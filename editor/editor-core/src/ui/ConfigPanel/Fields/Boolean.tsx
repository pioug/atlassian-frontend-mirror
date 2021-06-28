import React, { Fragment } from 'react';
import styled from 'styled-components';

import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { BooleanField } from '@atlaskit/editor-common/extensions';
import AKToggle from '@atlaskit/toggle';

import { ValidationError, OnFieldChange } from '../types';
import FieldMessages from '../FieldMessages';
import { RequiredIndicator } from './common/RequiredIndicator';

const ToggleFieldWrapper = styled.div`
  display: flex;
`;
const ToggleLabel = styled.label`
  display: flex;
  padding: 3px 3px 3px 0px;
  flex-grow: 1;
`;

function validate(value: boolean | undefined, isRequired: boolean) {
  if (isRequired && !value) {
    return ValidationError.Required;
  }
}

function handleOnChange(
  onChange: (value: boolean) => void,
  onFieldChange: OnFieldChange,
  event: React.ChangeEvent<HTMLInputElement>,
) {
  onChange(event?.target?.checked || false);
  onFieldChange(name, true);
}

function Checkbox({
  name,
  field,
  onFieldChange,
}: {
  name: string;
  field: BooleanField;
  onFieldChange: OnFieldChange;
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
      validate={(value) => validate(value, isRequired)}
      defaultValue={defaultValue}
    >
      {({ fieldProps, error }) => {
        const { value: isChecked, ...restFieldProps } = fieldProps;
        return (
          <Fragment>
            <AKCheckbox
              {...restFieldProps}
              label={label}
              onChange={(event) =>
                handleOnChange(fieldProps.onChange, onFieldChange, event)
              }
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
  onFieldChange,
}: {
  name: string;
  field: BooleanField;
  onFieldChange: OnFieldChange;
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
      validate={(value) => validate(value, isRequired)}
      defaultValue={defaultValue}
    >
      {({ fieldProps, error }) => {
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
                onChange={(event) =>
                  handleOnChange(fieldProps.onChange, onFieldChange, event)
                }
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
  onFieldChange,
}: {
  name: string;
  field: BooleanField;
  onFieldChange: OnFieldChange;
}) {
  if (field.style === 'toggle') {
    return <Toggle name={name} field={field} onFieldChange={onFieldChange} />;
  }
  return <Checkbox name={name} field={field} onFieldChange={onFieldChange} />;
}
