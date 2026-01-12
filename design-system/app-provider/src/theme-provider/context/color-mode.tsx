import { createContext } from 'react';

import type { ThemeColorModes } from '@atlaskit/tokens';

export type ReconciledColorMode = Exclude<ThemeColorModes, 'auto'>;

/**
 * __Color mode context__
 */
export const ColorModeContext = createContext<ReconciledColorMode | undefined>(undefined);

/**
 * __Set color mode context__
 */
export const SetColorModeContext = createContext<((value: ThemeColorModes) => void) | undefined>(
	undefined,
);
