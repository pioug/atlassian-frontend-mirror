import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { shallowEqual } from '@atlaskit/editor-common/utils';
import type { Dispatch } from '../../../event-dispatcher';
import {
  getCurrentIndentLevel as getTaskListIndentLevel,
  getTaskItemIndex,
  isInsideTask,
} from '../../tasks-and-decisions/pm-plugins/helpers';
import {
  isIndentationAllowed,
  MAX_INDENTATION_LEVEL,
} from '../../indentation/commands';

import { getListItemAttributes } from '@atlaskit/editor-common/lists';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type toolbarListsIndentationPlugin from '../index';

export interface IndentationButtons {
  indentDisabled: boolean;
  outdentDisabled: boolean;
  node: null | 'paragraph_heading' | 'list' | 'taskList'; // used to determine which indent/outdent function to call on button click, see '../ui/onItemActivated
}

export const pluginKey = new PluginKey<IndentationButtons>(
  'indentationButtonsPlugin',
);

function getIndentationButtonsState(
  editorState: EditorState,
  allowHeadingAndParagraphIndentation: boolean,
  api: ExtractInjectionAPI<typeof toolbarListsIndentationPlugin> | undefined,
): IndentationButtons {
  const state = {
    indentDisabled: true,
    outdentDisabled: true,
    node: null,
  };

  const { selection } = editorState;
  const node = selection.$from.node();

  // Handle bullet and numbered lists seperately as they do
  // not use the indentation mark.
  // Check for lists before paragraphs and headings in case
  // the selection is in a list nested in a layout column.
  if (api?.list.actions.isInsideListItem(editorState.tr)) {
    const { indentLevel, itemIndex } = getListItemAttributes(selection.$head);

    return {
      // List indent levels are zero indexed so we need to subtract 1
      indentDisabled:
        itemIndex === 0 || indentLevel >= MAX_INDENTATION_LEVEL - 1,
      outdentDisabled: false,
      node: 'list',
    };
  }

  // Handle tasks seperately as they do not use the indentation mark
  // and have different behaviour for outdent compared to lists
  if (isInsideTask(editorState)) {
    const indentLevel = getTaskListIndentLevel(selection) || 0;
    const itemIndex = getTaskItemIndex(editorState);

    return {
      indentDisabled: itemIndex === 0 || indentLevel >= MAX_INDENTATION_LEVEL,
      outdentDisabled: indentLevel <= 1,
      node: 'taskList',
    };
  }

  const isTopLevelParagraphOrHeading = selection.$from.depth === 1;
  const isInLayoutNode =
    hasParentNodeOfType(editorState.schema.nodes.layoutColumn)(selection) &&
    // depth of non-nested paragraphs and headings in layouts will always be 3
    selection.$from.depth === 3;

  if (
    allowHeadingAndParagraphIndentation &&
    isIndentationAllowed(editorState.schema, node) &&
    (isTopLevelParagraphOrHeading || isInLayoutNode)
  ) {
    const indentationMark = node.marks.find(
      (mark) => mark.type === editorState.schema.marks.indentation,
    );

    if (!indentationMark) {
      return {
        outdentDisabled: true,
        indentDisabled: false,
        node: 'paragraph_heading',
      };
    }

    return {
      indentDisabled: indentationMark.attrs.level >= MAX_INDENTATION_LEVEL,
      outdentDisabled: false,
      node: 'paragraph_heading',
    };
  }

  return state;
}

export const createPlugin = ({
  dispatch,
  showIndentationButtons,
  allowHeadingAndParagraphIndentation,
  api,
}: {
  dispatch: Dispatch;
  showIndentationButtons: boolean;
  allowHeadingAndParagraphIndentation: boolean;
  api: ExtractInjectionAPI<typeof toolbarListsIndentationPlugin> | undefined;
}) =>
  new SafePlugin({
    state: {
      init(_config, state: EditorState) {
        const initialState: IndentationButtons = {
          indentDisabled: true,
          outdentDisabled: true,
          node: null,
        };

        return showIndentationButtons
          ? getIndentationButtonsState(
              state,
              allowHeadingAndParagraphIndentation,
              api,
            )
          : initialState;
      },
      apply(_tr, pluginState: IndentationButtons, _oldState, newState) {
        if (showIndentationButtons) {
          const state = getIndentationButtonsState(
            newState,
            allowHeadingAndParagraphIndentation,
            api,
          );

          if (!shallowEqual(pluginState, state)) {
            dispatch(pluginKey, state);
            return state;
          }
        }

        return pluginState;
      },
    },
    key: pluginKey,
  });
