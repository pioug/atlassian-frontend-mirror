import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type Sizes = 'regular' | 'large';

export interface BaseProps extends WithAnalyticsEventsProps {
  /** If the toggle is disabled or not. This prevents any interaction. */
  isDisabled?: boolean;
  /**
   * Use a pairing label with your toggle using `id` and `htmlFor` props to set the relationship.
   * For more information see [labels on MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label).
   */
  id?: string;
  /** Descriptive name for value property to be submitted in a form. */
  name?: string;
  /** Value to be submitted in a form. */
  value?: string;
  /** Handler to be called when toggle is unfocused. */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Handler to be called when native 'change' event happens internally. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Handler to be called when toggle is focused. */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Toggle size. */
  size?: Sizes;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
  We have added 2 `testIds`:
   - `testId` that targets the Label component to interact with the component.
   - `{testId}--input` to check if the toggle has been checked/unchecked.
  */
  testId?: string;
}

export interface StatefulProps extends BaseProps {
  /** Whether the toggle is initially checked or not
   * After initial mount whether the component is checked or not is
   * controlled by the component */
  isDefaultChecked: boolean;
}

export interface StatelessProps extends BaseProps {
  /** If the toggle is checked or not. */
  isChecked?: boolean;
}

export interface StyledProps {
  isChecked?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  size: Sizes;
}
