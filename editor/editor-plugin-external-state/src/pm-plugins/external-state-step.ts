import { LocalOnlyStep } from '@atlaskit/editor-common/collab-local-only-step';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { StepResult } from '@atlaskit/editor-prosemirror/transform';
import { Step } from '@atlaskit/editor-prosemirror/transform-override';

import type { ExternalState, ExternalStateKey } from '../externalStatePluginType';

const externalStateStepType = 'atlaskit-external-state';

const pickValues = (state: ExternalState, keys: ExternalStateKey[]): Partial<ExternalState> => {
	const picked: Partial<ExternalState> = {};
	for (const key of keys) {
		Object.assign(picked, { [key]: state[key] });
	}
	return picked;
};

/**
 * Sets external state values in the local editor. It changes no document content and is never
 * sent to collaborators; it exists so a local change enters the undo history.
 *
 * Undo restores the values from just before the step was applied. Redo restores the values from
 * just before undo ran, so when a collaborator changes a value after this user's change, redo keeps
 * the collaborator's value.
 */
export class ExternalStateStep extends LocalOnlyStep {
	readonly values: Partial<ExternalState>;
	private readonly getCurrentState: () => ExternalState;
	private replacedValues: Partial<ExternalState> = {};

	constructor(values: Partial<ExternalState>, getCurrentState: () => ExternalState) {
		super();
		this.values = values;
		this.getCurrentState = getCurrentState;
	}

	/**
	 * Records the values this step replaces. ProseMirror applies a step when it's added to a
	 * transaction, before the transaction is dispatched, so the editor still holds those values.
	 */
	apply(doc: PMNode): StepResult {
		this.replacedValues = pickValues(
			this.getCurrentState(),
			Object.keys(this.values) as ExternalStateKey[],
		);
		return super.apply(doc);
	}

	invert(): ExternalStateStep {
		return new ExternalStateStep({ ...this.replacedValues }, this.getCurrentState);
	}

	toJSON(): { stepType: string } {
		return { stepType: externalStateStepType };
	}

	/** Never sent, so a received step is a no-op. */
	static fromJSON(): ReplaceStep {
		return new ReplaceStep(0, 0, Slice.empty);
	}
}

Step.jsonID(externalStateStepType, ExternalStateStep);
