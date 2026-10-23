import { type Context, createContext } from 'react';

import type { CoercedMenuPlacement } from '../types';

export const PortalPlacementContext: Context<{
	setPortalPlacement: (placement: CoercedMenuPlacement) => void;
} | null> = createContext<{
	setPortalPlacement: (placement: CoercedMenuPlacement) => void;
} | null>(null);
