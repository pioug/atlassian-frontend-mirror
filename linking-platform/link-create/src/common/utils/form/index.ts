import { type FieldMetaState } from 'react-final-form';
/**
 * This function checks if there have been changes since last submit
 * to let a Field know if it should hide the error message until
 * the next submit, or if it returns to the previous error state
 */
export const shouldShowValidationErrors = (meta: FieldMetaState<any>) => {
  if (!meta.touched) {
    return false;
  }

  if (meta.submitFailed) {
    if (meta.error) {
      return !meta.dirtySinceLastSubmit;
    }

    if (meta.submitError) {
      return !meta.dirtySinceLastSubmit;
    }
  }

  return false;
};
