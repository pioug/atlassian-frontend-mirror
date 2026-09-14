import { createContext } from 'react';

export type SpacingMode = 'compact' | 'cozy';

/**
 * __Spacing context__
 *
 *  The spacing context is used to provide spacing values to menu item primitives.
 *
 * @internal Do not use directly.
 */
export const SpacingContext: import('react').Context<SpacingMode> =
	createContext<SpacingMode>('cozy');

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports
export { SELECTION_STYLE_CONTEXT_DO_NOT_USE } from './selection-style-context-do-not-use';
