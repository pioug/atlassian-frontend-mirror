import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
	PluginKey,
	type ReadonlyTransaction,
	type EditorState,
} from '@atlaskit/editor-prosemirror/state';

import { type EditorViewStateUpdatedCallbackProps } from '../types/editor-config';

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
) => {
	const transactions: ReadonlyTransaction[] = [];
	return new SafePlugin<EditorStateNotificationPluginState>({
		key: key,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init() {
				return {
					latestTransaction: undefined,
				};
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply(tr) {
				transactions.push(tr);
				return {
					latestTransaction: tr,
				};
			},
		},
		view: () => {
			return {
				// @ts-ignore - Workaround for help-center local consumption

				update: (view, oldEditorState) => {
					onEditorStateUpdated({ oldEditorState, newEditorState: view.state });
				},
			};
		},
	});
};
