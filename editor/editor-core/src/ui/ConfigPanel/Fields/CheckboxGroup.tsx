import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field, Fieldset as AKFieldset, FieldProps } from '@atlaskit/form';
import { EnumCheckboxField, Option } from '@atlaskit/editor-common/extensions';

import { ValidationError, OnFieldChange } from '../types';
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
  onFieldChange,
  options,
  error,
  fieldProps,
}: {
  label: JSX.Element;
  description?: string;
  onFieldChange: () => void;
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
    onFieldChange();
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
  onFieldChange,
}: {
  name: string;
  field: EnumCheckboxField;
  onFieldChange: OnFieldChange;
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

  const _onFieldChange = useCallback(() => {
    onFieldChange(name, true);
  }, [name, onFieldChange]);

  return (
    <Field<string[]>
      name={name}
      isRequired={isRequired}
      defaultValue={defaultValue}
      validate={(value?: string[]) => validate(value, isRequired)}
    >
      {(props) => {
        return (
          <CheckboxGroupInner
            label={label}
            description={description}
            options={options}
            onFieldChange={_onFieldChange}
            {...props}
          />
        );
      }}
    </Field>
  );
}
