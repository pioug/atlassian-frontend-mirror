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

/**
 * __Selection context__
 *
 * The selection context is used to set what selection mode the menu items display as.
 *
 * @internal Do not use directly.
 */
export const SELECTION_STYLE_CONTEXT_DO_NOT_USE = createContext<
  'notch' | 'border' | 'none'
>('border');
