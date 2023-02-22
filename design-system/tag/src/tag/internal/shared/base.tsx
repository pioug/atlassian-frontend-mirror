/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import { useGlobalTheme } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

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
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  margin: defaultMargin,
  padding: token('space.0', '0px'),
  position: 'relative',
  backgroundColor: `var(${cssVar.color.background.default})`,
  borderRadius: `var(${cssVar.borderRadius})`,
  color: `var(${cssVar.color.text.default})`,
  cursor: 'default',
  lineHeight: 1,
  overflow: 'hidden',
});

const interactiveStyles = css({
  '&:hover': {
    backgroundColor: `var(${cssVar.color.background.hover})`,
  },
  '&:active': {
    backgroundColor: `var(${cssVar.color.background.active})`,
  },
});

const focusRingStyles = css({
  '&:focus-within': {
    boxShadow: `0 0 0 2px var(${cssVar.color.focusRing})`,
    outline: 'none',
  },
});

const nonStandardLinkStyles = css({
  '&:active': {
    color: `var(${cssVar.color.text.active})`,
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
  const isStandardLink = isLink && color === 'standard';

  // Change link text color if  the tag is standard color
  const textLinkColors = isStandardLink
    ? theme.textColors['standardLink'][mode]
    : theme.textColors[color][mode];

  const backgroundHoverColors =
    isRemovable && !isLink
      ? theme.backgroundColors[color][mode]
      : theme.linkHoverBackgroundColors[color][mode];

  const backgroundActiveColors =
    isRemovable && !isLink
      ? theme.backgroundColors[color][mode]
      : theme.linkActiveBackgroundColors[color][mode];

  return (
    <span
      {...other}
      ref={ref}
      css={[
        baseStyles,
        (isRemovable || isLink) && focusRingStyles,
        isLink && !isStandardLink && nonStandardLinkStyles,
        isInteractive && interactiveStyles,
      ]}
      style={{
        [cssVar.color.text.default]: theme.textColors[color][mode],
        [cssVar.color.text.hover]: theme.textHoverColors[color][mode],
        [cssVar.color.text.active]: theme.textActiveColors[color][mode],
        [cssVar.color.text.link]: textLinkColors,
        [cssVar.color.background.default]: theme.backgroundColors[color][mode],
        [cssVar.color.background.hover]: backgroundHoverColors,
        [cssVar.color.background.active]: backgroundActiveColors,
        [cssVar.color.focusRing]: theme.focusRingColors[mode],
        [cssVar.color.removeButton.default]: theme.removeButtonColors[color],
        [cssVar.color.removeButton.hover]:
          theme.removeButtonHoverColors[color][mode],
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BaseTag;
