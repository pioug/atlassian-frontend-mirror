import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
import { updateSelectedIndex } from './commands/update-selected-index';
import { StatsModifier } from './stats-modifier';
import type {
  TypeAheadHandler,
  TypeAheadItem,
  TypeAheadPluginState,
} from './types';
import { typeAheadListMessages } from './messages';
import { IntlShape } from 'react-intl-next';

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

/** Is a typeahead plugin open? */
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

export const findHandlerByTrigger = ({
  trigger,
  editorState,
}: {
  trigger: string;
  editorState: EditorState;
}): TypeAheadHandler | null => {
  const pluginState = typeAheadPluginKey.getState(editorState);

  if (
    !pluginState ||
    !pluginState.typeAheadHandlers ||
    pluginState.typeAheadHandlers.length === 0
  ) {
    return null;
  }

  const { typeAheadHandlers } = pluginState;

  return (
    typeAheadHandlers.find((h: TypeAheadHandler) => h.trigger === trigger) ||
    null
  );
};

type MoveSelectedIndexProps = {
  editorView: EditorView;
  direction: 'next' | 'previous';
};
export const moveSelectedIndex =
  ({ editorView, direction }: MoveSelectedIndexProps) =>
  () => {
    const typeAheadState = getPluginState(editorView.state);
    if (!typeAheadState) {
      return;
    }
    const { selectedIndex, items } = typeAheadState;
    const stats =
      typeAheadState.stats instanceof StatsModifier
        ? typeAheadState.stats
        : new StatsModifier();

    let nextIndex;
    if (direction === 'next') {
      stats.increaseArrowDown();
      nextIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
    } else {
      stats.increaseArrowUp();
      nextIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
    }

    updateSelectedIndex(nextIndex)(editorView.state, editorView.dispatch);
  };

type TypeAheadAssistiveLabels = {
  popupAriaLabel: string;
  listItemAriaLabel?: string;
};

export const getTypeAheadListAriaLabels = (
  trigger: string | undefined,
  intl: IntlShape,
  item?: TypeAheadItem,
): TypeAheadAssistiveLabels => {
  switch (trigger) {
    case '@':
      return {
        popupAriaLabel: intl.formatMessage(
          typeAheadListMessages.mentionPopupLabel,
        ),
        listItemAriaLabel: intl.formatMessage(
          typeAheadListMessages.metionListItemLabel,
          {
            name: item?.mention?.name || '',
            shortName: item?.mention?.mentionName || '',
          },
        ),
      };
    case '/':
      return {
        popupAriaLabel: intl.formatMessage(
          typeAheadListMessages.quickInsertPopupLabel,
        ),
        listItemAriaLabel: intl.formatMessage(
          typeAheadListMessages.emojiListItemLabel,
          { name: item?.title || '', shortcut: item?.emoji?.shortName || '' },
        ),
      };
    case ':':
      return {
        popupAriaLabel: intl.formatMessage(
          typeAheadListMessages.emojiPopupLabel,
        ),
        listItemAriaLabel: intl.formatMessage(
          typeAheadListMessages.emojiListItemLabel,
          {
            name: item?.emoji?.name || '',
            shortcut: item?.emoji?.shortName || '',
          },
        ),
      };
    default:
      return {
        popupAriaLabel: intl.formatMessage(
          typeAheadListMessages.typeAheadPopupLabel,
        ),
      };
  }
};
