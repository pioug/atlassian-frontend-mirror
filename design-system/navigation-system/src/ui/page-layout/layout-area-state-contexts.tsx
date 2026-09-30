import { type Context, createContext } from 'react';

import type { LayoutArea, LayoutAreaState } from './layout-area-sizing-context';

// Width changes should notify only the affected region, not every sizing consumer.
export const layoutAreaStateContexts: Record<LayoutArea, Context<LayoutAreaState | undefined>> = {
	'side-nav': createContext<LayoutAreaState | undefined>(undefined),
	panel: createContext<LayoutAreaState | undefined>(undefined),
	'chat-panel': createContext<LayoutAreaState | undefined>(undefined),
};
