import { useState } from 'react';

type TAnchorState = {
	anchor: HTMLElement | null;
	setAnchor: (element: HTMLElement | null) => void;
};

/**
 * Returns the local state used by `<Manager>` to publish the anchor
 * captured by `<Reference>` to descendant `<Popper>` instances.
 */
export function useAnchorState(): TAnchorState {
	const [anchor, setAnchor] = useState<HTMLElement | null>(null);
	return { anchor, setAnchor };
}
