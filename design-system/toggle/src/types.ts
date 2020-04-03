import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type Sizes = 'regular' | 'large';

export interface BaseProps extends WithAnalyticsEventsProps {
  /** Whether the toggle is disabled or not. This will prevent any interaction with the user */
  isDisabled?: boolean;
  /** Label to be set for accessibility */
  label?: string;
  /** Descriptive name for value property to be submitted in a form */
  name?: string;
  /** The value to be submitted in a form. */
  value?: string;
  /** Handler to be called when toggle is unfocused */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Handler to be called when native 'change' event happens internally. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Handler to be called when toggle is focused. */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Defines the size of the toggle. */
  size?: Sizes;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
  we have added 2 testIds:
   - `testId` that targets the Label component to interact with the component.
   - `{testId}--input` to check if the toggle has been checked/unchecked. */
  testId?: string;
}

export interface StatefulProps extends BaseProps {
  /** Whether the toggle is initially checked or not
   * After initial mount whether the component is checked or not is
   * controlled by the component */
  isDefaultChecked: boolean;
}

export interface StatelessProps extends BaseProps {
  /** Whether the toggle is checked or not */
  isChecked?: boolean;
}

export interface StyledProps {
  isChecked?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  size: Sizes;
}
