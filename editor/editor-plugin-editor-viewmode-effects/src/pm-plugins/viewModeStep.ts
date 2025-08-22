import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { Mappable } from '@atlaskit/editor-prosemirror/transform';
import {
	type AddMarkStep,
	type AddNodeMarkStep,
	ReplaceStep,
	Step,
	StepMap,
	StepResult,
} from '@atlaskit/editor-prosemirror/transform';

type ViewModeStepProps = {
	from: number;
	inverted?: boolean;
	mark?: Mark;
	to: number;
};

export class ViewModeStep extends Step {
	public readonly inverted: boolean;
	public readonly from: number;
	public readonly to: number;
	public readonly mark: Mark | undefined;

	private constructor({ inverted, from, to, mark }: ViewModeStepProps) {
		super();
		this.inverted = Boolean(inverted);
		this.from = from;
		this.to = to;
		this.mark = mark;
	}

	invert(doc: PMNode) {
		return new ViewModeStep({
			inverted: true,
			from: this.from,
			to: this.to,
			mark: this.mark,
		});
	}

	apply(doc: PMNode) {
		return StepResult.ok(doc);
	}

	merge(): null {
		return null;
	}

	map(mapping: Mappable): ViewModeStep | null {
		const mappedFrom = mapping.mapResult(this.from, 1);
		const mappedTo = mapping.mapResult(this.to, 1);

		if (mappedFrom.deleted || mappedTo.deleted) {
			return null;
		}

		return new ViewModeStep({
			inverted: this.inverted,
			from: mappedFrom.pos,
			to: mappedTo.pos,
		});
	}

	getMap() {
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

	static fromJSON() {
		// This is a "local custom step" once serialized
		// we need to transform it in a no-operation action
		return new ReplaceStep(0, 0, Slice.empty);
	}

	static from(step: AddMarkStep) {
		const { mark, from, to } = step;
		return new ViewModeStep({
			mark,
			from,
			to,
		});
	}
}

type ViewModeNodeStepProps = {
	inverted?: boolean;
	mark?: Mark;
	pos: number;
};

export class ViewModeNodeStep extends Step {
	public readonly inverted: boolean;
	public readonly pos: number;
	public readonly mark: Mark | undefined;

	private constructor({ inverted, pos, mark }: ViewModeNodeStepProps) {
		super();
		this.inverted = Boolean(inverted);
		this.pos = pos;
		this.mark = mark;
	}

	invert(doc: PMNode) {
		return new ViewModeNodeStep({
			inverted: true,
			pos: this.pos,
			mark: this.mark,
		});
	}

	apply(doc: PMNode) {
		return StepResult.ok(doc);
	}

	merge(): null {
		return null;
	}

	map(mapping: Mappable): ViewModeNodeStep | null {
		const mappedPos = mapping.mapResult(this.pos, 1);

		if (mappedPos.deleted) {
			return null;
		}

		return new ViewModeNodeStep({
			inverted: this.inverted,
			pos: mappedPos.pos,
		});
	}

	getMap() {
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

	static fromJSON() {
		// This is a "local custom step" once serialized
		// we need to transform it in a no-operation action

		return new ReplaceStep(0, 0, Slice.empty);
	}

	static from(step: AddNodeMarkStep) {
		const { mark, pos } = step;

		return new ViewModeNodeStep({
			mark,
			pos,
		});
	}
}
