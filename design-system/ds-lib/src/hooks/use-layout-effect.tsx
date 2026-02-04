import { useEffect, useLayoutEffect as useHostLayoutEffect } from 'react';

/**
 * **useLayoutEffect**
 *
 * Before React 19 when running layout effects on the server they log an error. To prevent our
 * SSR tests from failing we check the environment and replace it with an effect when in SSR.
 * This effectively suppresses the error log. When on React 19 we can remove this altogether.
 */
export const useLayoutEffect: typeof useEffect = typeof window === 'undefined' ? useEffect : useHostLayoutEffect;
