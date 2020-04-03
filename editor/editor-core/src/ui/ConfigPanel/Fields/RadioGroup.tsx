import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { EnumField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { FieldTypeError } from '../types';
import { validate } from '../utils';

export default function({ field }: { field: EnumField }) {
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
