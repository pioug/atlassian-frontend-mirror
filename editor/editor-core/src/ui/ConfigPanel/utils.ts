import {
  Option,
  FieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import { ValidationError, Entry } from './types';

export const validate = <T>(
  field: Partial<FieldDefinition>,
  value: T,
): ValidationError | undefined => {
  return validateRequired<T>(field, value);
};

export const fromEntries = <T>(iterable: Entry<T>[]): Parameters => {
  return [...iterable].reduce<{ [key: string]: T }>((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});
};

const isEmptyString = <T>(value: T) =>
  typeof value === 'string' && value === '';
const isEmptyArray = <T>(value: T) =>
  Array.isArray(value) && value.length === 0;

type ValidationProps = { isRequired?: boolean; isMultiple?: boolean };

const validateRequired = <T>(
  { isRequired, isMultiple }: ValidationProps,
  value: T,
): ValidationError | undefined => {
  if (isRequired) {
    const isUndefined = typeof value === 'undefined';
    const isEmpty =
      isEmptyString<T>(value) ||
      (isMultiple && isEmptyArray<T>(value)) ||
      false;

    return isUndefined || isEmpty ? ValidationError.Required : undefined;
  }

  return undefined;
};

export const getOptionFromValue = (
  options: Option[],
  value: string | string[] | undefined,
): Option | Option[] | undefined => {
  if (!Array.isArray(options) || options.length === 0) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return options.filter(option => value.includes(option.value));
  }

  return options.find(option => value === option.value);
};
