import { createContext } from 'react';

/**
 * A context for creating a namespace for grouping layers.
 *
 * This is useful for determining the number of layers open within a section of the page, e.g. the SideNav.
 */
export const OpenLayerObserverNamespaceContext: import("react").Context<string | null> = createContext<string | null>(null);
