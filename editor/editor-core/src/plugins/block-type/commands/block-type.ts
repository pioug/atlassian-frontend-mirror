import type {
  EditorState,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type {
  Node as PMNode,
  NodeType,
} from '@atlaskit/editor-prosemirror/model';
import { findWrapping } from '@atlaskit/editor-prosemirror/transform';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';

import { PanelType } from '@atlaskit/adf-schema';
import { CellSelection } from '@atlaskit/editor-tables';
import type {
  HeadingLevelsAndNormalText,
  Command,
} from '@atlaskit/editor-common/types';
import { shouldSplitSelectedNodeOnNodeInsertion } from '@atlaskit/editor-common/insert';
import type {
  INPUT_METHOD,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import {
  filterChildrenBetween,
  removeBlockMarks,
} from '@atlaskit/editor-common/utils';

import {
  CODE_BLOCK,
  BLOCK_QUOTE,
  PANEL,
  HEADINGS_BY_NAME,
  NORMAL_TEXT,
} from '../types';
import { transformToCodeBlockAction } from './transform-to-code-block';

export type InputMethod =
  | INPUT_METHOD.TOOLBAR
  | INPUT_METHOD.INSERT_MENU
  | INPUT_METHOD.SHORTCUT
  | INPUT_METHOD.FORMATTING
  | INPUT_METHOD.KEYBOARD;

export function setBlockType(name: string): Command {
  return (state, dispatch) => {
    const { nodes } = state.schema;
    if (name === NORMAL_TEXT.name && nodes.paragraph) {
      return setNormalText()(state, dispatch);
    }

    const headingBlockType = HEADINGS_BY_NAME[name];
    if (headingBlockType && nodes.heading && headingBlockType.level) {
      return setHeading(headingBlockType.level)(state, dispatch);
    }

    return false;
  };
}

export function setBlockTypeWithAnalytics(
  name: string,
  inputMethod: InputMethod,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command {
  return (state, dispatch) => {
    const { nodes } = state.schema;
    if (name === NORMAL_TEXT.name && nodes.paragraph) {
      return setNormalTextWithAnalytics(inputMethod, editorAnalyticsApi)(
        state,
        dispatch,
      );
    }

    const headingBlockType = HEADINGS_BY_NAME[name];
    if (headingBlockType && nodes.heading && headingBlockType.level) {
      return setHeadingWithAnalytics(
        headingBlockType.level,
        inputMethod,
        editorAnalyticsApi,
      )(state, dispatch);
    }

    return false;
  };
}

export function setNormalText(): Command {
  return function (state, dispatch) {
    const { selection, schema, tr } = state;
    const ranges =
      selection instanceof CellSelection ? selection.ranges : [selection];
    ranges.forEach(({ $from, $to }) => {
      tr.setBlockType($from.pos, $to.pos, schema.nodes.paragraph);
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
function withCurrentHeadingLevel(
  fn: (level?: HeadingLevelsAndNormalText) => Command,
): Command {
  return (state, dispatch, view) => {
    // Find all headings and paragraphs of text
    const { heading, paragraph } = state.schema.nodes;
    const nodes = filterChildrenBetween(
      state.doc,
      state.selection.from,
      state.selection.to,
      (node: PMNode) => {
        return node.type === heading || node.type === paragraph;
      },
    );

    // Check each paragraph and/or heading and check for consistent level
    let level: undefined | HeadingLevelsAndNormalText;
    for (let node of nodes) {
      const nodeLevel = node.node.type === heading ? node.node.attrs.level : 0;
      if (!level) {
        level = nodeLevel;
      } else if (nodeLevel !== level) {
        // Conflict in level, therefore inconsistent and undefined
        level = undefined;
        break;
      }
    }

    return fn(level)(state, dispatch, view);
  };
}

export function setNormalTextWithAnalytics(
  inputMethod: InputMethod,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command {
  return withCurrentHeadingLevel((previousHeadingLevel) =>
    withAnalytics(editorAnalyticsApi, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
      attributes: {
        inputMethod,
        newHeadingLevel: 0,
        previousHeadingLevel,
      },
    })(setNormalText()),
  );
}
export function setHeading(level: HeadingLevelsAndNormalText): Command {
  return function (state, dispatch) {
    const { selection, schema, tr } = state;
    const ranges =
      selection instanceof CellSelection ? selection.ranges : [selection];
    ranges.forEach(({ $from, $to }) => {
      tr.setBlockType($from.pos, $to.pos, schema.nodes.heading, {
        level,
      });
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

export const setHeadingWithAnalytics = (
  newHeadingLevel: HeadingLevelsAndNormalText,
  inputMethod: InputMethod,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
  return withCurrentHeadingLevel((previousHeadingLevel) =>
    withAnalytics(editorAnalyticsApi, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
      attributes: {
        inputMethod,
        newHeadingLevel,
        previousHeadingLevel,
      },
    })(setHeading(newHeadingLevel)),
  );
};

export function insertBlockType(name: string): Command {
  return function (state, dispatch) {
    const { nodes } = state.schema;

    switch (name) {
      case BLOCK_QUOTE.name:
        if (nodes.paragraph && nodes.blockquote) {
          return wrapSelectionIn(nodes.blockquote)(state, dispatch);
        }
        break;
      case CODE_BLOCK.name:
        if (nodes.codeBlock) {
          return insertCodeBlock()(state, dispatch);
        }
        break;
      case PANEL.name:
        if (nodes.panel && nodes.paragraph) {
          return wrapSelectionIn(nodes.panel)(state, dispatch);
        }
        break;
    }

    return false;
  };
}

/**
 *
 * @param name - block type name
 * @param inputMethod - input method
 * @param editorAnalyticsApi - analytics api, undefined if not available either because it failed to load or wasn't added
 * otherwise Editor becomes very sad and crashes
 * @returns - command that inserts block type
 */
export const insertBlockTypesWithAnalytics = (
  name: string,
  inputMethod: InputMethod,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
  switch (name) {
    case BLOCK_QUOTE.name:
      return withAnalytics(editorAnalyticsApi, {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
        attributes: {
          inputMethod,
        },
      })(insertBlockType(name));
    case CODE_BLOCK.name:
      return withAnalytics(editorAnalyticsApi, {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
        attributes: { inputMethod: inputMethod as INPUT_METHOD.TOOLBAR },
        eventType: EVENT_TYPE.TRACK,
      })(insertBlockType(name));
    case PANEL.name:
      return withAnalytics(editorAnalyticsApi, {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: {
          inputMethod: inputMethod as INPUT_METHOD.TOOLBAR,
          panelType: PanelType.INFO, // only info panels can be inserted from toolbar
        },
        eventType: EVENT_TYPE.TRACK,
      })(insertBlockType(name));
    default:
      return insertBlockType(name);
  }
};

/**
 * This function creates a new transaction that wraps the current selection
 * in the specified node type if it results in a valid transaction.
 * If not valid, it performs a safe insert operation.
 *
 * Example of when wrapping might not be valid is when attempting to wrap
 * content that is already inside a panel with another panel
 */
export function createWrapSelectionTransaction({
  state,
  type,
  nodeAttributes,
}: {
  state: EditorState;
  type: NodeType;
  // This should be the node attributes from the ADF schema where prosemirror attributes are specified
  nodeAttributes?: Record<string, any>;
}) {
  let { tr } = state;
  const { $from, $to } = state.selection;
  const { alignment, indentation } = state.schema.marks;

  /** Alignment or Indentation is not valid inside block types */
  const removeAlignTr = removeBlockMarks(state, [alignment, indentation]);
  tr = removeAlignTr || tr;

  const range = $from.blockRange($to) as any;
  const wrapping = range && (findWrapping(range, type, nodeAttributes) as any);
  if (range && wrapping) {
    tr.wrap(range, wrapping).scrollIntoView();
  } else {
    /** We always want to append a block type */
    safeInsert(type.createAndFill(nodeAttributes) as PMNode)(
      tr,
    ).scrollIntoView();
  }

  return tr;
}

/**
 * Function will add wrapping node.
 * 1. If currently selected blocks can be wrapped in the wrapper type it will wrap them.
 * 2. If current block can not be wrapped inside wrapping block it will create a new block below selection,
 *  and set selection on it.
 */
function wrapSelectionIn(type: NodeType): Command {
  return function (state: EditorState, dispatch) {
    let tr = createWrapSelectionTransaction({ state, type });
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}

/**
 * This function creates a new transaction that inserts a code block,
 * if there is text selected it will wrap the current selection if not it will
 * append the codeblock to the end of the document.
 */
export function createInsertCodeBlockTransaction({
  state,
}: {
  state: EditorState;
}) {
  let { tr } = state;
  const { from } = state.selection;
  const { codeBlock } = state.schema.nodes;
  const grandParentNodeType = state.selection.$from.node(-1)?.type;
  const parentNodeType = state.selection.$from.parent.type;

  /** We always want to append a codeBlock unless we're inserting into a paragraph
   * AND it's a valid child of the grandparent node.
   * Insert the current selection as codeBlock content unless it contains nodes other
   * than paragraphs and inline.
   */
  const canInsertCodeBlock =
    shouldSplitSelectedNodeOnNodeInsertion({
      parentNodeType,
      grandParentNodeType,
      content: codeBlock.createAndFill() as PMNode,
    }) && contentAllowedInCodeBlock(state);

  if (canInsertCodeBlock) {
    tr = transformToCodeBlockAction(state, from);
  } else {
    safeInsert(codeBlock.createAndFill() as PMNode)(tr).scrollIntoView();
  }

  return tr;
}

/**
 * Function will insert code block at current selection if block is empty or below current selection and set focus on it.
 */
function insertCodeBlock(): Command {
  return function (state: EditorState, dispatch) {
    let tr = createInsertCodeBlockTransaction({ state });
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}

/**
 * Check if the current selection contains any nodes that are not permitted
 * as codeBlock child nodes. Note that this allows paragraphs and inline nodes
 * as we extract their text content.
 */
function contentAllowedInCodeBlock(state: EditorState): boolean {
  const { $from, $to } = state.selection;
  let isAllowedChild = true;
  state.doc.nodesBetween($from.pos, $to.pos, (node) => {
    if (!isAllowedChild) {
      return false;
    }

    return (isAllowedChild =
      node.type === state.schema.nodes.listItem ||
      node.type === state.schema.nodes.bulletList ||
      node.type === state.schema.nodes.orderedList ||
      node.type === state.schema.nodes.paragraph ||
      node.isInline ||
      node.isText);
  });

  return isAllowedChild;
}

export const cleanUpAtTheStartOfDocument: Command = (state, dispatch) => {
  const { $cursor } = state.selection as TextSelection;
  if (
    $cursor &&
    !$cursor.nodeBefore &&
    !$cursor.nodeAfter &&
    $cursor.pos === 1
  ) {
    const { tr, schema } = state;
    const { paragraph } = schema.nodes;
    const { parent } = $cursor;

    /**
     * Use cases:
     * 1. Change `heading` to `paragraph`
     * 2. Remove block marks
     *
     * NOTE: We already know it's an empty doc so it's safe to use 0
     */
    tr.setNodeMarkup(0, paragraph, parent.attrs, []);
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  }
  return false;
};
