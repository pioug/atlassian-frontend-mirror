/** @jsx jsx */
import { ChangeEvent, Fragment, useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field, Fieldset as AKFieldset, FieldProps } from '@atlaskit/form';
import { EnumCheckboxField, Option } from '@atlaskit/editor-common/extensions';
import { token } from '@atlaskit/tokens';

import { ValidationError, OnFieldChange } from '../types';
import FieldMessages from '../FieldMessages';

function validate(value: string[] | undefined, isRequired: boolean) {
  if (isRequired && !value?.length) {
    return ValidationError.Required;
  }
}

const requiredIndicator = css`
  color: ${token('color.text.danger', '#bf2600')};
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
    <Fragment>
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
    </Fragment>
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
    <Fragment>
      {labelBase}
      {isRequired ? (
        <span css={requiredIndicator} aria-hidden="true">
          {' '}
          *
        </span>
      ) : null}
    </Fragment>
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
