import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types/plugin-factory';
import { pluginFactory } from '@atlaskit/editor-common/utils/plugin-state-factory';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
	EditorState,
	PluginKey,
	Transaction,
	type SafeStateField,
} from '@atlaskit/editor-prosemirror/state';

import reducer from './reducer';

const pluginKey = new PluginKey('mediaPixelResizingPlugin');

const dest = pluginFactory(pluginKey, reducer, {
	onSelectionChanged() {
		return {
			isPixelEditorOpen: false,
		};
	},
});
const createPluginState: (
	dispatch: Dispatch,
	initialState:
		| {
				isPixelEditorOpen: boolean;
		  }
		| ((state: EditorState) => {
				isPixelEditorOpen: boolean;
		  }),
) => SafeStateField<{
	isPixelEditorOpen: boolean;
}> = dest.createPluginState;
const createCommand: <
	A =
		| {
				type: 'openPixelEditor';
		  }
		| {
				type: 'closePixelEditor';
		  },
>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = dest.createCommand;
const getPluginState: (state: EditorState) => {
	isPixelEditorOpen: boolean;
} = dest.getPluginState;

export const createPlugin = ({
	dispatch,
}: PMPluginFactoryParams): SafePlugin<{
	isPixelEditorOpen: boolean;
}> => {
	return new SafePlugin({
		state: createPluginState(dispatch, { isPixelEditorOpen: false }),
		key: pluginKey,
	});
};

export { createCommand, getPluginState };
