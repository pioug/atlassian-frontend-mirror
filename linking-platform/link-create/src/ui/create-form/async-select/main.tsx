/** @jsx jsx */
import { Fragment, useEffect } from 'react';

import { jsx } from '@emotion/react';

import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import { AsyncSelect as AkAsyncSelect, OptionType } from '@atlaskit/select';

import { useFormContext } from '../../../controllers/form-context';

import { AsyncSelectProps } from './types';

/**
 * An async select utilising the Atlaskit AsyncSelect and Field objects from `@atlaskit/form`.
 * Validation is handled by the form as it is on form submission. Any errors returned by
 * the handleSubmit function passed to the form <Form> that have a key matching the `name`
 * of this text field are shown above the field.
 */
export function AsyncSelect<T = OptionType>({
  label,
  name,
  validationHelpText,
  isRequired,
  testId,
  validators,
  ...rest
}: AsyncSelectProps<T>) {
  const { assignValidator } = useFormContext();

  useEffect(() => {
    if (validators) {
      assignValidator(name, validators);
    }
  }, [name, validators, assignValidator]);

  return (
    <div data-testid={testId}>
      <Field<any, HTMLSelectElement>
        name={name}
        label={label}
        isRequired={isRequired}
      >
        {({ fieldProps, error }) => (
          <Fragment>
            <AkAsyncSelect<T> {...fieldProps} {...rest} />
            {!error && <HelperMessage>{validationHelpText}</HelperMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Fragment>
        )}
      </Field>
    </div>
  );
}
