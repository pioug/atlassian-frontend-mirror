import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { EditorState, SafeStateField, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { AnalyticPluginAction } from './actions';
import { pluginKey } from './plugin-key';
import { reducer } from './reducer';
import type { AnalyticPluginState } from './types';

const dest = pluginFactory(pluginKey, reducer);
export const createPluginState: (
	dispatch: Dispatch,
	initialState: AnalyticPluginState | ((state: EditorState) => AnalyticPluginState),
) => SafeStateField<AnalyticPluginState> = dest.createPluginState;
export const createCommand: <A = AnalyticPluginAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = dest.createCommand;
export const getPluginState: (state: EditorState) => AnalyticPluginState = dest.getPluginState;
