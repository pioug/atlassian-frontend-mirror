import { TextSelection, EditorState } from 'prosemirror-state';
import { DecorationSet, Decoration, EditorView } from 'prosemirror-view';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
import { updateSelectedIndex } from './commands/update-selected-index';
import { StatsModifier } from './stats-modifier';
import type { TypeAheadHandler, TypeAheadPluginState } from './types';

export const findTypeAheadDecorations = (
  state: EditorState,
): Decoration | null => {
  const { selection } = state;
  const { decorationSet } = typeAheadPluginKey.getState(state);

  if (
    !decorationSet ||
    decorationSet === DecorationSet.empty ||
    !(selection instanceof TextSelection) ||
    !selection.$cursor
  ) {
    return null;
  }
  const {
    $cursor: { pos },
  } = selection;
  const decoration = decorationSet.find(
    pos,
    pos,
    (spec: Record<string, any>) => spec?.isTypeAheadDecoration,
  );

  if (!decoration || decoration.length !== 1) {
    return null;
  }

  return decoration[0];
};

export const isTypeAheadHandler = (
  handler: any,
): handler is TypeAheadHandler => {
  return (
    handler &&
    Object.values(TypeAheadAvailableNodes).includes(handler.id) &&
    typeof handler.trigger === 'string' &&
    typeof handler.selectItem === 'function' &&
    typeof handler.getItems === 'function'
  );
};

export const isTypeAheadOpen = (editorState: EditorState) => {
  return (
    typeAheadPluginKey?.getState(editorState)?.decorationSet?.find().length > 0
  );
};

export const getPluginState = (
  editorState: EditorState,
): TypeAheadPluginState => {
  return typeAheadPluginKey.getState(editorState);
};

export const getTypeAheadHandler = (editorState: EditorState) => {
  return typeAheadPluginKey.getState(editorState).triggerHandler;
};

export const getTypeAheadQuery = (editorState: EditorState) => {
  return typeAheadPluginKey.getState(editorState).query;
};

export const isTypeAheadAllowed = (state: EditorState) => {
  const isOpen = isTypeAheadOpen(state);
  // if the TypeAhead is open
  // we should not allow it
  return !isOpen;
};

export const findHandler = (
  id: TypeAheadAvailableNodes,
  state: EditorState,
): TypeAheadHandler | null => {
  const pluginState = typeAheadPluginKey.getState(state);

  if (
    !pluginState ||
    !pluginState.typeAheadHandlers ||
    pluginState.typeAheadHandlers.length === 0
  ) {
    return null;
  }

  const { typeAheadHandlers } = pluginState;

  return typeAheadHandlers.find((h: TypeAheadHandler) => h.id === id) || null;
};

type MoveSelectedIndexProps = {
  editorView: EditorView;
  direction: 'next' | 'previous';
};
export const moveSelectedIndex = ({
  editorView,
  direction,
}: MoveSelectedIndexProps) => () => {
  const typeAheadState = getPluginState(editorView.state);
  if (!typeAheadState) {
    return;
  }
  const { selectedIndex, items } = typeAheadState;
  const stats =
    typeAheadState.stats instanceof StatsModifier
      ? typeAheadState.stats
      : new StatsModifier();

  let nextIndex = 0;
  if (direction === 'next') {
    stats.increaseArrowDown();
    nextIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
  } else {
    stats.increaseArrowUp();
    nextIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
  }

  updateSelectedIndex(nextIndex)(editorView.state, editorView.dispatch);
};
