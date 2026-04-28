
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { EditorState, SafeStateField, Transaction } from '@atlaskit/editor-prosemirror/state';

import { pluginKey as tablePluginKey } from '../plugin-key';

import type { DragAndDropPluginAction } from './actions';
import { pluginKey } from './plugin-key';
import reducer from './reducer';
import type { DragAndDropPluginState } from './types';

const dest = pluginFactory(
    pluginKey,
    reducer,
    {
        mapping: (tr, pluginState) => {
            if (tr.docChanged) {
                let decorationSet = pluginState.decorationSet;

                const meta = tr.getMeta(tablePluginKey);
                if (meta && meta.data && meta.data.decorationSet) {
                    decorationSet = meta.data.decorationSet;
                }

                if (decorationSet) {
                    decorationSet = decorationSet.map(tr.mapping, tr.doc);
                }

                return {
                    ...pluginState,
                     decorationSet,
                };
            }
            return pluginState;
        },
    }
);
export const createPluginState: (dispatch: Dispatch, initialState: DragAndDropPluginState | ((state: EditorState) => DragAndDropPluginState)) => SafeStateField<DragAndDropPluginState> = dest.createPluginState;
export const createCommand: <A = DragAndDropPluginAction>(action: A | ((state: Readonly<EditorState>) => false | A), transform?: (tr: Transaction, state: EditorState) => Transaction) => Command = dest.createCommand;
export const getPluginState: (state: EditorState) => DragAndDropPluginState = dest.getPluginState;
