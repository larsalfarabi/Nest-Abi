import { responseSuccess, responsePagination } from 'src/inteface/response';
import { Kategori } from './entity/kategori.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { CreateKategoriDto, findAllKategori } from './dto/kategori.dto';
import { Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any, // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }
  async create(payload: CreateKategoriDto): Promise<responseSuccess> {
    try {
      await this.kategoriRepository.save(payload); // cukup payload tanpa manipulasi object

      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getAllCategory(query: findAllKategori): Promise<responsePagination> {
    const { page, pageSize, limit, nama_kategori } = query;

    const filterQuery = {};
    if (nama_kategori) {
      filterQuery['nama_kategori'] = Like(`%${nama_kategori}%`);
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
      select: {
        // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_kategori: true,
        created_by: {
          id: true, // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }
}
