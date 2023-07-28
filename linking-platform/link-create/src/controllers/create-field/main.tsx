/** @jsx jsx */
import { Fragment, useEffect, useMemo } from 'react';

import { css, jsx } from '@emotion/react';
import { Field } from 'react-final-form';

import {
  ErrorMessage,
  HelperMessage,
  Label,
  RequiredAsterisk,
} from '@atlaskit/form';
import { token } from '@atlaskit/tokens';

import { validateSubmitErrors } from '../../common/utils/form';
import { useFormContext } from '../form-context';

import { CreateFieldProps } from './types';

const fieldWrapperStyles = css({
  marginTop: token('space.100', '8px'),
});

export function CreateField({
  id,
  name,
  label,
  isRequired,
  validators,
  validationHelpText,
  testId,
  children,
}: CreateFieldProps) {
  const { assignValidator } = useFormContext();

  useEffect(() => {
    if (validators) {
      assignValidator(name, validators);
    }
  }, [name, validators, assignValidator]);

  const fieldId = useMemo(
    () => (id ? id : `link-create-field-${name}`),
    [id, name],
  );

  return (
    <div css={fieldWrapperStyles} data-testid={testId}>
      <Field name={name}>
        {({ input, meta }) => {
          const isInvalid = validateSubmitErrors(meta);
          const { submitError } = meta;

          return (
            <Fragment>
              {label && (
                <Label
                  htmlFor={fieldId}
                  id={`${fieldId}-label`}
                  testId={`${testId}-label`}
                >
                  {label}
                  {isRequired && <RequiredAsterisk />}
                </Label>
              )}

              {children({ ...input, fieldId, isInvalid })}

              {!submitError && validationHelpText && (
                <HelperMessage testId={`${testId}-helper-message`}>
                  {validationHelpText}
                </HelperMessage>
              )}
              {submitError && isInvalid && (
                <ErrorMessage testId={`${testId}-error-message`}>
                  {submitError}
                </ErrorMessage>
              )}
            </Fragment>
          );
        }}
      </Field>
    </div>
  );
}
