import type { Layers } from '@atlaskit/theme/types';
/**
 * Named layers of all z-index used in the Atlassian Design System.
 */
export type LayerName = keyof Layers;

/**
 * Creates a new type by reversing the key and values of the passed type
 * @param {T} T - the generic type to be reversed. Each members of it should be a Record in key-value form
 * @returns - The reversed type
 */
type ReverseMap<T extends Record<keyof T, T[keyof T]>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};

// create a new type by using ReverseMap on Layers
export type ReversedLayers = ReverseMap<Layers>;

/**
 * Interface for event to be fired on Atlassian Portal component mount and unmount
 */
export interface PortalEventDetail {
  layer: LayerName | null;
  zIndex: number;
}
