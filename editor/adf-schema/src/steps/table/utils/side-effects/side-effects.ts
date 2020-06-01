import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { Mappable, StepMap } from 'prosemirror-transform';
import { SideEffects, SideEffectsJSON } from './types';
import { TableSideEffectHandler } from './table';
import { RowsSideEffectHandler } from './rows';

export class SideEffectsHandler {
  public table: TableSideEffectHandler;
  public rows: RowsSideEffectHandler;

  constructor(sideEffects?: SideEffects) {
    this.table = new TableSideEffectHandler(sideEffects && sideEffects.table);
    this.rows = new RowsSideEffectHandler(sideEffects && sideEffects.rows);
  }

  getTableMap(isDelete: boolean): StepMap | undefined {
    return this.table.getTableMap(isDelete);
  }

  map(mapping: Mappable): SideEffects {
    const sideEffects: SideEffects = {};
    const tableSideEffect = this.table.map(mapping);
    const rowsSideEffect = this.rows.map(mapping);

    if (tableSideEffect) {
      sideEffects.table = tableSideEffect;
    }

    if (rowsSideEffect) {
      sideEffects.rows = rowsSideEffect;
    }
    return sideEffects;
  }

  invert(
    originalDoc: ProseMirrorNode,
    isDelete: boolean,
    map: StepMap,
  ): SideEffects {
    const sideEffects: SideEffects = {};

    const tableSideEffect = this.table.invert(originalDoc);
    if (tableSideEffect) {
      sideEffects.table = tableSideEffect;
    }

    const rowsSideEffect = this.rows.invert(originalDoc, isDelete, map);
    if (rowsSideEffect) {
      sideEffects.rows = rowsSideEffect;
    }

    return sideEffects;
  }

  toJSON(): SideEffectsJSON | undefined {
    const tableSideEffectJson = this.table.toJSON();
    const rowsSideEffectJson = this.rows.toJSON();

    if (!tableSideEffectJson && !rowsSideEffectJson) {
      return;
    }

    const sideEffectsJSON: SideEffectsJSON = {};
    if (tableSideEffectJson) {
      sideEffectsJSON.table = tableSideEffectJson;
    }
    if (rowsSideEffectJson) {
      sideEffectsJSON.rows = rowsSideEffectJson;
    }

    return sideEffectsJSON;
  }

  static fromJSON(schema: Schema, json: SideEffectsJSON): SideEffects {
    const sideEffects: SideEffects = {};

    if (json.table) {
      sideEffects.table = TableSideEffectHandler.fromJSON(schema, json.table);
    }

    if (json.rows) {
      sideEffects.rows = RowsSideEffectHandler.fromJSON(schema, json.rows);
    }

    return sideEffects;
  }
}
