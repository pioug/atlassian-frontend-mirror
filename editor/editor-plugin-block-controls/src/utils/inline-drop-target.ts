import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { maxLayoutColumnSupported } from '../consts';

import { isPreRelease1 } from './advanced-layouts-flags';
import { isWrappedMedia } from './check-media-layout';

export const shouldAllowInlineDropTarget = (isNested: boolean, node?: PMNode) => {
	if (!isPreRelease1() || isNested) {
		return false;
	}

	if (isWrappedMedia(node)) {
		return false;
	}

	if (node?.type.name === 'layoutSection') {
		return node.childCount < maxLayoutColumnSupported();
	}
	return !isEmptyParagraph(node);
};
