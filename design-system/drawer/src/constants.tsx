import type { Direction } from '@atlaskit/motion';

import type { DrawerWidth, FocusLockSettings } from './components/types';

export const widths: DrawerWidth[] = ['narrow', 'medium', 'wide', 'extended', 'full'];
export const directions: Direction[] = ['top', 'right', 'bottom', 'left'];

export const defaultFocusLockSettings: FocusLockSettings = {
	isFocusLockEnabled: true,
	shouldReturnFocus: true,
	autoFocusFirstElem: true,
};
