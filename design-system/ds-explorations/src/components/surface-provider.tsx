import { createContext, useContext } from 'react';

/**
 * __Surface context__
 *
 * A surface context provides context information on the current background (if set).
 */
export const SurfaceContext = createContext<any>('elevation.surface');

/**
 * __useSurface__
 *
 * Return the current surface. If no parent sets a surface color it falls back to the default surface.
 *
 * @see SurfaceContext
 */
export const useSurface = () => {
  return useContext(SurfaceContext);
};

SurfaceContext.displayName = 'SurfaceProvider';
