import React, { Fragment } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField, Fieldset } from '@atlaskit/form';
import { EnumCheckboxField } from '@atlaskit/editor-common/extensions';

import { OnBlur } from '../types';
import FieldMessages from '../FieldMessages';

export default function CheckboxGroup({
  name,
  field,
  onBlur,
}: {
  name: string;
  field: EnumCheckboxField;
  onBlur: OnBlur;
}) {
  const { label, defaultValue, isRequired, items } = field;
  return (
    <Fieldset legend={label}>
      {items.map(option => (
        <CheckboxField
          key={`${name}${option.value}`}
          name={name}
          value={option.value}
          isRequired={isRequired}
          defaultIsChecked={
            (defaultValue && defaultValue.includes(option.value)) || false
          }
        >
          {({ fieldProps, error }) => {
            const onChange = (
              value?: string | React.FormEvent<HTMLInputElement>,
            ) => {
              fieldProps.onChange(value);
              onBlur(name);
            };

            return (
              <Fragment>
                <Checkbox
                  {...fieldProps}
                  onChange={onChange}
                  label={option.label}
                />
                <FieldMessages error={error} />
              </Fragment>
            );
          }}
        </CheckboxField>
      ))}
    </Fieldset>
  );
}
