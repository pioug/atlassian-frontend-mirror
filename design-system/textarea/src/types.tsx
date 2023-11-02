import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export interface OwnProps extends WithAnalyticsEventsProps {
  /**
   * Controls the appearance of the field.
   * Subtle shows styling on hover.
   * None prevents all field styling. Take care when using the none appearance as this doesn't include accessible interactions.
   */
  appearance?: 'standard' | 'subtle' | 'none';
  /**
   * Sets whether the field should expand to fill available horizontal space.
   */
  isCompact?: boolean;
  /**
   * Sets the field as uneditable, with a changed hover state.
   */
  isDisabled?: boolean;
  /**
   * If true, prevents the value of the input from being edited.
   */
  isReadOnly?: boolean;
  /**
   * Sets whether the field is required for form that the field is part of.
   */
  isRequired?: boolean;
  /**
   * Sets styling to indicate that the input is invalid.
   */
  isInvalid?: boolean;
  /**
   * The minimum number of rows of text to display.
   */
  minimumRows?: number;
  /**
   * The maximum height of the text area.
   */
  maxHeight?: string;
  /**
   * The value of the text area.
   */
  value?: string;
  /**
   * The default value of the text area.
   */
  defaultValue?: string;
  /**
   * Name of the input form control.
   */
  name?: string;
  /**
   * The placeholder within the text area.
   */
  placeholder?: string;
  /**
   * Handler to be called when the input is blurred.
   */
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  /**
   * Handler to be called when the input changes.
   */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  /**
   * Handler to be called when the input is focused.
   */
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  /**
   * Sets the content text value to monospace.
   */
  isMonospaced?: boolean;
  /**
   * Enables resizing of the text area. The default setting is `smart`.
   * Auto enables resizing in both directions.
   * Horizontal enables resizing only along the X axis.
   * Vertical enables resizing only along the Y axis.
   * Smart vertically grows and shrinks the text area automatically to wrap your input text.
   * None explicitly disallows resizing of the text area.
   */
  resize?: 'auto' | 'vertical' | 'horizontal' | 'smart' | 'none';
  /**
   * Enables native spell check on the `textarea` element.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  spellCheck?: boolean;
  /**
   * The theme function `TextArea` consumes to derive theming constants for use in styling its components
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  theme?: any;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

// TODO: DSP-2566 Move `Combine` type utility into @atlaskit/ds-lib https://product-fabric.atlassian.net/browse/DSP-2566
type Combine<First, Second> = Omit<First, keyof Second> & Second;

export type TextAreaProps = Combine<
  Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'disabled' | 'required' | 'readonly'
  >,
  OwnProps
>;
