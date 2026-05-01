import { createContext } from 'react';

import type { ThemeColorModes } from '@atlaskit/tokens';

export const SetColorModeContext: import('react').Context<
	((value: ThemeColorModes) => void) | undefined
> = createContext<((value: ThemeColorModes) => void) | undefined>(undefined);
