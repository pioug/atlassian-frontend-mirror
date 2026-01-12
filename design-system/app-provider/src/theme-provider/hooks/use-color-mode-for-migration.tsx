import { useContext } from 'react';

import { ColorModeContext, type ReconciledColorMode } from '../context/color-mode';

/**
 * __UNSAFE_useColorModeForMigration()__
 *
 * Returns the current color mode when inside the app provider.
 * Unlike useColorMode, this utility returns undefined, instead of throwing an error, when the app provider is missing.
 * This allows it to be used by components that need to operate with and without an app provider.
 */
export function UNSAFE_useColorModeForMigration(): ReconciledColorMode | undefined {
	const value = useContext(ColorModeContext);
	return value;
}
