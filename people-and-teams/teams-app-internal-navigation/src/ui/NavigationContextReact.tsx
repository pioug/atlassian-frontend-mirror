import React, { createContext } from 'react';

import { type NavigationContext } from '../common/utils/getNavigationProps';

export const NavigationContextReact: React.Context<NavigationContext | undefined> = createContext<
	NavigationContext | undefined
>(undefined);
