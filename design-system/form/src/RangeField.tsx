import React, { FC, ReactNode } from 'react';

import Field, { FieldProps, Meta } from './Field';

type RangeProps = Omit<FieldProps<number>, 'isInvalid' | 'isRequired'>;
export interface RangeFieldProps {
  /* Children to render in the field. Called with props for the field component and other information about the field. */
  children: (args: {
    fieldProps: RangeProps;
    error?: string;
    meta: Meta;
  }) => React.ReactNode;
  /* The name of the field */
  name: string;
  /* The default value of the field. If a function is provided it is called with the current default value of the field. Range inputs always have a default value so this is required. */
  defaultValue: number | ((currentDefaultValue?: number) => number);
  /* Passed to the ID attribute of the field. Randomly generated if not specified */
  id?: string;
  /* Whether the field is disabled. If the parent Form component is disabled, then the field will always be disabled */
  isDisabled?: boolean;
  /* Label displayed above the field */
  label?: ReactNode;
}

const RangeField: FC<RangeFieldProps> = props => {
  const { children, ...strippedProps } = props;
  // isInvalid and isRequired are specifically invalid for range inputs
  return (
    <Field<number> {...strippedProps} transform={Number}>
      {({ fieldProps: { isInvalid, isRequired, ...fieldProps }, ...rest }) =>
        children({ fieldProps, ...rest })
      }
    </Field>
  );
};

export default RangeField;
