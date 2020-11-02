import React, { Fragment } from 'react';
import styled from 'styled-components';

import { Checkbox } from '@atlaskit/checkbox';
import { Field, FieldProps } from '@atlaskit/form';
import { BooleanField } from '@atlaskit/editor-common/extensions';
import Toggle from '@atlaskit/toggle';

import { getSafeParentedName } from '../utils';
import { ValidationError, OnBlur } from '../types';

import FieldMessages from '../FieldMessages';

function isChecked(value: string | boolean | undefined) {
  if (typeof value === 'string') {
    return value === 'true';
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return false;
}

const ToggleFieldWrapper = styled.div`
  display: flex;
`;
const ToggleLabel = styled.label`
  display: flex;
  padding: 3px 3px 3px 0px;
  flex-grow: 1;
`;
const RequiredIndicator = styled.span`
  color: #bf2600;
`;

function BooleanToggle({
  label,
  defaultValue,
  ...fieldProps
}: {
  label: string;
  defaultValue: boolean;
} & FieldProps<boolean>) {
  const { id, isRequired, value } = fieldProps;

  return (
    <ToggleFieldWrapper>
      <ToggleLabel id={id} htmlFor={id}>
        {label}
        {isRequired ? (
          <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
        ) : null}
      </ToggleLabel>
      <Toggle
        {...fieldProps}
        defaultChecked={defaultValue}
        value={value ? 'true' : 'false'}
      />
    </ToggleFieldWrapper>
  );
}

function validate(value: boolean | undefined, isRequired: boolean) {
  if (isRequired && !value) {
    return ValidationError.Required;
  }
}

export default function Boolean({
  field,
  onBlur,
  parentName,
}: {
  field: BooleanField;
  onBlur: OnBlur;
  parentName?: string;
}) {
  const {
    name,
    label,
    description,
    isRequired = false,
    defaultValue = false,
  } = field;
  const showToggle = field.style === 'toggle';
  // WARNING: strings were previously used for booleans, protect that here
  const defaultIsChecked = isChecked(defaultValue);

  return (
    <Field<boolean>
      name={getSafeParentedName(name, parentName)}
      isRequired={isRequired}
      validate={value => validate(value, isRequired)}
      defaultValue={defaultIsChecked}
    >
      {({ fieldProps, error }) => {
        const { value = false } = fieldProps;
        const props = {
          ...fieldProps,
          label,
          onChange: (value?: boolean | React.FormEvent<HTMLInputElement>) => {
            if (typeof value === 'boolean') {
              fieldProps.onChange(value);
            } else {
              fieldProps.onChange(
                (value as React.ChangeEvent<HTMLInputElement>)?.target?.checked,
              );
            }
            onBlur(name);
          },
          value,
        };

        return (
          <Fragment>
            {showToggle ? (
              <BooleanToggle {...props} defaultValue={defaultIsChecked} />
            ) : (
              <Checkbox {...props} value={value ? 'true' : 'false'} />
            )}
            <FieldMessages error={error} description={description} />
          </Fragment>
        );
      }}
    </Field>
  );
}
