import type { MessageDescriptor } from 'react-intl-next';

import { uuid } from '@atlaskit/adf-schema';
import type { PasteSource } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI, PasteWarningOptions } from '@atlaskit/editor-common/types';
import { mapSlice } from '@atlaskit/editor-common/utils';
import type { Fragment, Node, Schema, Slice } from '@atlaskit/editor-prosemirror/model';

import { PastePluginActionTypes } from '../../editor-actions/actions';
import type { PastePlugin, ActiveFlag } from '../../pastePluginType';
import { FLAG_TYPE } from '../../pastePluginType';
import { pluginKey } from '../../pm-plugins/plugin-factory';

enum FLAG_ID {
	CANNOT_PASTE_CONTENT = 'cannot-paste-content',
}

const transformSyncBlockNode = (
	node: Node,
	schema: Schema,
	isFromEditor: boolean,
): Node | Fragment => {
	// if copying from renderer, flatten out the content and remove the sync block
	if (!isFromEditor) {
		return node.content;
	}

	// sync blocks need a unique localId to function correctly
	const newAttrs = { ...node.attrs, localId: uuid.generate() };
	return schema.nodes.syncBlock.create(newAttrs, null, [...node.marks]);
};

const transformBodiedSyncBlockNode = (node: Node, isFromEditor: boolean): Node | Fragment => {
	// if copying from renderer, flatten out the content and remove the bodied sync block
	if (!isFromEditor) {
		return node.content;
	}

	// this is not possible as all bodiedSyncBlocks have already been converted into a syncBlock by now.
	return node;
};

const showWarningFlag = ({
	api,
	title,
	description,
	urlText,
	urlHref,
}: {
	api: ExtractInjectionAPI<PastePlugin> | undefined;
	description: MessageDescriptor;
	title: MessageDescriptor;
	urlHref: string;
	urlText: MessageDescriptor;
}) => {
	// Use setTimeout to dispatch transaction in next tick and avoid re-entrant dispatch
	setTimeout(() => {
		api?.core.actions.execute(({ tr }) => {
			const flag: ActiveFlag = {
				id: FLAG_ID.CANNOT_PASTE_CONTENT,
				description,
				title,
				urlText,
				urlHref,
				type: FLAG_TYPE.WARNING,
			};
			return tr.setMeta(pluginKey, {
				type: PastePluginActionTypes.SET_ACTIVE_FLAG,
				activeFlag: flag,
			});
		});
	}, 0);
};

// Check if rawHtml contains a synced block
// example: "<meta charset='utf-8'><html><head></head><body><div data-sync-block=\"\" data-local-id=\"\" data-resource-id=\"d64883c8-1270-431d-a1d3-51d36a1ed5f4\" data-prosemirror-content-type=\"node\" data-prosemirror-node-name=\"syncBlock\" data-prosemirror-node-block=\"true\" data-pm-slice=\"0 0 []\"></div></body></html>"
const hasSyncedBlockInRawHtml = (rawHtml: string): boolean => {
	return rawHtml.includes('data-sync-block="');
};

/**
 * If we are copying from editor, transform the copied source or reference sync block to a new reference sync block
 * Otherwise, (e.g. if copying from renderer), flatten out the content and remove the sync block
 * Also, show a warning flag if the pasted content contains a synced block and the paste warning options are configured.
 */
export const handleSyncBlocksPaste = (
	slice: Slice,
	schema: Schema,
	pasteSource: PasteSource,
	rawHtml: string,
	pasteWarningOptions: PasteWarningOptions | undefined,
	api: ExtractInjectionAPI<PastePlugin> | undefined,
): Slice => {
	const isFromEditor = pasteSource === 'fabric-editor';

	const isSyncedBlockInRawHtml = hasSyncedBlockInRawHtml(rawHtml);

	let hasSyncedBlockInSlice = false;
	slice = mapSlice(slice, (node: Node) => {
		if (node.type === schema.nodes.syncBlock) {
			hasSyncedBlockInSlice = true;
			return transformSyncBlockNode(node, schema, isFromEditor);
		} else if (node.type === schema.nodes.bodiedSyncBlock) {
			hasSyncedBlockInSlice = true;
			return transformBodiedSyncBlockNode(node, isFromEditor);
		}

		return node;
	});

	if (
		pasteWarningOptions?.cannotPasteSyncedBlock &&
		!hasSyncedBlockInSlice &&
		isSyncedBlockInRawHtml
	) {
		showWarningFlag({
			api,
			title: pasteWarningOptions?.cannotPasteSyncedBlock?.title,
			description: pasteWarningOptions?.cannotPasteSyncedBlock?.description,
			urlText: pasteWarningOptions?.cannotPasteSyncedBlock?.urlText,
			urlHref: pasteWarningOptions?.cannotPasteSyncedBlock?.urlHref,
		});
	}

	return slice;
};
