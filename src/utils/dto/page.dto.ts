import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageRequestDto {
  @IsInt()
  @Type(() => Number) //karna query param adalah string maka harus di ubah menjadi number
  page = 1;

  @IsInt()
  @Type(() => Number)
  pageSize = 10;

  @IsInt()
  @Type(() => Number)
  limit: number;
}
