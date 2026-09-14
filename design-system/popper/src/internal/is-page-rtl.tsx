import { getDocument } from '@atlaskit/browser-apis';

/**
 * Returns whether the current page is laid out right-to-left.
 *
 * Used to resolve `rectPointForPlacement`'s physical coordinates, so both the
 * React and imperative popper adapters answer this the same way.
 */
export function isPageRtl(): boolean {
	const document = getDocument();
	if (!document) {
		return false;
	}
	return (
		document.dir === 'rtl' || document.body.dir === 'rtl' || document.documentElement.dir === 'rtl'
	);
}
