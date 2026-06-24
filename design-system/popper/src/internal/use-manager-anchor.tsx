import { useContext } from 'react';

import { AnchorContext } from './anchor-context';

/**
 * Returns the current anchor element published by an ancestor
 * `<Reference>` via the shared `<Manager>` provider. Returns `null`
 * when there is no surrounding `<Manager>` / `<Reference>` pair.
 */
export function useManagerAnchor(): HTMLElement | null {
	return useContext(AnchorContext);
}
