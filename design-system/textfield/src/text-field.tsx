/** @jsx jsx */
import React, { forwardRef, memo, useCallback, useMemo, useRef } from 'react';

import { jsx } from '@emotion/core';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { useGlobalTheme } from '@atlaskit/theme/components';

import {
  containerStyles as getContainerStyles,
  inputStyles as getInputStyles,
} from './styles';
import { TextfieldProps } from './types';

const analyticsParams = {
  componentName: 'textField',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const Textfield = forwardRef((props: TextfieldProps, ref) => {
  const {
    appearance = 'standard',
    isCompact = false,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    isReadOnly = false,
    isMonospaced = false,
    width,
    elemAfterInput,
    elemBeforeInput,
    testId,
    onFocus,
    onBlur,
    onMouseDown,
    className,
    ...spreadProps
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mode } = useGlobalTheme();

  const handleOnFocus = usePlatformLeafEventHandler({
    fn: (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus && onFocus(event);
    },
    action: 'focused',
    ...analyticsParams,
  });

  const handleOnBlur = usePlatformLeafEventHandler({
    fn: (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur && onBlur(event);
    },
    action: 'blurred',
    ...analyticsParams,
  });

  const handleOnMouseDown = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      // Running e.preventDefault() on the INPUT prevents double click behaviour
      // Sadly we needed this cast as the target type is being correctly set
      const target: HTMLInputElement = event.target as HTMLInputElement;
      if (target.tagName !== 'INPUT') {
        event.preventDefault();
      }

      if (
        inputRef &&
        inputRef.current &&
        !isDisabled &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current.focus();
      }

      onMouseDown && onMouseDown(event);
    },
    [onMouseDown, isDisabled],
  );

  const setInputRef = useCallback(
    (inputElement: HTMLInputElement | null) => {
      inputRef.current = inputElement;

      if (!ref) {
        return;
      }

      if (typeof ref === 'object') {
        // This is a blunder on the part of @types/react
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
        // .current should be assignable
        // @ts-expect-error
        ref.current = inputElement;
      }

      if (typeof ref === 'function') {
        ref(inputElement);
      }
    },
    [ref],
  );

  const containerStyles = useMemo(
    () => getContainerStyles(appearance, mode, width),
    [appearance, mode, width],
  );

  const inputStyle = useMemo(() => getInputStyles(mode), [mode]);

  return (
    // We use event bubbling here to listen to any child element mouse down event.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      data-disabled={isDisabled ? isDisabled : undefined}
      data-invalid={isInvalid ? isInvalid : undefined}
      data-ds--text-field--container
      data-testid={testId && `${testId}-container`}
      onMouseDown={handleOnMouseDown}
      // TODO: When removing legacy theming fix this.
      // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
      css={containerStyles}
      className={className}
    >
      {elemBeforeInput}
      <input
        {...spreadProps}
        data-compact={isCompact ? isCompact : undefined}
        data-monospaced={isMonospaced ? isMonospaced : undefined}
        data-ds--text-field--input
        data-testid={testId}
        aria-invalid={isInvalid ? isInvalid : undefined}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        ref={setInputRef}
        // TODO: When removing legacy theming fix this.
        // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
        css={inputStyle}
      />
      {elemAfterInput}
    </div>
  );
});

Textfield.displayName = 'Textfield';

/**
 * __Textfield__
 *
 * A text field is an input that allows a user to write or edit text.
 *
 * - [Examples](https://atlassian.design/components/textfield/examples)
 * - [Code](https://atlassian.design/components/textfield/code)
 * - [Usage](https://atlassian.design/components/textfield/usage)
 */
export default memo<TextfieldProps & React.RefAttributes<unknown>>(Textfield);
// The above generic is used to let ERTC know what props to extract.
// See: https://github.com/atlassian/extract-react-types/issues/201
