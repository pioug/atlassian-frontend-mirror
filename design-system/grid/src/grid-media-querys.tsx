import {
  UNSAFE_BREAKPOINTS_CONFIG,
  UNSAFE_buildAboveMediaQueryCSS,
} from '@atlaskit/primitives/responsive';

export const gapMediaQueries = Object.values(
  UNSAFE_buildAboveMediaQueryCSS((breakpoint) => ({
    gap: UNSAFE_BREAKPOINTS_CONFIG[breakpoint].gridItemGutter,
  })),
);

export const inlinePaddingMediaQueries = Object.values(
  UNSAFE_buildAboveMediaQueryCSS((breakpoint) => ({
    paddingInline: UNSAFE_BREAKPOINTS_CONFIG[breakpoint].gridMargin,
  })),
);
