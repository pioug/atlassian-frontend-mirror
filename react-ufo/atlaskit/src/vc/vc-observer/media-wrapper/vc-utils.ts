import { withProfiling } from '../../../self-measurements';

import { MEDIA_WRAPPER_TAG } from './index';

export const isContainedWithinMediaWrapper = withProfiling(function isContainedWithinMediaWrapper(
	node: Node | null,
) {
	while (node) {
		if (node instanceof Element && node.hasAttribute(MEDIA_WRAPPER_TAG)) {
			return true;
		}

		node = node.parentNode;
	}

	return false;
});
