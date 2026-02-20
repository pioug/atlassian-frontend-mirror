import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep, Step, StepMap, StepResult } from '@atlaskit/editor-prosemirror/transform';

export const insertTypeAheadStepType = 'atlaskit-insert-type-ahead';

export enum InsertTypeAheadStages {
	DELETING_RAW_QUERY = 'DELETING_RAW_QUERY',
	INSERTING_ITEM = 'INSERTING_ITEM',
}

type Config = {
	query: string;
	selectedIndex: number;
	stage: InsertTypeAheadStages;
	trigger: string;
};
export class InsertTypeAheadStep extends Step {
	private isInvertStep: boolean;
	selectedIndex: number;
	stage: InsertTypeAheadStages;
	query: string;
	trigger: string;

	constructor({ stage, query, trigger, selectedIndex }: Config, isInvertStep: boolean = false) {
		super();
		this.isInvertStep = isInvertStep;
		this.stage = stage;
		this.query = query;
		this.trigger = trigger;
		this.selectedIndex = selectedIndex;
	}

	invert(): InsertTypeAheadStep {
		const config = {
			stage: this.stage,
			query: this.query,
			trigger: this.trigger,
			selectedIndex: this.selectedIndex,
		};
		return new InsertTypeAheadStep(config, !this.isInvertStep);
	}

	apply(doc: PMNode): StepResult {
		return StepResult.ok(doc);
	}

	merge(): null {
		return null;
	}

	isInsertionStep(): boolean {
		return !this.isInvertStep;
	}

	isUndoingStep(): boolean {
		return this.isInvertStep;
	}

	map(): InsertTypeAheadStep {
		const config = {
			stage: this.stage,
			query: this.query,
			trigger: this.trigger,
			selectedIndex: this.selectedIndex,
		};
		// Return the same events, this step will never be removed
		return new InsertTypeAheadStep(config, this.isInvertStep);
	}

	getMap(): StepMap {
		return new StepMap([0, 0, 0]);
	}

	toJSON() {
		// When serialized we should create a noop Replace step
		return {
			stepType: 'replace',
			from: 0,
			to: 0,
		};
	}

	static fromJSON(): ReplaceStep {
		// This is a "local custom step" once serialized
		// we need to transform it in a no-operation action
		return new ReplaceStep(0, 0, Slice.empty);
	}
}

/** Register this step with Prosemirror */
Step.jsonID(insertTypeAheadStepType, InsertTypeAheadStep);
