import { BatchAttrsStep } from '@atlaskit/adf-schema/steps';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { AttrStep, type Step } from '@atlaskit/editor-prosemirror/transform';

import { ActionType, type AttrChangeAction } from '../types';

export const checkTableColumnResized = (tr: ReadonlyTransaction): AttrChangeAction | undefined => {
	const COL_WIDTH_ATTR = 'colwidth';
	const steps = tr.steps;

	// Find the step that is changing the column width
	const resizingColumnStep = steps.find(
		(step: Step) => step instanceof AttrStep || step instanceof BatchAttrsStep,
	);

	if (!resizingColumnStep) {
		return undefined;
	}

	let pos: number | undefined;

	// Find the position of the first column in the step that is being resized
	if (resizingColumnStep instanceof BatchAttrsStep) {
		if (resizingColumnStep.data.length === 0) {
			return undefined;
		}
		const { attrs, nodeType, position } = resizingColumnStep.data[0];
		if (['tableHeader', 'tableCell'].includes(nodeType) && attrs?.[COL_WIDTH_ATTR]) {
			pos = position;
		}
	} else if (resizingColumnStep instanceof AttrStep && resizingColumnStep.attr === COL_WIDTH_ATTR) {
		pos = resizingColumnStep.pos;
	}

	if (!pos) {
		return undefined;
	}

	// Find the range of the table that is being resized
	const $pos = tr.doc.resolve(pos);
	const blockRange = $pos.blockRange();

	if (!blockRange) {
		return undefined;
	}

	const from = blockRange.start;
	const to = from + blockRange.parent.content.size;

	// Use to and from position of table to check whether column width of same table is being resized
	return { type: ActionType.CHANGING_ATTRS, extraData: { attr: COL_WIDTH_ATTR, from, to } };
};
