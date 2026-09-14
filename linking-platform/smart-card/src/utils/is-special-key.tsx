import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * Meta key = cmd on mac, windows key on windows
 * Ctrl key on mac by default triggers a right click instead of left click
 * Ctrl key on Windows has the same behaviour of cmd key of mac (open in new tab)
 * Shift key is also a "special" key because the default behavior of Chromium-based browsers is to open the
 * link in a new window; Arc browser has custom logic to show links in its "peek" window when shift is held.
 *
 * `isSpecialKey` on a mouse event on mac with default behaviour should be equivalent to opening in new tab
 * On Windows it will be equivalent to opening a new tab, unless its the Window key that is held
 * in which case typically only a standard clickthrough will occur, this is likely a small portion of events
 */
export const isSpecialKey = (event: React.MouseEvent | React.KeyboardEvent): boolean => {
	return fg('platform-smart-card-shift-key')
		? event.metaKey || event.ctrlKey || event.shiftKey
		: event.metaKey || event.ctrlKey;
};
