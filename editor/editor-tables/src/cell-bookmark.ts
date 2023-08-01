import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
  Selection,
  SelectionBookmark,
} from '@atlaskit/editor-prosemirror/state';
import { Mappable } from '@atlaskit/editor-prosemirror/transform';

import { SerializedCellSelection } from './types';
import { inSameTable } from './utils/tables';

export class CellBookmark implements SelectionBookmark {
  constructor(public readonly anchor: number, public readonly head: number) {}

  public map(mapping: Mappable): SelectionBookmark {
    return new CellBookmark(mapping.map(this.anchor), mapping.map(this.head));
  }

  public resolve(doc: PMNode): Selection {
    const $anchorCell = doc.resolve(this.anchor);
    const $headCell = doc.resolve(this.head);

    if (
      $anchorCell.parent.type.spec.tableRole === 'row' &&
      $headCell.parent.type.spec.tableRole === 'row' &&
      $anchorCell.index() < $anchorCell.parent.childCount &&
      $headCell.index() < $headCell.parent.childCount &&
      inSameTable($anchorCell, $headCell)
    ) {
      const data: SerializedCellSelection = {
        type: 'cell',
        anchor: $anchorCell.pos,
        head: $headCell.pos,
      };
      return Selection.fromJSON(doc, data);
    }

    return Selection.near($headCell, 1);
  }
}
