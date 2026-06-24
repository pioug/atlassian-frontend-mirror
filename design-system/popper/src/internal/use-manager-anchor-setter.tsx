import { useContext } from 'react';

import { AnchorSetterContext, type TSetAnchor } from './anchor-setter-context';

/**
 * Returns the setter that an ancestor `<Manager>` exposes to publish
 * the anchor element from `<Reference>`. Returns a no-op when there is
 * no surrounding `<Manager>`.
 */
export function useManagerAnchorSetter(): TSetAnchor {
	return useContext(AnchorSetterContext);
}
