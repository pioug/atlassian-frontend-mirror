import { useEffect } from 'react';

import type { InteractivityRegion } from './types';

export type UseInteractivityRegionElementOptions = {
	/** Missing while the element is not rendered yet. */
	element: Element | null | undefined;
	/** Missing while its collector is not there. */
	region: InteractivityRegion | undefined;
};

/**
 * Makes the element part of the region for as long as both stay the same, so a React owner of a
 * region registers nothing by hand. An element from a ref callback comes through state:
 * `const [element, setElement] = useState<Element | null>(null)` and `ref={setElement}`.
 */
export function useInteractivityRegionElement({
	region,
	element,
}: UseInteractivityRegionElementOptions): void {
	useEffect(() => {
		if (!region || !element) {
			return;
		}
		return region.addElement(element);
	}, [region, element]);
}
