import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
	EditorState,
	PluginKey,
	Transaction,
	type SafeStateField,
} from '@atlaskit/editor-prosemirror/state';

import type { ExpandPluginState, ExpandPluginAction } from '../../types';
import reducer from '../reducer';

export const pluginKey: PluginKey = new PluginKey('expandPlugin');

const dest = pluginFactory(pluginKey, reducer);
export const createPluginState: (
	dispatch: Dispatch,
	initialState: ExpandPluginState | ((state: EditorState) => ExpandPluginState),
) => SafeStateField<ExpandPluginState> = dest.createPluginState;
export const createCommand: <A = ExpandPluginAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = dest.createCommand;
export const getPluginState: (state: EditorState) => ExpandPluginState = dest.getPluginState;
