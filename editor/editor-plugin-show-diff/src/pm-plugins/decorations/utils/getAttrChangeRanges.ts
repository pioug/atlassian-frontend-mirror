import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Step as ProseMirrorStep, AttrStep } from '@atlaskit/editor-prosemirror/transform';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export type InlineAttrChangeNodeName = 'date' | 'emoji' | 'mention' | 'status';

type StepRange = {
	/**
	 * Position of the original (before) node in the original doc.
	 * Populated for inline attr changes (e.g. emoji, date) so the caller can
	 * render the old node as a "deleted" widget alongside the new highlighted node.
	 */
	fromA?: number;
	fromB: number;
	/** Inline node type, used by callers that need node-view-specific styling. */
	inlineNodeName?: InlineAttrChangeNodeName;
	/** Whether the changed node is inline (true) or block (false/undefined) */
	isInline?: boolean;
	toA?: number;
	toB: number;
};

const filterUndefined = (x: StepRange | undefined): x is StepRange => !!x;

// Attributes that indicate a change in media image
const mediaAttrs = ['id', 'collection', 'url'];

// Attribute that indicates a date change
const dateAttrs = ['timestamp'];

// Attribute that indicates a task item state change
const taskItemAttrs = ['state'];

// Attributes that indicate an emoji change
const emojiAttrs = ['shortName', 'id', 'text'];

// Attributes that indicate a mention change (who is mentioned)
const mentionAttrs = ['id', 'text'];

// Attributes that indicate a status change (label or colour)
const statusAttrs = ['text', 'color'];

// Map of node type name → the attrs that represent a meaningful content change for that node
const inlineNodeAttrMap: Record<InlineAttrChangeNodeName, string[]> = {
	date: dateAttrs,
	emoji: emojiAttrs,
	mention: mentionAttrs,
	status: statusAttrs,
};

const isInlineAttrChangeNodeName = (nodeName: string): nodeName is InlineAttrChangeNodeName =>
	nodeName in inlineNodeAttrMap;

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

export const getAttrChangeRanges = (
	doc: PMNode,
	steps: ProseMirrorStep[],
	originalDoc: PMNode,
): StepRange[] => {
	return (
		steps
			.map((step): StepRange | undefined => {
				if (!(step instanceof AttrStep) && !(step instanceof SetAttrsStep)) {
					return undefined;
				}
				const stepAttrs = getStepAttrs(step);
				const $pos = doc.resolve(step.pos);
				const nodeAtPos = doc.nodeAt(step.pos);

				// date node: timestamp attribute change — highlight the date node itself (inline)
				if (
					stepAttrs.some((v) => dateAttrs.includes(v)) &&
					nodeAtPos?.type.name === 'date' &&
					!expValEquals('platform_editor_improve_inline_diffs', 'isEnabled', true)
				) {
					return {
						fromB: step.pos,
						toB: step.pos + nodeAtPos.nodeSize,
						isInline: true,
						inlineNodeName: 'date',
					};
				}

				// The following inline node attr changes are gated behind platform_editor_improve_inline_diffs.
				// The changeset path (createDecorationsForChange) handles the deletion widget via
				// prosemirror-changeset; we only need to add the inline insertion highlight here.
				if (expValEquals('platform_editor_improve_inline_diffs', 'isEnabled', true) && nodeAtPos) {
					const nodeName = nodeAtPos.type.name;
					if (isInlineAttrChangeNodeName(nodeName)) {
						const watchedAttrs = inlineNodeAttrMap[nodeName];
						if (stepAttrs.some((v) => watchedAttrs.includes(v))) {
							const originalNodeAtPos = originalDoc?.nodeAt(step.pos);
							return {
								fromB: step.pos,
								toB: step.pos + nodeAtPos.nodeSize,
								isInline: true,
								inlineNodeName: nodeName,
								...(originalNodeAtPos && {
									fromA: step.pos,
									toA: step.pos + originalNodeAtPos.nodeSize,
								}),
							};
						}
					}
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
			.filter(filterUndefined)
			// Deduplicate by node position: multiple AttrSteps on the same node
			// (e.g. setNodeAttribute(pos, 'text', ...) + setNodeAttribute(pos, 'color', ...))
			// should produce only one decoration, not one per step.
			// Gated behind the same experiment as the inline node attr changes that introduced
			// the possibility of multiple ranges for the same node position.
			.filter(
				(range, i, arr) =>
					!expValEquals('platform_editor_improve_inline_diffs', 'isEnabled', true) ||
					arr.findIndex((r) => r.fromB === range.fromB) === i,
			)
	);
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
