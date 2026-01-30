import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) { }

  async validate(value: any, args: ValidationArguments) {
    const [model, field] = args.constraints;

    if (!value) return true;

    const modelDelegate = (this.prisma as any)[model];
    const record = await modelDelegate.findFirst({
      where: {
        [field]: value,
      },
    });

    return !record;
  }

  defaultMessage(args: ValidationArguments) {
    const [, field] = args.constraints;
    return `${field} already exists`;
  }
}
