import { N10, N30 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import {
  VAR_SCROLL_INDICATOR_COLOR,
  VAR_SEPARATOR_COLOR,
} from '../../common/constants';

const scrollIndicatorMaskZIndex = 2;
const scrollIndicatorZIndex = 1;
const scrollIndicatorHeight = 2;
const scrollIndicatorBorderRadius = 1;
const containerPadding = gridSize();

const itemHeadingTopMargin = containerPadding * 2.5;
const itemHeadingBottomMargin = containerPadding * 0.75;

// Skeleton content is slightly shorter than the real content.
// Because of that we slightly increase the top margin to offset this so the
// containing size both real and skeleton always equal approx 30px.
const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const skeletonHeadingHeight = containerPadding;
const skeletonHeadingMarginOffset = 3;
const skeletonHeadingTopMargin =
  itemHeadingTopMargin +
  (itemHeadingContentHeight - skeletonHeadingHeight) -
  skeletonHeadingMarginOffset;
// We want to move the entire body up by 3px without affecting the height of the skeleton container.
const skeletonHeadingBottomMargin =
  itemHeadingBottomMargin + skeletonHeadingMarginOffset;

interface StyleOpts {
  showTopScrollIndicator?: boolean;
}

/**
 * This outer container css contains the "real" scroll indicators which are
 * always rendered to the screen.
 * They are "conditionally" shown from the users perspective using the inner container CSS
 * which has other pseudo elements which "mask" the "real" scroll indicators.
 */
export const outerContainerCSS = (
  opts: StyleOpts & { scrollbarWidth: number },
) =>
  ({
    // Flex is needed to ensure the overflow indicators are positioned correctly.
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',

    '&::before': {
      content: "''",
      display: 'block',
      left: containerPadding,
      right: containerPadding + opts.scrollbarWidth,
      height: scrollIndicatorHeight,
      borderRadius: scrollIndicatorBorderRadius,
      backgroundColor: `var(${VAR_SEPARATOR_COLOR}, ${token(
        'color.border.neutral',
        N30,
      )})`,
      position: 'absolute',
      zIndex: scrollIndicatorZIndex,
    },

    '&::after': {
      content: "''",
      position: 'absolute',
      display: 'block',
      borderRadius: scrollIndicatorBorderRadius,
      flexShrink: 0,
      height: scrollIndicatorHeight,
      left: containerPadding,
      right: containerPadding + opts.scrollbarWidth,
      bottom: 0,
      zIndex: scrollIndicatorZIndex,
      backgroundColor: `var(${VAR_SEPARATOR_COLOR}, ${token(
        'color.border.neutral',
        N30,
      )})`,
    },
  } as const);

/**
 * This inner container css contains the "mask" logic for the scroll indicators.
 * Essentially they cover (mask) the "real" scroll indicators when the user is scrolled
 * to the top or bottom of the container.
 */
export const innerContainerCSS = (opts: StyleOpts) =>
  ({
    display: 'flex',
    overflow: 'auto',
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    flexDirection: 'column',

    // This before pseudo element is works by being positioned at the top of this scrolling
    // container - so when you scroll down it stops "masking" the actual scroll indicator.
    ...(!opts.showTopScrollIndicator &&
      ({
        '&::before': {
          borderRadius: scrollIndicatorBorderRadius,
          content: "''",
          left: 0,
          right: 0,
          height: scrollIndicatorHeight,
          backgroundColor: `var(${VAR_SCROLL_INDICATOR_COLOR}, ${token(
            'color.background.default',
            N10,
          )})`,
          position: 'absolute',
          display: 'block',
          zIndex: scrollIndicatorMaskZIndex,
        },
      } as const)),

    // This after pseudo element abuses being a flex child and pushes itself down to the
    // very bottom of the container - doing so ends up "masking" the actual scroll indicator.
    '&::after': {
      borderRadius: scrollIndicatorBorderRadius,
      content: "''",
      display: 'block',
      flexShrink: 0,
      height: scrollIndicatorHeight,
      // This is used to "push" the element to the bottom of the flex container.
      marginTop: 'auto',
      position: 'relative',
      zIndex: scrollIndicatorMaskZIndex,
      backgroundColor: `var(${VAR_SCROLL_INDICATOR_COLOR}, ${token(
        'color.background.default',
        N10,
      )})`,
    },
  } as const);

export const containerCSS = (opts: StyleOpts) =>
  ({
    // When the scroll indicator is always shown we need to add some padding
    // so the spacing between matches what it would be if the indicator was a "block" element.
    // We use margin here so any child absolutely positioned elements are positioned correctly.
    marginTop: opts.showTopScrollIndicator ? scrollIndicatorHeight : 0,
    marginLeft: containerPadding,
    marginRight: containerPadding,
    // Enables child absolutely positioned elements to be positioned relative to this element.
    position: 'relative',

    '& [data-ds--menu--heading-item]': {
      marginTop: itemHeadingTopMargin,
      marginBottom: itemHeadingBottomMargin,
    },
    '& [data-ds--menu--skeleton-heading-item]': {
      marginTop: skeletonHeadingTopMargin,
      marginBottom: skeletonHeadingBottomMargin,
    },
  } as const);
