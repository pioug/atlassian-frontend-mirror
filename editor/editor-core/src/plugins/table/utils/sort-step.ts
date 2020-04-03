import { Node as PMNode, Slice } from 'prosemirror-model';
import { Step, StepResult, StepMap, ReplaceStep } from 'prosemirror-transform';
import { TableColumnOrdering } from '../types';

export const tableSortingStepType = 'atlaskit-table-sorting-ordering';

export class TableSortStep extends Step {
  prev: TableColumnOrdering | undefined;
  next: TableColumnOrdering | undefined;
  pos: number;

  constructor(
    pos: number,
    prev?: TableColumnOrdering,
    next?: TableColumnOrdering,
  ) {
    super();
    this.prev = prev;
    this.next = next;
    this.pos = pos;
  }

  invert() {
    return new TableSortStep(this.pos, this.next, this.prev);
  }

  apply(doc: PMNode) {
    return StepResult.ok(doc);
  }

  map() {
    return null;
  }

  getMap() {
    return new StepMap([0, 0, 0]);
  }

  toJSON() {
    return {
      stepType: tableSortingStepType,
    };
  }

  static fromJSON() {
    return new ReplaceStep(0, 0, Slice.empty);
  }
}

/** Register this step with Prosemirror */
Step.jsonID(tableSortingStepType, TableSortStep);
