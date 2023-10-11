import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto, findAllKategori } from './dto/kategori.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator'; //import disini

@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKategoriDto) {
    //ganti @Body() dengan @InjectCreatedBy()
    return this.kategoriService.create(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    return this.kategoriService.getAllCategory(query);
  }
}
