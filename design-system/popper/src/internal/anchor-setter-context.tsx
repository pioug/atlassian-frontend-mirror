import React, { createContext } from 'react';

type TSetAnchor = (element: HTMLElement | null) => void;

/**
 * Module-private context that exposes the anchor setter to descendant
 * `<Reference>` instances inside the same `<Manager>` subtree. The
 * setter forwards the captured element into `AnchorContext` so
 * descendant `<Popper>` instances can discover the anchor without
 * reaching into `react-popper`'s internal context.
 */
export const AnchorSetterContext: React.Context<TSetAnchor> = createContext<TSetAnchor>(
	() => undefined,
);

export type { TSetAnchor };
