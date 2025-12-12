import { Step, StepResult, StepMap } from '@atlaskit/editor-prosemirror/transform';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { ADFEntity } from './types';

type Options = {
	inverted?: boolean;
	nextDocument: PMNode;
};

export const overrideDocumentStepType = 'override-document';

export class OverrideDocumentStep extends Step {
	public inverted = false;
	private nextDocument: PMNode;
	private oldDocumentSize: number = 0;

	constructor(opts: Options) {
		super();

		const { inverted, nextDocument } = opts;

		if (nextDocument.type.name !== 'doc') {
			throw new Error(
				'nextDocument should be the entire prosemirror doc node and not only its content.',
			);
		}

		this.nextDocument = nextDocument;
		this.inverted = Boolean(inverted);
	}

	apply(doc: PMNode): StepResult {
		this.oldDocumentSize = doc.content.size;

		return StepResult.ok(this.nextDocument);
	}

	map(): OverrideDocumentStep {
		return new OverrideDocumentStep({
			nextDocument: this.nextDocument,
			inverted: this.inverted,
		});
	}

	getMap(): StepMap {
		if (!this.nextDocument || !this.oldDocumentSize) {
			return new StepMap([0, 0, 0]);
		}

		const oldSize = this.oldDocumentSize;
		const nextDocumentSize = this.nextDocument.content.size;

		return new StepMap([0, oldSize, nextDocumentSize]);
	}

	invert(doc: PMNode): OverrideDocumentStep {
		return new OverrideDocumentStep({
			nextDocument: doc,
			inverted: true,
		});
	}

	toJSON(): OverrideDocumentStepJSON {
		return {
			stepType: overrideDocumentStepType,
			inverted: this.inverted,
			nextDocument: this.nextDocument.toJSON(),
		};
	}

	static fromJSON(schema: Schema, json: OverrideDocumentStepJSON): OverrideDocumentStep {
		if (!json || json.stepType !== overrideDocumentStepType) {
			throw new RangeError('Invalid overrideDocument step OverrideDocumentStep.fromJSON');
		}

		return new OverrideDocumentStep({
			inverted: json.inverted,
			nextDocument: schema.nodeFromJSON(json.nextDocument),
		});
	}
}

export type OverrideDocumentStepJSON = {
	inverted: boolean;
	nextDocument: ADFEntity;
	stepType: 'override-document';
};

Step.jsonID(overrideDocumentStepType, OverrideDocumentStep);
