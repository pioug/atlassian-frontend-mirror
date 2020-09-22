import React, { Fragment } from 'react';
import styled from 'styled-components';

import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField, FieldProps } from '@atlaskit/form';
import { BooleanField } from '@atlaskit/editor-common/extensions';
import Toggle from '@atlaskit/toggle';

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

type Props = {
  label: string;
} & FieldProps<string>;

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

function BooleanToggle({ label, ...fieldProps }: Props) {
  const { id, isRequired } = fieldProps;
  return (
    <ToggleFieldWrapper>
      <ToggleLabel id={id} htmlFor={id}>
        {label}
        {isRequired ? (
          <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
        ) : null}
      </ToggleLabel>
      <Toggle {...fieldProps} />
    </ToggleFieldWrapper>
  );
}

export default function Boolean({
  field,
  onBlur,
}: {
  field: BooleanField;
  onBlur: OnBlur;
}) {
  const { name, label, description, isRequired, defaultValue } = field;
  const showToggle = field.style === 'toggle';

  return (
    <CheckboxField
      key={name}
      name={name}
      isRequired={isRequired}
      defaultIsChecked={isChecked(defaultValue)}
    >
      {({ fieldProps, error }) => {
        const { value = '' } = fieldProps;
        const props = {
          ...fieldProps,
          label,
          onChange: (value?: string | React.FormEvent<HTMLInputElement>) => {
            fieldProps.onChange(value);
            onBlur(name);
          },
          value,
        };

        return (
          <Fragment>
            {showToggle ? (
              <BooleanToggle {...props} />
            ) : (
              <Checkbox {...props} />
            )}
            <FieldMessages error={error} description={description} />
          </Fragment>
        );
      }}
    </CheckboxField>
  );
}
