import { Meta } from '@atlaskit/form/Field';
/**
 * This function checks if there have been changes since last submit
 * to let a Field know if it should hide the error message until
 * the next submit, or if it returns to the previous error state
 */
export const validateSubmitErrors = (meta: Meta) => {
  return !!(
    meta.touched &&
    (meta.error || (meta.submitError && !meta.dirtySinceLastSubmit))
  );
};
