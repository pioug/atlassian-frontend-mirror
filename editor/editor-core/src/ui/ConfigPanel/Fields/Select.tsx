import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import Select, { ValueType } from '@atlaskit/select';
import { EnumSelectField, Option } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate, getOptionFromValue } from '../utils';
import { OnFieldChange } from '../types';
import { formatOptionLabel } from './SelectItem';

export default function SelectField({
  name,
  field,
  onFieldChange,
  autoFocus,
  placeholder,
  fieldDefaultValue,
}: {
  name: string;
  field: EnumSelectField;
  onFieldChange: OnFieldChange;
  autoFocus?: boolean;
  placeholder?: string;
  fieldDefaultValue?: string | string[];
}) {
  //ignore arrays as mutli-value select fields are always clearable
  const hasValidSingleDefaultValue =
    !Array.isArray(fieldDefaultValue) && fieldDefaultValue !== undefined;

  const isClearable = !hasValidSingleDefaultValue || field.isMultiple;

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
      validate={(value: ValueType<Option> | null | undefined) => {
        return validate<ValueType<Option>>(field, value!);
      }}
    >
      {({ fieldProps, error }) => (
        <Fragment>
          <Select
            {...fieldProps}
            onChange={(value) => {
              fieldProps.onChange(value);
              onFieldChange(name, true);
            }}
            // @see DST-2386 & ED-12503
            enableAnimation={false}
            // add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
            isMulti={(field.isMultiple || false) as false}
            options={field.items || []}
            isClearable={isClearable}
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
