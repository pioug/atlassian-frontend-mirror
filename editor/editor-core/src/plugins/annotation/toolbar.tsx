import React from 'react';
import { defineMessages, InjectedIntl } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import CommentIcon from '@atlaskit/icon/glyph/comment';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';
import { Command } from '../../types';
import { addInlineComment, ToolTipContent } from '../../keymaps';
import {
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from '../../plugins/floating-toolbar/types';
import { setInlineCommentDraftState } from './commands';
import { AnnotationTestIds, AnnotationSelectionType } from './types';
import { isSelectionValid } from './utils';

export const annotationMessages = defineMessages({
  createComment: {
    id: 'fabric.editor.createComment',
    defaultMessage: 'Comment',
    description: 'Create/add an inline comment based on the users selection',
  },
  createCommentInvalid: {
    id: 'fabric.editor.createCommentInvalid',
    defaultMessage: 'You can only comment on text and headings',
    description:
      'Error message to communicate to the user they can only do the current action in certain contexts',
  },
  toolbar: {
    id: 'fabric.editor.annotationToolbar',
    defaultMessage: 'Annotation toolbar',
    description:
      'A label for a toolbar (UI element) that creates annotations/comments in the document',
  },
});

/*
  Calculates the position of the floating toolbar relative to the selection.

  This is a re-implementation which closely matches the behaviour on Confluence renderer.
  The main difference is the popup is always above the selection.

  Things to consider:
  - popup is always above the selection
  - coordinates of head X and getBoundingClientRect() are absolute in client viewport (not including scroll offsets)
  - popup may appear in '.fabric-editor-popup-scroll-parent' (or body)
  - we use the toolbarRect to center align toolbar
  - use wrapperBounds to clamp values
  - editorView.dom bounds differ to wrapperBounds, convert at the end
*/
const calculateToolbarPositionAboveSelection = (toolbarTitle: string) => (
  editorView: EditorView,
  nextPos: Position,
): Position => {
  const toolbar = document.querySelector(
    `div[aria-label="${toolbarTitle}"]`,
  ) as HTMLElement;

  if (!toolbar) {
    return nextPos;
  }

  // scroll wrapper for full page, fall back to document body
  // TODO: look into using getScrollGutterOptions()
  const scrollWrapper =
    editorView.dom.closest('.fabric-editor-popup-scroll-parent') ||
    document.body;
  const wrapperBounds = scrollWrapper.getBoundingClientRect();

  const selection = window && window.getSelection();
  const range = selection && !selection.isCollapsed && selection.getRangeAt(0);

  if (!range) {
    return nextPos;
  }

  const toolbarRect = toolbar.getBoundingClientRect();
  const { head, anchor } = editorView.state.selection;
  const topCoords = editorView.coordsAtPos(Math.min(head, anchor));
  const bottomCoords = editorView.coordsAtPos(
    Math.max(head, anchor) - Math.min(range.endOffset, 1),
  );
  const top = (topCoords.top || 0) - toolbarRect.height * 1.5;
  let left = 0;

  // If not on the same line
  if (topCoords.top !== bottomCoords.top) {
    // selecting downwards
    if (head > anchor) {
      left = Math.max(topCoords.right, bottomCoords.right);
    } else {
      left = Math.min(topCoords.left, bottomCoords.left);
    }

    /*
      short selection above a long paragraph

      eg. short {<}heading
      The purpose of this text is to show the selection range{>}.

      The horizontal positioning should center around "heading",
      not where it ends at "range".

      Note: if it was "head<b>ing</b>" then it would only center
      around "head". Undesireable but matches the current renderer.
    */
    const cliffPosition = range.getClientRects()[0];
    if (cliffPosition.right < left) {
      left = cliffPosition.left + cliffPosition.width / 2;
    }
  } else {
    // Otherwise center on the single line selection
    left = topCoords.left + (bottomCoords.right - topCoords.left) / 2;
  }
  left -= toolbarRect.width / 2;

  // remap positions from browser document to wrapperBounds
  return {
    top: top - wrapperBounds.top + scrollWrapper.scrollTop,
    left: Math.max(0, left - wrapperBounds.left),
  };
};

/*
  Calculates the position of the floating toolbar relative to the selection.

  This is a re-implementation which closely matches the behaviour on Confluence renderer.
  The main difference is the popup is always above the selection.

  Things to consider:
  - stick as close to the head X release coordinates as possible
  - coordinates of head X and getBoundingClientRect() are absolute in client viewport (not including scroll offsets)
  - popup may appear in '.fabric-editor-popup-scroll-parent' (or body)
  - we use the toolbarRect to center align toolbar
  - use wrapperBounds to clamp values
  - editorView.dom bounds differ to wrapperBounds, convert at the end
*/
const calculateToolbarPositionTrackHead = (toolbarTitle: string) => (
  editorView: EditorView,
  nextPos: Position,
): Position => {
  const toolbar = document.querySelector(
    `div[aria-label="${toolbarTitle}"]`,
  ) as HTMLElement;

  if (!toolbar) {
    return nextPos;
  }

  // scroll wrapper for full page, fall back to document body
  // TODO: look into using getScrollGutterOptions()
  const scrollWrapper =
    editorView.dom.closest('.fabric-editor-popup-scroll-parent') ||
    document.body;
  const wrapperBounds = scrollWrapper.getBoundingClientRect();

  const selection = window && window.getSelection();
  const range = selection && !selection.isCollapsed && selection.getRangeAt(0);

  if (!range) {
    return nextPos;
  }

  const toolbarRect = toolbar.getBoundingClientRect();
  const { head, anchor } = editorView.state.selection;
  let topCoords = editorView.coordsAtPos(Math.min(head, anchor));
  let bottomCoords = editorView.coordsAtPos(
    Math.max(head, anchor) - Math.min(range.endOffset, 1),
  );
  let top;
  // If not the same line, display toolbar below.
  if (head > anchor && topCoords.top !== bottomCoords.top) {
    // We are taking the previous pos to the maxium, so avoid end of line positions
    // returning the next line's rect.
    top = (bottomCoords.top || 0) + toolbarRect.height / 1.15;
  } else {
    top = (topCoords.top || 0) - toolbarRect.height * 1.5;
  }

  const left =
    (head > anchor ? bottomCoords.right : topCoords.left) -
    toolbarRect.width / 2;

  // remap positions from browser document to wrapperBounds
  return {
    top: top - wrapperBounds.top + scrollWrapper.scrollTop,
    left: Math.max(0, left - wrapperBounds.left),
  };
};

export const buildToolbar = (
  state: EditorState,
  intl: InjectedIntl,
  isToolbarAbove: boolean = false,
): FloatingToolbarConfig | undefined => {
  const { schema } = state;
  const selectionValid = isSelectionValid(state);
  if (selectionValid === AnnotationSelectionType.INVALID) {
    return undefined;
  }

  const createCommentMessage = intl.formatMessage(
    annotationMessages.createComment,
  );
  const commentDisabledMessage = intl.formatMessage(
    annotationMessages.createCommentInvalid,
  );

  const createComment: FloatingToolbarButton<Command> = {
    type: 'button',
    showTitle: true,
    disabled: selectionValid === AnnotationSelectionType.DISABLED,
    testId: AnnotationTestIds.floatingToolbarCreateButton,
    icon: CommentIcon,
    tooltipContent:
      selectionValid === AnnotationSelectionType.DISABLED ? (
        commentDisabledMessage
      ) : (
        <ToolTipContent
          description={createCommentMessage}
          keymap={addInlineComment}
        />
      ),
    title: createCommentMessage,
    onClick: (state, dispatch) => {
      return setInlineCommentDraftState(true)(state, dispatch);
    },
  };

  const { annotation } = schema.marks;
  const validNodes = Object.keys(schema.nodes).reduce<NodeType[]>(
    (acc, current) => {
      const type = schema.nodes[current];
      if (type.allowsMarkType(annotation)) {
        acc.push(type);
      }
      return acc;
    },
    [],
  );

  const toolbarTitle = intl.formatMessage(annotationMessages.toolbar);
  const calcToolbarPosition = isToolbarAbove
    ? calculateToolbarPositionAboveSelection
    : calculateToolbarPositionTrackHead;
  const onPositionCalculated = calcToolbarPosition(toolbarTitle);

  return {
    title: toolbarTitle,
    nodeType: validNodes,
    items: [createComment],
    onPositionCalculated,
  };
};
