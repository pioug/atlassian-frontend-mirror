import { MEDIA_WRAPPER_TAG } from './index';

export function isContainedWithinMediaWrapper(node: Node | null): boolean {
	while (node) {
		if (node instanceof Element && node.hasAttribute(MEDIA_WRAPPER_TAG)) {
			return true;
		}

		node = node.parentNode;
	}

	return false;
}
