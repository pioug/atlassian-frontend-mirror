import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ACTION } from '@atlaskit/editor-common/analytics';
import { getAnalyticsPayload } from '@atlaskit/editor-common/clipboard';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { DOMSerializer, Fragment } from '@atlaskit/editor-prosemirror/model';
import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { clipboardPluginKey } from './plugin-key';

export enum ClipboardEventType {
	CUT = 'CUT',
	COPY = 'COPY',
}
let lastEventType: ClipboardEventType | null = null;

export const createPlugin = ({ dispatchAnalyticsEvent, schema }: PMPluginFactoryParams) => {
	let editorView: EditorView;
	const getEditorView = () => editorView;

	return new SafePlugin({
		key: clipboardPluginKey,
		view: (view: EditorView) => {
			editorView = view;
			return {
				update: (view: EditorView) => {
					editorView = view;
				},
			};
		},
		props: {
			handleDOMEvents: {
				cut: (view) => {
					setLastEventType(ClipboardEventType.CUT);
					return sendClipboardAnalytics(view, dispatchAnalyticsEvent, ACTION.CUT);
				},
				copy: (view) => {
					setLastEventType(ClipboardEventType.COPY);
					return sendClipboardAnalytics(view, dispatchAnalyticsEvent, ACTION.COPIED);
				},
			},
			clipboardSerializer: createClipboardSerializer(schema, getEditorView),
		},
	});
};

/**
 * Overrides Prosemirror's default clipboardSerializer, in order to fix table row copy/paste bug raised in ED-13003.
 * This allows us to store the original table’s attributes on the new table that the row is wrapped with when it is being copied.
 * e.g. keeping the layout on a row that is copied.
 * We store the default serializer in order to call it after we handle the table row case.
 */
export const createClipboardSerializer = (
	schema: Schema,
	getEditorView: () => EditorView,
): DOMSerializer => {
	const oldSerializer = DOMSerializer.fromSchema(schema);
	const newSerializer = new DOMSerializer(oldSerializer.nodes, oldSerializer.marks);

	const originalSerializeFragment = newSerializer.serializeFragment.bind(newSerializer);

	newSerializer.serializeFragment = (
		content: Fragment,
		options: { [key: string]: any } = {},
		target?: Node,
	): DocumentFragment => {
		const editorView = getEditorView();
		const selection = editorView.state.selection;

		// We do not need to handle when a user copies a tableRow + other content.
		// In that scenario it already wraps the Row with correct Table and attributes.
		if (!options.tableWrapperExists) {
			let i = 0;
			while (i < content.childCount) {
				if (content.maybeChild(i)?.type.name === 'table') {
					options.tableWrapperExists = true;
					break;
				}
				i++;
			}
		}

		// When the content being copied includes a tableRow that is not already wrapped with a table,
		// We will wrap it with one ourselves, while preserving the parent table's attributes.
		if (content.firstChild?.type.name === 'tableRow' && !options.tableWrapperExists) {
			// We only want 1 table wrapping the rows.
			// tableWrapperExist is a custom prop added solely for the purposes of this recursive algorithm.
			// The function is recursively called for each node in the tree captured in the fragment.
			// For recursive logic see the bind call above and the prosemirror-model (https://github.com/ProseMirror/prosemirror-model/blob/master/src/to_dom.js#L44
			// and https://github.com/ProseMirror/prosemirror-model/blob/master/src/to_dom.js#L87)
			options.tableWrapperExists = true;

			const parentTable = findParentNodeOfType(schema.nodes.table)(selection);
			const attributes = parentTable?.node.attrs;

			const newTable: NodeType = schema.nodes.table;
			// Explicitly remove local id since we are creating a new table and it should have a unique local id which will be generated.
			const newTableNode = newTable.createChecked({ ...attributes, localId: undefined }, content);
			const newContent = Fragment.from(newTableNode);
			// Pass updated content into original ProseMirror serializeFragment function.
			// Currently incorrectly typed in @Types. See this GitHub thread: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/57668
			//@ts-ignore
			return originalSerializeFragment(newContent, options, target);
		}

		// Remove annotations from media nodes when copying to clipboard, only do this for copy operations
		if (lastEventType === ClipboardEventType.COPY && content.firstChild?.type.name === 'media') {
			const mediaNode = content.firstChild;
			const strippedMediaNode = schema.nodes.media.createChecked(
				mediaNode.attrs,
				mediaNode.content,
				mediaNode.marks?.filter((mark) => mark.type.name !== 'annotation'),
			);
			const newContent = Fragment.from(strippedMediaNode);
			// Currently incorrectly typed, see comment above
			//@ts-ignore
			return originalSerializeFragment(newContent, options, target);
		}

		// If we're not copying any rows or media nodes, just run default serializeFragment function.
		// Currently incorrectly typed in @Types. See this GitHub thread: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/57668
		//@ts-ignore
		return originalSerializeFragment(content, options, target);
	};
	return newSerializer;
};

export const sendClipboardAnalytics = (
	view: EditorView,
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	action: ACTION.CUT | ACTION.COPIED,
) => {
	const clipboardAnalyticsPayload = getAnalyticsPayload(view.state, action);
	if (clipboardAnalyticsPayload) {
		dispatchAnalyticsEvent(clipboardAnalyticsPayload);
	}
	// return false so we don't block any other plugins' cut or copy handlers
	// from running just because we are sending an analytics event
	return false;
};

export const setLastEventType = (eventType: ClipboardEventType) => (lastEventType = eventType);
