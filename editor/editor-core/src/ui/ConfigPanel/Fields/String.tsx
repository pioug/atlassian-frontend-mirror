import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';
import { StringField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate } from '../utils';
import { OnBlur } from '../types';

export default function String({
  field,
  autoFocus,
  onBlur,
  placeholder,
}: {
  field: StringField;
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
      {({ fieldProps, error, valid }) => {
        if (field.style === 'multiline') {
          const { onChange, ...restFieldProps } = fieldProps;
          const { options } = field;

          return (
            <Fragment>
              <TextArea
                {...restFieldProps}
                {...options}
                onChange={e => {
                  fieldProps.onChange(e.target.value);
                }}
                onBlur={() => {
                  fieldProps.onBlur();
                  onBlur(name);
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
                onBlur(name);
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
