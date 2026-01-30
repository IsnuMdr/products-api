import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Name is empty' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(255, {
    message: 'Name length must not more than 255 characters'
  })
  name: string;
}