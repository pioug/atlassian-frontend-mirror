/**
 * Internal context used to pass the original Select instance's getStyles function
 * down to components like MultiValue, without polluting the public CommonProps API.
 *
 * This allows MultiValue to detect whether getStyles has been overridden on a
 * component instance (e.g. via a custom component wrapper passing a different
 * getStyles prop), by comparing props.getStyles against the original.
 *
 * @internal — not part of the public API
 */
import { type Context, createContext } from 'react';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SelectGetStylesContext: Context<Function | undefined> = createContext<
	Function | undefined
>(undefined);
