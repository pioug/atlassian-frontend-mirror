import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Step as ProseMirrorStep, AttrStep } from '@atlaskit/editor-prosemirror/transform';

type StepRange = {
	fromB: number;
	toB: number;
};

const filterUndefined = (x: StepRange | undefined): x is StepRange => !!x;

// Currently allow attributes that indicats a change in media image
const allowedAttrs = ['id', 'collection', 'url'];

export const getAttrChangeRanges = (doc: PMNode, steps: ProseMirrorStep[]): StepRange[] => {
	return steps
		.map((step) => {
			if (
				(step instanceof AttrStep && allowedAttrs.includes(step.attr)) ||
				(step instanceof SetAttrsStep &&
					step.attrs &&
					[...Object.keys(step.attrs)].some((v) => allowedAttrs.includes(v)))
			) {
				const $pos = doc.resolve(step.pos);
				if ($pos.parent.type === doc.type.schema.nodes.mediaSingle) {
					const startPos = $pos.pos + $pos.parentOffset;
					return { fromB: startPos, toB: startPos + $pos.parent.nodeSize - 1 };
				}
			}
			return undefined;
		})
		.filter(filterUndefined);
};

/**
 * Check if the step was a valid attr change and affected the doc
 *
 * @param step Attr step to test
 * @param beforeDoc Doc before the step
 * @param afterDoc Doc after the step
 * @returns Boolean if the change should show a decoration
 */
export const stepIsValidAttrChange = (
	step: ProseMirrorStep,
	beforeDoc: PMNode,
	afterDoc: PMNode,
): boolean => {
	try {
		if (step instanceof AttrStep || step instanceof SetAttrsStep) {
			const attrStepAfter = afterDoc.nodeAt(step.pos);
			const attrStepBefore = beforeDoc.nodeAt(step.pos);
			// The change affected the document
			if (attrStepAfter && attrStepBefore && !attrStepAfter.eq(attrStepBefore)) {
				return true;
			}
		}
		return false;
	} catch (e) {
		return false;
	}
};
