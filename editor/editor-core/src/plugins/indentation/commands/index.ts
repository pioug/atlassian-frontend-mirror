import { Node as PmNode, Schema } from 'prosemirror-model';
import { IndentationMarkAttributes } from '@atlaskit/adf-schema';
import { toggleBlockMark } from '../../../commands';
import { Command } from '../../../types/command';
import { createAnalyticsDispatch, IndentationInputMethod } from './utils';
import { INDENT_DIRECTION, INPUT_METHOD } from '../../analytics';
import getAttrsWithChangesRecorder from '../../../utils/getAttrsWithChangesRecorder';

export const MAX_INDENTATION_LEVEL = 6;

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
}: {
  getNewIndentationAttrs: (
    prevAttrs?: IndentationMarkAttributes,
    node?: PmNode,
  ) => IndentationMarkAttributes | undefined | false;
  direction: INDENT_DIRECTION;
  inputMethod: IndentationInputMethod;
}): Command {
  // Create a new getAttrs function to record the changes
  const {
    getAttrs,
    getAndResetAttrsChanges,
  } = getAttrsWithChangesRecorder(getNewIndentationAttrs, { direction });

  // Use new getAttrs wrapper
  const indentationCommand = createIndentationCommand(getAttrs);

  // Return a new command where we change dispatch for our analytics dispatch
  return (state, dispatch) => {
    return indentationCommand(
      state,
      createAnalyticsDispatch({
        getAttrsChanges: getAndResetAttrsChanges,
        inputMethod,
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

export const getIndentCommand = (
  inputMethod: IndentationInputMethod = INPUT_METHOD.KEYBOARD,
): Command =>
  createIndentationCommandWithAnalytics({
    getNewIndentationAttrs: getIndentAttrs,
    direction: INDENT_DIRECTION.INDENT,
    inputMethod,
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

export const getOutdentCommand = (
  inputMethod: IndentationInputMethod = INPUT_METHOD.KEYBOARD,
): Command =>
  createIndentationCommandWithAnalytics({
    getNewIndentationAttrs: getOutdentAttrs,
    direction: INDENT_DIRECTION.OUTDENT,
    inputMethod,
  });

export const removeIndentation: Command = (state, dispatch) =>
  toggleBlockMark(state.schema.marks.indentation, () => false)(state, dispatch);
