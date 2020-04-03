import React, { FC, ReactNode, useCallback } from 'react';
import Field, { Meta, FieldProps } from './Field';

export interface CheckboxFieldProps extends FieldProps<string | undefined> {
  isChecked: boolean;
}

export interface CheckboxProps {
  /* Children to render in the field. Called with form information. */
  children: (args: {
    fieldProps: CheckboxFieldProps;
    error?: string;
    valid: boolean;
    meta: Meta;
  }) => ReactNode;
  /* The default checked state of the checkbox */
  defaultIsChecked?: boolean;
  /* Whether the field is required for submission */
  isRequired?: boolean;
  /* Whether the field is disabled */
  isDisabled?: boolean;
  /* Label displayed above the field */
  label?: ReactNode;
  /* The name of the field */
  name: string;
  /* The value of the checkbox. Used as the value in the form state when the checkbox is checked */
  value?: string;
}

const CheckboxField: FC<CheckboxProps> = props => {
  const { children, defaultIsChecked = false, value, ...rest } = props;

  // Maintains a memoised list of the default values
  const defaultValue = useCallback(
    (currentValue: string[] = []) =>
      defaultIsChecked && value !== undefined
        ? [...currentValue, value]
        : currentValue,
    [value, defaultIsChecked],
  );

  return value !== undefined ? (
    <Field<any>
      {...rest}
      defaultValue={defaultValue}
      transform={(event, currentValue: string[]) =>
        event.currentTarget.checked && currentValue
          ? [...currentValue, value]
          : currentValue.filter(v => v !== value)
      }
    >
      {({ fieldProps: { value: fieldValue, ...otherFieldProps }, ...others }) =>
        children({
          fieldProps: {
            ...otherFieldProps,
            isChecked: !!fieldValue.find((v: string) => v === value),
            value,
          },
          ...others,
        })
      }
    </Field>
  ) : (
    <Field<any>
      {...rest}
      defaultValue={defaultIsChecked}
      transform={event => event.currentTarget.checked}
    >
      {({ fieldProps: { value: fieldValue, ...otherFieldProps }, ...others }) =>
        children({
          fieldProps: {
            ...otherFieldProps,
            isChecked: fieldValue,
            value,
          },
          ...others,
        })
      }
    </Field>
  );
};

CheckboxField.defaultProps = {
  defaultIsChecked: false,
};

export default CheckboxField;
