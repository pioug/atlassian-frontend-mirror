declare module '@atlaskit/field-base' {
  import React from 'react';

  export interface FieldBaseCommonProps {
    appearance?: 'standard' | 'none' | 'subtle';
    children?: React.ReactNode;
    invalidMessage?: React.ReactNode;
    isCompact?: boolean;
    isDialogOpen?: boolean;
    isDisabled?: boolean;
    isFitContainerWidthEnabled?: boolean;
    isInvalid?: boolean;
    isLoading?: boolean;
    isPaddingDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    onBlur?: (event: any) => void;
    onFocus?: (event: any) => void;
    onDialogBlur?: (event: any) => void;
    onDialogClick?: (event: any) => void;
    onDialogFocus?: (event: any) => void;
    shouldReset?: boolean;
    maxWidth?: number;
    isValidationHidden?: boolean;
  }

  export interface FieldBaseStatelessProps extends FieldBaseCommonProps {
    isFocused: boolean;
  }

  export interface FieldBaseProps extends FieldBaseCommonProps {
    defaultIsFocused?: boolean;
  }

  export interface LabelProps {
    label: string;
    isLabelHidden?: boolean;
    onClick?: (event: any) => void;
    isRequired?: boolean;
    isDisabled?: boolean;
    htmlFor?: string;
    children?: Node;
    appearance?: 'default' | 'inline-edit';
    isFirstChild?: boolean;
  }

  export default class FieldBase extends React.Component<FieldBaseProps, {}> {}
  export class FieldBaseStateless extends React.Component<
    FieldBaseStatelessProps,
    {}
  > {}
  export class Label extends React.Component<LabelProps, {}> {}
}
