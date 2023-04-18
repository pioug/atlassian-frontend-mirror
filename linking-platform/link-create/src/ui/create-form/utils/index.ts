import { Validator, ValidatorMap } from '../../../common/types';

/** Map of field names to errors for that field (or undefined if no error for that field) */
export type ValidatorResults = {
  [name: string]: string | undefined;
};

/**
 * Returns an object where the keys are names of form fields, and values are a string if the field
 * has an error, or undefined if the field is valid.
 */
export function validateFormData({
  data,
  validators,
}: {
  data: Record<string, unknown>;
  validators: ValidatorMap;
}): ValidatorResults {
  // Run each validator on the input
  const map: ValidatorResults = {};

  for (const fieldName of Object.keys(validators)) {
    for (let i = 0; i < validators[fieldName].length; i++) {
      const currentValidator: Validator = validators[fieldName][i];

      // If we already have an error for this field, skip any new validations on this field
      if (map[fieldName] !== undefined) {
        continue;
      }
      const maybeValue = data[fieldName];

      if (!currentValidator.isValid(maybeValue)) {
        map[fieldName] = currentValidator.errorMessage;
      }
    }
  }
  return map;
}
