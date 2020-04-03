/** @jsx jsx */
import React from 'react';
import { jsx, CSSObject } from '@emotion/core';
import { ThemeTokens } from '../theme';

function warnIfClash(
  ours: React.InputHTMLAttributes<HTMLInputElement>,
  theirs: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const ourKeys: string[] = Object.keys(ours);
  const theirKeys: string[] = Object.keys(theirs);

  ourKeys.forEach((key: string) => {
    if (theirKeys.includes(key)) {
      // eslint-disable-next-line no-console
      console.warn(`
          FieldText:
          You are attempting to add prop "${key}" to the input field.
          It is clashing with one of our supplied props.
          Please try to control this prop through our public API
        `);
    }
  });
}

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  isDisabled: boolean;
  isReadOnly: boolean;
  isRequired: boolean;

  // Theme controls a number of visual stylings
  theme: ThemeTokens;

  // Needed by TextField
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onMouseDown: React.MouseEventHandler<HTMLElement>;
  onMouseEnter: React.MouseEventHandler<HTMLElement>;
  onMouseLeave: React.MouseEventHandler<HTMLElement>;

  /** Element after the input field */
  elemAfterInput?: React.ReactNode;
  /** Element before the input field */
  elemBeforeInput?: React.ReactNode;

  /* returns the ref of the input */
  innerRef: (ref: HTMLInputElement | null) => void;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
}

export default function Input({
  elemAfterInput,
  elemBeforeInput,
  isDisabled,
  isReadOnly,
  isRequired,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onBlur,
  onFocus,
  theme,
  innerRef,
  testId,
  ...theirInputProps
}: Props) {
  const ourInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    onFocus,
    onBlur,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
  };

  // Check for any clashes when in development
  if (process.env.NODE_ENV !== 'production') {
    warnIfClash(ourInputProps, theirInputProps);
  }

  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...theirInputProps,
    // overriding any clashes
    ...ourInputProps,
  };

  const containerProps: React.HTMLAttributes<HTMLElement> = {
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
  };
  return (
    <div {...containerProps} css={theme.container as CSSObject}>
      {elemBeforeInput}
      <input
        {...inputProps}
        css={theme.input as CSSObject}
        ref={innerRef}
        data-testid={testId}
      />
      {elemAfterInput}
    </div>
  );
}
