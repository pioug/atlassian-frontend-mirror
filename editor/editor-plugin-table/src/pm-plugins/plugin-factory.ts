
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { EditorState, SafeStateField, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { TablePluginState, TablePluginAction } from '../types';

import { handleDocOrSelectionChanged } from './handlers';
import { pluginKey } from './plugin-key';
import reducer from './reducer';



const dest = pluginFactory(
    pluginKey,
    reducer,
    {
        mapping: (tr, pluginState) => {
            if (tr.docChanged) {
                let updatedTargetCell = {};
                if (pluginState.targetCellPosition) {
                    const { pos, deleted } = tr.mapping.mapResult(pluginState.targetCellPosition);

                    updatedTargetCell = {
                        targetCellPosition: deleted ? undefined : pos,
                    };
                }

                let updatedTablePos = {};
                if (pluginState.tablePos) {
                    const { pos, deleted } = tr.mapping.mapResult(pluginState.tablePos, -1);

                    updatedTablePos = {
                        tablePos: deleted ? undefined : pos,
                    };
                }

                return {
                    ...pluginState,
                    ...updatedTargetCell,
                    ...updatedTablePos,
                };
            }
            return pluginState;
        },
        onDocChanged: handleDocOrSelectionChanged,
        onSelectionChanged: handleDocOrSelectionChanged,
    }
);
export const createPluginState: (dispatch: Dispatch, initialState: TablePluginState | ((state: EditorState) => TablePluginState)) => SafeStateField<TablePluginState> = dest.createPluginState;
export const createCommand: <A = TablePluginAction>(action: A | ((state: Readonly<EditorState>) => false | A), transform?: (tr: Transaction, state: EditorState) => Transaction) => Command = dest.createCommand;
export const getPluginState: (state: EditorState) => TablePluginState = dest.getPluginState;
