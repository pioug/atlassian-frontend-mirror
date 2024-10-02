import { createContext, type MutableRefObject } from 'react';

/**
 * The number of layers that are currently open under the observer.
 */
export const OpenLayerCount = createContext<MutableRefObject<number>>({ current: 0 });
