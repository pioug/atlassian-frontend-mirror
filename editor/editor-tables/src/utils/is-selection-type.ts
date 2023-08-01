import { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import {
  NodeSelection,
  Selection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';

interface CellSelectionShape extends Selection {
  $anchorCell: ResolvedPos;
  $headCell: ResolvedPos;
  visible: boolean;
}

export function isSelectionType(
  selection: Selection,
  type: 'cell',
): selection is CellSelectionShape;

export function isSelectionType(
  selection: Selection,
  type: 'node',
): selection is NodeSelection;

export function isSelectionType(
  selection: Selection,
  type: 'text',
): selection is TextSelection;

export function isSelectionType(selection: Selection, type: string): boolean {
  if (!selection) {
    return false;
  }
  const serialized = selection.toJSON();
  return serialized.type === type;
}
