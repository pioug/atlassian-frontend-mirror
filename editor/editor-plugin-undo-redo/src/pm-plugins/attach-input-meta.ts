import type { EditorAnalyticsAPI, ACTION } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT, EVENT_TYPE, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type { HigherOrderCommand, Command } from '@atlaskit/editor-common/types';
import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import { InputSource } from './enums';
import { pluginKey as undoPluginKey } from './plugin-key';

type AttachInputMeta = (inputSource: InputSource) => HigherOrderCommand;
export const attachInputMeta: AttachInputMeta = (inputSource) => (command) => (state, dispatch) => {
	let customTr: Transaction = state.tr;
	const fakeDispatch = (tr: Transaction) => {
		customTr = tr;
	};
	command(state, fakeDispatch);

	if (!customTr || !customTr.docChanged) {
		return false;
	}

	customTr.setMeta(undoPluginKey, inputSource);
	if (dispatch) {
		dispatch(customTr);
	}

	return true;
};

const inputSourceToInputMethod = (
	inputSource: InputSource,
): INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR | INPUT_METHOD.EXTERNAL => {
	switch (inputSource) {
		case InputSource.EXTERNAL:
			return INPUT_METHOD.EXTERNAL;
		case InputSource.KEYBOARD:
			return INPUT_METHOD.KEYBOARD;
		case InputSource.TOOLBAR:
			return INPUT_METHOD.TOOLBAR;
		default:
			return INPUT_METHOD.EXTERNAL;
	}
};

type NodeHistory = { after: Node; before: Node };
type NodeWithDifferingAttributes = { attributes: string[]; type: string };

function getNodesWithDifferingAttributes({
	before,
	after,
}: NodeHistory): NodeWithDifferingAttributes[] {
	const allAttributeKeys = Object.keys({ ...before.attrs, ...after.attrs });
	const differingAttributes = allAttributeKeys.filter(
		(key) => before.attrs[key] !== after.attrs[key],
	);
	const affectedNodes = differingAttributes.length
		? [{ type: before.type.name, attributes: differingAttributes }]
		: [];

	return before.children.reduce(
		(acc, beforeChild, index) => [
			...acc,
			...getNodesWithDifferingAttributes({ before: beforeChild, after: after.child(index) }),
		],
		affectedNodes,
	);
}

/**
 * Analyzes changes between two ProseMirror document nodes.
 *
 * @param params - Object containing before and after node states
 * @param params.before - The document node before changes
 * @param params.after - The document node after changes
 * @returns Object containing change analysis results with hasChanged boolean and affectedNodes array
 */
export function getChanges({ before, after }: NodeHistory) {
	const hasChanged = !areNodesEqualIgnoreAttrs(after, before);

	const affectedNodes = hasChanged
		? undefined
		: getNodesWithDifferingAttributes({ before, after })
				// Limit to 25 nodes to avoid oversize payloads
				.slice(0, 25);

	return { hasChanged, affectedNodes };
}

export const attachInputMetaWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputSource: InputSource, action: ACTION.UNDO_PERFORMED | ACTION.REDO_PERFORMED) =>
	(command: Command) =>
		attachInputMeta(inputSource)(
			withAnalytics(
				editorAnalyticsAPI,
				fg('platform_editor_add_undo_meta_analytics')
					? ({ doc: before }, { currentDoc: after }) => ({
							eventType: EVENT_TYPE.TRACK,
							action,
							actionSubject: ACTION_SUBJECT.EDITOR,
							attributes: {
								inputMethod: inputSourceToInputMethod(inputSource),
								...getChanges({ before, after }),
							},
						})
					: {
							eventType: EVENT_TYPE.TRACK,
							action,
							actionSubject: ACTION_SUBJECT.EDITOR,
							attributes: {
								inputMethod: inputSourceToInputMethod(inputSource),
							},
						},
			)(command),
		);
