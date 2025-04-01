import { createContext } from 'react';

import type { OpenLayerObserverInternalAPI } from './types';

/**
 * Context for the open layer observer.
 *
 * We are setting the default value to `null` so we can check if there are nested context providers,
 * so we know to update the layer count in the parent context as well.
 */
export const OpenLayerObserverContext = createContext<OpenLayerObserverInternalAPI | null>(null);
