import { Node, NodeType, Slice } from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
} from 'prosemirror-state';
import { ReplaceAroundStep, ReplaceStep, Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';

import { closest } from './dom';

export const stepHasSlice = (
  step: Step,
): step is Step & { from: number; to: number; slice: Slice } =>
  step && step.hasOwnProperty('slice');

/**
 * Checks whether a given step is adding nodes of given nodeTypes
 *
 * @param step Step to check
 * @param nodeTypes NodeTypes being added
 */
export function stepAddsOneOf(step: Step, nodeTypes: Set<NodeType>): boolean {
  let adds = false;

  if (!stepHasSlice(step)) {
    return adds;
  }

  step.slice.content.descendants((node) => {
    if (nodeTypes.has(node.type)) {
      adds = true;
    }
    return !adds;
  });

  return adds;
}

export const extractSliceFromStep = (step: Step): Slice | null => {
  if (!(step instanceof ReplaceStep) && !(step instanceof ReplaceAroundStep)) {
    return null;
  }

  // @ts-ignore This is by design. Slice is a private property, but accesible, from ReplaceStep.
  // However, we need to read it to found if the step was adding a newline
  const slice = step.slice;

  return slice as Slice;
};

export const isTextSelection = (
  selection: Selection,
): selection is TextSelection => selection instanceof TextSelection;

export const isElementInTableCell = (
  element: HTMLElement | null,
): HTMLElement | null => {
  return closest(element, 'td') || closest(element, 'th');
};

export const isLastItemMediaGroup = (node: Node): boolean => {
  const { content } = node;
  return !!content.lastChild && content.lastChild.type.name === 'mediaGroup';
};

export const setNodeSelection = (view: EditorView, pos: number) => {
  const { state, dispatch } = view;

  if (!isFinite(pos)) {
    return;
  }

  const tr = state.tr.setSelection(NodeSelection.create(state.doc, pos));
  dispatch(tr);
};

export function setTextSelection(
  view: EditorView,
  anchor: number,
  head?: number,
) {
  const { state, dispatch } = view;
  const tr = state.tr.setSelection(
    TextSelection.create(state.doc, anchor, head),
  );
  dispatch(tr);
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// checks if the given position is within the ProseMirror document
export const isValidPosition = (pos: number, state: EditorState): boolean => {
  if (pos >= 0 && pos <= state.doc.resolve(0).end()) {
    return true;
  }

  return false;
};
