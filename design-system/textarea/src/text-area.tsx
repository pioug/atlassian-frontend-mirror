/** @jsx jsx */
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { jsx } from '@emotion/core';

import {
  usePlatformLeafEventHandler,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import GlobalTheme from '@atlaskit/theme/components';

import { borderWidth, getBaseStyles, themeStyles } from './styles';
import { Theme, ThemeTokens } from './theme';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

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
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
}

interface InternalProps extends Props {
  tokens: ThemeTokens;
}

const analyticsParams = {
  componentName: 'textArea',
  packageName,
  packageVersion,
};

const setSmartHeight = (el: HTMLTextAreaElement) => {
  const borderHeight = borderWidth;
  const paddingBoxHeight: number = el.scrollHeight;
  const borderBoxHeight: number = paddingBoxHeight + borderHeight * 2;
  el.style.height = `${borderBoxHeight}px`;
};

const TextAreaWithTokens = forwardRef((props: InternalProps, ref) => {
  const ourRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    resize = 'smart',
    appearance = 'standard',
    isCompact = false,
    isRequired = false,
    isReadOnly = false,
    isDisabled = false,
    isInvalid = false,
    isMonospaced = false,
    minimumRows = 1,
    theme,
    testId,
    maxHeight = '50vh',
    onBlur,
    onFocus,
    onChange,
    tokens,
    ...rest
  } = props;

  useEffect(() => {
    const el: HTMLTextAreaElement | null = ourRef.current;
    if (resize === 'smart' && el) {
      setSmartHeight(el);
    }
  }, [resize]);

  const onBlurWithAnalytics = usePlatformLeafEventHandler({
    fn: (event: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlur && onBlur(event);
    },
    action: 'blurred',
    ...analyticsParams,
  });

  const onFocusWithAnalytics = usePlatformLeafEventHandler({
    fn: (event: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocus && onFocus(event);
    },
    action: 'focused',
    ...analyticsParams,
  });

  const getTextAreaRef = (elementRef: HTMLTextAreaElement | null) => {
    ourRef.current = elementRef;
    if (ref && typeof ref === 'object') {
      // @ts-ignore
      ref.current = elementRef;
    }
    if (ref && typeof ref === 'function') {
      ref(elementRef);
    }
  };

  const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      const el: HTMLTextAreaElement | null = ourRef.current;
      if (resize === 'smart' && el) {
        el.style.height = 'auto';
        setSmartHeight(el);
      }
      onChange && onChange(e);
    },
    [onChange, resize],
  );

  const controlProps = {
    'data-invalid': isInvalid ? isInvalid : undefined,
    'data-compact': isCompact ? isCompact : undefined,
    'data-testid': testId ? testId : undefined,
  };

  const baseStyles = useMemo(
    () =>
      getBaseStyles({
        minimumRows,
        resize,
        appearance,
        isMonospaced,
        maxHeight,
      }),
    [minimumRows, resize, appearance, isMonospaced, maxHeight],
  );

  const textAreaStyles = [
    baseStyles,
    // not memoizing themeStyles as `tokens` is an unstable reference
    themeStyles(tokens),
  ];

  return (
    <textarea
      {...controlProps}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      ref={getTextAreaRef}
      onChange={handleOnChange}
      onBlur={onBlurWithAnalytics}
      onFocus={onFocusWithAnalytics}
      // TODO refactor to follow emotion styling rules
      // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
      css={textAreaStyles}
      {...rest}
    />
  );
});

const TextArea = memo(
  forwardRef<HTMLTextAreaElement, Props>(function TextArea(
    props: Props,
    ref: React.Ref<HTMLTextAreaElement>,
  ) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }: { mode: 'dark' | 'light' }) => (
          <Theme.Provider value={props.theme}>
            <Theme.Consumer
              appearance={props.appearance || 'standard'}
              mode={mode}
            >
              {(tokens: ThemeTokens) => (
                <TextAreaWithTokens ref={ref} {...props} tokens={tokens} />
              )}
            </Theme.Consumer>
          </Theme.Provider>
        )}
      </GlobalTheme.Consumer>
    );
  }),
);

TextArea.displayName = 'TextArea';

export default TextArea;
