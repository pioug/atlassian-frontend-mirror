import type { IntlShape } from 'react-intl-next';

import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	FloatingToolbarConfig,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/dist/types/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import CopyIcon from '@atlaskit/icon/core/copy';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';

import { copySyncedBlockReferenceToClipboard } from '../pm-plugins/actions';
import { findSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPluginOptions } from '../syncedBlockPluginType';

export const getToolbarConfig = (
	state: EditorState,
	_intl: IntlShape,
	_options: SyncedBlockPluginOptions = {},
	_providerFactory: ProviderFactory,
): FloatingToolbarConfig | undefined => {
	const syncBlockObject = findSyncBlock(state);
	if (!syncBlockObject) {
		return;
	}

	const nodeType = state.schema.nodes.syncBlock;

	const items: Array<FloatingToolbarItem<Command>> = [];
	const copyButton: FloatingToolbarItem<Command> = {
		id: 'editor.syncedBlock.copy',
		type: 'button',
		appearance: 'subtle',
		icon: CopyIcon,
		title: 'Copy',
		showTitle: true,
		tooltipContent: 'Copy reference to clipboard',
		onClick: copySyncedBlockReferenceToClipboard,
	};
	items.push(copyButton);

	if (syncBlockObject.node.attrs.resourceId !== syncBlockObject.node.attrs.localId) {
		const editSourceButton: FloatingToolbarItem<Command> = {
			id: 'editor.syncedBlock.editSource',
			type: 'button',
			appearance: 'subtle',
			icon: LinkExternalIcon,
			title: 'Edit source',
			showTitle: true,
			tooltipContent: 'Navigate to source page of the sync block',
			disabled: true,
			onClick: (_state, _dispatch, view) => {
				if (!view) {
					return false;
				}
				// to be implemented in a follow up PR
				return true;
			},
		};
		items.push(editSourceButton);
	}

	const getDomRef = (editorView: EditorView) => {
		const domAtPos = editorView.domAtPos.bind(editorView);
		const element = findDomRefAtPos(syncBlockObject.pos, domAtPos) as HTMLDivElement;
		return element;
	};

	return {
		title: 'Synced Block floating controls',
		getDomRef,
		nodeType,
		items,
		scrollable: true,
		groupLabel: 'Synced blocks',
	};
};
