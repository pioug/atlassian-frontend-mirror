import type {
  Node as PmNode,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { IndentationMarkAttributes } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { toggleBlockMark } from '@atlaskit/editor-common/commands';
import type { Command } from '@atlaskit/editor-common/types';
import type { IndentationInputMethod } from './utils';
import { createAnalyticsDispatch } from './utils';
import {
  INDENT_DIRECTION,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import getAttrsWithChangesRecorder from '../getAttrsWithChangesRecorder';
import { MAX_INDENTATION_LEVEL } from '@atlaskit/editor-common/indentation';

export const isIndentationAllowed = (schema: Schema, node: PmNode) => {
  const {
    nodes: { paragraph, heading },
    marks: { alignment },
  } = schema;

  if ([paragraph, heading].indexOf(node.type) > -1) {
    if (alignment) {
      const hasAlignment = node.marks.filter(
        (mark) => mark.type === alignment,
      )[0];
      return !hasAlignment;
    }
    return true;
  }
  return false;
};

/**
 * Create new indentation command (Either indent or outdent depend of getArgsFn)
 * @param getNewIndentationAttrs Function to handle new indentation level
 */
function createIndentationCommand(
  getNewIndentationAttrs: (
    prevArgs?: IndentationMarkAttributes,
    node?: PmNode,
  ) => IndentationMarkAttributes | undefined | false,
): Command {
  return (state, dispatch) => {
    const { indentation } = state.schema.marks;

    return toggleBlockMark<IndentationMarkAttributes>(
      indentation,
      getNewIndentationAttrs,
      isIndentationAllowed,
    )(state, dispatch);
  };
}

function createIndentationCommandWithAnalytics({
  getNewIndentationAttrs,
  direction,
  inputMethod,
  editorAnalyticsAPI,
}: {
  getNewIndentationAttrs: (
    prevAttrs?: IndentationMarkAttributes,
    node?: PmNode,
  ) => IndentationMarkAttributes | undefined | false;
  direction: INDENT_DIRECTION;
  inputMethod: IndentationInputMethod;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
}): Command {
  // Create a new getAttrs function to record the changes
  const { getAttrs, getAndResetAttrsChanges } = getAttrsWithChangesRecorder(
    getNewIndentationAttrs,
    { direction },
  );

  // Use new getAttrs wrapper
  const indentationCommand = createIndentationCommand(getAttrs);

  // Return a new command where we change dispatch for our analytics dispatch
  return (state, dispatch) => {
    return indentationCommand(
      state,
      createAnalyticsDispatch({
        getAttrsChanges: getAndResetAttrsChanges,
        inputMethod,
        editorAnalyticsAPI,
        state,
        dispatch,
      }),
    );
  };
}

/**
 * Get new level for outdent
 * @param oldAttr Old attributes for the mark, undefined if the mark doesn't exit
 * @returns  - undefined; No change required
 *           - false; Remove the mark
 *           - object; Update attributes
 */
const getIndentAttrs = (
  oldAttr?: IndentationMarkAttributes,
): IndentationMarkAttributes | undefined => {
  if (!oldAttr) {
    return { level: 1 }; // No mark exist, create a new one with level 1
  }

  const { level } = oldAttr;
  if (level >= MAX_INDENTATION_LEVEL) {
    return undefined; // Max indentation level reached, do nothing.
  }
  return { level: level + 1 }; // Otherwise, increase the level by one
};

export const getIndentCommand =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (inputMethod: IndentationInputMethod = INPUT_METHOD.KEYBOARD): Command =>
    createIndentationCommandWithAnalytics({
      getNewIndentationAttrs: getIndentAttrs,
      direction: INDENT_DIRECTION.INDENT,
      inputMethod,
      editorAnalyticsAPI,
    });

/**
 * Get new level for outdent
 * @param oldAttr Old attributes for the mark, undefined if the mark doesn't exit
 * @returns  - undefined; No change required
 *           - false; Remove the mark
 *           - object; Update attributes
 */
const getOutdentAttrs = (
  oldAttr?: IndentationMarkAttributes,
): IndentationMarkAttributes | undefined | false => {
  if (!oldAttr) {
    return undefined; // Do nothing;
  }

  const { level } = oldAttr;
  if (level <= 1) {
    return false; // Remove the mark
  }

  return { level: level - 1 }; // Decrease the level on other cases
};

export const getOutdentCommand =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (inputMethod: IndentationInputMethod = INPUT_METHOD.KEYBOARD): Command =>
    createIndentationCommandWithAnalytics({
      getNewIndentationAttrs: getOutdentAttrs,
      direction: INDENT_DIRECTION.OUTDENT,
      inputMethod,
      editorAnalyticsAPI,
    });

export const removeIndentation: Command = (state, dispatch) =>
  toggleBlockMark(state.schema.marks.indentation, () => false)(state, dispatch);
