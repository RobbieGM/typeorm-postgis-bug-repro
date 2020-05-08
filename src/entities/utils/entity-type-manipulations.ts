import { ClassType, transformAndValidateSync } from 'class-transformer-validator';
import { ValidationError, validateSync } from 'class-validator';
import { identity } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import { ClassValidatorOptions, DEFAULT_CLASS_VALIDATOR_OPTIONS } from '../../middleware/request-data-validator';
import { plainToClass } from 'class-transformer';
import { Business } from '../../db/all-entities';

export type ExtractClassInstanceType<T> = T extends ClassType<infer U> ? U : never;

/**
 * Makes an io-ts model encapsulating a class-validator class. Warning: this ignores async validations.
 *
 * @param options The entity to use as a validation test
 */
export function iotsModelFromClassValidatorOptions<TEntity extends object>(options: ClassValidatorOptions<TEntity>) {
  const validate = (x: unknown): true | ValidationError[] | Error => {
    try {
      if (typeof x === 'object' && x != null) {
        transformAndValidateSync(options.class, JSON.stringify(x), {
          validator: { ...DEFAULT_CLASS_VALIDATOR_OPTIONS, skipMissingProperties: options.partial }
        });
        // const transformed = plainToClass(options.class, x);
        // console.debug('transformed', transformed);
        // const errors = validateSync(transformed, {
        //   ...DEFAULT_CLASS_VALIDATOR_OPTIONS,
        //   skipMissingProperties: options.partial
        // });
        // if (errors.length > 0) {
        //   return errors;
        // }
        return true;
      } else return new Error('Object is null or a primitive value');
    } catch (err) {
      return err as ValidationError[];
    }
  };
  const isValid = (x: unknown): x is TEntity => validate(x) === true;
  return new t.Type<TEntity, unknown, unknown>(
    options.class.name,
    isValid,
    (object, context) => {
      const validationResult = validate(object);
      return validationResult === true
        ? t.success(object as TEntity)
        : t.failure(
            object,
            context,
            validationResult instanceof Error ? validationResult.message : JSON.stringify(validationResult)
          );
    },
    // isValid(object)
    //   ? t.success(object)
    //   : t.failure(object, context, `Object does not match entity ${options.class.name}`),
    identity
  );
}
