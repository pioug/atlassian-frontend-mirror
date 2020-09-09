import React, { Fragment } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField } from '@atlaskit/form';
import { BooleanField } from '@atlaskit/editor-common/extensions';

import { OnBlur } from '../types';

import FieldMessages from '../FieldMessages';

const isChecked = (value?: string | boolean) => {
  if (typeof value === 'string') {
    return value === 'true';
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return false;
};

export default function ({
  field,
  onBlur,
}: {
  field: BooleanField;
  onBlur: OnBlur;
}) {
  return (
    <CheckboxField
      key={field.name}
      name={field.name}
      isRequired={field.isRequired}
      defaultIsChecked={isChecked(field.defaultValue)}
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
            <Checkbox {...fieldProps} onChange={onChange} label={field.label} />
            <FieldMessages error={error} description={field.description} />
          </Fragment>
        );
      }}
    </CheckboxField>
  );
}
