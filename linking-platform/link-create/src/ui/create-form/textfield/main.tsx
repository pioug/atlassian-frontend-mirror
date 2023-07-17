/** @jsx jsx */
import { Fragment, useEffect } from 'react';

import { jsx } from '@emotion/react';

import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import AkTextfield from '@atlaskit/textfield';

import { validateSubmitErrors } from '../../../common/utils/form';
import { useFormContext } from '../../../controllers/form-context';

import { TextFieldProps } from './types';

export const TEST_ID = 'link-create-text-field';

/**
 * A text field utilising the Atlaskit Textfield and Field objects from `@atlaskit/form`.
 * Validation is handled by the form as it is on form submission. Any errors returned by
 * the handleSubmit function passed to the form <Form> that have a key matching the `name`
 * of this text field are shown above the field.
 */

export function TextField({
  label,
  name,
  testId = TEST_ID,
  validationHelpText,
  validators,
  defaultValue,
  isRequired,
  ...restProps
}: TextFieldProps) {
  const { assignValidator } = useFormContext();
  useEffect(() => {
    if (validators) {
      assignValidator(name, validators);
    }
  }, [name, validators, assignValidator]);

  return (
    /**
     * The defaultValue here should be '' when there is nothing passed in from the props.
     * This is because if we don't give it anything, the `fieldProps` wouldn't have a `value`
     * prop and make the TextField component uncontrolled. Later when user starts typing, the
     * `value` will be populated again in `fieldProps` which cause the TextField to be changed
     * to a controlled component and raise a warning from React.
     */

    <Field
      name={name}
      label={label}
      isRequired={isRequired}
      defaultValue={defaultValue ?? ''}
    >
      {({ fieldProps, meta, error }) => {
        const isInvalid = validateSubmitErrors(meta);
        return (
          <Fragment>
            <AkTextfield
              {...fieldProps}
              {...restProps}
              testId={testId}
              isInvalid={isInvalid}
              isRequired={false} // Remove the default browser validation
            />
            {!error && validationHelpText && (
              <HelperMessage testId={`${testId}-helper-message`}>
                {validationHelpText}
              </HelperMessage>
            )}
            {error && isInvalid && (
              <ErrorMessage testId={`${testId}-error-message`}>
                {error}
              </ErrorMessage>
            )}
          </Fragment>
        );
      }}
    </Field>
  );
}
