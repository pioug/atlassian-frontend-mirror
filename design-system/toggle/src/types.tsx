import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

export type Size = 'regular' | 'large';

export interface ToggleProps extends WithAnalyticsEventsProps {
  /**
   * Sets if the toggle is disabled or not. This prevents any interaction. Keep in mind that disabled toggles will not be available to screen readers.
   */
  isDisabled?: boolean;
  /**
   * Use a pairing label with your toggle using `id` and `htmlFor` props to set the relationship.
   * For more information see [labels on MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label).
   */
  id?: string;
  /**
   * Descriptive name for value property to be submitted in a form.
   */
  name?: string;
  /**
   * Value to be submitted in a form.
   */
  value?: string;
  /**
   * Handler to be called when toggle is unfocused.
   */
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * Handler to be called when native 'change' event happens internally.
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * Handler to be called when toggle is focused.
   */
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * Toggle size.
   */
  size?: Size;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   * We have added 2 `testIds`:
   * - `testId` that targets the Label component to interact with the component.
   * - `{testId}--input` to check if the toggle has been checked/unchecked.
   */
  testId?: string;

  /**
   * Additional information to be included in the `context` of analytics events that come from button.
   */
  analyticsContext?: Record<string, any>;

  /**
   * Whether the toggle is initially checked or not.
   * After the initial interaction, whether the component is checked or not is
   * controlled by the component.
   */
  defaultChecked?: boolean;

  /**
   * If defined it takes precedence over defaultChecked and Toggle acts
   * as a controlled component.
   *
   * You can provide a onChange function to be notified of checked value changes
   */
  isChecked?: boolean;

  /**
   * Text to be used as aria-label of toggle component.
   *
   * Use this when there is no visible label for the toggle.
   */
  label?: string;

  /**
   * Use this when you need to provide an extended description about how the toggle works using aria-describedby.
   *
   * It's important to use this prop if the meaning of the toggle with the only a label would be unclear to people who use assistive technology.
   */
  descriptionId?: string;
}
