import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import Select, { ValueType } from '@atlaskit/select';
import { EnumField, Option } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate, getOptionFromValue } from '../utils';

export default function({ field }: { field: EnumField }) {
  return (
    <Field<ValueType<Option>>
      name={field.name}
      label={field.label}
      defaultValue={getOptionFromValue(field.items, field.defaultValue)}
      isRequired={field.isRequired}
      validate={(value: ValueType<Option>) =>
        validate<ValueType<Option>>(field, value)
      }
    >
      {({ fieldProps, error, valid }) => (
        <Fragment>
          <Select
            {...fieldProps}
            isMulti={field.isMultiple || false}
            options={field.items || []}
            isClearable={false}
            validationState={error ? 'error' : 'default'}
          />
          <FieldMessages error={error} description={field.description} />
        </Fragment>
      )}
    </Field>
  );
}
