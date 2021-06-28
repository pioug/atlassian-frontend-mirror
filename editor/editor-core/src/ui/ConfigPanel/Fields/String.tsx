import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';
import { StringField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate } from '../utils';
import { OnFieldChange } from '../types';

export default function String({
  name,
  field,
  autoFocus,
  onFieldChange,
  placeholder,
}: {
  name: string;
  field: StringField;
  autoFocus?: boolean;
  onFieldChange: OnFieldChange;
  placeholder?: string;
}) {
  const { label, description, defaultValue, isRequired } = field;

  return (
    <Field
      name={name}
      label={label}
      defaultValue={defaultValue || ''}
      isRequired={isRequired}
      validate={(value?: string) => validate<string>(field, value || '')}
    >
      {({ fieldProps, error, meta }) => {
        if (field.style === 'multiline') {
          const { onChange, ...restFieldProps } = fieldProps;
          const { options } = field;

          return (
            <Fragment>
              <TextArea
                {...restFieldProps}
                {...options}
                onChange={(e) => onChange(e.currentTarget.value)}
                onBlur={() => {
                  fieldProps.onBlur();
                  onFieldChange(name, meta.dirty);
                }}
                placeholder={placeholder}
              />
              <FieldMessages error={error} description={description} />
            </Fragment>
          );
        }

        return (
          <Fragment>
            <TextField
              {...fieldProps}
              type="text"
              autoFocus={autoFocus}
              onBlur={() => {
                fieldProps.onBlur();
                onFieldChange(name, meta.dirty);
              }}
              placeholder={placeholder}
            />
            <FieldMessages error={error} description={description} />
          </Fragment>
        );
      }}
    </Field>
  );
}
