/** @jsx jsx */
import { Fragment, useEffect } from 'react';

import { jsx } from '@emotion/react';

import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import AkTextfield from '@atlaskit/textfield';

import { useFormContext } from '../../../controllers/form-context';

import { TextFieldProps } from './types';

/**
 * A text field utilising the Atlaskit Textfield and Field objects from `@atlaskit/form`.
 * Validation is handled by the form as it is on form submission. Any errors returned by
 * the handleSubmit function passed to the form <Form> that have a key matching the `name`
 * of this text field are shown above the field.
 */

export function TextField({
  label,
  name,
  validationHelpText,
  isRequired,
  testId,
  validators,
}: TextFieldProps) {
  const { assignValidator } = useFormContext();
  useEffect(() => {
    if (validators) {
      assignValidator(name, validators);
    }
  }, [name, validators, assignValidator]);

  return (
    <Field name={name} label={label} isRequired={isRequired} defaultValue={''}>
      {({ fieldProps, error }) => (
        <Fragment>
          <AkTextfield {...fieldProps} testId={testId} />
          {!error && <HelperMessage>{validationHelpText}</HelperMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Fragment>
      )}
    </Field>
  );
}
