import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';
import { StringField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate, getSafeParentedName } from '../utils';
import { OnBlur } from '../types';

export default function String({
  field,
  autoFocus,
  onBlur,
  placeholder,
  parentName,
}: {
  field: StringField;
  autoFocus?: boolean;
  onBlur: OnBlur;
  placeholder?: string;
  parentName?: string;
}) {
  const { name, label, description, defaultValue, isRequired } = field;

  return (
    <Field
      name={getSafeParentedName(name, parentName)}
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
