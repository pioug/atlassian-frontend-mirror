import { NavigationTheme } from '../theme';

import { CREATE_BREAKPOINT } from './constants';

export const actionSectionDesktopCSS = {
  [`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
    display: 'none !important',
  },
};

export const actionSectionMobileCSS = {
  [`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
    display: 'none !important',
  },
};

export const skeletonCSS = ({ mode: { skeleton } }: NavigationTheme) => ({
  //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
  opacity: 0.15,
  ...skeleton,
});
