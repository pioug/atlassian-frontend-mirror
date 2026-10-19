import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ReadonlyTransaction, EditorState } from '@atlaskit/editor-prosemirror/state';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { EditorViewStateUpdatedCallbackProps } from '../types/editor-config';

const key = new PluginKey<EditorStateNotificationPluginState>('editorStateNotificationPlugin');

export type EditorStateNotificationPluginState = {
	latestTransaction: ReadonlyTransaction | undefined;
};

export const createEditorStateNotificationPlugin = (
	onEditorStateUpdated: (props: {
		newEditorState: EditorState;
		oldEditorState: EditorState;
	}) => void,
	onEditorViewStateUpdatedCallbacks: Array<{
		callback: (props: EditorViewStateUpdatedCallbackProps) => void;
		pluginName: string;
	}>,
): SafePlugin<EditorStateNotificationPluginState> => {
	const transactions: ReadonlyTransaction[] = [];
	return new SafePlugin<EditorStateNotificationPluginState>({
		key: key,
		state: {
			init() {
				return {
					latestTransaction: undefined,
				};
			},
			apply(tr) {
				if (!isExperimentEnabled('platform_editor_reduce_memory_leaks')) {
					// Dead accumulator: nothing reads it, so it pins every transaction for the
					// editor's lifetime. Delete it when the experiment ships.
					transactions.push(tr);
				}
				return {
					latestTransaction: tr,
				};
			},
		},
		view: () => {
			return {
				update: (view, oldEditorState) => {
					onEditorStateUpdated({ oldEditorState, newEditorState: view.state });
				},
			};
		},
	});
};
