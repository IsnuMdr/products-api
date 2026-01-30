import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryProductDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  sku?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  name?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  'price.start'?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  'price.end'?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  'stock.start'?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  'stock.end'?: number;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  'category.id'?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  'category.name'?: string[];
}