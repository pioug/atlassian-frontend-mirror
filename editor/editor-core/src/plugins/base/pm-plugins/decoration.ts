import { NodeType } from 'prosemirror-model';
import { DecorationSet, Decoration } from 'prosemirror-view';
import {
  PluginKey,
  Plugin,
  EditorState,
  NodeSelection,
} from 'prosemirror-state';
import { Command } from '../../../types';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';

export const decorationStateKey = new PluginKey('decorationPlugin');

export enum ACTIONS {
  DECORATION_ADD,
  DECORATION_REMOVE,
}

export const hoverDecoration = (
  nodeType: NodeType | Array<NodeType>,
  add: boolean,
  className: string = 'danger',
): Command => (state, dispatch) => {
  let from: number | undefined;
  let parentNode: Node | undefined;

  if (state.selection instanceof NodeSelection) {
    const selectedNode = state.selection.node;
    const nodeTypes = Array.isArray(nodeType) ? nodeType : [nodeType];
    const isNodeTypeMatching = nodeTypes.indexOf(selectedNode.type) > -1;
    // This adds danger styling if the selected node is the one that requires
    // the decoration to be added, e.g. if a layout is selected and the user
    // hovers over the layout's delete button.
    if (isNodeTypeMatching) {
      from = state.selection.from;
      parentNode = selectedNode;
    }
  }

  // This adds danger styling if the selection is not a node selection, OR if
  // the selected node is a child of the one that requires the decoration to
  // be added, e.g. if a decision item is selected inside a layout and the
  // user hovers over the layout's delete button.
  const foundParentNode = findParentNodeOfType(nodeType)(state.selection);
  if (from === undefined && foundParentNode) {
    from = foundParentNode.pos;
    parentNode = foundParentNode.node;
  }

  // Note: can't use !from as from could be 0, which is falsy but valid
  if (from === undefined || parentNode === undefined) {
    return false;
  }

  if (dispatch) {
    dispatch(
      state.tr
        .setMeta(decorationStateKey, {
          action: add ? ACTIONS.DECORATION_ADD : ACTIONS.DECORATION_REMOVE,
          data: Decoration.node(
            from,
            from + parentNode.nodeSize,
            {
              class: className,
            },
            { key: 'decorationNode' },
          ),
        })
        .setMeta('addToHistory', false),
    );
  }
  return true;
};

export type DecorationState = {
  decoration?: Decoration;
};

export default () => {
  return new Plugin({
    key: decorationStateKey,
    state: {
      init: (): DecorationState => ({ decoration: undefined }),
      apply(tr, pluginState: DecorationState): DecorationState {
        if (pluginState.decoration) {
          const mapResult = tr.mapping.mapResult(pluginState.decoration.from);
          if (mapResult.deleted) {
            pluginState = { decoration: undefined };
          }
        }

        const meta = tr.getMeta(decorationStateKey);
        if (!meta) {
          return pluginState;
        }

        switch (meta.action) {
          case ACTIONS.DECORATION_ADD:
            return {
              decoration: meta.data,
            };
          case ACTIONS.DECORATION_REMOVE:
            return { decoration: undefined };
          default:
            return pluginState;
        }
      },
    },

    props: {
      decorations(state: EditorState) {
        const { doc } = state;
        const { decoration } = decorationStateKey.getState(
          state,
        ) as DecorationState;
        if (decoration) {
          return DecorationSet.create(doc, [decoration]);
        }
        return null;
      },
    },
  });
};
