import {
	createBlockLinkHashValue,
	DEFAULT_BLOCK_LINK_HASH_PREFIX,
} from '@atlaskit/editor-common/block-menu';
import { copyToClipboard } from '@atlaskit/editor-common/clipboard';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { expandSelectionToBlockRange } from '../../editor-commands/transform-node-utils/utils';

type CopyLinkOptions = {
	blockLinkHashPrefix?: string;
	getLinkPath?: () => string | null;
	schema: Schema;
	selection: Selection;
};

export const copyLink = async ({
	getLinkPath,
	blockLinkHashPrefix = DEFAULT_BLOCK_LINK_HASH_PREFIX,
	selection,
	schema,
}: CopyLinkOptions): Promise<boolean> => {
	const blockRange = expandSelectionToBlockRange(selection, schema);

	if (!blockRange) {
		return false;
	}

	// get the link to the first node in the selection
	const node = blockRange.$from.nodeAfter;

	if (!node || !node.attrs || !node.attrs.localId) {
		return false;
	}

	const path = getLinkPath?.() || location.pathname;

	try {
		const url = new URL(location.origin + path);
		url.hash = createBlockLinkHashValue(node.attrs.localId, blockLinkHashPrefix);
		const href = url.toString();

		await copyToClipboard(href);
	} catch (error) {
		logException(error as Error, { location: 'editor-plugin-block-menu' });
		return false;
	}

	return true;
};
