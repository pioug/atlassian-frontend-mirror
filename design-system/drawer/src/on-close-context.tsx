import { type Context, createContext, type SyntheticEvent } from 'react';

import type { DrawerProps } from './types';

/**
 * __On close context__
 *
 * An context that provides the on close function for the drawer.
 */
export const OnCloseContext: Context<
	((event: SyntheticEvent<HTMLElement>, analyticsEvent?: any) => void) | undefined
> = createContext<DrawerProps['onClose']>(undefined);
