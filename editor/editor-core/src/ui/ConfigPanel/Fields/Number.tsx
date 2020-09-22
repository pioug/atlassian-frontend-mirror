import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { NumberField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate } from '../utils';
import { OnBlur } from '../types';

export default function Number({
  field,
  autoFocus,
  onBlur,
  placeholder,
}: {
  field: NumberField;
  autoFocus?: boolean;
  onBlur: OnBlur;
  placeholder?: string;
}) {
  const { name, label, description, defaultValue, isRequired } = field;
  return (
    <Field
      name={name}
      label={label}
      defaultValue={defaultValue || ''}
      isRequired={isRequired}
      validate={(value?: string) => validate<string>(field, value || '')}
    >
      {({ fieldProps, error, valid }) => (
        <Fragment>
          <TextField
            {...fieldProps}
            autoFocus={autoFocus}
            onBlur={() => {
              fieldProps.onBlur();
              onBlur(name);
            }}
            type="number"
            placeholder={placeholder}
          />
          <FieldMessages error={error} description={description} />
        </Fragment>
      )}
    </Field>
  );
}
