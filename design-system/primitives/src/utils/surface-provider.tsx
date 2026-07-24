import { useContext } from 'react';

import { SurfaceContext } from './surface-context';
import type { BackgroundColorToken } from './types';

/**
 * __useSurface__
 *
 * Return the current surface. If no parent sets a surface color it falls back to the default surface.
 *
 * @see SurfaceContext
 */
export const useSurface = (): BackgroundColorToken => {
	return useContext(SurfaceContext);
};

SurfaceContext.displayName = 'SurfaceProvider';
