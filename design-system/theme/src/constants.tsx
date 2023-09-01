import deprecationWarning from '@atlaskit/ds-lib/deprecation-warning';
import { token } from '@atlaskit/tokens';

import { B200, N30A, skeleton as skeletonColor } from './colors';
import type { Layers } from './types';

export const CHANNEL = '__ATLASKIT_THEME__';
export const DEFAULT_THEME_MODE = 'light';
export const THEME_MODES = ['light', 'dark'];

/*
  These theme values are expressed as functions so that if we decide to make
  them dependent on props in the future, it wouldn't require a significant
  refactor everywhere they are being used.
*/
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated Use `token('border.radius', '3px')` instead.
 */
export const borderRadius = () => 3;
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated Use `token('space.100', '8px')` instead with any of the space tokens.
 * Available space tokens can be found on {@link https://atlassian.design/foundations/spacing/#scale}
 */
export const gridSize = () => 8;
export const fontSize = () => 14;
export const fontSizeSmall = () => 11;
export const fontFamily = () =>
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
export const codeFontFamily = () =>
  `'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace`;

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/focus-ring` instead.
 */
export const focusRing = (
  color: string = token('color.border.focused', B200),
  outlineWidth: number = gridSize() / 4,
) => {
  deprecationWarning(
    '@atlaskit/theme',
    'focus ring mixin',
    'Please use `@atlaskit/focus-ring` instead.',
  );
  return `
  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px ${outlineWidth}px ${color};
  }
`;
};

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/focus-ring` instead.
 */
export const noFocusRing = () => `
  box-shadow: none;
`;

export const layers: { [P in keyof Layers]: () => Layers[P] } = {
  card: () => 100,
  navigation: () => 200,
  dialog: () => 300,
  layer: () => 400,
  blanket: () => 500,
  modal: () => 510,
  flag: () => 600,
  spotlight: () => 700,
  tooltip: () => 9999,
};

// eslint-disable-next-line @atlaskit/design-system/use-visually-hidden
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/visually-hidden`
 */
export const visuallyHidden = () => {
  deprecationWarning(
    '@atlaskit/theme',
    'visually hidden mixin',
    'Please use `@atlaskit/visually-hidden` instead.',
  );
  return {
    border: '0 !important',
    clip: 'rect(1px, 1px, 1px, 1px) !important',
    height: '1px !important',
    overflow: 'hidden !important' as 'hidden',
    padding: '0 !important',
    position: 'absolute !important' as 'absolute',
    width: '1px !important',
    whiteSpace: 'nowrap !important' as 'nowrap',
  };
};

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/visually-hidden`
 */
export const assistive = visuallyHidden;

/**
 * These styles are mirrored in:
 * packages/design-system/menu/src/internal/components/skeleton-shimmer.tsx
 *
 * Please update both.
 */
export const skeletonShimmer = () =>
  ({
    css: {
      backgroundColor: token('color.skeleton', skeletonColor()),
      animationDuration: '1.5s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
      animationDirection: 'alternate',
    },
    keyframes: {
      from: {
        backgroundColor: token('color.skeleton', skeletonColor()),
      },
      to: {
        backgroundColor: token('color.skeleton.subtle', N30A),
      },
    },
  } as const);
