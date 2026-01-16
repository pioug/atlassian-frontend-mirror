import memorizeOne from 'memoize-one';

import { getBrowserInfo } from '@atlaskit/editor-common/browser';

export const isAnchorSupported = memorizeOne((): boolean => {
	if (window.CSS && window.CSS.supports) {
		return window.CSS.supports('anchor-name: --anchor');
	}
	return false;
});

export const isNativeStickySupported = (isDragAndDropEnabled: boolean): boolean => {
	const safariVersion = getBrowserInfo().safari_version;
	const isBrowserSafari = !Number.isNaN(safariVersion);

	return (
		// Safari has a bug with position: sticky and content editable, so we don't support it
		!isBrowserSafari &&
		isAnchorSupported() &&
		isDragAndDropEnabled
	);
};
