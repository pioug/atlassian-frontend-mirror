import { DEFAULT_BLOCK_LINK_HASH_PREFIX } from '@atlaskit/editor-common/block-menu';
import { copyToClipboard } from '@atlaskit/editor-common/clipboard';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';

export const copyLink = async (
	getLinkPath?: () => string | null,
	blockLinkHashPrefix: string = DEFAULT_BLOCK_LINK_HASH_PREFIX,
	api?: ExtractInjectionAPI<BlockMenuPlugin>,
): Promise<boolean> => {
	try {
		let node;
		const selection = api?.selection?.sharedState.currentState()?.selection;

		if (selection instanceof NodeSelection && selection.node) {
			node = selection.node;
		} else if (selection instanceof TextSelection) {
			node = selection.$from.node();
		} else if (selection instanceof CellSelection) {
			node = selection.$anchorCell.node(-1);
		}

		if (!node || !node.attrs || !node.attrs.localId) {
			return false;
		}

		const path = getLinkPath?.() || location.pathname;
		if (!path) {
			return false;
		}

		const url = new URL(location.origin + path);
		// append the localId as a hash fragment in the form #block-{localId}
		url.hash = `${blockLinkHashPrefix}${node.attrs.localId}`;
		const href = url.toString();

		await copyToClipboard(href);
		return true;
	} catch (e) {
		return false;
	}
};
