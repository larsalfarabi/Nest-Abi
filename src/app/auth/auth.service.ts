import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { User } from './entity/auth.entity';
import { responseSuccess } from 'src/inteface/response';
import { LoginDto, RegisterDto } from './auth.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './auth.interface';
import { jwt_config } from 'src/config/jwt.config';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {
    super();
  }
  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt

  async register(payload: RegisterDto): Promise<responseSuccess> {
    const checkUserExist = await this.userRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExist) {
      throw new HttpException(
        'user already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    payload.password = await hash(payload.password, 12);
    await this.userRepo.save(payload);
    return this._success('Register Berhasil');
  }
  async login(payload: LoginDto): Promise<responseSuccess> {
    const checkUserExists = await this.userRepo.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    );

    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '1d',
        jwt_config.access_token_secret,
      );
      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );
      await this.userRepo.save({
        refresh_token: refresh_token,
        id: checkUserExists.id,
      }); // simpan refresh token ke dalam tabel
      return this._success('Login Success', {
        ...checkUserExists,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async refreshToken(id: number, token: string): Promise<responseSuccess> {
    const checkUserExists = await this.userRepo.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('user', checkUserExists);
    if (checkUserExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '7d',
      jwt_config.refresh_token_secret,
    );

    await this.userRepo.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._success('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }
}
