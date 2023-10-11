import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Between, Like, Repository } from 'typeorm';
import { responsePagination, responseSuccess } from 'src/inteface/response';
import { CreateBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import BaseResponse from 'src/utils/response/base.response';

@Injectable()
export class BookService extends BaseResponse {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }

  async getAllBook(query: FindBookDto): Promise<responsePagination> {
    const { page, pageSize, limit, title, author, from_year, to_year } = query;

    const filter: { [key: string]: any } = {};
    if (title) {
      filter.title = Like(`%${title}%`);
    }
    if (author) {
      filter.author = Like(`%${author}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }
    console.log(filter);
    const total = await this.bookRepository.count({ where: filter });

    const books = await this.bookRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });
    return this._pagination(
      'Berhasil Menemukan Buku',
      books,
      total,
      page,
      pageSize,
    );
  }

  async getById(id: number): Promise<responseSuccess> {
    //promise digunakan untuk mengelola operasi yang bersifat asinkron

    const book = await this.bookRepository.findOne({
      where: {
        id,
      },
    });
    if (book == null) {
      throw new NotFoundException('Buku tidak ditemukan');
    }
    return this._success(`Berhasil Menemukan Buku dengan ID ${id}`, book);
  }

  async createBook(payload: CreateBookDto): Promise<responseSuccess> {
    try {
      await this.bookRepository.save(payload);
      return this._success('Berhasil Menambah Buku');
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async updateBook(
    id: number,
    updateBookDto: UpdateBookDto,
  ): Promise<responseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });
    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    const update = await this.bookRepository.save({ ...updateBookDto, id: id });
    return this._success('Berhasil Mengupdate Buku', update);
  }
  async deleteBook(id: number) {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });
    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    await this.bookRepository.delete(id);
    return this._success('Berhasil Menghapus Buku');
  }
}
