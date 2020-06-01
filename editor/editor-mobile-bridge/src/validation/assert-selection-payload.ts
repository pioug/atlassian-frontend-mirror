import * as E from './error-messages';
import { SelectionPayload } from '../types';
import { ValidationResult } from './types';

export function assertSelectionPayload(
  input: unknown,
): ValidationResult<Error, SelectionPayload> {
  if (typeof input !== 'object' || input === null) {
    return { error: new Error(E.PAYLOAD_OBJECT), data: null };
  }

  if (!input.hasOwnProperty('selection') || !input.hasOwnProperty('rect')) {
    return { error: new Error(E.SELECTION_SHAPE), data: null };
  }

  const shape = input as { selection: unknown; rect: unknown };

  if (typeof shape.rect !== 'object' || shape.rect === null) {
    return { error: new Error(E.RECT_OBJECT), data: null };
  }

  if (typeof shape.selection !== 'object' || shape.selection === null) {
    return { error: new Error(E.RECT_OBJECT), data: null };
  }

  const objectShape = input as { selection: object; rect: object };

  if (
    !objectShape.rect.hasOwnProperty('top') ||
    !objectShape.rect.hasOwnProperty('left')
  ) {
    return { error: new Error(E.RECT_SHAPE), data: null };
  }

  if (!objectShape.selection.hasOwnProperty('type')) {
    return { error: new Error(E.SELECTION_BASE), data: null };
  }

  const { selection, rect } = objectShape as {
    selection: { type: unknown };
    rect: { top: unknown; left: unknown };
  };

  if (typeof rect.top !== 'number' || typeof rect.left !== 'number') {
    return { error: new Error(E.RECT_SHAPE), data: null };
  }

  const validatedRect = rect as { top: number; left: number };

  if (
    typeof selection.type !== 'string' ||
    !['all', 'node', 'text', 'gapcursor', 'cell'].includes(selection.type)
  ) {
    return { error: new Error(E.SELECTION_ENUM), data: null };
  }

  const softSelection = selection as { [key: string]: unknown };

  switch (softSelection.type) {
    case 'all':
      break;
    case 'node': {
      if (typeof softSelection.anchor !== 'number') {
        return { error: new Error(E.NODE_SELECTION), data: null };
      }
      break;
    }
    case 'text':
    case 'cell': {
      if (
        typeof softSelection.anchor !== 'number' ||
        typeof softSelection.head !== 'number'
      ) {
        return { error: new Error(E.TEXT_CELL_SELECTION), data: null };
      }
      break;
    }
    case 'gapcursor': {
      if (typeof softSelection.pos !== 'number') {
        return { error: new Error(E.GAPCURSOR_SELECTION), data: null };
      }
      break;
    }
  }

  const validatedSelection = selection as SelectionPayload['selection'];
  return {
    error: null,
    data: { rect: validatedRect, selection: validatedSelection },
  };
}
