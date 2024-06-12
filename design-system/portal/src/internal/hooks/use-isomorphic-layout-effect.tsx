import { useEffect, useLayoutEffect } from 'react';

/**
 * Needed to supress the SSR warning when running use layout effect on the server.
 */
export const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect;
