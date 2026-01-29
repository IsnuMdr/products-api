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

export class CreateProductDto {
  @IsNotEmpty({ message: 'SKU is required' })
  @IsString({ message: 'SKU must be a string' })
  @MinLength(3, { message: 'SKU must be at least 3 characters' })
  @MaxLength(50, { message: 'SKU must not exceed 50 characters' })
  sku: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @IsNotEmpty({ message: 'Stock is required' })
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId: string;
}