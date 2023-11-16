import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import { getListItemAttributes } from '@atlaskit/editor-common/lists';

import { MAX_INDENTATION_LEVEL } from '@atlaskit/editor-common/indentation';

export type IndentationButtonNode =
  | null
  | 'paragraph_heading'
  | 'list'
  | 'taskList';

export interface IndentationButtons {
  indentDisabled: boolean;
  outdentDisabled: boolean;
  node: IndentationButtonNode; // used to determine which indent/outdent function to call on button click, see '../ui/onItemActivated
}

interface TaskDecisionState {
  isInsideTask: boolean;
  indentDisabled: boolean;
  outdentDisabled: boolean;
}

interface IndentationState {
  isIndentationAllowed: boolean;
  indentDisabled: boolean;
  outdentDisabled: boolean;
}

export function getIndentationButtonsState(
  editorState: EditorState,
  allowHeadingAndParagraphIndentation: boolean,
  taskDecisionState: TaskDecisionState | undefined,
  indentationState: IndentationState | undefined,
  isInsideListItem: ((tr: Transaction) => boolean | undefined) | undefined,
): IndentationButtons {
  const state = {
    indentDisabled: true,
    outdentDisabled: true,
    node: null,
  };

  const { selection } = editorState;

  // Handle bullet and numbered lists seperately as they do
  // not use the indentation mark.
  // Check for lists before paragraphs and headings in case
  // the selection is in a list nested in a layout column.
  if (isInsideListItem?.(editorState.tr)) {
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
  if (taskDecisionState?.isInsideTask) {
    return {
      indentDisabled: taskDecisionState.indentDisabled,
      outdentDisabled: taskDecisionState.outdentDisabled,
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
    (indentationState?.isIndentationAllowed ?? false) &&
    (isTopLevelParagraphOrHeading || isInLayoutNode) &&
    indentationState
  ) {
    return {
      indentDisabled: indentationState.indentDisabled,
      outdentDisabled: indentationState.outdentDisabled,
      node: 'paragraph_heading',
    };
  }

  return state;
}
