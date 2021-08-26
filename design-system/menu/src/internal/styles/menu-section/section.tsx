import { CSSObject } from '@emotion/core';

import { N30A } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const gridSize = gridSizeFn();

const itemHeadingTopMargin = gridSize * 2.5;
const itemHeadingBottomMargin = gridSize * 0.75;

// Skeleton content is slightly shorter than the real content.
// Because of that we slightly increase the top margin to offset this so the
// containing size both real and skeleton always equal approx 30px.
const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const skeletonHeadingHeight = gridSize;
const skeletonHeadingMarginOffset = 3;
const skeletonHeadingTopMargin =
  itemHeadingTopMargin +
  (itemHeadingContentHeight - skeletonHeadingHeight) -
  skeletonHeadingMarginOffset;
// We want to move the entire body up by 3px without affecting the height of the skeleton container.
const skeletonHeadingBottomMargin =
  itemHeadingBottomMargin + skeletonHeadingMarginOffset;

const sectionPaddingTopBottom = gridSize * 0.75;
const VAR_SEPARATOR_COLOR = '--ds-menu-seperator-color';

export const sectionCSS = (
  isScrollable?: boolean,
  hasSeparator?: boolean,
): CSSObject => {
  return {
    '&:before, &:after': {
      content: '" "',
      display: 'block',
      height: sectionPaddingTopBottom,
    },
    '& [data-ds--menu--heading-item]': {
      '&:first-of-type': {
        marginTop: itemHeadingTopMargin - sectionPaddingTopBottom,
      },
      marginTop: itemHeadingTopMargin,
      marginBottom: itemHeadingBottomMargin,
    },
    '& [data-ds--menu--skeleton-heading-item]': {
      '&:first-of-type': {
        marginTop: skeletonHeadingTopMargin - sectionPaddingTopBottom,
      },
      marginTop: skeletonHeadingTopMargin,
      marginBottom: skeletonHeadingBottomMargin,
    },
    ...(isScrollable
      ? {
          flexShrink: 1,
          overflow: 'auto',
        }
      : { flexShrink: 0 }),
    ...(hasSeparator
      ? {
          borderTop: `2px solid var(${VAR_SEPARATOR_COLOR}, ${token(
            'color.border.neutral',
            N30A,
          )})`,
        }
      : {
          // this is to ensure that adjacent sections without separators don't get additional margins.
          '[data-section] + &': {
            marginTop: -6,
          },
        }),
    '&:focus': {
      // NOTE: Firefox allows elements that have "overflow: auto" to gain focus (as if it had tab-index="0")
      // We have made a deliberate choice to leave this behaviour as is.
      // This makes the outline go inside by 1px so it can actually be displayed
      // else it gets cut off from the overflow: scroll from the parent menu group.
      outlineOffset: -1,
    },
  };
};
