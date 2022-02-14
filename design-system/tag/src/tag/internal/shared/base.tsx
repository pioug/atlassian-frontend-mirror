/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';

import { cssVar, defaultMargin, tagHeight } from '../../../constants';
import type { AppearanceType, TagColor } from '../../../index';
import * as theme from '../../../theme';

type BaseProps = React.AllHTMLAttributes<HTMLElement> & {
  before?: JSX.Element;
  contentElement: JSX.Element;
  after?: JSX.Element;
  testId?: string;
  appearance?: AppearanceType;
  color?: TagColor;
};

const baseStyles = css({
  display: 'inline-flex',
  height: tagHeight,
  margin: defaultMargin,
  padding: 0,
  position: 'relative',
  backgroundColor: `var(${cssVar.color.background.default})`,
  borderRadius: `var(${cssVar.borderRadius})`,
  color: `var(${cssVar.color.text.default})`,
  cursor: 'default',
  lineHeight: 1,
  overflow: 'hidden',
  pointerEvents: 'none',
});

const interactiveStyles = css({
  '&:hover': {
    backgroundColor: `var(${cssVar.color.background.hover})`,
    color: `var(${cssVar.color.text.hover})`,
  },

  '&:active': {
    backgroundColor: `var(${cssVar.color.background.active})`,
    color: `var(${cssVar.color.text.hover})`,
  },

  '&:focus-within': {
    boxShadow: `0 0 0 2px var(${cssVar.color.focusRing})`,
    outline: 'none',
  },
});

const BaseTag = React.forwardRef<HTMLDivElement, BaseProps>(function BaseTag(
  {
    before,
    contentElement,
    after,
    testId,
    appearance = 'default',
    style,
    color = 'standard',
    href,
    className,
    ...other
  }: BaseProps,
  ref,
) {
  const { mode } = useGlobalTheme();

  const isLink = Boolean(href);
  const isRemovable = Boolean(after);
  const isInteractive = isLink || isRemovable;

  return (
    <span
      {...other}
      ref={ref}
      css={[baseStyles, isInteractive && interactiveStyles]}
      style={{
        [cssVar.color.background.default]: theme.backgroundColors[color][mode],
        [cssVar.color.text.default]: theme.textColors[color][mode],
        [cssVar.color.background.hover]:
          theme.linkHoverBackgroundColors[color][mode],
        [cssVar.color.background.active]:
          theme.linkActiveBackgroundColors[mode],
        [cssVar.color.focusRing]: theme.focusRingColors[mode],
        [cssVar.borderRadius]: theme.borderRadius[appearance],
        ...style,
      }}
      className={className}
      data-testid={testId}
    >
      {before}
      {contentElement}
      {after}
    </span>
  );
});

export default BaseTag;
