import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import {
  Props as ReactSelectProps,
  FormatOptionLabelMeta as RSFormatOptionLabelMeta,
  ValueType as RSValueType,
  ActionMeta as RSActionMeta,
  GroupTypeBase as GroupType,
  OptionsType as RSOptionsType,
  SelectComponentsConfig as RSSelectComponentsConfig,
  IndicatorComponentType as RSIndicatorComponentType,
  StylesConfig as RSStylesConfig,
  InputActionMeta as RSInputActionMeta,
  IndicatorProps as RSIndicatorProps,
  ControlProps as RSControlProps,
  GroupProps as RSGroupProps,
  InputProps,
  MenuProps as RSMenuProps,
  MenuListComponentProps as RSMenuListComponentProps,
  MultiValueProps,
  OptionProps as ReactSelectOptionProps,
  PlaceholderProps as RSPlaceholderProps,
  SingleValueProps,
  ValueContainerProps as RSValueContainerProps,
  GroupedOptionsType,
} from 'react-select';

import { AsyncProps as ReactAsyncSelectProps } from 'react-select/async';

export type ValidationState = 'default' | 'error' | 'success';
export interface OptionType {
  [key: string]: any;
  label: string;
  value: string | number;
}

export type OptionsType<Option = OptionType> = RSOptionsType<Option>;

export interface OptionProps<
  Option = OptionType,
  IsMulti extends boolean = false
> extends ReactSelectOptionProps<Option, IsMulti> {
  [key: string]: any;
  Icon?: React.ComponentType<{
    label: string;
    // label?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    onClick?: (e: MouseEvent) => void;
    primaryColor?: string;
    secondaryColor?: string;
  }>;
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
}

export interface SelectProps<OptionType, IsMulti extends boolean = false>
  extends ReactSelectProps<OptionType, IsMulti>,
    WithAnalyticsEventsProps {
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing?: 'compact' | 'default';
  /* The state of validation if used in a form */
  validationState?: ValidationState;
}

export type ActionMeta<Option = OptionType> = RSActionMeta<Option>;

export type InputActionMeta = RSInputActionMeta;

export type ControlProps<
  OptionType,
  IsMulti extends boolean = false
> = RSControlProps<OptionType, IsMulti>;

export type FormatOptionLabelMeta<
  OptionType,
  IsMulti extends boolean = false
> = RSFormatOptionLabelMeta<OptionType, IsMulti>;

export type IndicatorProps<
  OptionType,
  IsMulti extends boolean = false
> = RSIndicatorProps<OptionType, IsMulti>;

export type IndicatorComponentType<
  OptionType,
  IsMulti extends boolean = false
> = RSIndicatorComponentType<OptionType, IsMulti>;

export type ValueType<
  OptionType,
  IsMulti extends boolean = false
> = RSValueType<OptionType, IsMulti>;

export type StylesConfig<
  Option = OptionType,
  IsMulti extends boolean = false
> = RSStylesConfig<Option, IsMulti>;

export type SelectComponentsConfig<
  OptionType,
  IsMulti extends boolean = false
> = RSSelectComponentsConfig<OptionType, IsMulti>;

export type GroupProps<
  OptionType,
  IsMulti extends boolean = false
> = RSGroupProps<OptionType, IsMulti>;

export type MenuProps<
  OptionType,
  IsMulti extends boolean = false
> = RSMenuProps<OptionType, IsMulti>;

export type MenuListComponentProps<
  OptionType,
  IsMulti extends boolean = false
> = RSMenuListComponentProps<OptionType, IsMulti>;

export type PlaceholderProps<
  OptionType,
  IsMulti extends boolean = false
> = RSPlaceholderProps<OptionType, IsMulti>;

export type ValueContainerProps<
  OptionType,
  IsMulti extends boolean = false
> = RSValueContainerProps<OptionType, IsMulti>;

export type {
  GroupType,
  InputProps,
  MultiValueProps,
  ReactAsyncSelectProps,
  ReactSelectProps,
  SingleValueProps,
  GroupedOptionsType,
};
