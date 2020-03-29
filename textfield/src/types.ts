import React, { AllHTMLAttributes } from 'react';
import { ThemeProp } from '@atlaskit/theme/components';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { ThemeProps, ThemeTokens } from './theme';

// External component
export interface PublicProps
  extends WithAnalyticsEventsProps,
    AllHTMLAttributes<HTMLInputElement> {
  appearance?: 'standard' | 'none' | 'subtle';
  /** Applies compact styling, making the field smaller */
  isCompact?: boolean;
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled?: boolean;
  /** Sets styling to indicate that the input is invalid */
  isInvalid?: boolean;
  /** Sets content text value to monospace */
  isMonospaced?: boolean;
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean;
  /** Set required for form that the field is part of. */
  isRequired?: boolean;
  /** Element after input in textfield. */
  elemAfterInput?: React.ReactNode;
  /** Element before input in textfield. */
  elemBeforeInput?: React.ReactNode;
  /** Sets maximum width of input */
  width?: string | number;
  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
  /** Mousedown handler that will fire on the container element */
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
  /** Name of the input form control */
  name?: string;
}

export interface InternalProps extends PublicProps {
  /** forwardedRef is not a public prop.
  It is being picked up due to an issue with `extract-react-types`
  */
  forwardedRef?: React.Ref<HTMLInputElement>;
}
