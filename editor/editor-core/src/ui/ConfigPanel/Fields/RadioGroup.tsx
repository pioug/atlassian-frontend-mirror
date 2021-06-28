import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { EnumRadioField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { FieldTypeError, OnFieldChange } from '../types';
import { validate } from '../utils';

export default function RadioField({
  name,
  field,
  onFieldChange,
}: {
  name: string;
  field: EnumRadioField;
  onFieldChange: OnFieldChange;
}) {
  if (field.isMultiple) {
    return <FieldMessages error={FieldTypeError.isMultipleAndRadio} />;
  }

  return (
    <Field
      name={name}
      label={field.label}
      defaultValue={field.defaultValue}
      isRequired={field.isRequired}
      validate={(value?: string) => validate<string | undefined>(field, value)}
    >
      {({ fieldProps, error }) => (
        <Fragment>
          <RadioGroup
            {...fieldProps}
            options={(field.items || []).map((option) => ({
              ...option,
              name: field.name,
            }))}
            onChange={(value) => {
              fieldProps.onChange(value);
              onFieldChange(field.name, true);
            }}
          />
          <FieldMessages error={error} />
        </Fragment>
      )}
    </Field>
  );
}
