import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { pluginFactory, pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
	EditorState,
	PluginKey,
	Transaction,
	type SafeStateField,
} from '@atlaskit/editor-prosemirror/state';

import type { MediaAltTextAction } from './actions';
import reducer from './reducer';
import type { MediaAltTextState } from './types';

const pluginKey = new PluginKey('mediaAltTextPlugin');

const dest = pluginFactory(pluginKey, reducer, {
	onSelectionChanged: (tr, newState) => {
		// dont close alt text for undo/redo transactions (if it comes from prosemirror-history)
		if (tr.getMeta(pmHistoryPluginKey)) {
			return newState;
		}
		return {
			isAltTextEditorOpen: false,
		};
	},
});
const createPluginState: (
	dispatch: Dispatch,
	initialState: MediaAltTextState | ((state: EditorState) => MediaAltTextState),
) => SafeStateField<MediaAltTextState> = dest.createPluginState;
const createCommand: <A = MediaAltTextAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = dest.createCommand;
const getPluginState: (state: EditorState) => MediaAltTextState = dest.getPluginState;

export const createPlugin = ({
	dispatch,
	providerFactory,
}: PMPluginFactoryParams): SafePlugin<MediaAltTextState> => {
	return new SafePlugin({
		state: createPluginState(dispatch, { isAltTextEditorOpen: false }),
		key: pluginKey,
	});
};

export { createCommand, getPluginState };
