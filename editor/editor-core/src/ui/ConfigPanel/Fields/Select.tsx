import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import Select, { ValueType } from '@atlaskit/select';
import { EnumSelectField, Option } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate, getOptionFromValue } from '../utils';
import { OnBlur } from '../types';
import { formatOptionLabel } from './SelectItem';

export default function SelectField({
  field,
  onBlur,
  autoFocus,
  placeholder,
}: {
  field: EnumSelectField;
  onBlur: OnBlur;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  return (
    <Field<ValueType<Option>>
      name={field.name}
      label={field.label}
      defaultValue={getOptionFromValue(field.items, field.defaultValue)}
      isRequired={field.isRequired}
      validate={(value: ValueType<Option>) =>
        validate<ValueType<Option>>(field, value)
      }
    >
      {({ fieldProps, error, valid }) => (
        <Fragment>
          <Select
            {...fieldProps}
            onChange={value => {
              fieldProps.onChange(value);
              onBlur(field.name);
            }}
            isMulti={field.isMultiple || false}
            options={field.items || []}
            isClearable={false}
            validationState={error ? 'error' : 'default'}
            formatOptionLabel={formatOptionLabel}
            autoFocus={autoFocus}
            placeholder={placeholder}
          />
          <FieldMessages error={error} description={field.description} />
        </Fragment>
      )}
    </Field>
  );
}
