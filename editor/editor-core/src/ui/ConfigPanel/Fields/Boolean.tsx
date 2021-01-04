import React, { Fragment } from 'react';
import styled from 'styled-components';

import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { BooleanField } from '@atlaskit/editor-common/extensions';
import AKToggle from '@atlaskit/toggle';

import { ValidationError, OnBlur } from '../types';
import FieldMessages from '../FieldMessages';

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

function validate(value: boolean | undefined, isRequired: boolean) {
  if (isRequired && !value) {
    return ValidationError.Required;
  }
}

function Checkbox({
  name,
  field,
  onBlur,
}: {
  name: string;
  field: BooleanField;
  onBlur: OnBlur;
}) {
  const {
    label,
    description,
    isRequired = false,
    defaultValue = false,
  } = field;

  return (
    <Field<boolean>
      name={name}
      isRequired={isRequired}
      validate={value => validate(value, isRequired)}
      defaultValue={defaultValue}
    >
      {({ fieldProps, error }) => {
        const { value: isChecked, ...restFieldProps } = fieldProps;
        return (
          <Fragment>
            <AKCheckbox
              {...restFieldProps}
              label={label}
              isChecked={isChecked}
            />
            <FieldMessages error={error} description={description} />
          </Fragment>
        );
      }}
    </Field>
  );
}

function Toggle({
  name,
  field,
  onBlur,
}: {
  name: string;
  field: BooleanField;
  onBlur: OnBlur;
}) {
  const {
    label,
    description,
    isRequired = false,
    defaultValue = false,
  } = field;

  return (
    <Field<boolean>
      name={name}
      isRequired={isRequired}
      validate={value => validate(value, isRequired)}
      defaultValue={defaultValue}
    >
      {({ fieldProps, error }) => {
        function _onChange(value?: React.ChangeEvent<HTMLInputElement>) {
          fieldProps.onChange(value?.target?.checked || false);
          onBlur(name);
        }

        const { id, value: isChecked, ...restFieldProps } = fieldProps;
        return (
          <Fragment>
            <ToggleFieldWrapper>
              <ToggleLabel id={id} htmlFor={id}>
                {label}
                {isRequired ? (
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                ) : null}
              </ToggleLabel>
              <AKToggle
                {...restFieldProps}
                onChange={_onChange}
                isChecked={isChecked}
              />
            </ToggleFieldWrapper>
            <FieldMessages error={error} description={description} />
          </Fragment>
        );
      }}
    </Field>
  );
}

export default function Boolean({
  name,
  field,
  onBlur,
}: {
  name: string;
  field: BooleanField;
  onBlur: OnBlur;
}) {
  if (field.style === 'toggle') {
    return <Toggle name={name} field={field} onBlur={onBlur} />;
  }
  return <Checkbox name={name} field={field} onBlur={onBlur} />;
}
