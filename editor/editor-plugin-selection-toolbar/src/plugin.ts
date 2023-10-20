import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  Command,
  FloatingToolbarItem,
  NextEditorPlugin,
  SelectionToolbarGroup,
  SelectionToolbarHandler,
} from '@atlaskit/editor-common/types';
import {
  calculateToolbarPositionAboveSelection,
  calculateToolbarPositionTrackHead,
} from '@atlaskit/editor-common/utils';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { selectionToolbarPluginKey } from './plugin-key';

type SelectionToolbarPluginState = {
  selectionStable: boolean;
};

export const selectionToolbarPlugin: NextEditorPlugin<
  'selectionToolbar',
  {
    pluginConfiguration: {
      /**
       * Defaults to false
       */
      preferenceToolbarAboveSelection?: boolean;
    };
  }
> = options => {
  let __selectionToolbarHandlers: SelectionToolbarHandler[] = [];

  return {
    name: 'selectionToolbar',
    pmPlugins(selectionToolbarHandlers: Array<SelectionToolbarHandler>) {
      if (selectionToolbarHandlers) {
        __selectionToolbarHandlers.push(...selectionToolbarHandlers);
      }

      return [
        {
          name: 'selection-tracker',
          plugin: () => {
            return new SafePlugin({
              key: selectionToolbarPluginKey,
              state: {
                init(): SelectionToolbarPluginState {
                  return { selectionStable: false };
                },
                apply(tr, pluginState: SelectionToolbarPluginState) {
                  const meta = tr.getMeta(selectionToolbarPluginKey);

                  if (meta) {
                    return {
                      ...pluginState,
                      ...meta,
                    };
                  }

                  return pluginState;
                },
              },
              view(view) {
                const unbind = bind(view.root, {
                  type: 'mouseup',
                  listener: () => {
                    // We only want to set selectionStable to true if the editor has focus
                    // to prevent the toolbar from showing when the editor is blurred
                    // due to a click outside the editor.
                    view.dispatch(
                      view.state.tr.setMeta(selectionToolbarPluginKey, {
                        selectionStable: view.hasFocus(),
                      }),
                    );
                  },
                });

                return {
                  destroy() {
                    unbind();
                  },
                };
              },
              props: {
                handleDOMEvents: {
                  mousedown: view => {
                    view.dispatch(
                      view.state.tr.setMeta(selectionToolbarPluginKey, {
                        selectionStable: false,
                      }),
                    );
                    return false;
                  },
                },
              },
            });
          },
        },
      ];
    },
    pluginsOptions: {
      floatingToolbar(state, intl, providerFactory) {
        const { selectionStable } = selectionToolbarPluginKey.getState(state);

        if (
          state.selection.empty ||
          !selectionStable ||
          'node' in state.selection
        ) {
          // If there is no active selection, or the selection is not stable, or the selection is a node selection,
          // do not show the toolbar.
          return;
        }
        // Resolve the selectionToolbarHandlers to a list of SelectionToolbarGroups
        // and filter out any handlers which returned undefined
        const resolved = __selectionToolbarHandlers
          .map(selectionToolbarHandler =>
            selectionToolbarHandler(state, intl, providerFactory),
          )
          .filter(
            resolved => resolved !== undefined,
          ) as SelectionToolbarGroup[];
        // Sort the groups by rank
        // This is intended to allow different plugins to control the order of the groups
        // they add to the selection toolbar.
        // ie. if you want to have your plugin's group appear first, set rank to -10 if there is currently another
        // plugin you expect to be run at the same time as with an rank of -9
        resolved.sort(({ rank: rankA = 0 }, { rank: rankB = 0 }) => {
          if (rankA < rankB) {
            return 1;
          }
          return -1;
        });
        // This flattens the groups passed into the floating toolbar into a single list of items
        const items = resolved.reduce((acc, curr) => {
          acc.push(...curr.items);
          return acc;
        }, [] as FloatingToolbarItem<Command>[]);
        const calcToolbarPosition = options.config
          .preferenceToolbarAboveSelection
          ? calculateToolbarPositionAboveSelection
          : calculateToolbarPositionTrackHead;
        const toolbarTitle = 'Selection toolbar';
        const onPositionCalculated = calcToolbarPosition(toolbarTitle);
        const nodeType = getSelectionNodeTypes(state);
        return {
          title: 'Selection toolbar',
          nodeType: nodeType,
          items: items,
          onPositionCalculated,
        };
      },
    },
  };
};

function getSelectionNodeTypes(state: EditorState) {
  let selectionNodeTypes: NodeType[] = [];
  state.doc.nodesBetween(
    state.selection.from,
    state.selection.to,
    (node, _pos, parent) => {
      if (selectionNodeTypes.indexOf(node.type) !== 0) {
        selectionNodeTypes.push(node.type);
      }
    },
  );
  return selectionNodeTypes;
}

export type SelectionToolbarPlugin = typeof selectionToolbarPlugin;
