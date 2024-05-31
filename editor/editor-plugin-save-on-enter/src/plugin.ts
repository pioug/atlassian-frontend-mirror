import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CommandDispatch, NextEditorPlugin } from '@atlaskit/editor-common/types';
import { analyticsEventKey } from '@atlaskit/editor-common/utils';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export function createPlugin(
	eventDispatch: Dispatch,
	onSave?: (editorView: EditorView) => void,
): SafePlugin | undefined {
	if (!onSave) {
		return;
	}

	return keymap({
		Enter(state: EditorState, _dispatch?: CommandDispatch, editorView?: EditorView) {
			if (editorView && canSaveOnEnter(editorView)) {
				eventDispatch(analyticsEventKey, analyticsPayload(state));
				onSave(editorView);
				return true;
			}
			return false;
		},
	}) as SafePlugin;
}

function canSaveOnEnter(editorView: EditorView) {
	const { $cursor } = editorView.state.selection as TextSelection;
	const { decisionItem, paragraph, taskItem } = editorView.state.schema.nodes;
	return (
		!$cursor ||
		($cursor.parent.type === paragraph && $cursor.depth === 1) ||
		($cursor.parent.type === decisionItem && !isEmptyAtCursor($cursor)) ||
		($cursor.parent.type === taskItem && !isEmptyAtCursor($cursor))
	);
}

function isEmptyAtCursor($cursor: ResolvedPos) {
	const { content } = $cursor.parent;
	return !(content && content.size);
}

const analyticsPayload = (state: EditorState): { payload: AnalyticsEventPayload } => ({
	payload: {
		action: ACTION.STOPPED,
		actionSubject: ACTION_SUBJECT.EDITOR,
		actionSubjectId: ACTION_SUBJECT_ID.SAVE,
		attributes: {
			inputMethod: INPUT_METHOD.SHORTCUT,
			documentSize: state.doc.nodeSize,
			// TODO add individual node counts - tables, headings, lists, mediaSingles, mediaGroups, mediaCards, panels, extensions, decisions, action, codeBlocks
		},
		eventType: EVENT_TYPE.UI,
	},
});

type Config = (editorView: EditorView) => void;

export type SaveOnEnterPlugin = NextEditorPlugin<
	'saveOnEnter',
	{
		pluginConfiguration: Config | undefined;
	}
>;

export const saveOnEnterPlugin: SaveOnEnterPlugin = ({ config: onSave }) => ({
	name: 'saveOnEnter',

	pmPlugins() {
		return [
			{
				name: 'saveOnEnter',
				plugin: ({ dispatch }) => createPlugin(dispatch, onSave),
			},
		];
	},
});
