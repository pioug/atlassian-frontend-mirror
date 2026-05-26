import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Step as ProseMirrorStep, AttrStep } from '@atlaskit/editor-prosemirror/transform';
type StepRange = {
	fromB: number;
	/** Whether the changed node is inline (true) or block (false/undefined) */
	isInline?: boolean;
	toB: number;
};

const filterUndefined = (x: StepRange | undefined): x is StepRange => !!x;

// Attributes that indicate a change in media image
const mediaAttrs = ['id', 'collection', 'url'];

// Attribute that indicates a date change
const dateAttrs = ['timestamp'];

// Attribute that indicates a task item state change
const taskItemAttrs = ['state'];

// Attributes excluded from extension change detection (not meaningful content changes)
const extensionExcludedAttrs = ['localId'];

// Extension node type names
const extensionNodeNames = ['extension', 'inlineExtension', 'bodiedExtension'];

const getStepAttrs = (step: ProseMirrorStep): string[] => {
	if (step instanceof AttrStep) {
		return [step.attr];
	}
	if (step instanceof SetAttrsStep && step.attrs) {
		return Object.keys(step.attrs);
	}
	return [];
};

export const getAttrChangeRanges = (doc: PMNode, steps: ProseMirrorStep[]): StepRange[] => {
	return steps
		.map((step) => {
			if (!(step instanceof AttrStep) && !(step instanceof SetAttrsStep)) {
				return undefined;
			}
			const stepAttrs = getStepAttrs(step);
			const $pos = doc.resolve(step.pos);
			const nodeAtPos = doc.nodeAt(step.pos);

			// date node: timestamp attribute change — highlight the date node itself (inline)
			if (stepAttrs.some((v) => dateAttrs.includes(v)) && nodeAtPos?.type.name === 'date') {
				return { fromB: step.pos, toB: step.pos + nodeAtPos.nodeSize, isInline: true };
			}

			// taskItem node: state attribute change — highlight the taskItem node
			if (
				stepAttrs.some((v) => taskItemAttrs.includes(v)) &&
				nodeAtPos?.type.name === 'taskItem'
			) {
				return { fromB: step.pos, toB: step.pos + nodeAtPos.nodeSize };
			}

			// extension nodes: any attribute change except localId — highlight the node
			if (
				nodeAtPos &&
				extensionNodeNames.includes(nodeAtPos.type.name) &&
				stepAttrs.some((v) => !extensionExcludedAttrs.includes(v))
			) {
				const isInline = nodeAtPos.type.name === 'inlineExtension';
				return { fromB: step.pos, toB: step.pos + nodeAtPos.nodeSize, isInline };
			}

			// media node: id/collection/url attribute change — highlight the mediaSingle parent
			if (
				stepAttrs.some((v) => mediaAttrs.includes(v)) &&
				$pos.parent.type === doc.type.schema.nodes.mediaSingle
			) {
				const startPos = $pos.pos + $pos.parentOffset;
				return { fromB: startPos, toB: startPos + $pos.parent.nodeSize - 1 };
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
	} catch {
		return false;
	}
};
