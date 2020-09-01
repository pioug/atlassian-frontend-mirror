import {
  EditorState,
  StateField,
  PluginKey,
  Transaction,
} from 'prosemirror-state';
import { Dispatch } from '../event-dispatcher';
import { Command } from '../types';

/**
 * Creates a ProseMirror plugin's state and handles UI updates.
 *
 * Here's a few things to keep in mind:
 * - plugin's state is stored as a single object
 * - `Reducer` specifies how plugin's state changes in response to commands
 * - `Command` describes only what happen, but not how state changes
 * - `mapping` could be used to map ProseMirror positions stored in plugin's state
 *
 * Example:
 *  const { createPluginState, createCommand, getPluginState } = pluginFactory(
 *    reducer,
 *    pluginKey
 *  );
 *
 *  export const createPlugin = (dispatch: Dispatch, initialState) =>
 *    new Plugin({
 *      state: createPluginState(dispatch, initialState),
 *      key: pluginKey
 *    });
 *
 * Example of a reducer:
 *
 *  export const reducer = (
 *    state: TablePluginState,
 *    action: TableAction,
 *  ): TablePluginState => {
 *    switch (action.type) {
 *      case 'TOGGLE_CONTEXTUAL_MENU':
 *      return {
 *        ...state,
 *        isContextualMenuOpen: !state.isContextualMenuOpen,
 *      };
 *    default:
 *      return state;
 *    }
 *  };
 *
 *
 * Example of a command:
 *
 * export const toggleContextualMenu = createCommand({
 *   type: 'TOGGLE_CONTEXTUAL_MENU',
 * }, tr => tr.setMeta('addToHistory', false));
 *
 */

function isFunction(x: any): x is Function {
  return typeof x === 'function';
}

export type Reducer<PluginState, Action> = (
  state: PluginState,
  action: Action,
) => PluginState;

type MapState<PluginState> = (
  tr: Transaction,
  pluginState: PluginState,
) => PluginState;

type Plugin<PluginState, Action, InitialState extends PluginState> = {
  createPluginState: (
    dispatch: Dispatch,
    initialState: InitialState | ((state: EditorState) => InitialState),
  ) => StateField<PluginState>;

  createCommand: <A = Action>(
    action: A | ((state: Readonly<EditorState>) => A | false),
    transform?: (tr: Transaction, state: EditorState) => Transaction,
  ) => Command;

  getPluginState: (state: EditorState) => PluginState;
};

export function pluginFactory<
  PluginState,
  Action,
  InitialState extends PluginState
>(
  pluginKey: PluginKey,
  reducer: Reducer<PluginState, Action>,
  options: {
    mapping?: MapState<PluginState>;
    onDocChanged?: MapState<PluginState>;
    onSelectionChanged?: MapState<PluginState>;
  } = {},
): Plugin<PluginState, Action, InitialState> {
  const { mapping, onDocChanged, onSelectionChanged } = options;

  return {
    createPluginState(dispatch, initialState) {
      return {
        init: (_, state) =>
          isFunction(initialState) ? initialState(state) : initialState,

        apply: (tr, _pluginState) => {
          const oldState = mapping ? mapping(tr, _pluginState) : _pluginState;
          let newState = oldState;

          const meta = tr.getMeta(pluginKey);
          if (meta) {
            newState = reducer(oldState, meta);
          }

          if (onDocChanged && tr.docChanged) {
            newState = onDocChanged(tr, newState);
          } else if (onSelectionChanged && tr.selectionSet) {
            newState = onSelectionChanged(tr, newState);
          }

          if (newState !== oldState) {
            dispatch(pluginKey, newState);
          }
          return newState;
        },
      };
    },

    createCommand(action, transform) {
      return (state, dispatch) => {
        if (dispatch) {
          const tr = transform ? transform(state.tr, state) : state.tr;
          const resolvedAction = isFunction(action) ? action(state) : action;
          if (tr && resolvedAction) {
            dispatch(tr.setMeta(pluginKey, resolvedAction));
          } else {
            return false;
          }
        }
        return true;
      };
    },

    getPluginState(state) {
      return pluginKey.getState(state);
    },
  };
}
