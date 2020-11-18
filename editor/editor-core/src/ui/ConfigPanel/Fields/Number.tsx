import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { NumberField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate, getSafeParentedName } from '../utils';
import { OnBlur, ValidationError } from '../types';
import isNumber from 'is-number';

export default function Number({
  field,
  autoFocus,
  onBlur,
  placeholder,
  parentName,
}: {
  field: NumberField;
  autoFocus?: boolean;
  onBlur: OnBlur;
  placeholder?: string;
  parentName?: string;
}) {
  const { name, label, description, defaultValue, isRequired } = field;

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
      name={getSafeParentedName(name, parentName)}
      label={label}
      defaultValue={defaultValue === undefined ? '' : String(defaultValue)}
      isRequired={isRequired}
      validate={validateNumber}
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
            type="text" // do not change this to type="number", it will return invalid strings as ''
            placeholder={placeholder}
          />
          <FieldMessages error={error} description={description} />
        </Fragment>
      )}
    </Field>
  );
}
