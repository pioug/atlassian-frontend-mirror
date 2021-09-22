import React, { FC, ReactNode, useCallback } from 'react';

import Field, { FieldProps, Meta } from './field';

export interface CheckboxFieldProps extends FieldProps<string | undefined> {
  isChecked: boolean;
}
export interface CheckboxProps {
  /**
   * Content to render in the checkbox field. This is a function that is called with information about the field.
   */
  children: (args: {
    fieldProps: CheckboxFieldProps;
    error?: string;
    // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
    valid: boolean;
    meta: Meta;
  }) => ReactNode;
  /**
   * Sets the default state of the checkbox as checked.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  defaultIsChecked?: boolean;
  /**
   * Sets whether the field is required for submission. Required fields are marked with a red asterisk.
   */
  isRequired?: boolean;
  /**
   * Sets whether the field is disabled. Users cannot edit or focus on the fields. If the parent form component is disabled, then the field will always be disabled.
   */
  isDisabled?: boolean;
  /**
   * Label displayed beside the checkbox.
   */
  label?: ReactNode;
  /**
   * Specifies the name of the field. This is important for referencing the form data.
   */
  name: string;
  /**
   * The value of the checkbox. This is the value used in the form state when the checkbox is checked.
   */
  value?: string;
}

/**
 * __Checkbox field__
 *
 * A checkbox field is a form field that lets users select an item. Users can check or uncheck the checkbox.
 *
 * - [Examples] https://atlaskit.atlassian.com/packages/design-system/form/docs/fields#checkboxfield-reference
 * - [Code] https://atlaskit.atlassian.com/packages/design-system/form/docs/fields#checkboxfield-reference
 * - [Usage] https://atlaskit.atlassian.com/packages/design-system/form/docs/fields#checkboxfield-reference
 */
const CheckboxField: FC<CheckboxProps> = (props) => {
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
          : currentValue.filter((v) => v !== value)
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
      transform={(event) => event.currentTarget.checked}
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
