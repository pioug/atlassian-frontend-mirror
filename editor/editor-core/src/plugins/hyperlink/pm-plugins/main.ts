import { Node } from 'prosemirror-model';
import {
  EditorState,
  Plugin,
  PluginKey,
  Selection,
  Transaction,
  TextSelection,
} from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import { shallowEqual } from '../../../utils';

export enum LinkAction {
  SHOW_INSERT_TOOLBAR = 'SHOW_INSERT_TOOLBAR',
  HIDE_TOOLBAR = 'HIDE_TOOLBAR',
  SELECTION_CHANGE = 'SELECTION_CHANGE',
  INSERT_LINK_TOOLBAR = 'INSERT',
  EDIT_INSERTED_TOOLBAR = 'EDIT_INSERTED_TOOLBAR',
}
export enum InsertStatus {
  EDIT_LINK_TOOLBAR = 'EDIT',
  INSERT_LINK_TOOLBAR = 'INSERT',
  EDIT_INSERTED_TOOLBAR = 'EDIT_INSERTED',
}

export type InsertState = {
  type: InsertStatus.INSERT_LINK_TOOLBAR;
  from: number;
  to: number;
};

export type EditInsertedState = {
  type: InsertStatus.EDIT_INSERTED_TOOLBAR;
  node: Node;
  pos: number;
};

export type EditState = {
  type: InsertStatus.EDIT_LINK_TOOLBAR;
  node: Node;
  pos: number;
};

export type LinkToolbarState =
  | EditState
  | EditInsertedState
  | InsertState
  | undefined;

export const canLinkBeCreatedInRange = (from: number, to: number) => (
  state: EditorState,
) => {
  if (!state.doc.rangeHasMark(from, to, state.schema.marks.link)) {
    const $from = state.doc.resolve(from);
    const $to = state.doc.resolve(to);
    const link = state.schema.marks.link;
    if ($from.parent === $to.parent && $from.parent.isTextblock) {
      if ($from.parent.type.allowsMarkType(link)) {
        let allowed = true;
        state.doc.nodesBetween(from, to, node => {
          allowed = allowed && !node.marks.some(m => m.type.excludes(link));
          return allowed;
        });
        return allowed;
      }
    }
  }
  return false;
};

const isSelectionInsideLink = (state: EditorState | Transaction) =>
  !!state.doc.type.schema.marks.link.isInSet(state.selection.$from.marks());

const isSelectionAroundLink = (state: EditorState | Transaction) => {
  const { $from, $to } = state.selection;
  const node = $from.nodeAfter;

  return (
    !!node &&
    $from.textOffset === 0 &&
    $to.pos - $from.pos === node.nodeSize &&
    !!state.doc.type.schema.marks.link.isInSet(node.marks)
  );
};

const mapTransactionToState = (
  state: LinkToolbarState,
  tr: Transaction,
): LinkToolbarState => {
  if (!state) {
    return undefined;
  } else if (
    state.type === InsertStatus.EDIT_LINK_TOOLBAR ||
    state.type === InsertStatus.EDIT_INSERTED_TOOLBAR
  ) {
    const { pos, deleted } = tr.mapping.mapResult(state.pos, 1);
    const node = tr.doc.nodeAt(pos) as Node;
    // If the position was not deleted & it is still a link
    if (!deleted && !!node.type.schema.marks.link.isInSet(node.marks)) {
      if (node === state.node && pos === state.pos) {
        return state;
      }
      return { ...state, pos, node };
    }
    // If the position has been deleted, then require a navigation to show the toolbar again
    return;
  } else if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
    return {
      ...state,
      from: tr.mapping.map(state.from),
      to: tr.mapping.map(state.to),
    };
  }
  return;
};

const toState = (
  state: LinkToolbarState,
  action: LinkAction,
  editorState: EditorState,
): LinkToolbarState => {
  // Show insert or edit toolbar
  if (!state) {
    switch (action) {
      case LinkAction.SHOW_INSERT_TOOLBAR: {
        const { from, to } = editorState.selection;
        if (canLinkBeCreatedInRange(from, to)(editorState)) {
          return {
            type: InsertStatus.INSERT_LINK_TOOLBAR,
            from,
            to,
          };
        }
        return undefined;
      }
      case LinkAction.SELECTION_CHANGE:
        // If the user has moved their cursor, see if they're in a link
        const link = getActiveLinkMark(editorState);
        if (link) {
          return { ...link, type: InsertStatus.EDIT_LINK_TOOLBAR };
        }
        return undefined;
      default:
        return undefined;
    }
  }
  // Update toolbar state if selection changes, or if toolbar is hidden
  if (state.type === InsertStatus.EDIT_LINK_TOOLBAR) {
    switch (action) {
      case LinkAction.EDIT_INSERTED_TOOLBAR: {
        const link = getActiveLinkMark(editorState);
        if (link) {
          if (link.pos === state.pos && link.node === state.node) {
            return { ...state, type: InsertStatus.EDIT_INSERTED_TOOLBAR };
          }
          return { ...link, type: InsertStatus.EDIT_INSERTED_TOOLBAR };
        }
        return undefined;
      }
      case LinkAction.SELECTION_CHANGE:
        const link = getActiveLinkMark(editorState);
        if (link) {
          if (link.pos === state.pos && link.node === state.node) {
            // Make sure we return the same object, if it's the same link
            return state;
          }
          return { ...link, type: InsertStatus.EDIT_LINK_TOOLBAR };
        }
        return undefined;
      case LinkAction.HIDE_TOOLBAR:
        return undefined;
      default:
        return state;
    }
  }

  // Remove toolbar if user changes selection or toolbar is hidden
  if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
    switch (action) {
      case LinkAction.SELECTION_CHANGE:
      case LinkAction.HIDE_TOOLBAR:
        return undefined;
      default:
        return state;
    }
  }

  return;
};

const getActiveLinkMark = (
  state: EditorState | Transaction,
): { node: Node; pos: number } | undefined => {
  const {
    selection: { $from },
  } = state;

  if (isSelectionInsideLink(state) || isSelectionAroundLink(state)) {
    const pos = $from.pos - $from.textOffset;
    const node = state.doc.nodeAt(pos);
    return node && node.isText ? { node, pos } : undefined;
  }

  return undefined;
};

const getActiveText = (selection: Selection): string | undefined => {
  const currentSlice = selection.content();

  if (currentSlice.size === 0) {
    return;
  }

  if (
    currentSlice.content.childCount === 1 &&
    currentSlice.content.firstChild &&
    selection instanceof TextSelection
  ) {
    return currentSlice.content.firstChild.textContent;
  }
  return;
};

export interface HyperlinkState {
  activeText?: string;
  activeLinkMark?: LinkToolbarState;
  canInsertLink: boolean;
}

export const stateKey = new PluginKey('hyperlinkPlugin');

export const plugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init(_, state: EditorState): HyperlinkState {
        const canInsertLink = canLinkBeCreatedInRange(
          state.selection.from,
          state.selection.to,
        )(state);
        return {
          activeText: getActiveText(state.selection),
          canInsertLink,
          activeLinkMark: toState(
            undefined,
            LinkAction.SELECTION_CHANGE,
            state,
          ),
        };
      },
      apply(
        tr,
        pluginState: HyperlinkState,
        _oldState,
        newState,
      ): HyperlinkState {
        let state = pluginState;
        const action =
          tr.getMeta(stateKey) && (tr.getMeta(stateKey).type as LinkAction);

        if (tr.docChanged) {
          state = {
            activeText: state.activeText,
            canInsertLink: canLinkBeCreatedInRange(
              newState.selection.from,
              newState.selection.to,
            )(newState),
            activeLinkMark: mapTransactionToState(state.activeLinkMark, tr),
          };
        }

        if (action) {
          state = {
            activeText: state.activeText,
            canInsertLink: state.canInsertLink,
            activeLinkMark: toState(state.activeLinkMark, action, newState),
          };
        }

        if (tr.selectionSet) {
          state = {
            activeText: getActiveText(newState.selection),
            canInsertLink: canLinkBeCreatedInRange(
              newState.selection.from,
              newState.selection.to,
            )(newState),
            activeLinkMark: toState(
              state.activeLinkMark,
              LinkAction.SELECTION_CHANGE,
              newState,
            ),
          };
        }

        if (!shallowEqual(state, pluginState)) {
          dispatch(stateKey, state);
        }
        return state;
      },
    },
    key: stateKey,
  });
