import React, { Fragment } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField, Fieldset } from '@atlaskit/form';
import { EnumField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';

export default function({ field }: { field: EnumField }) {
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
            return (
              <Fragment>
                <Checkbox {...fieldProps} label={option.label} />
                <FieldMessages error={error} />
              </Fragment>
            );
          }}
        </CheckboxField>
      ))}
    </Fieldset>
  );
}
