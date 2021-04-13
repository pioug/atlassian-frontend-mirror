import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import Select, { ValueType } from '@atlaskit/select';
import { EnumSelectField, Option } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate, getOptionFromValue } from '../utils';
import { OnBlur } from '../types';
import { formatOptionLabel } from './SelectItem';

export default function SelectField({
  name,
  field,
  onBlur,
  autoFocus,
  placeholder,
}: {
  name: string;
  field: EnumSelectField;
  onBlur: OnBlur;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  return (
    <Field<ValueType<Option>>
      name={name}
      label={field.label}
      defaultValue={
        getOptionFromValue(field.items, field.defaultValue) as ValueType<
          Option,
          false
        >
      }
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
              onBlur(name);
            }}
            // @see DST-2386 & ED-12503
            enableAnimation={false}
            // add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
            isMulti={(field.isMultiple || false) as false}
            options={field.items || []}
            isClearable={false}
            validationState={error ? 'error' : 'default'}
            formatOptionLabel={formatOptionLabel}
            autoFocus={autoFocus}
            menuPlacement="auto"
            placeholder={placeholder}
          />
          <FieldMessages error={error} description={field.description} />
        </Fragment>
      )}
    </Field>
  );
}
