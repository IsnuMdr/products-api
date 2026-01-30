import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueValidator } from '../validators/is-unique.validator';

export function IsUnique(
  model: string,
  field: string,
  options?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [model, field],
      validator: UniqueValidator,
    });
  };
}
