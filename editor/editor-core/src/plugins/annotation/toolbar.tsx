import { defineMessages, InjectedIntl } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';
import { Command } from '../../types';
import { inlineCommentPluginKey } from './pm-plugins/plugin-factory';
import {
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from '../../plugins/floating-toolbar/types';
import { setInlineCommentDraftState } from './commands';
import { AnnotationTestIds } from './types';
import { hasInlineNodes } from './utils';
import { NodeType } from 'prosemirror-model';
import { getSelectionStartRect } from './utils';
import { addInlineComment, renderTooltipContent } from '../../keymaps';

export const annotationMessages = defineMessages({
  createComment: {
    id: 'fabric.editor.createComment',
    defaultMessage: 'Create comment',
    description: 'Create/add an inline comment based on the users selection',
  },
  createCommentInvalid: {
    id: 'fabric.editor.createCommentInvalid',
    defaultMessage: 'Comments are only enabled for text and headings',
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
  const pluginState = inlineCommentPluginKey.getState(state);

  // Toolbar can only be specified on ranged text selections
  if (selection.empty || pluginState.mouseData.isSelecting) {
    return undefined;
  }

  const selectionInvalid = hasInlineNodes(state);
  const createCommentMessage = intl.formatMessage(
    annotationMessages.createComment,
  );

  const createComment: FloatingToolbarButton<Command> = {
    type: 'button',
    showTitle: true,
    disabled: selectionInvalid,
    testId: AnnotationTestIds.floatingToolbarCreateButton,
    icon: CommentIcon,
    tooltipContent: selectionInvalid
      ? intl.formatMessage(annotationMessages.createCommentInvalid)
      : renderTooltipContent(createCommentMessage, addInlineComment),
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
    const bounds = getSelectionStartRect();

    if (!bounds) {
      return nextPos;
    }

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
    const editorBounds = editorView.dom.getBoundingClientRect();
    let mouseX = pluginState.mouseData.x;

    // selection without mouse
    if (mouseX === 0) {
      const coordinates = editorView.coordsAtPos(
        editorView.state.selection.$to.pos,
      );
      mouseX = coordinates.left;
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
    const top = bounds.top - toolbarRect.height * 1.5;
    // ensure mouseX is within bounds left and right
    const positionX = Math.min(bounds.right, Math.max(bounds.left, mouseX));
    const left = positionX - toolbarRect.width / 2;

    // clamp within bounds of wrapper to prevent clipping of toolbar
    const clampLeft = editorBounds.left;
    const clampRight = editorBounds.right - toolbarRect.width;

    // remap positions from browser document to wrapperBounds
    return {
      top: top - wrapperBounds.top + scrollWrapper.scrollTop,
      left:
        Math.max(clampLeft, Math.min(clampRight, left)) - wrapperBounds.left,
    };
  };

  return {
    title: toolbarTitle,
    nodeType: validNodes,
    items: [createComment],
    onPositionCalculated,
  };
};
