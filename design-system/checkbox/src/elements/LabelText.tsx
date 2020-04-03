/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';
import { defaultAttributesFn } from '../utils';
import { LabelTextProps, LabelTextCSSProps } from '../types';

export const labelTextCSS = ({ tokens }: LabelTextCSSProps): CSSObject => ({
  paddingTop: tokens.label.spacing.top,
  paddingRight: tokens.label.spacing.right,
  paddingBottom: tokens.label.spacing.bottom,
  paddingLeft: tokens.label.spacing.left,
});

export function LabelText({
  attributesFn,
  tokens,
  children,
  cssFn,
}: LabelTextProps) {
  return (
    <span {...attributesFn()} css={cssFn({ tokens })}>
      {children}
    </span>
  );
}

export default {
  component: LabelText,
  cssFn: labelTextCSS,
  attributesFn: defaultAttributesFn,
};
