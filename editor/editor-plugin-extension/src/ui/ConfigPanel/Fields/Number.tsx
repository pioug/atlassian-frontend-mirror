import React from 'react';

import isNumber from 'is-number';

import type { NumberField } from '@atlaskit/editor-common/extensions';
import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { ValidationError } from '../types';
import { validate } from '../utils';

export default function Number({
  name,
  field,
  autoFocus,
  onFieldChange,
  placeholder,
}: {
  name: string;
  field: NumberField;
  autoFocus?: boolean;
  onFieldChange: OnFieldChange;
  placeholder?: string;
}) {
  const { label, description, defaultValue, isRequired } = field;

  function validateNumber(value?: string) {
    const error = validate<string>(field, value || '');
    if (error) {
      return error;
    }
    if (value === '') {
      return;
    }
    if (isNumber(value)) {
      return;
    }
    return ValidationError.Invalid;
  }

  return (
    <Field<string>
      name={name}
      label={label}
      defaultValue={defaultValue === undefined ? '' : String(defaultValue)}
      isRequired={isRequired}
      validate={validateNumber}
      testId={`config-panel-number-${name}`}
    >
      {({ fieldProps, error, meta }) => {
        return (
          <>
            <TextField
              {...fieldProps}
              autoFocus={autoFocus}
              onBlur={() => {
                fieldProps.onBlur();
                onFieldChange(name, meta.dirty);
              }}
              type="text" // do not change this to type="number", it will return invalid strings as ''
              placeholder={placeholder}
            />
            <FieldMessages error={error} description={description} />
          </>
        );
      }}
    </Field>
  );
}
