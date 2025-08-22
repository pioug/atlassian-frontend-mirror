import { copyToClipboard } from '@atlaskit/editor-common/clipboard';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';

export const copyLink = async (
	getLinkPath?: () => string | null,
	blockQueryParam: string = 'block',
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
		url.searchParams.set(blockQueryParam, node.attrs.localId);
		const href = url.toString();

		await copyToClipboard(href);
		return true;
	} catch (e) {
		return false;
	}
};
