import { Option, Validator } from './ui/types';

/** Map of field names to errors for that field (or undefined if no error for that field) */
export type ValidatorResults = {
  [name: string]: string | undefined;
};

function isOption(maybeOption: unknown): maybeOption is Option {
  return (
    maybeOption !== undefined &&
    maybeOption !== null &&
    (maybeOption as Option).value !== undefined &&
    typeof (maybeOption as Option).value === 'string'
  );
}
/**
 * Returns an object where the keys are names of form fields, and values are a string if the field
 * has an error, or undefined if the field is valid.
 */
export async function validateFormData({
  data,
  validators,
}: {
  data: Record<string, unknown>;
  validators: Validator<any>[];
}): Promise<ValidatorResults> {
  // Run each validator on the input.
  const map: ValidatorResults = {};

  for (let i = 0; i < validators.length; i++) {
    const v = validators[i];
    const fieldName: string = v.fieldName;

    const maybeValue = data[fieldName];

    // If maybeValue is undefined, the fieldname of the current validator doesn't exist
    // in our form.
    // Value should always be in form, but if not, check if it's undefined here
    if (maybeValue === undefined || maybeValue === null) {
      continue;
    }

    if (typeof maybeValue === 'string' && (await v.isInvalid(maybeValue))) {
      map[v.fieldName] = v.errorMessage;
    }

    if (isOption(maybeValue) && (await v.isInvalid(maybeValue.value))) {
      map[v.fieldName] = v.errorMessage;
    }
  }
  return map;
}
