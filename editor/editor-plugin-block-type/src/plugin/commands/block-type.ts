import type {
  EditorAnalyticsAPI,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { setHeading } from '@atlaskit/editor-common/commands';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type {
  Command,
  HeadingLevelsAndNormalText,
} from '@atlaskit/editor-common/types';
import {
  filterChildrenBetween,
  wrapSelectionIn,
} from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables';

import { HEADINGS_BY_NAME, NORMAL_TEXT } from '../block-types';

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
  return withCurrentHeadingLevel(previousHeadingLevel =>
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

export const setHeadingWithAnalytics = (
  newHeadingLevel: HeadingLevelsAndNormalText,
  inputMethod: InputMethod,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
  return withCurrentHeadingLevel(previousHeadingLevel =>
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

function insertBlockQuote(): Command {
  return function (state, dispatch) {
    const { nodes } = state.schema;

    if (nodes.paragraph && nodes.blockquote) {
      return wrapSelectionIn(nodes.blockquote)(state, dispatch);
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
export const insertBlockQuoteWithAnalytics = (
  inputMethod: InputMethod,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
  return withAnalytics(editorAnalyticsApi, {
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    eventType: EVENT_TYPE.TRACK,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
    attributes: {
      inputMethod: inputMethod,
    },
  })(insertBlockQuote());
};

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
