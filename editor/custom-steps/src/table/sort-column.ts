import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep, Step, StepMap, StepResult } from '@atlaskit/editor-prosemirror/transform';

import type { TableColumnOrdering } from './types';

export const tableSortingStepType = 'atlaskit-table-sorting-ordering';

export class TableSortStep extends Step {
	prev: TableColumnOrdering | undefined;
	next: TableColumnOrdering | undefined;
	pos: number;

	constructor(pos: number, prev?: TableColumnOrdering, next?: TableColumnOrdering) {
		super();
		this.prev = prev;
		this.next = next;
		this.pos = pos;
	}

	invert(): TableSortStep {
		return new TableSortStep(this.pos, this.next, this.prev);
	}

	apply(doc: PMNode): StepResult {
		return StepResult.ok(doc);
	}

	map(): null {
		return null;
	}

	getMap(): StepMap {
		return new StepMap([0, 0, 0]);
	}

	toJSON(): {
		stepType: string;
	} {
		return {
			stepType: tableSortingStepType,
		};
	}

	static fromJSON(): ReplaceStep {
		return new ReplaceStep(0, 0, Slice.empty);
	}
}

/** Register this step with Prosemirror */
Step.jsonID(tableSortingStepType, TableSortStep);
