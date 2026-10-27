import { createContext } from 'react';
import type { Context } from 'react';

// The list caches rendered rows while scrolling, so those rows may not receive
// updated props. We pass the active item key down through context so their styling
// updates without rebuilding the wrappers that measure row height.
export const ActiveMenuItemKeyContext: Context<string | undefined> = createContext<
	string | undefined
>(undefined);
