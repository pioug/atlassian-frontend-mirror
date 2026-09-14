/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */

import { useContext } from 'react';

import { ForceFallbackContext } from './force-fallback-toggle';

/**
 * Read whether the JS fallback is being forced by the example wrapper.
 */
export function useForceFallback(): boolean {
	return useContext(ForceFallbackContext);
}
