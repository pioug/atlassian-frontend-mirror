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

import { borderWidth, dynamicStyles, getBaseStyles } from './styles';
import { type TextAreaProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

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

const InnerTextArea = forwardRef((props: TextAreaProps, ref) => {
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
    testId,
    maxHeight = '50vh',
    onBlur,
    onFocus,
    onChange,
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

  const textAreaStyles = css([baseStyles, dynamicStyles(appearance)]);

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
    return <InnerTextArea ref={ref} {...props} />;
  }),
);

TextArea.displayName = 'TextArea';

export default TextArea;
