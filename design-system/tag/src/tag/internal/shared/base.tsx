/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { cssVar, defaultMargin, tagHeight } from '../../../constants';
import type { AppearanceType, TagColor } from '../../../index';
import * as styles from '../../../styles';

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
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
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
  const isLink = Boolean(href);
  const isRemovable = Boolean(after);
  const isInteractive = isLink || isRemovable;
  const isStandardLink = isLink && color === 'standard';

  // Change link text color if  the tag is standard color
  const textLinkColors = isStandardLink
    ? styles.textColors['standardLink']
    : styles.textColors[color];

  const backgroundHoverColors =
    isRemovable && !isLink
      ? styles.backgroundColors[color]
      : styles.linkHoverBackgroundColors[color];

  const backgroundActiveColors =
    isRemovable && !isLink
      ? styles.backgroundColors[color]
      : styles.linkActiveBackgroundColors[color];

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
        [cssVar.color.text.default]: styles.textColors[color],
        [cssVar.color.text.hover]: styles.textHoverColors[color],
        [cssVar.color.text.active]: styles.textActiveColors[color],
        [cssVar.color.text.link]: textLinkColors,
        [cssVar.color.background.default]: styles.backgroundColors[color],
        [cssVar.color.background.hover]: backgroundHoverColors,
        [cssVar.color.background.active]: backgroundActiveColors,
        [cssVar.color.focusRing]: styles.focusRingColors,
        [cssVar.color.removeButton.default]: styles.removeButtonColors[color],
        [cssVar.color.removeButton.hover]:
          styles.removeButtonHoverColors[color],
        [cssVar.borderRadius]: styles.borderRadius[appearance],
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
