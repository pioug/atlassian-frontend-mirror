import { pluginFactory } from '@atlaskit/editor-common/utils';
import type {
	EditorState,
	ReadonlyTransaction,
	SafeStateField,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { ColumnResizingPluginAction, ColumnResizingPluginState } from '../../types';

import { pluginKey } from './plugin-key';
// eslint-disable-next-line import/order
import reducer from './reducer';
// eslint-disable-next-line import/order
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
// eslint-disable-next-line import/order
import type { Command } from '@atlaskit/editor-common/types';

function mapping(
	tr: ReadonlyTransaction,
	pluginState: ColumnResizingPluginState,
): ColumnResizingPluginState {
	if (pluginState && pluginState.resizeHandlePos !== null) {
		return {
			...pluginState,
			resizeHandlePos: tr.mapping.map(pluginState.resizeHandlePos),
		};
	}
	return pluginState;
}

const factory = pluginFactory(pluginKey, reducer, {
	mapping,
});

export const createCommand: <A = ColumnResizingPluginAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = factory.createCommand;
export const createPluginState: (
	dispatch: Dispatch,
	initialState: ColumnResizingPluginState | ((state: EditorState) => ColumnResizingPluginState),
) => SafeStateField<ColumnResizingPluginState> = factory.createPluginState;
export const getPluginState: (state: EditorState) => ColumnResizingPluginState =
	factory.getPluginState;
