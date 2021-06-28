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

export const toEntries = (parameters: Parameters): [string, unknown][] =>
  Array.isArray(parameters)
    ? parameters.reduce<[string, unknown][]>(
        (prev, curr) => [...prev, ...Object.entries(curr)],
        [],
      )
    : Object.entries(parameters);

const isEmptyString = <T>(value: T) =>
  typeof value === 'string' && value === '';
const isEmptyArray = <T>(value: T) =>
  Array.isArray(value) && value.length === 0;

type ValidationProps = { isRequired?: boolean; isMultiple?: boolean };

export const validateRequired = <T>(
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
    return options.filter((option) => value.includes(option.value));
  }

  return options.find((option) => value === option.value);
};

// Atlaskit uses final-form to power the form.
// Final-form will create nesting in the tree if a dot (.) is used in the name of the field.
// A parent is provided from a <Fieldset /> and is appended to the name here for simplicity
export const getSafeParentedName = (
  name: string,
  parentName?: string,
): string => {
  if (parentName && name.indexOf(`${parentName}.`) === -1) {
    return `${parentName}.${name}`;
  }

  return name;
};

const duplicateFieldRegex = /:[0-9]+$/;

export const isDuplicateField = (key: string) => duplicateFieldRegex.test(key);

export const getNameFromDuplicateField = (key: string) =>
  key.replace(duplicateFieldRegex, '');

/* 
    ColorPickerButton only accepts 8 digit hex alpha values, for example:
    #123fffaa (8 digits, hex alpha)
    */

export const isValidHex = (color: string): boolean => {
  const hexRegexPattern = new RegExp('^#([a-fA-F0-9]{8})$');

  return hexRegexPattern.test(color);
};
