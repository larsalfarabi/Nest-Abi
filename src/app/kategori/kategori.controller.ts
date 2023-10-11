import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KategoriService } from './kategori.service';
import {
  CreateKategoriBulkDto,
  CreateKategoriDto,
  UpdateKategoriDto,
  findAllKategori,
} from './dto/kategori.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator'; //import disini
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';

@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }

  @Post('create-bulk')
  async createBulkKategori(@Body() payload: CreateKategoriBulkDto, @Req() req) {
    return this.kategoriService.createBulk(payload, req);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    return this.kategoriService.getAllCategory(query);
  }

  @Put('update/:id')
  async UpdateCategory(
    @Param('id') id: string,
    @InjectUpdatedBy() payload: UpdateKategoriDto,
  ) {
    return this.kategoriService.update(+id, payload);
  }

  @Delete('delete/:id')
  async deleteKategori(@Param('id') id: string) {
    return this.kategoriService.remove(+id);
  }

  @Get(':id')
  async DetailCategory(@Param('id') id: string) {
    return this.kategoriService.findOne(+id);
  }
}
