import { createContext } from 'react';
import type { Context } from 'react';

// The list caches rendered rows while scrolling, so those rows may not receive
// updated props. We pass the index of the item showing its preview through context
// so their styling updates without rebuilding the wrappers that measure row height.
// Each row compares it with its own index, which a cached row still has right.
export const PreviewItemIndexContext: Context<number | undefined> = createContext<
	number | undefined
>(undefined);
