import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { pasteOptionsToolbarMessages as messages } from '@atlaskit/editor-common/messages';
import type {
  Command,
  CommandDispatch,
  FloatingToolbarConfig,
  FloatingToolbarDropdown,
  FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import type { LastContentPasted } from '@atlaskit/editor-plugin-paste';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';

import {
  changeToMarkdownWithAnalytics,
  changeToPlainTextWithAnalytics,
  changeToRichTextWithAnalytics,
  dropdownClickHandler,
} from './commands';
import {
  PASTE_OPTIONS_TEST_ID,
  PASTE_TOOLBAR_CLASS,
  PASTE_TOOLBAR_ITEM_CLASS,
} from './pm-plugins/constants';
import type { PasteOtionsPluginState, Position } from './types';
import { pasteOptionsPluginKey, ToolbarDropdownOption } from './types';
import EditorPasteIcon from './ui/paste-icon';
import {
  hasLinkMark,
  hasMediaNode,
  hasRuleNode,
  isPastedFromFabricEditor,
} from './util';

export const isToolbarVisible = (
  state: EditorState,
  lastContentPasted: LastContentPasted,
): boolean => {
  /**
   * Conditions for not showing the toolbar:
   * 1. Pasting link, media or text containing media(note: markdown link and images are allowed)
   * 2. Content is pasted in a nested node(i.e. inside a table, panel etc.).
   *    (grandParent node should be root doc for showing up the toolbar)
   * 3. Cursor is inside the codeblock.
   */
  const $from = state.selection.$from;
  if (hasRuleNode(lastContentPasted.pastedSlice, state.schema)) {
    return false;
  }
  const parentNodeType = $from.parent?.type;
  const grandParentNodeType = $from.node($from.depth - 1)?.type;

  if (
    grandParentNodeType &&
    grandParentNodeType.name === state.schema.nodes.doc.name &&
    parentNodeType.name !== state.schema.nodes.codeBlock.name &&
    !isPastedFromFabricEditor(lastContentPasted.pasteSource) &&
    !hasLinkMark(lastContentPasted.pastedSlice) &&
    !hasMediaNode(lastContentPasted.pastedSlice)
  ) {
    return true;
  }

  return false;
};

export const getToolbarMenuConfig = (
  pluginState: PasteOtionsPluginState,
  intl: IntlShape,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): FloatingToolbarDropdown<Command> => {
  const options = [
    {
      id: 'editor.paste.richText',
      title: intl.formatMessage(messages.richText),
      selected: pluginState.selectedOption === ToolbarDropdownOption.RichText,
      hidden: pluginState.isPlainText,
      onClick: changeToRichTextWithAnalytics(editorAnalyticsAPI)(),
    },
    {
      id: 'editor.paste.markdown',
      title: intl.formatMessage(messages.markdown),
      selected: pluginState.selectedOption === ToolbarDropdownOption.Markdown,
      onClick: changeToMarkdownWithAnalytics(
        editorAnalyticsAPI,
        pluginState.plaintext.length,
      )(),
    },
    {
      id: 'editor.paste.plainText',
      title: intl.formatMessage(messages.plainText),
      selected: pluginState.selectedOption === ToolbarDropdownOption.PlainText,
      onClick: changeToPlainTextWithAnalytics(
        editorAnalyticsAPI,
        pluginState.plaintext.length,
      )(),
    },
  ];

  return {
    id: PASTE_TOOLBAR_ITEM_CLASS,
    icon: EditorPasteIcon,
    type: 'dropdown',
    testId: PASTE_OPTIONS_TEST_ID,
    title: intl.formatMessage(messages.pasteOptions),
    options,
    onToggle: onToggleHandler,
  };
};

const onToggleHandler = (
  state: EditorState,
  dispatch: CommandDispatch | undefined,
) => {
  return dropdownClickHandler()(state, dispatch);
};

export const buildToolbar = (
  state: EditorState,
  intl: IntlShape,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): FloatingToolbarConfig | undefined => {
  const { schema } = state;
  const validNodes = Object.values(schema.nodes);

  const pluginState = pasteOptionsPluginKey.getState(state);
  const menu: FloatingToolbarItem<Command> = getToolbarMenuConfig(
    pluginState,
    intl,
    editorAnalyticsAPI,
  );

  return {
    title: intl.formatMessage(messages.pasteOptions),
    nodeType: validNodes,
    zIndex: akEditorFloatingPanelZIndex,
    className: PASTE_TOOLBAR_CLASS,
    items: [menu],
    align: 'right',
    onPositionCalculated,
  };
};

const onPositionCalculated = (editorView: EditorView, nextPos: Position) => {
  const { from } = editorView.state.selection;
  const fromCoords = editorView.coordsAtPos(from);

  const toolbar = document.querySelector(
    `div[aria-label="${messages.pasteOptions.defaultMessage}"]`,
  ) as HTMLElement;

  const offsetParent = toolbar?.offsetParent || editorView.dom;
  const offsetParentRect = offsetParent?.getBoundingClientRect();

  const offsetTop = offsetParentRect?.top || 0;
  const offsetLeft = offsetParentRect?.left || 0;
  const offsetScrollTop = offsetParent?.scrollTop || 0;

  const cursorHeight = getCursorHeight(editorView, from);

  return {
    top: fromCoords.top - offsetTop + offsetScrollTop + cursorHeight,
    left: fromCoords.left - offsetLeft,
  };
};

const getCursorHeight = (editorView: EditorView, from: number): number => {
  const nodeAtFrom = editorView.domAtPos(from).node;
  const nearestNonTextNode =
    nodeAtFrom?.nodeType === Node.TEXT_NODE
      ? (nodeAtFrom.parentNode as HTMLElement)
      : (nodeAtFrom as HTMLElement);

  return parseFloat(
    window.getComputedStyle(nearestNonTextNode, undefined).lineHeight || '',
  );
};
