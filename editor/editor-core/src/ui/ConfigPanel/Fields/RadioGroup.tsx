import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { EnumField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { FieldTypeError, OnBlur } from '../types';
import { validate } from '../utils';

export default function({
  field,
  onBlur,
}: {
  field: EnumField;
  onBlur: OnBlur;
}) {
  if (field.isMultiple) {
    return <FieldMessages error={FieldTypeError.isMultipleAndRadio} />;
  }

  return (
    <Field
      name={field.name}
      label={field.label}
      defaultValue={field.defaultValue}
      isRequired={field.isRequired}
      validate={(value?: string) => validate<string | undefined>(field, value)}
    >
      {({ fieldProps, error }) => (
        <Fragment>
          <RadioGroup
            onChange={value => {
              fieldProps.onChange(value);
              onBlur(field.name);
            }}
            options={(field.items || []).map(option => ({
              ...option,
              name: field.name,
            }))}
            {...fieldProps}
          />
          <FieldMessages error={error} />
        </Fragment>
      )}
    </Field>
  );
}
