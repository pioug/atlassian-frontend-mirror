import { createContext } from 'react';

/**
 * Context for setting the number of layers currently open under the observer.
 *
 * We are setting the default value to `null` so we can check if there are nested context providers,
 * so we know to update the layer count in the parent context as well.
 */
export const UpdateLayerCount = createContext<{
	increment: () => void;
	decrement: () => void;
} | null>(null);
