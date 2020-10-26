import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { Mappable, StepMap, Transform } from 'prosemirror-transform';
import { TableRect } from '@atlaskit/editor-tables/table-map';
import { TableSideEffect, TableSideEffectJSON } from './types';

export class TableSideEffectHandler {
  public table?: TableSideEffect;

  constructor(tableSideEffect?: TableSideEffect) {
    if (tableSideEffect) {
      this.table = tableSideEffect;
    }
  }

  private addTableSideEffect(from: number, to: number, node: ProseMirrorNode) {
    this.table = { from, to, node };
  }

  handleAddTable(tr: Transform, isDelete: boolean): boolean {
    if (isDelete || !this.table) {
      return false;
    }

    tr.insert(this.table.from, this.table.node);
    return true;
  }

  handleRemoveTable(
    tr: Transform,
    tablePos: number,
    tableRect: TableRect,
    column: number | null,
    isDelete: boolean,
  ) {
    if (isDelete && tableRect.map.width === 1 && column === 0) {
      // Add side effect
      this.addTableSideEffect(
        tablePos,
        tablePos + tableRect.table.nodeSize,
        tableRect.table.copy(tableRect.table.content),
      );

      tr.delete(tablePos, tablePos + tableRect.table.nodeSize);
      return true;
    }
    return false;
  }

  getTableMap(isDelete: boolean): StepMap | undefined {
    if (!this.table) {
      return;
    }
    const { from, to } = this.table;
    if (isDelete) {
      return new StepMap([from, to - from, 0]);
    }

    return new StepMap([from, 0, to - from]);
  }

  map(mapping: Mappable): TableSideEffect | undefined {
    if (!this.table) {
      return;
    }

    return {
      from: mapping.map(this.table.from),
      to: mapping.map(this.table.to),
      node: this.table.node,
    };
  }

  invert(doc: ProseMirrorNode): TableSideEffect | undefined {
    if (!this.table) {
      return;
    }
    const tableNode = doc.nodeAt(this.table.from)!;

    return {
      from: this.table.from,
      to: this.table.from + tableNode.nodeSize,
      node: tableNode.copy(tableNode.content),
    };
  }

  toJSON(): TableSideEffectJSON | undefined {
    if (!this.table) {
      return;
    }

    return {
      from: this.table.from,
      to: this.table.to,
      node: this.table.node.toJSON(),
    };
  }

  static fromJSON(schema: Schema, json: TableSideEffectJSON): TableSideEffect {
    return {
      from: json.from,
      to: json.to,
      node: schema.nodeFromJSON(json.node),
    };
  }
}
