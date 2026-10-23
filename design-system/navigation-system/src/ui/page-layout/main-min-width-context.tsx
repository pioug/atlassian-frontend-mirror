import { type Context, createContext } from 'react';

import { defaultMainMinWidth } from './constants';

// Available during SSR, before Main registers with the measured sizing coordinator.
export const MainMinWidthContext: Context<number> = createContext(defaultMainMinWidth);
