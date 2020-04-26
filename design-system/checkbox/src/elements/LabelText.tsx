/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';

import { LabelTextCSSProps, LabelTextProps } from '../types';
import { defaultAttributesFn } from '../utils';

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
