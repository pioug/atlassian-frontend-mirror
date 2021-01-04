import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field, Fieldset as AKFieldset, FieldProps } from '@atlaskit/form';
import { EnumCheckboxField, Option } from '@atlaskit/editor-common/extensions';

import { ValidationError, OnBlur } from '../types';
import FieldMessages from '../FieldMessages';

function validate(value: string[] | undefined, isRequired: boolean) {
  if (isRequired && !value?.length) {
    return ValidationError.Required;
  }
}

const RequiredIndicator = styled.span`
  color: #bf2600;
`;

function CheckboxGroupInner({
  label,
  description,
  onBlur,
  options,
  error,
  fieldProps,
}: {
  label: JSX.Element;
  description?: string;
  onBlur: () => void;
  options: Option[];
  error?: string;
  fieldProps: FieldProps<string[], HTMLInputElement>;
}) {
  const { onChange, value, ...restFieldProps } = fieldProps;
  function _onChange(optionValue: string, isChecked: boolean) {
    const active = new Set(value ? value : []);

    if (isChecked) {
      active.add(optionValue);
    } else {
      active.delete(optionValue);
    }

    onChange([...active]);
    onBlur();
  }

  return (
    <>
      <AKFieldset legend={label}>
        {options.map(({ label: optionLabel, value: optionValue }, i) => {
          const isChecked = value && value.includes(optionValue);
          const onOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
            _onChange(optionValue, event.target.checked);
          };

          return (
            <AKCheckbox
              key={i}
              {...restFieldProps}
              isRequired={false}
              label={optionLabel}
              isChecked={isChecked}
              onBlur={onBlur}
              onChange={onOptionChange}
            />
          );
        })}
      </AKFieldset>
      <FieldMessages error={error} description={description} />
    </>
  );
}

export default function CheckboxGroup({
  name,
  field,
  onBlur,
}: {
  name: string;
  field: EnumCheckboxField;
  onBlur: OnBlur;
}) {
  const {
    label: labelBase,
    description,
    defaultValue,
    isRequired = false,
    items: options,
  } = field;

  const label = (
    <>
      {labelBase}
      {isRequired ? (
        <RequiredIndicator aria-hidden="true"> *</RequiredIndicator>
      ) : null}
    </>
  );

  const _onBlur = useCallback(() => {
    onBlur(name);
  }, [name, onBlur]);

  return (
    <Field<string[]>
      name={name}
      isRequired={isRequired}
      defaultValue={defaultValue}
      validate={(value: string[] | undefined) => validate(value, isRequired)}
    >
      {props => {
        return (
          <CheckboxGroupInner
            label={label}
            description={description}
            options={options}
            onBlur={_onBlur}
            {...props}
          />
        );
      }}
    </Field>
  );
}
