import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import {
  Mappable,
  Step,
  StepMap,
  StepResult,
  Transform,
} from 'prosemirror-transform';
import { TableRect } from '@atlaskit/editor-tables/table-map';

import { Cell, cellsAtColumn } from './utils/cells-at-column';
import { findColumn } from './utils/find-column';
import {
  AddColumnStepInfo,
  AddColumnStepJson,
  CellStep,
  CellStepJson,
  ColumnInfo,
} from './types';
import { getTableRectFromDoc } from './utils/get-table-rect-from-doc';
import {
  applyCellStep,
  createCellStep,
  getMapFromCellStep,
  invertCellStep,
} from './utils/cell-step';
import { SideEffectsHandler } from './utils/side-effects/side-effects';
import memoizeOne from 'memoize-one';
import { SideEffects } from './utils/side-effects/types';

const ADD_COLUMN_STEP = 'ak-add-column';

function printColumnInfo(columnInfo: ColumnInfo) {
  let cellsFrom = [];
  for (const cellInfo of columnInfo.values()) {
    cellsFrom.push(cellInfo.from);
  }
  return `[${cellsFrom.join(',')}]`;
}

function createColumnInfo(cellsInfo: CellStep[]): ColumnInfo {
  return new Map<number, CellStep>(
    cellsInfo.map((cellInfo) => [cellInfo.from, cellInfo]),
  );
}

const getTableRectAndColumnFactory = (
  doc: ProseMirrorNode,
  pos: number,
  columnInfo: ColumnInfo,
) => {
  return memoizeOne(() => {
    const rect = getTableRectFromDoc(doc, pos);

    const column = findColumn(columnInfo, rect);
    if (column === null) {
      throw new Error('no column');
    }
    return {
      rect,
      column,
    };
  });
};

/**
 * Index and positions looks like
 * 0    1    2    3   -> Add Column Index
 * | 5  | 10 | 15 |   -> Table with Positions
 * | 20 | 25 | 30 |
 * 0    1    2    x   -> Remove Column Index
 *
 */
export class AddColumnStep<S extends Schema = any> extends Step {
  private readonly tablePos: number;
  private readonly isDelete: boolean;
  private columnInfo: ColumnInfo;
  private sideEffectsHandler: SideEffectsHandler;

  constructor(
    tablePos: number,
    addColumnStepInfo: AddColumnStepInfo,
    isDelete = false,
  ) {
    super();

    this.tablePos = tablePos;
    this.isDelete = isDelete;
    this.sideEffectsHandler = new SideEffectsHandler(
      addColumnStepInfo.sideEffects,
    );
    this.columnInfo = createColumnInfo(addColumnStepInfo.cells);
  }

  /**
   * Detect the column based on all the cells step in column info.
   * Recreate columnInfo based on the current document. We might need to add new cells added by insert row or unmerge cells.
   * If isDelete
   *    Decrease colspan if one row has merged cell
   *    Remove all the cells using columnInfo.cellStep[].from
   * else
   *    Increase colspan if one row had merged cell
   *    Add all new cells at columnInfo.cellStep[].from,
   *      if there is columnInfo.cellStep[].newCell use it
   *      else create an empty cell
   *
   * @param doc Current document
   */
  apply(doc: ProseMirrorNode<S>): StepResult<S> {
    const { tablePos } = this;
    // Create transform base on the doc
    const tr = new Transform(doc);

    if (this.sideEffectsHandler.table.handleAddTable(tr, this.isDelete)) {
      return StepResult.ok(tr.doc);
    }

    let tableRect: TableRect | undefined;
    try {
      tableRect = getTableRectFromDoc(doc, tablePos);
    } catch (e) {
      return StepResult.fail((e as Error).message);
    }

    const column = findColumn(this.columnInfo, tableRect);

    if (column === null) {
      return StepResult.fail(
        `No column for this cells "${printColumnInfo(
          this.columnInfo,
        )}" in table at position "${tablePos}".`,
      );
    }

    if (
      this.sideEffectsHandler.table.handleRemoveTable(
        tr,
        this.tablePos,
        tableRect,
        column,
        this.isDelete,
      )
    ) {
      return StepResult.ok(tr.doc);
    }

    this.columnInfo = this.applyCellSteps(tr, tableRect, column, this.isDelete);

    // Return the document modified.
    return StepResult.ok(tr.doc);
  }

  /**
   * Update tablePos with the new position. If tablePos doesnt exist any more remove the step
   * Update all the cellStep inside columnInfo. If cellStep.from position gets deleted removed it from column info
   * if cellStep.length === 0 remove the step
   * Create a new step with all the position updated
   * @param mapping
   */
  map(mapping: Mappable): Step<S> | null | undefined {
    const tablePosResult = mapping.mapResult(this.tablePos);
    if (tablePosResult.deleted) {
      // If table was deleted remove the step
      return null;
    }

    const cellSteps: CellStep[] = [];
    for (const oldCellStep of this.columnInfo.values()) {
      const fromResult = mapping.mapResult(oldCellStep.from);
      const toResult = mapping.mapResult(oldCellStep.to);
      if (fromResult.deleted && toResult.deleted) {
        continue;
      }
      const cellStep: CellStep = {
        ...oldCellStep,
        from: fromResult.pos,
        to: toResult.pos,
      };

      if (oldCellStep.mergeWith !== undefined) {
        cellStep.mergeWith = mapping.map(oldCellStep.mergeWith);
      }
      cellSteps.push(cellStep);
    }

    if (cellSteps.length === 0) {
      return null;
    }

    const sideEffects = this.sideEffectsHandler.map(mapping);

    return new AddColumnStep(
      tablePosResult.pos,
      { cells: cellSteps, sideEffects },
      this.isDelete,
    );
  }

  /**
   * if isDelete
   *    Get the original cell node at columnInfo.cellStep[].from to columnInfo.cellStep[].to
   *    Create a copy of the node
   *    Create a new cellStep with the same positions but with the clone node as a content
   *    return new step inverted
   * else
   *    Remove the content from each columnInfo.cellStep[].content
   *    return new step inverted
   * @param originalDoc
   */
  invert(originalDoc: ProseMirrorNode<S>): Step<S> {
    const stepMap = this.getMap();

    // Memoize function to be called only on delete scenarios
    const getTableRectAndColumn = getTableRectAndColumnFactory(
      originalDoc,
      this.tablePos,
      this.columnInfo,
    );
    // This is needed because the real pos of the cell in the generated document is affected by the previous operations.
    const newCellSteps: CellStep[] = Array.from(
      this.columnInfo.values(),
      (oldCellStep) => {
        const newCellStep = invertCellStep(
          originalDoc,
          getTableRectAndColumn,
          oldCellStep,
          this.isDelete,
          stepMap,
        );
        return newCellStep;
      },
    );

    const sideEffects = this.sideEffectsHandler.invert(
      originalDoc,
      this.isDelete,
      stepMap,
    );

    return new AddColumnStep(
      this.tablePos,
      { cells: newCellSteps, sideEffects },
      !this.isDelete,
    );
  }

  /**
   * StepMap is created based on columnInfo.
   * ColumnInfo is created on constructor and once is applied (the document could have new cells that weren't part of the original set)
   * if isDelete
   *    Create range array based on cell info where each range is [cellStep.from, cellStep.from - cellStep.to, 0]
   * else
   *    Create range array base on cell info where each range is [cellStep.from, 0, cellStep.content ? cellStep.content.nodeSize : defaultEmptyCellNodeSize]
   *
   * Ranges in ProseMirror are represented by each 3 elements in an array.
   * As [pos, currentSize, newSize, pos2, currentSize2, newSize2] where:
   * pos: Position in the document
   * currentSize: Represent the affected range, this will be pos + currentSize
   * newSize: Represent the new values, pos + newSize
   */
  getMap(): StepMap {
    const tableMap = this.sideEffectsHandler.getTableMap(this.isDelete);
    if (tableMap) {
      return tableMap;
    }

    let ranges: number[] = [];
    for (const cellStep of this.columnInfo.values()) {
      ranges.push(...getMapFromCellStep(cellStep, this.isDelete));
    }

    ranges = this.sideEffectsHandler.rows.addRowRanges(ranges, this.isDelete);

    // If no steps, I create am empty stepMap
    return new StepMap(ranges);
  }

  /**
   * Try to merge this step with another one, to be applied directly
   * after it. Returns the merged step when possible, null if the
   * steps can't be merged.
   */
  merge(other: Step<S>): Step<S> | null | undefined {
    // We cannot merge add column step at the moment
    return null;
  }

  /**
   * Create a JSON-serializeable representation of this step. When
   * defining this for a custom subclass, make sure the result object
   * includes the step type's [JSON id](#transform.Step^jsonID) under
   * the `stepType` property.
   */
  toJSON() {
    const addColumnStepJson: AddColumnStepJson = {
      stepType: ADD_COLUMN_STEP,
      tablePos: this.tablePos,
      cells: Array.from(this.columnInfo.values(), (cellStep) => {
        const cellStepJson: CellStepJson = {
          from: cellStep.from,
          to: cellStep.to,
        };

        if (cellStep.mergeWith !== undefined) {
          cellStepJson.mergeWith = cellStep.mergeWith;
        }

        if (cellStep.newCell !== undefined) {
          cellStepJson.newCell = cellStep.newCell.toJSON();
        }
        return cellStepJson;
      }),
      isDelete: this.isDelete,
    };

    const sideEffectsJSON = this.sideEffectsHandler.toJSON();
    if (sideEffectsJSON) {
      addColumnStepJson.sideEffects = sideEffectsJSON;
    }

    return addColumnStepJson;
  }

  /**
   * Deserialize a step from its JSON representation. Will call
   * through to the step class' own implementation of this method.
   */
  static fromJSON<S extends Schema = any>(
    schema: S,
    json: AddColumnStepJson,
  ): Step<S> {
    // TODO: Add validation. Return null if it is invalid. Check in review if this is necessary
    const cells = json.cells.map((cellsJson) => {
      const cell: CellStep = {
        ...cellsJson,
        newCell: cellsJson.newCell
          ? schema.nodeFromJSON(cellsJson.newCell)
          : undefined,
      };
      return cell;
    });

    let sideEffects: SideEffects | undefined;
    if (json.sideEffects) {
      sideEffects = SideEffectsHandler.fromJSON(schema, json.sideEffects);
    }

    return new AddColumnStep(
      json.tablePos,
      { cells, sideEffects },
      json.isDelete,
    );
  }

  static create(
    doc: ProseMirrorNode,
    tablePos: number,
    column: number,
    isDelete = false,
  ) {
    const tableRect = getTableRectFromDoc(doc, tablePos);

    // By default add column will rely on default behaviour (add empty cell).
    // There is no need to add content
    const cells: CellStep[] = [];
    const iter = cellsAtColumn(tableRect, column);
    let next = iter.next();
    while (!next.done) {
      const cell: Cell = next.value;
      cells.push(createCellStep(cell, column, isDelete));

      let skipRows = 0;
      if (cell.attrs && cell.attrs.rowspan) {
        skipRows = cell.attrs.rowspan - 1;
      }

      next = iter.next(skipRows);
    }

    return new AddColumnStep(tablePos, { cells }, isDelete);
  }

  private applyCellSteps(
    tr: Transform,
    tableRect: TableRect,
    column: number,
    isDelete: boolean,
  ) {
    const newColumnInfo: Map<number, CellStep> = new Map<number, CellStep>();
    const rowsHandler = this.sideEffectsHandler.rows.start(this.isDelete);

    const iter = cellsAtColumn(tableRect, column);
    let next = iter.next();
    // Iterate for all the cells in the current document
    while (!next.done) {
      const cell: Cell = next.value;

      const previousCellStep = this.columnInfo.get(cell.from);

      const newCellStep: CellStep = createCellStep(
        cell,
        column,
        isDelete,
        previousCellStep,
      );

      // If is the last cell in the row and doesnt have colspan I need to remove the whole row.
      const removeRowResult = rowsHandler.handle(
        tr,
        tableRect,
        cell.row,
        column,
        cell,
      );
      if (removeRowResult.handled) {
        next = iter.next(removeRowResult.skipRows);
        continue;
      }

      // Apply the step, to the pseudo document, get rows to skip, and the cellstep (might be modified, for example, a merge cell that remove the cell instead)
      const { skipRows, cellStep } = applyCellStep(
        tr,
        tableRect,
        cell,
        newCellStep,
        isDelete,
        column,
      );

      // Store the new cell step. This could be an existing one or a new cell.
      newColumnInfo.set(newCellStep.from, cellStep);
      next = iter.next(skipRows);
    }

    rowsHandler.end(tr, tableRect, column);
    return newColumnInfo;
  }
}

Step.jsonID(ADD_COLUMN_STEP, AddColumnStep);
