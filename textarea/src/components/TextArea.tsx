import React from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  WithAnalyticsEventsProps,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import GlobalTheme from '@atlaskit/theme/components';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { Theme, ThemeTokens } from '../theme';
import { TextAreaWrapper } from '../styled';
import TextareaElement from './TextAreaElement';

export interface Props extends WithAnalyticsEventsProps {
  /**
   * controls the appearance of the field.
   * subtle shows styling on hover.
   * none prevents all field styling.
   */
  appearance?: 'standard' | 'subtle' | 'none';
  /** Set whether the fields should expand to fill available horizontal space. */
  isCompact?: boolean;
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled?: boolean;
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean;
  /** Set required for form that the field is part of. */
  isRequired?: boolean;
  /** Sets styling to indicate that the input is invalid. */
  isInvalid?: boolean;
  /** The minimum number of rows of text to display */
  minimumRows?: number;
  /** The maxheight of the textarea */
  maxHeight?: string;
  /** The value of the text-area. */
  value?: string;
  /** The default value of the textarea */
  defaultValue?: string;
  /** Name of the input form control */
  name?: string;
  /** The placeholder within the textarea */
  placeholder?: string;
  /** Handler to be called when the input is blurred */
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  /** Handler to be called when the input changes. */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  /** Handler to be called when the input is focused */
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  /** Sets content text value to monospace */
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
  spellCheck?: boolean;
  /**
   * The theme function TextArea consumes to derive theming constants for use in styling its components
   */
  theme?: any;
  /**
   * Ref used to access the textarea dom element. NOTE we expose this via
   * forwardRef, so you can also use the ref prop of this component to the
   * same effect.
   */
  forwardedRef?: React.Ref<HTMLTextAreaElement>;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
}

type State = {
  isFocused: boolean;
};

class TextAreaWithoutForwardRef extends React.Component<Props, State> {
  static defaultProps = {
    resize: 'smart',
    appearance: 'standard',
    isCompact: false,
    isRequired: false,
    isReadOnly: false,
    isDisabled: false,
    isInvalid: false,
    isMonospaced: false,
    minimumRows: 1,
    maxHeight: '50vh',
    forwardedRef: () => {},
  };

  state: State = {
    isFocused: false,
  };

  handleOnBlur: React.FocusEventHandler<HTMLTextAreaElement> = event => {
    const { onBlur } = this.props;
    this.setState({ isFocused: false });
    if (onBlur) {
      onBlur(event);
    }
  };

  handleOnFocus: React.FocusEventHandler<HTMLTextAreaElement> = event => {
    const { onFocus } = this.props;
    this.setState({ isFocused: true });
    if (onFocus) {
      onFocus(event);
    }
  };

  render() {
    const {
      createAnalyticsEvent,
      appearance,
      resize,
      isCompact,
      isDisabled,
      isInvalid,
      isReadOnly,
      isMonospaced,
      isRequired,
      minimumRows,
      maxHeight,
      theme,
      forwardedRef,
      testId,
      ...rest
    } = this.props;

    const { isFocused } = this.state;

    return (
      <GlobalTheme.Consumer>
        {({ mode }: { mode: 'dark' | 'light' }) => (
          <Theme.Provider value={theme}>
            <Theme.Consumer appearance={appearance!} mode={mode}>
              {(tokens: ThemeTokens) => (
                <TextAreaWrapper
                  resize={resize}
                  maxHeight={maxHeight}
                  appearance={appearance}
                  isCompact={isCompact}
                  isDisabled={isDisabled}
                  isReadOnly={isReadOnly}
                  isMonospaced={isMonospaced}
                  isFocused={isFocused}
                  isInvalid={isInvalid}
                  minimumRows={minimumRows}
                  {...tokens}
                >
                  <TextareaElement
                    forwardedRef={forwardedRef}
                    resize={resize}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    required={isRequired}
                    {...rest}
                    onFocus={this.handleOnFocus}
                    onBlur={this.handleOnBlur}
                    data-testid={testId}
                  />
                </TextAreaWrapper>
              )}
            </Theme.Consumer>
          </Theme.Provider>
        )}
      </GlobalTheme.Consumer>
    );
  }
}

const TextArea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => (
  // Once Extract React Types is fixed to read from default exports we can
  // move textareaRef instantiation to after the spread.
  // as of now we do this to reduce the chance of users being misled into a breaking configuration
  // by our documentation.
  <TextAreaWithoutForwardRef forwardedRef={ref} {...props} />
));

export { TextArea as TextAreaWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'textArea',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'textArea',

      attributes: {
        componentName: 'textArea',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'textArea',

      attributes: {
        componentName: 'textArea',
        packageName,
        packageVersion,
      },
    }),
  })(TextArea),
);
