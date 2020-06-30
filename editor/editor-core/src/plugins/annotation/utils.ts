import { ResolvedPos, Mark, Node } from 'prosemirror-model';
import {
  EditorState,
  Selection,
  PluginKey,
  TextSelection,
  AllSelection,
} from 'prosemirror-state';
import { Decoration } from 'prosemirror-view';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common';
import { AnnotationInfo, AnnotationSelectionType } from './types';
import { sum } from '../../utils';
import { InlineCommentPluginState } from './pm-plugins/types';
import {
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION,
  INPUT_METHOD,
  AnalyticsEventPayload,
} from '../analytics';
import { AnalyticsEventPayloadCallback } from '../analytics/utils';
import { AnnotationAEPAttributes } from '../analytics/types/inline-comment-events';
/**
 * Finds the marks in the nodes to the left and right.
 * @param $pos Position to center search around
 */
export const surroundingMarks = ($pos: ResolvedPos) => {
  const { nodeBefore, nodeAfter } = $pos;
  const markNodeBefore =
    nodeBefore && $pos.doc.nodeAt($pos.pos - nodeBefore.nodeSize - 1);
  const markNodeAfter =
    nodeAfter && $pos.doc.nodeAt($pos.pos + nodeAfter.nodeSize);

  return [
    (markNodeBefore && markNodeBefore.marks) || [],
    (markNodeAfter && markNodeAfter.marks) || [],
  ];
};

/**
 * Finds annotation marks, and returns their IDs.
 * @param marks Array of marks to search in
 */
export const filterAnnotationIds = (marks: Array<Mark>): Array<string> => {
  if (!marks.length) {
    return [];
  }

  const { annotation } = marks[0].type.schema.marks;
  return marks
    .filter(mark => mark.type === annotation)
    .map(mark => mark.attrs.id);
};

/**
 * Re-orders the annotation array based on the order in the document.
 *
 * This places the marks that do not appear in the surrounding nodes
 * higher in the list. That is, the inner-most one appears first.
 *
 * Undo, for example, can re-order annotation marks in the document.
 * @param annotations annotation metadata
 * @param $from location to look around (usually the selection)
 */
export const reorderAnnotations = (
  annotations: Array<AnnotationInfo>,
  $from: ResolvedPos,
) => {
  const idSet = surroundingMarks($from).map(filterAnnotationIds);

  annotations.sort(
    (a, b) =>
      sum(idSet, ids => ids.indexOf(a.id)) -
      sum(idSet, ids => ids.indexOf(b.id)),
  );
};

export const getAllAnnotations = (doc: Node): string[] => {
  const allAnnotationIds: Set<string> = new Set();

  doc.descendants(node => {
    node.marks
      .filter(mark => mark.type.name === 'annotation')
      .forEach(m => allAnnotationIds.add(m.attrs.id));
    return true;
  });

  return Array.from(allAnnotationIds);
};

export const getAnnotationText = (root: Node, annotationIds: string[] = []) => {
  let result = '';
  root.descendants(node => {
    if (
      node.marks.length &&
      node.marks.some(
        mark =>
          mark.type.name === 'annotation' &&
          annotationIds.includes(mark.attrs.id),
      )
    ) {
      result += node.textContent;
    }
    return true;
  });
  return result;
};

// helper function: return the first selection range for the window
const getSelectionRange = function(): Range | null {
  const selection = window.getSelection();

  // no selection made in browser
  if (!selection || selection.isCollapsed) {
    return null;
  }

  const selectionRange = selection.getRangeAt(0);

  return selectionRange;
};

// helper function: find the bounds of first part within selected content
export const getSelectionStartRect = (): ClientRect | null => {
  const range = getSelectionRange();

  if (!range) {
    return null;
  }

  const rects = range.getClientRects();
  if (!rects.length) {
    return null;
  }
  // Find first selection area that width is not 0
  // Sometimes there is a chance that user is selecting an empty DOM node.
  const firstRect = Array.from(rects).find(
    rect => rect.width !== 0 && rect.height !== 0,
  );

  return firstRect || null;
};

/*
 * add decoration for the comment selection in draft state
 * (when creating new comment)
 */
export const addDraftDecoration = (start: number, end: number) => {
  return Decoration.inline(start, end, {
    class: `${AnnotationSharedClassNames.draft}`,
  });
};

export const getAnnotationViewKey = (annotations: AnnotationInfo[]): string => {
  const keys = annotations.map(mark => mark.id).join('_');
  return `view-annotation-wrapper_${keys}`;
};

export const findAnnotationsInSelection = (
  selection: Selection,
  doc: Node,
): AnnotationInfo[] => {
  const { empty, anchor, $anchor } = selection;
  // Only detect annotations on caret selection
  if (!empty || !doc) {
    return [];
  }

  const node = doc.nodeAt(anchor);
  if (!node || !node.marks.length) {
    return [];
  }

  const annotations = node.marks
    .filter(mark => mark.type.name === 'annotation')
    .map(mark => ({
      id: mark.attrs.id,
      type: mark.attrs.annotationType,
    }));

  reorderAnnotations(annotations, $anchor);
  return annotations;
};

/**
 * get selection from position to apply new comment for
 * @return bookmarked positions if they exists, otherwise current selection positions
 */
export function getSelectionPositions(
  editorState: EditorState,
  inlineCommentState: InlineCommentPluginState,
): {
  from: number;
  to: number;
} {
  let { from, to } = editorState.selection;
  const { bookmark } = inlineCommentState;

  // get positions via saved bookmark if it is available
  // this is to make comments box positioned relative to temporary highlight rather then current selection
  if (bookmark) {
    const resolvedBookmark = bookmark.resolve(editorState.doc);
    from = resolvedBookmark.from;
    to = resolvedBookmark.to;
  }
  return { from, to };
}

export const inlineCommentPluginKey = new PluginKey('inlineCommentPluginKey');

export const getPluginState = (
  state: EditorState,
): InlineCommentPluginState => {
  return inlineCommentPluginKey.getState(state);
};

/**
 * get number of unique annotations within current selection
 */
const getAnnotationsInSelectionCount = (state: EditorState): number => {
  const { annotation } = state.schema.marks;
  const { from, to } = state.selection;
  const annotations = new Set<string>();

  state.doc.nodesBetween(from, to, node => {
    node.marks.forEach((mark: Mark<any>) => {
      if (mark.type === annotation) {
        annotations.add(mark.attrs.id);
      }
    });
    return true; // be thorough, go through all children
  });

  return annotations.size;
};

/**
 * get payload for the open/close analytics event
 */
export const getDraftCommandAnalyticsPayload = (
  drafting: boolean,
  inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.SHORTCUT,
) => {
  const payload: AnalyticsEventPayloadCallback = (
    state: EditorState,
  ): AnalyticsEventPayload => {
    let attributes: AnnotationAEPAttributes = {};

    if (drafting) {
      attributes = {
        inputMethod,
        overlap: getAnnotationsInSelectionCount(state),
      };
    }

    return {
      action: drafting ? ACTION.OPENED : ACTION.CLOSED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: EVENT_TYPE.TRACK,
      attributes,
    };
  };
  return payload;
};

export const isSelectionValid = (
  state: EditorState,
): AnnotationSelectionType => {
  const { selection } = state;
  const { disallowOnWhitespace } = getPluginState(state);

  if (
    selection.empty ||
    !(selection instanceof TextSelection || selection instanceof AllSelection)
  ) {
    return AnnotationSelectionType.INVALID;
  }

  if (hasInlineNodes(state)) {
    return AnnotationSelectionType.DISABLED;
  }

  if (disallowOnWhitespace && hasWhitespaceNode(selection)) {
    return AnnotationSelectionType.INVALID;
  }

  return AnnotationSelectionType.VALID;
};

export const hasInlineNodes = (state: EditorState): boolean => {
  const { selection, doc } = state;
  let inlineNodesCount = 0;

  doc.nodesBetween(selection.from, selection.to, node => {
    if (node.isInline && !node.isText) {
      ++inlineNodesCount;
    }
    return true;
  });

  return inlineNodesCount > 0;
};

/**
 * Checks if any of the nodes in a given selection are completely whitespace
 * This is to conform to Confluence annotation specifications
 */
export function hasWhitespaceNode(selection: TextSelection | AllSelection) {
  let foundWhitespace = false;
  selection.content().content.descendants(node => {
    if (node.textContent.trim() === '') {
      foundWhitespace = true;
    }
    return !foundWhitespace;
  });

  return foundWhitespace;
}
