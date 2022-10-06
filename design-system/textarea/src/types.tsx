import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export interface OwnProps extends WithAnalyticsEventsProps {
  /**
   * controls the appearance of the field.
   * subtle shows styling on hover.
   * none prevents all field styling.
   */
  appearance?: 'standard' | 'subtle' | 'none';
  /**
   * Set whether the fields should expand to fill available horizontal space.
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
   * Set required for form that the field is part of.
   */
  isRequired?: boolean;
  /**
   * Sets styling to indicate that the input is invalid.
   */
  isInvalid?: boolean;
  /**
   * The minimum number of rows of text to display
   */
  minimumRows?: number;
  /**
   * The maxheight of the textarea
   */
  maxHeight?: string;
  /**
   * The value of the text-area.
   */
  value?: string;
  /**
   * The default value of the textarea
   */
  defaultValue?: string;
  /**
   * Name of the input form control
   */
  name?: string;
  /**
   * The placeholder within the textarea
   */
  placeholder?: string;
  /**
   * Handler to be called when the input is blurred
   */
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  /**
   * Handler to be called when the input changes.
   */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  /**
   * Handler to be called when the input is focused
   */
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  /**
   * Sets content text value to monospace
   */
  isMonospaced?: boolean;
  /**
   * Enables the resizing of the textarea:
   * auto: both directions.
   * horizontal: only along the x axis.
   * vertical: only along the y axis.
   * smart (default): vertically grows and shrinks the textarea automatically to wrap your input text.
   * none: explicitly disallow resizing on the textarea.
   */
  resize?: 'auto' | 'vertical' | 'horizontal' | 'smart' | 'none';
  /**
   * Enables native spell check on the `textarea` element.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  spellCheck?: boolean;
  /**
   * The theme function TextArea consumes to derive theming constants for use in styling its components
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  theme?: any;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
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
