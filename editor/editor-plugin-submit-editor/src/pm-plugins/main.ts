import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { submit } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CommandDispatch, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { analyticsEventKey } from '@atlaskit/editor-common/utils';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { type SubmitEditorPlugin } from '../submitEditorPluginType';

export function createPlugin(
	eventDispatch: Dispatch,
	api: ExtractInjectionAPI<SubmitEditorPlugin> | undefined,
	onSave?: (editorView: EditorView) => void,
): SafePlugin | undefined {
	if (!onSave) {
		return;
	}

	return keymap({
		[`${submit.common}`]: (
			state: EditorState,
			_dispatch?: CommandDispatch,
			editorView?: EditorView,
		) => {
			const mediaState = api?.media?.sharedState?.currentState();

			if (mediaState && mediaState.waitForMediaUpload && !mediaState.allUploadsFinished) {
				return true;
			}

			if (!editorView) {
				return false;
			}

			eventDispatch(analyticsEventKey, analyticsPayload(state));
			onSave(editorView);
			return true;
		},
	}) as SafePlugin;
}

const analyticsPayload = (state: EditorState): { payload: AnalyticsEventPayload } => ({
	payload: {
		action: ACTION.STOPPED,
		actionSubject: ACTION_SUBJECT.EDITOR,
		actionSubjectId: ACTION_SUBJECT_ID.SAVE,
		attributes: {
			inputMethod: INPUT_METHOD.SHORTCUT,
			documentSize: state.doc.nodeSize,
			// TODO: ED-26961 - add individual node counts - tables, headings, lists, mediaSingles, mediaGroups, mediaCards, panels, extensions, decisions, action, codeBlocks
		},
		eventType: EVENT_TYPE.UI,
	},
});
