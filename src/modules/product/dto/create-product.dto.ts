import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  Min,
  MinLength,
  MaxLength,
  IsInt,
} from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'SKU is empty' })
  @IsString({ message: 'SKU must be a string' })
  @IsUnique('product', 'sku', { message: 'SKU must be unique' })
  sku: string;

  @IsNotEmpty({ message: 'Name is empty' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(255, { message: 'Name length must not more than 255 characters' })
  name: string;

  @IsNotEmpty({ message: 'Price is empty' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @IsNotEmpty({ message: 'Stock is empty' })
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @IsNotEmpty({ message: 'Category ID is empty' })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId: string;
}