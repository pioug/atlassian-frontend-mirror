import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type ActiveNode } from '../../blockControlsPluginType';

import { isWrappedMedia } from './check-media-layout';
import { maxLayoutColumnSupported } from './consts';

const syncedBlockTypes = ['syncBlock', 'bodiedSyncBlock'];

export const shouldAllowInlineDropTarget = (
	isNested: boolean,
	node?: PMNode,
	/**
	 * Is the active node in the same layout as the target node
	 */
	isSameLayout: boolean = false,
	activeNode?: ActiveNode,
) => {
	if (editorExperiment('advanced_layouts', false) || isNested) {
		return false;
	}

	if (isWrappedMedia(node)) {
		return false;
	}
	if (activeNode?.nodeType === 'layoutSection') {
		return false;
	}

	if (
		(syncedBlockTypes.includes(activeNode?.nodeType || '') ||
			syncedBlockTypes.includes(node?.type.name || '')) &&
		editorExperiment('platform_synced_block', true)
	) {
		return false;
	}

	if (node?.type.name === 'layoutSection') {
		return node.childCount < maxLayoutColumnSupported() || isSameLayout;
	}
	return !isEmptyParagraph(node);
};
