import type { Direction } from '@atlaskit/motion';
import { easeOut } from '@atlaskit/motion/curves';

import type { DrawerWidth, FocusLockSettings } from './components/types';

export const transitionTimingFunction = easeOut;
export const widths: DrawerWidth[] = ['narrow', 'medium', 'wide', 'extended', 'full'];
export const directions: Direction[] = ['top', 'right', 'bottom', 'left'];

export const animationTimingFunction = () => easeOut;

export const defaultFocusLockSettings: FocusLockSettings = {
	isFocusLockEnabled: true,
	shouldReturnFocus: true,
	autoFocusFirstElem: true,
};
