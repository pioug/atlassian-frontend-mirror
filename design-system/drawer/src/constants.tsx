import { easeOut } from '@atlaskit/motion/curves';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { DrawerWidth, FocusLockSettings } from './components/types';

export const transitionDuration = '0.22s';
export const transitionDurationMs = 220;
export const transitionTimingFunction = easeOut;
export const widths: DrawerWidth[] = [
  'narrow',
  'medium',
  'wide',
  'extended',
  'full',
];

export const animationTimingFunction = () => easeOut;

export const defaultFocusLockSettings: FocusLockSettings = {
  isFocusLockEnabled: true,
  shouldReturnFocus: true,
  autoFocusFirstElem:
    getBooleanFF(
      'platform.design-system-team.drawer-screen-reader-focus-trap-refactor_hfuxc',
    ) || false,
};
