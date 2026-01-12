import { useContext } from 'react';

import type { ThemeColorModes } from '@atlaskit/tokens';

import { SetColorModeContext } from '../context/color-mode';

/**
 * __useSetColorMode()__
 *
 * Returns the color mode setter when inside the app provider.
 */
export function useSetColorMode(): (value: ThemeColorModes) => void {
	const value = useContext(SetColorModeContext);
	if (!value) {
		throw new Error('useSetColorMode must be used within ThemeProvider.');
	}

	return value;
}
