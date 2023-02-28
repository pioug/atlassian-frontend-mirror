import { createContext } from 'react';

export type SpacingMode = 'compact' | 'cozy';

/**
 * __Spacing context__
 *
 *  The spacing context is used to provide spacing values to menu item primitives.
 *
 * @internal Do not use directly.
 */
export const SpacingContext = createContext<SpacingMode>('cozy');
