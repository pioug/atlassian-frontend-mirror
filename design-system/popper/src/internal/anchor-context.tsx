import React, { createContext } from 'react';

/**
 * Module-private context used to bridge the anchor element from our
 * `<Reference>` wrapper to `<Popper>`. Deliberately separate from
 * `react-popper`'s own `ManagerReferenceNodeContext`: `react-popper`
 * ships dual CJS and ESM builds, each with its own
 * `React.createContext()` instance, and bundlers and Jest can resolve
 * different builds. Bridging through a context we control guarantees a
 * single shared instance across every consumer of `@atlaskit/popper`.
 */
export const AnchorContext: React.Context<HTMLElement | null> = createContext<HTMLElement | null>(
	null,
);
