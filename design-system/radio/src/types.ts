import { ReactNode, SyntheticEvent } from 'react';

import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

// Used by RadioGroup
export type OptionPropType = {
  isDisabled?: boolean;
  label?: ReactNode;
  name?: string;
  value?: RadioValue;
  testId?: string;
};

export type OptionsPropType = Array<OptionPropType>;

export type RadioValue = string;

// If updating props in OwnProps, also update in ExtractReactTypeProps
type OwnProps = {
  /** the aria-label attribute associated with the radio element */
  ariaLabel?: string;
  /** Makes a `Radio` field unselectable when true. Overridden by `isDisabled` prop of `RadioGroup`. */
  isDisabled?: boolean;
  /** Marks this as a required field */
  isRequired?: boolean;
  /** Field is invalid */
  isInvalid?: boolean;
  /** Set the field as checked */
  isChecked?: boolean;
  /** The label value for the input rendered to the dom */
  label?: ReactNode;
  /** onChange event handler, passed into the props of each `Radio` Component instantiated within `RadioGroup` */
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /** Field value */
  value?: RadioValue;
  /**
      A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
      we have 2 different testid generated based on the one you pass to the Radio component:
      - `{testId}--radio-input` to check if it got changed to checked/unchecked.
      - `{testId}--radio-label` to click the input
  */
  testId?: string;
  /** Additional information to be included in the `context` of analytics events that come from radio */
  analyticsContext?: Record<string, any>;
};

// Expose all props on a html input element
type Combine<First, Second> = Omit<First, keyof Second> & Second;
export type RadioProps = Combine<
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'aria-label' | 'disabled' | 'required' | 'checked' | 'value'
  >,
  OwnProps
> &
  WithAnalyticsEventsProps;

// Maintained for extract react types so it's clear what methods exist
export interface ExtractReactTypeProps extends WithAnalyticsEventsProps {
  /** the aria-label attribute associated with the radio element */
  ariaLabel?: string;
  /** Field disabled */
  isDisabled?: boolean;
  /** Marks this as a required field */
  isRequired?: boolean;
  /** Field is invalid */
  isInvalid?: boolean;
  /** Set the field as checked */
  isChecked?: boolean;
  /** The label value for the input rendered to the dom */
  label?: ReactNode;
  /** Field name, must be unique to the radio group */
  name?: string;
  /** `onChange` event handler, passed into the props of each `Radio` Component instantiated within RadioGroup */
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  /** `onInvalid` event handler, passed into the props of each `Radio` component instantiated within `RadioGroup` */
  onInvalid?: (e: SyntheticEvent<any>) => void;
  /** Field value */
  value?: RadioValue;
  /**
      A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
      we have two different `testId`s generated based on the one you pass to the Radio component:
      - `{testId}--radio-input` to check if it got changed to checked/unchecked.
      - `{testId}--radio-label` to click the input
    */
  testId?: string;
  /** Additional information to be included in the `context` of analytics events that come from radio */
  analyticsContext?: Record<string, any>;
}
