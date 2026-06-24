import React from 'react';

import { type ManagerProps, Manager as ReactPopperManager } from 'react-popper';

import { AnchorContext } from './internal/anchor-context';
import { AnchorSetterContext } from './internal/anchor-setter-context';
import { useAnchorState } from './internal/use-anchor-state';

// Derive the wrapper's props from `react-popper`'s own `ManagerProps` so the
// public surface provably accepts exactly what the underlying `<Manager>`
// accepts (today just `children`) and stays in sync if that contract changes.
type TManagerProps = ManagerProps;

/**
 * Wraps `react-popper`'s `<Manager>` so the anchor that `<Reference>`
 * captures is published through `@atlaskit/popper`'s own bridge context.
 * Doing so insulates `<Popper>` consumers from `react-popper`'s dual
 * CJS / ESM builds, which otherwise create two unrelated context
 * instances that prevent the FF-on top-layer adapter from discovering
 * the anchor.
 */
export function Manager({ children }: TManagerProps): React.JSX.Element {
	// `setAnchor` is the `useState` setter, which React guarantees is stable
	// across renders, so it can be passed straight to the context provider.
	const { anchor, setAnchor } = useAnchorState();
	return (
		<ReactPopperManager>
			<AnchorSetterContext.Provider value={setAnchor}>
				<AnchorContext.Provider value={anchor}>{children}</AnchorContext.Provider>
			</AnchorSetterContext.Provider>
		</ReactPopperManager>
	);
}
