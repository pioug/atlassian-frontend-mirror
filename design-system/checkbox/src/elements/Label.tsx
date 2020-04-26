/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';

import { LabelCSSProps, LabelProps } from '../types';
import { defaultAttributesFn } from '../utils';

export const labelCSS = ({ isDisabled, tokens }: LabelCSSProps): CSSObject => ({
  alignItems: 'flex-start',
  display: 'flex',
  color: isDisabled
    ? tokens.label.textColor.disabled
    : tokens.label.textColor.rest,
  ...(isDisabled && { cursor: 'not-allowed' }),
});

export function Label({
  attributesFn,
  children,
  isDisabled,
  onMouseUp,
  onMouseDown,
  onMouseLeave,
  onMouseEnter,
  tokens,
  cssFn,
  testId,
}: LabelProps) {
  return (
    <label
      {...attributesFn({ isDisabled })}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      css={cssFn({ isDisabled, tokens })}
      data-testid={testId}
    >
      {children}
    </label>
  );
}

export default {
  component: Label,
  cssFn: labelCSS,
  attributesFn: defaultAttributesFn,
};
