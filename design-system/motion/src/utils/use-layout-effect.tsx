import { useEffect, useLayoutEffect as useRealLayoutEffect } from 'react';

/**
 * Needed to supress the SSR warning when running use layout effect on the server.
 */
export const useLayoutEffect =
  typeof window === 'undefined' ? useEffect : useRealLayoutEffect;
