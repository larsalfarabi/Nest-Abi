import { responseSuccess, responsePagination } from 'src/inteface/response';
import { Kategori } from './entity/kategori.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import {
  CreateKategoriBulkDto,
  CreateKategoriDto,
  UpdateKategoriDto,
  findAllKategori,
} from './dto/kategori.dto';
import { Like, Repository } from 'typeorm';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>, // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }
  async create(payload: CreateKategoriDto): Promise<responseSuccess> {
    try {
      await this.kategoriRepository.save(payload); // cukup payload tanpa manipulasi object

      return this._success('Berhasil Membuat Kategori');
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async createBulk(payload: CreateKategoriBulkDto, req) {
    let berhasil = 0;
    let gagal = 0;

    await Promise.all(
      payload.data.map(async (data) => {
        try {
          const dataSave = {
            ...data,
            created_by: {
              id: req.user.id,
            },
          };
          await this.kategoriRepository.save(dataSave);
          berhasil += 1;
        } catch (error) {
          console.log(error);
          gagal -= 1;
          throw new HttpException(
            'Ada Kesalahan',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }),
    );
    return this._success(
      `Berhasil Menambah ${berhasil} Kategori dan gagal ${gagal} `,
    );
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

  async findOne(id: number): Promise<responseSuccess> {
    const result = await this.kategoriRepository.findOne({
      where: { id: id },
    });
    if (!result) throw new NotFoundException('Kategori Tidak Ditemukan');
    return this._success('Berhasil Menemukan Detail Kategori', result);
  }

  async update(
    id: number,
    payload: UpdateKategoriDto,
  ): Promise<responseSuccess> {
    const result = await this.kategoriRepository.findOne({
      where: { id: id },
    });
    if (!result) throw new NotFoundException('Kategori Tidak Ditemukan');

    await this.kategoriRepository.save({
      ...payload,
      id: id,
    });
    return this._success('Berhasil Mengupdate Kategori');
  }

  async remove(id: number): Promise<responseSuccess> {
    const result = await this.kategoriRepository.findOne({
      where: { id: id },
    });
    if (!result) throw new NotFoundException('Kategori Tidak Ditemukan');

    await this.kategoriRepository.delete(id);
    return this._success('Berhasil Menghapus Kategori');
  }
}
