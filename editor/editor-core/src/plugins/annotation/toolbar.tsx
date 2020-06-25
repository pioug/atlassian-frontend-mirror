import React from 'react';
import { defineMessages, InjectedIntl } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import { TextSelection, EditorState, AllSelection } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';
import { Command } from '../../types';
import { addInlineComment, ToolTipContent } from '../../keymaps';
import {
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from '../../plugins/floating-toolbar/types';
import { setInlineCommentDraftState } from './commands';
import { AnnotationTestIds } from './types';
import { hasInlineNodes } from './utils';

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

export const buildToolbar = (
  state: EditorState,
  intl: InjectedIntl,
): FloatingToolbarConfig | undefined => {
  const { selection, schema } = state;

  // Toolbar can only be specified on ranged text selections and all selections
  if (
    selection.empty ||
    !(selection instanceof TextSelection || selection instanceof AllSelection)
  ) {
    return undefined;
  }

  const selectionDisabled = hasInlineNodes(state);
  const createCommentMessage = intl.formatMessage(
    annotationMessages.createComment,
  );

  const createComment: FloatingToolbarButton<Command> = {
    type: 'button',
    showTitle: true,
    disabled: selectionDisabled,
    testId: AnnotationTestIds.floatingToolbarCreateButton,
    icon: CommentIcon,
    tooltipContent: selectionDisabled ? (
      intl.formatMessage(annotationMessages.createCommentInvalid)
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

  const onPositionCalculated = (
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
    const range =
      selection && !selection.isCollapsed && selection.getRangeAt(0);

    if (!range) {
      return nextPos;
    }

    /*
    things to consider
    - coordinates of mouseX and getBoundingClientRect() are absolute in client viewport (not including scroll offsets)
    - popup may appear in '.fabric-editor-popup-scroll-parent' (or body)
    - we use the toolbarRect to center align toolbar
    - use wrapperBounds to clamp values
    - editorView.dom bounds differ to wrapperBounds, convert at the end
    - stick as close to the mouseX release coordinates as possible
    */
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

  return {
    title: toolbarTitle,
    nodeType: validNodes,
    items: [createComment],
    onPositionCalculated,
  };
};
