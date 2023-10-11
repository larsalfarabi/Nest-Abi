import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreateBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import { BookService } from './book.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('book') // base url
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('list')
  GetAllBook(@Pagination() query: FindBookDto) {
    return this.bookService.getAllBook(query);
  }

  @Get('detail/:id')
  GetById(@Param('id') id: number) {
    return this.bookService.getById(id);
  }

  @Post('create')
  CreateBook(@Body() payload: CreateBookDto) {
    return this.bookService.createBook(payload);
  }

  @Put('update/:id')
  UpdateBook(@Param('id') id: string, @Body() payload: UpdateBookDto) {
    return this.bookService.updateBook(Number(id), payload);
  }

  @Delete('delete/:id')
  DeleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }
}
