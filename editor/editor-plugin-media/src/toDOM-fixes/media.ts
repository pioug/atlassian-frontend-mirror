import { media } from '@atlaskit/adf-schema';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import { getMediaAttrs } from './toDOMAttrs';

// @nodeSpecException:toDOM patch
export const mediaSpecWithFixedToDOM = () => {
	if (!fg('platform_editor_lazy-node-views')) {
		return media;
	}
	return {
		...media,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const attrs = getMediaAttrs('media', node);
			return ['div', attrs];
		},
	};
};
