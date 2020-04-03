import React from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { IconProps } from '@atlaskit/icon';
import { CSSObject } from '@emotion/core';

export type ChildrenType = React.ReactChild;
export type ComponentType = React.Component<{}, {}>;
export type ElementType = React.ReactChild;

/**
 *
 * OVERRIDE TYPES
 *
 **/
export type DefaultsType = {
  Label: {
    component: React.ComponentType<LabelProps>;
    cssFn: (state: LabelCSSProps) => CSSObject;
    attributesFn: (props: { isDisabled?: boolean }) => Record<string, any>;
  };
  LabelText: {
    component: React.ComponentType<LabelTextProps>;
    cssFn: (state: { tokens: ThemeTokens }) => CSSObject;
    attributesFn: () => Record<string, any>;
  };
  IconWrapper: {
    component: React.ComponentType<IconWrapperProps>;
    cssFn: (props: IconWrapperProps) => CSSObject;
    attributesFn: (
      props: Partial<StripOverrides<IconWrapperProps>>,
    ) => Record<string, any>;
  };
  Icon: {
    component: React.ComponentType<IconProps>;
  };
  IconIndeterminate: {
    component: React.ComponentType<IconProps>;
  };
  HiddenCheckbox: {
    attributesFn: (props: {
      disabled?: boolean;
      checked?: boolean;
      required?: boolean;
    }) => Record<string, any>;
  };
};

export type OverridesType = {
  Label?: {
    component?: React.ComponentType<LabelProps>;
    cssFn?: (defaultStyles: CSSObject, state: LabelCSSProps) => CSSObject;
    attributesFn?: (props: { isDisabled?: boolean }) => Record<string, any>;
  };
  LabelText?: {
    component?: React.ComponentType<LabelTextProps>;
    cssFn?: (
      defaultStyles: CSSObject,
      state: { tokens: ThemeTokens },
    ) => CSSObject;
    attributesFn?: () => Record<string, any>;
  };
  IconWrapper?: {
    component?: React.ComponentType<IconWrapperProps>;
    cssFn?: (defaultStyles: CSSObject, props: IconWrapperCSSProps) => CSSObject;
    attributesFn?: (
      props: Partial<StripOverrides<IconWrapperProps>>,
    ) => Record<string, any>;
  };
  Icon?: {
    component?: React.ComponentType<Readonly<IconProps>>;
  };
  IconIndeterminate?: {
    component?: React.ComponentType<Readonly<IconProps>>;
  };
  HiddenCheckbox?: {
    attributesFn?: (props: {
      disabled?: boolean;
      checked?: boolean;
      required?: boolean;
    }) => Record<string, any>;
  };
};

export type CheckboxDefaults = Pick<
  DefaultsType,
  'Label' | 'LabelText' | 'HiddenCheckbox'
>;
export type CheckboxOverrides = Pick<
  OverridesType,
  'Label' | 'LabelText' | 'HiddenCheckbox'
>;

export type CheckboxIconDefaults = Pick<
  DefaultsType,
  'Icon' | 'IconWrapper' | 'IconIndeterminate'
>;
export type CheckboxIconOverrides = Pick<
  OverridesType,
  'Icon' | 'IconWrapper' | 'IconIndeterminate'
>;

/**
 *
 *
 * CHECKBOXICON PROPTYPES
 *
 *
 **/

export interface CheckboxIconProps {
  /** Sets the checkbox icon active state. */
  isActive?: boolean;
  /** Sets whether the checkbox is checked or unchecked. */
  isChecked?: boolean;
  /** Sets whether the checkbox is disabled. */
  isDisabled?: boolean;
  /** Sets the checkbox focus */
  isFocused?: boolean;
  /**
   * Sets whether the checkbox is indeterminate. This only affects the
   * style and does not modify the isChecked property.
   */
  isIndeterminate?: boolean;
  /** Sets the checkbox as invalid */
  isInvalid?: boolean;
  /** Sets the checkbox icon hovered state */
  isHovered?: boolean;
  /** Primary color */
  primaryColor?: any;
  /** Secondary color */
  secondaryColor?: any;
  /** The label for icon to be displayed */
  label: any;
  /**
   A prop for adding targeted customisations to the `CheckboxIcon` component.
   Similar to the overrides prop on the `Checkbox` component, but with a subset of the properties (`Icon`, `IconIndeterminate` and `IconWrapper`)

   For a detailed explanation of how to use this prop,
   please see the overrides section of the `@atlaskit/checkbox` documentation.
  */
  overrides?: CheckboxIconOverrides;
  /**
   A prop for making thematic changes to the `CheckboxIcon` component using component tokens.
   For more information on how theming works for this component, please see the theming guide in the `@atlaskit/checkbox` documentation.
   */
  theme?: ThemeFn;
}

/**
 *
 *
 * CHECKBOX PROPTYPES
 *
 *
 **/

export interface CheckboxProps extends WithAnalyticsEventsProps {
  /** Sets whether the checkbox begins checked. */
  defaultChecked?: boolean;
  /** id assigned to input */
  id?: string;
  /** Callback to receive a reference.  */
  inputRef?: (input: HTMLInputElement | null | undefined) => any;
  /** Sets whether the checkbox is checked or unchecked. */
  isChecked?: boolean;
  /** Sets whether the checkbox is disabled. */
  isDisabled?: boolean;
  /** Sets whether the checkbox should take up the full width of the parent. */
  isFullWidth?: boolean;
  /**
   * Sets whether the checkbox is indeterminate. This only affects the
   * style and does not modify the isChecked property.
   */
  isIndeterminate?: boolean;
  /** Marks the field as invalid. Changes style of unchecked component. */
  isInvalid?: boolean;
  /** Marks the field as required & changes the label style. */
  isRequired?: boolean;
  /**
   * The label to be displayed to the right of the checkbox. The label is part
   * of the clickable element to select the checkbox.
   */
  label?: React.ReactChild;
  /** The name of the submitted field in a checkbox. */
  name?: string;
  /**
   * Function that is called whenever the state of the checkbox changes. It will
   * be called with an object containing the react synthetic event. Use currentTarget to get value, name and checked
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
  /**
   A prop for adding targeted customisations to the Checkbox component
   For a detailed explanation of how to use this prop,
   please see the overrides section of the @atlaskit/checkbox documentation.
  */
  overrides?: OverridesType;
  /**
   A prop for making thematic changes to the `Checkbox` component using component tokens.
   For more information on how theming works for this component, please see the theming guide in the @atlaskit/checkbox documentation.
   */
  theme?: ThemeFn;
  /** The value to be used in the checkbox input. This is the value that will be returned on form submission. */
  value?: number | string;
  /**
    A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
    we have 2 different testid generated based on the one you pass to the Checkbox component:
     - `{testId}--hidden-checkbox` to check if it got changed to checked/unchecked.
     - `{testId}--checkbox-label` to click the input, because in IE11 the input has opacity: 0 and can't be interacted.
  */
  testId?: string;
}

/**
 *
 * THEME TYPES
 *
 */

export type ThemeFn = (current: PrevThemeFn, props: ThemeProps) => ThemeTokens;

export type PrevThemeFn = (props: ThemeProps) => ThemeTokens;

interface ModeValue {
  light: string;
  dark: string;
}

type TokenValue = ModeValue | string;

export interface ComponentTokens {
  label?: {
    textColor?: {
      rest?: TokenValue;
      disabled?: TokenValue;
    };
    spacing?: {
      bottom?: TokenValue;
      right?: TokenValue;
      left?: TokenValue;
      top?: TokenValue;
    };
  };
  icon?: {
    borderWidth?: string;
    borderColor?: {
      rest?: TokenValue;
      disabled?: TokenValue;
      checked?: TokenValue;
      active?: TokenValue;
      invalid?: TokenValue;
      focused?: TokenValue;
      hovered?: TokenValue;
      hoveredAndChecked?: TokenValue;
      invalidAndChecked?: TokenValue;
    };
    boxColor?: {
      rest?: TokenValue;
      disabled?: TokenValue;
      active?: TokenValue;
      hoveredAndChecked?: TokenValue;
      hovered?: TokenValue;
      checked?: TokenValue;
    };
    tickColor?: {
      rest?: TokenValue;
      disabledAndChecked?: TokenValue;
      activeAndChecked?: TokenValue;
      checked?: TokenValue;
    };
    size?: 'small' | 'medium' | 'large' | 'xlarge';
  };
  requiredIndicator?: {
    textColor?: {
      rest?: TokenValue;
    };
  };
}

export interface ThemeIconTokens {
  borderWidth: string;
  borderColor: {
    rest: string;
    disabled: string;
    checked: string;
    active: string;
    invalid: string;
    focused: string;
    hovered: string;
    hoveredAndChecked: string;
    invalidAndChecked: string;
  };
  boxColor: {
    rest: string;
    disabled: string;
    active: string;
    hoveredAndChecked: string;
    hovered: string;
    checked: string;
  };
  tickColor: {
    rest: string;
    disabledAndChecked: string;
    activeAndChecked: string;
    checked: string;
  };
  size: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface ThemeLabelTokens {
  textColor: {
    rest: string;
    disabled: string;
  };
  spacing: {
    bottom: string;
    right: string;
    left: string;
    top: string;
  };
}

export interface ThemeTokens {
  label: ThemeLabelTokens;
  icon: ThemeIconTokens;
  requiredIndicator: {
    textColor: {
      rest: string;
    };
  };
}

export interface ThemeProps {
  tokens: ComponentTokens;
  mode: string;
}

export interface ThemeLabelTokens {
  textColor: {
    rest: string;
    disabled: string;
  };
  spacing: {
    bottom: string;
    right: string;
    left: string;
    top: string;
  };
}

export interface ThemeTokens {
  label: ThemeLabelTokens;
  icon: ThemeIconTokens;
}

export interface ThemeProps {
  tokens: ComponentTokens;
  mode: string;
}

/**
 *
 * OVERRIDE ELEMENT TYPES
 *
 */

export interface LabelTextProps extends React.HTMLProps<HTMLSpanElement> {
  attributesFn: () => Record<string, any>;
  cssFn: (props: { tokens: ThemeTokens }) => CSSObject;
  tokens: ThemeTokens;
  children: React.ReactNode;
}

export interface LabelTextCSSProps {
  tokens: ThemeTokens;
}

type StripOverrides<P extends Record<string, any>> = Pick<
  P,
  Exclude<keyof P, 'cssfn' | 'attributesFn'>
>;

export interface LabelProps extends React.HTMLProps<HTMLInputElement> {
  attributesFn: (props: { isDisabled?: boolean }) => Record<string, any>;
  cssFn: (props: LabelCSSProps) => CSSObject;
  onMouseUp: React.MouseEventHandler;
  onMouseDown: React.MouseEventHandler;
  onMouseEnter: React.MouseEventHandler;
  onMouseLeave: React.MouseEventHandler;
  isDisabled?: boolean;
  tokens: ThemeTokens;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

export interface IconWrapperProps extends React.HTMLProps<HTMLLabelElement> {
  attributesFn: (
    props: Partial<StripOverrides<IconWrapperProps>>,
  ) => Record<string, any>;
  cssFn: (
    props: Pick<IconWrapperProps, Exclude<keyof IconWrapperCSSProps, 'cssFn'>>,
  ) => CSSObject;
  tokens: ThemeTokens;
  isChecked?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  isInvalid?: boolean;
}

export type IconWrapperCSSProps = Omit<
  IconWrapperProps,
  'attributesFn' | 'cssFn'
>;

export type LabelCSSProps = Pick<LabelProps, 'isDisabled' | 'tokens'>;

export interface RequiredIndicatorProps
  extends React.HTMLProps<HTMLSpanElement> {
  tokens: ThemeTokens;
}
