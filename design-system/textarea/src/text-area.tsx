/** @jsx jsx */
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { css, jsx } from '@emotion/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { useGlobalTheme } from '@atlaskit/theme/components';

import { borderWidth, getBaseStyles, themeStyles } from './styles';
import { Theme, ThemeTokens } from './theme';
import { TextAreaProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

interface InternalProps extends TextAreaProps {
  tokens: ThemeTokens;
}

const analyticsParams = {
  componentName: 'textArea',
  packageName,
  packageVersion,
};

const setSmartHeight = (el: HTMLTextAreaElement) => {
  // Always reset height to auto before calculating new height
  el.style.height = 'auto';
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
    minimumRows = 2,
    theme,
    testId,
    maxHeight = '50vh',
    onBlur,
    onFocus,
    onChange,
    tokens,
    value,
    ...rest
  } = props;

  useEffect(() => {
    const el: HTMLTextAreaElement | null = ourRef.current;
    if (resize === 'smart' && el) {
      setSmartHeight(el);
    }
  }, [resize, value]);

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

  const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (e) => {
        const el: HTMLTextAreaElement | null = ourRef.current;
        if (resize === 'smart' && el) {
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

  const textAreaStyles = css([
    baseStyles,
    // not memoizing themeStyles as `tokens` is an unstable reference
    themeStyles(tokens, appearance),
  ]);

  return (
    <textarea
      {...controlProps}
      value={value}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      ref={getTextAreaRef}
      onChange={handleOnChange}
      onBlur={onBlurWithAnalytics}
      onFocus={onFocusWithAnalytics}
      rows={minimumRows}
      // TODO refactor to follow emotion styling rules
      // see: https://product-fabric.atlassian.net/browse/DSP-6060
      // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
      css={textAreaStyles}
      {...rest}
    />
  );
});

/**
 * __Text area__
 *
 * A text area lets users enter long form text which spans over multiple lines.
 *
 * - [Examples](https://atlassian.design/components/textarea/examples)
 * - [Code](https://atlassian.design/components/textarea/code)
 * - [Usage](https://atlassian.design/components/textarea/usage)
 */
const TextArea = memo(
  forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    props: TextAreaProps,
    ref: React.Ref<HTMLTextAreaElement>,
  ) {
    const { mode } = useGlobalTheme();
    return (
      <Theme.Provider value={props.theme}>
        <Theme.Consumer appearance={props.appearance || 'standard'} mode={mode}>
          {(tokens: ThemeTokens) => (
            <TextAreaWithTokens ref={ref} {...props} tokens={tokens} />
          )}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }),
);

TextArea.displayName = 'TextArea';

export default TextArea;
