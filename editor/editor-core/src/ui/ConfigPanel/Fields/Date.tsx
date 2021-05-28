import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { Field } from '@atlaskit/form';
import { DatePicker } from '@atlaskit/datetime-picker';
import { DateField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate } from '../utils';
import { OnFieldChange } from '../types';

function Date({
  name,
  field,
  autoFocus,
  onFieldChange,
  placeholder,
  intl,
}: {
  name: string;
  field: DateField;
  autoFocus?: boolean;
  onFieldChange: OnFieldChange;
  placeholder?: string;
} & InjectedIntlProps) {
  const { label, description, defaultValue, isRequired } = field;

  return (
    <Field<string>
      name={name}
      label={label}
      defaultValue={defaultValue}
      isRequired={isRequired}
      validate={(value?: string) => validate(field, value)}
    >
      {({ fieldProps, error }) => {
        return (
          <>
            <DatePicker
              {...fieldProps}
              autoFocus={autoFocus}
              onBlur={() => {
                fieldProps.onBlur();
              }}
              onChange={(value: string) => {
                fieldProps.onChange(value);
                onFieldChange(name, true);
              }}
              locale={intl.locale}
              placeholder={placeholder}
            />
            <FieldMessages error={error} description={description} />
          </>
        );
      }}
    </Field>
  );
}

export default injectIntl(Date);
