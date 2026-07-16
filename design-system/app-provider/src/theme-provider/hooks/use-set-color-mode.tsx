import { useContext } from 'react';

import type { ThemeColorModes } from '@atlaskit/tokens/theme-config';

import { SetColorModeContext } from '../context/set-color-mode-context';

/**
 * __useSetColorMode()__
 *
 * Returns a function that updates the color mode for the nearest `ThemeProvider`
 * in the React tree.
 *
 * Call the returned setter with `'light'`, `'dark'`, or `'auto'` to change the
 * active color mode. When set to `'auto'`, the color mode follows the system
 * color scheme preference and `useColorMode()` returns the resolved value.
 *
 * This hook must be called from within a `ThemeProvider` (or `AppProvider`).
 * It throws if no `ThemeProvider` is found in the tree.
 *
 * @returns A setter function that accepts a `ThemeColorModes` value.
 *
 * @example
 * ```tsx
 * function ColorModeToggle() {
 *   const colorMode = useColorMode();
 *   const setColorMode = useSetColorMode();
 *
 *   return (
 *     <button onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}>
 *       Toggle color mode
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Invert the color mode relative to a parent ThemeProvider
 * function InvertedPanel({ parentColorMode }: { parentColorMode: ThemeColorModes }) {
 *   const setColorMode = useSetColorMode();
 *
 *   useEffect(() => {
 *     setColorMode(parentColorMode === 'light' ? 'dark' : 'light');
 *   }, [parentColorMode, setColorMode]);
 *
 *   return <Box backgroundColor="elevation.surface">...</Box>;
 * }
 * ```
 */
export function useSetColorMode(): (value: ThemeColorModes) => void {
	const value = useContext(SetColorModeContext);
	if (!value) {
		throw new Error('useSetColorMode must be used within ThemeProvider.');
	}

	return value;
}
