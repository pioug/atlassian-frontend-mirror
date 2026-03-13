import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { EditorState, SafeStateField, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { MoveAnalyticsPluginAction } from './actions';
import { pluginKey } from './plugin-key';
import { reducer } from './reducer';
import type { MoveAnalyticsPluginState } from './types';

const dest = pluginFactory(pluginKey, reducer);
export const createPluginState: (
	dispatch: Dispatch,
	initialState: MoveAnalyticsPluginState | ((state: EditorState) => MoveAnalyticsPluginState),
) => SafeStateField<MoveAnalyticsPluginState> = dest.createPluginState;
export const createCommand: <A = MoveAnalyticsPluginAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = dest.createCommand;
export const getPluginState: (state: EditorState) => MoveAnalyticsPluginState = dest.getPluginState;
