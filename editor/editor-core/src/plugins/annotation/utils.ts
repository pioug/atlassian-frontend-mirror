import { ResolvedPos, Mark } from 'prosemirror-model';
import { AnnotationInfo, DraftDecorationClassName } from './types';
import { sum } from '../../utils';
import { EditorState } from 'prosemirror-state';
import { Decoration } from 'prosemirror-view';
import { Y75, Y200 } from '@atlaskit/theme/colors';
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

export const getAllAnnotations = (doc: EditorState['doc']): string[] => {
  const allAnnotationIds: Set<string> = new Set();
  doc.nodesBetween(0, doc.content.size, node =>
    node.marks
      .filter(mark => mark.type.name === 'annotation')
      .forEach(m => allAnnotationIds.add(m.attrs.id)),
  );

  return Array.from(allAnnotationIds);
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
    class: DraftDecorationClassName,
    style: `background-color: ${Y75}; border-bottom: 2px solid ${Y200};`,
  });
};

export const hasInlineNodes = (state: EditorState): boolean => {
  const { selection, doc } = state;
  const inlineNodes = [];
  doc.nodesBetween(selection.from, selection.to, node => {
    if (node.isInline && !node.isText) {
      inlineNodes.push(node);
    }
    return true;
  });

  return inlineNodes.length > 0;
};
