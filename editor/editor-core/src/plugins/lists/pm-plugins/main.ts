import { EditorState, Transaction, Plugin, PluginKey } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { isWrappingPossible } from '../utils';
import { Dispatch } from '../../../event-dispatcher';
import { removeBlockMarks } from '../../../utils/mark';

export const pluginKey = new PluginKey<ListsPluginState>('listsPlugin');

export interface ListsPluginState {
  bulletListActive: boolean;
  bulletListDisabled: boolean;
  orderedListActive: boolean;
  orderedListDisabled: boolean;
}

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init: () => ({
        bulletListActive: false,
        bulletListDisabled: false,
        orderedListActive: false,
        orderedListDisabled: false,
      }),

      apply(
        tr: Transaction,
        pluginState: ListsPluginState,
        _,
        state: EditorState,
      ) {
        const { bulletList, orderedList } = state.schema.nodes;
        const listParent = findParentNodeOfType([bulletList, orderedList])(
          tr.selection,
        );

        const bulletListActive =
          !!listParent && listParent.node.type === bulletList;
        const orderedListActive =
          !!listParent && listParent.node.type === orderedList;
        const bulletListDisabled = !(
          bulletListActive ||
          orderedListActive ||
          isWrappingPossible(bulletList, state)
        );
        const orderedListDisabled = !(
          bulletListActive ||
          orderedListActive ||
          isWrappingPossible(orderedList, state)
        );

        if (
          bulletListActive !== pluginState.bulletListActive ||
          orderedListActive !== pluginState.orderedListActive ||
          bulletListDisabled !== pluginState.bulletListDisabled ||
          orderedListDisabled !== pluginState.orderedListDisabled
        ) {
          const nextPluginState = {
            ...pluginState,
            bulletListActive,
            orderedListActive,
            bulletListDisabled,
            orderedListDisabled,
          };
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }

        return pluginState;
      },
    },

    view: () => {
      return {
        update: ({ state, dispatch }) => {
          const { bulletList, orderedList } = state.schema.nodes;
          const { alignment, indentation } = state.schema.marks;
          const listParent = findParentNodeOfType([bulletList, orderedList])(
            state.tr.selection,
          );
          if (!listParent) {
            return;
          }

          /** Block mark if exists should be removed when toggled to list items */
          const removeMarks = removeBlockMarks(state, [alignment, indentation]);
          if (removeMarks) {
            dispatch(removeMarks);
          }
        },
      };
    },

    key: pluginKey,
  });
