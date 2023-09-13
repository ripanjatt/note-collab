import { registerDecorator, ValidationOptions } from 'class-validator';
import { verifyJWT } from './utils';

/**
 *
 * Creates a Validator for verifying JWT token in request body before any other operation
 *
 */
export function isValidJWT(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidJWT',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return verifyJWT(value);
        },
      },
    });
  };
}
