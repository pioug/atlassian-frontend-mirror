import React, { Fragment } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField } from '@atlaskit/form';
import { BooleanField } from '@atlaskit/editor-common/extensions';

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

export default function({ field }: { field: BooleanField }) {
  return (
    <CheckboxField
      key={field.name}
      name={field.name}
      isRequired={field.isRequired}
      defaultIsChecked={isChecked(field.defaultValue)}
    >
      {({ fieldProps, error }) => {
        return (
          <Fragment>
            <Checkbox {...fieldProps} label={field.label} />
            <FieldMessages error={error} description={field.description} />
          </Fragment>
        );
      }}
    </CheckboxField>
  );
}
