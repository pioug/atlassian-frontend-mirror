import { BatchAttrsStep } from '@atlaskit/adf-schema/steps';
import { type ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import {
	AddMarkStep,
	AttrStep,
	RemoveMarkStep,
	ReplaceAroundStep,
	ReplaceStep,
	type Step,
} from '@atlaskit/editor-prosemirror/transform';

export const isTrWithDocChanges = (tr: ReadonlyTransaction): boolean =>
	tr.steps.length > 0 &&
	tr.steps?.some(
		(step: Step) =>
			step instanceof ReplaceStep ||
			step instanceof ReplaceAroundStep ||
			step instanceof AddMarkStep ||
			step instanceof AttrStep ||
			step instanceof RemoveMarkStep ||
			step instanceof BatchAttrsStep,
	);
