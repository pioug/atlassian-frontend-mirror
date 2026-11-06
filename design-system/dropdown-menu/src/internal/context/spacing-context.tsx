import { createContext } from 'react';

export type NewSpacingMode = 'compact' | 'spacious';
export type SpacingMode = NewSpacingMode | 'cozy';

/**
 * __SpacingContext__
 *
 * Allows the spacing mode to be provided once to `<DropdownMenu/>` and passed down automatically to menu items.
 *
 * @internal Do not use directly.
 */
export const NewSpacingContext: import('react').Context<NewSpacingMode> =
	createContext<NewSpacingMode>('spacious');
