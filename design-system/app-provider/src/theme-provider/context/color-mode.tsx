import { createContext } from 'react';

import type { ThemeColorModes } from '@atlaskit/tokens';

export type ReconciledColorMode = Exclude<ThemeColorModes, 'auto'>;

/**
 * __Color mode context__
 */
export const ColorModeContext: import('react').Context<ReconciledColorMode | undefined> =
	createContext<ReconciledColorMode | undefined>(undefined);
