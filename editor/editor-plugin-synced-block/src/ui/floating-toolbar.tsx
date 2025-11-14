import React from 'react';

import type { IntlShape } from 'react-intl-next';

import commonMessages, { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarConfig,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles/consts';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';

import {
	copySyncedBlockReferenceToClipboard,
	editSyncedBlockSource,
	removeSyncedBlock,
} from '../editor-commands';
import { findSyncBlockOrBodiedSyncBlock, isBodiedSyncBlockNode } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

export const getToolbarConfig = (
	state: EditorState,
	intl: IntlShape,
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	syncBlockStore: SyncBlockStoreManager,
): FloatingToolbarConfig | undefined => {
	const syncBlockObject = findSyncBlockOrBodiedSyncBlock(state.schema, state.selection);
	if (!syncBlockObject) {
		return;
	}
	const {
		schema: {
			nodes: { bodiedSyncBlock },
		},
	} = state;
	const isBodiedSyncBlock = isBodiedSyncBlockNode(syncBlockObject.node, bodiedSyncBlock);

	const { formatMessage } = intl;
	const nodeType = syncBlockObject.node.type;
	const hoverDecoration = api?.decorations?.actions.hoverDecoration;
	const hoverDecorationProps = (nodeType: NodeType | NodeType[], className?: string) => ({
		onMouseEnter: hoverDecoration?.(nodeType, true, className),
		onMouseLeave: hoverDecoration?.(nodeType, false, className),
		onFocus: hoverDecoration?.(nodeType, true, className),
		onBlur: hoverDecoration?.(nodeType, false, className),
	});

	const items: Array<FloatingToolbarItem<Command>> = [];
	const copyButton: FloatingToolbarItem<Command> = {
		id: 'editor.syncedBlock.copy',
		type: 'button',
		appearance: 'subtle',
		icon: CopyIcon,
		title: formatMessage(messages.copySyncBlockLabel),
		showTitle: false,
		tooltipContent: formatMessage(messages.copySyncBlockTooltip),
		onClick: copySyncedBlockReferenceToClipboard,
		...hoverDecorationProps(nodeType, akEditorSelectedNodeClassName),
	};
	items.push(copyButton);

	const disabled = !syncBlockStore.getSyncBlockURL(syncBlockObject.node.attrs.resourceId);

	if (!isBodiedSyncBlock) {
		const editSourceButton: FloatingToolbarItem<Command> = {
			id: 'editor.syncedBlock.editSource',
			type: 'button',
			disabled,
			appearance: 'subtle',
			icon: LinkExternalIcon,
			title: formatMessage(messages.editSourceLabel),
			showTitle: true,
			tooltipContent: disabled
				? formatMessage(messages.editSourceTooltipDisabled)
				: formatMessage(messages.editSourceTooltip),
			onClick: editSyncedBlockSource(syncBlockStore, api),
			...hoverDecorationProps(nodeType, akEditorSelectedNodeClassName),
		};
		items.push(editSourceButton);
	}

	// testId is required to show focus on trigger button on ESC key press
	// see hideOnEsc in platform/packages/editor/editor-plugin-floating-toolbar/src/ui/Dropdown.tsx
	const testId = 'synced-block-overflow-dropdown-trigger';

	const overflowMenuConfig: FloatingToolbarItem<Command>[] = [
		{
			type: 'overflow-dropdown',
			testId,
			options: [
				{
					title: formatMessage(commonMessages.delete),
					onClick: removeSyncedBlock(api),
					icon: <DeleteIcon label="" />,
					...hoverDecorationProps(nodeType),
				},
			],
		},
	];
	items.push(...overflowMenuConfig);

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
		groupLabel: formatMessage(messages.syncBlockGroup),
		visible: api?.connectivity?.sharedState.currentState()?.mode !== 'offline',
	};
};
