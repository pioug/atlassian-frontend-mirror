import { CSSObject } from '@emotion/core';

import { N30A } from '@atlaskit/theme/colors';

import { MenuGroupSizing } from '../types';

export const menuGroupCSS = ({
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
}: MenuGroupSizing): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  maxWidth,
  minWidth,
  maxHeight,
  minHeight,
});

export const sectionCSS = (
  isScrollable?: boolean,
  hasSeparator?: boolean,
): CSSObject => {
  return {
    ...(isScrollable
      ? {
          flexShrink: 1,
          overflow: 'auto',
        }
      : { flexShrink: 0 }),
    ...(hasSeparator
      ? {
          borderTop: `2px solid ${N30A}`,
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
