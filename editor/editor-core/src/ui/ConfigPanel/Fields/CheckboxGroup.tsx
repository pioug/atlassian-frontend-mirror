import React, { Fragment } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField, Fieldset } from '@atlaskit/form';
import { EnumCheckboxField } from '@atlaskit/editor-common/extensions';

import { OnBlur } from '../types';
import FieldMessages from '../FieldMessages';

export default function CheckboxGroup({
  field,
  onBlur,
}: {
  field: EnumCheckboxField;
  onBlur: OnBlur;
}) {
  return (
    <Fieldset legend={field.label}>
      {field.items.map(option => (
        <CheckboxField
          key={field.name + option.value}
          name={field.name}
          value={option.value}
          isRequired={field.isRequired}
          defaultIsChecked={
            (field.defaultValue && field.defaultValue.includes(option.value)) ||
            false
          }
        >
          {({ fieldProps, error }) => {
            const onChange = (
              value?: string | React.FormEvent<HTMLInputElement>,
            ) => {
              fieldProps.onChange(value);
              onBlur(field.name);
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
