import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import { SetAttrsStep } from '@atlaskit/adf-schema/steps/set-attrs';
import { getBaseNodeTypeName } from '@atlaskit/editor-common/utils/node-type-utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { AttrStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform-override';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getRequiredIncludedDiffableAttrs, isDiffableAttr } from './diffableAttrs';

export type InlineAttrChangeNodeName = 'date' | 'emoji' | 'mention' | 'status';

type AttrChangeStep = AttrStep | SetAttrsStep;

export type AttrStepContext = {
	attributionKey?: string;
	afterNode: PMNode | null;
	beforeNode: PMNode | null;
	finalPos: number;
	originalPos?: number;
	step: AttrChangeStep;
};

type StepRange = {
	/** Attribution key for the step that produced this range. */
	attributionKey?: string;
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

// Attr lists sourced from the shared `diffableAttrs` map (shared with the encoder).
const mediaAttrs = getRequiredIncludedDiffableAttrs('media');
const dateAttrs = getRequiredIncludedDiffableAttrs('date');
const taskItemAttrs = getRequiredIncludedDiffableAttrs('taskItem');
const panelAttrs = getRequiredIncludedDiffableAttrs('panel');
const emojiAttrs = getRequiredIncludedDiffableAttrs('emoji');
const mentionAttrs = getRequiredIncludedDiffableAttrs('mention');
const statusAttrs = getRequiredIncludedDiffableAttrs('status');

// Map of node type name → the attrs that represent a meaningful content change for that node
const inlineNodeAttrMap: Record<InlineAttrChangeNodeName, readonly string[]> = {
	date: dateAttrs,
	emoji: emojiAttrs,
	mention: mentionAttrs,
	status: statusAttrs,
};

export const isInlineAttrChangeNodeName = (
	nodeName: string,
): nodeName is InlineAttrChangeNodeName => nodeName in inlineNodeAttrMap;

// Extension node type names. Their "any attr except localId" exclude rule lives
// in the shared `diffableAttrs` map and is applied via `isDiffableAttr` below.
const extensionNodeNames = ['extension', 'inlineExtension', 'bodiedExtension'];

const transientExtensionAttrPaths = ['localId', 'parameters.macroParams._parentId'];

/**
 * Removes extension metadata that can change between document versions without changing the
 * extension's user-visible configuration.
 */
const getComparableExtensionAttrs = (node: PMNode): Record<string, unknown> =>
	omit(node.attrs, transientExtensionAttrPaths);

const haveSameRelevantExtensionAttrs = (beforeNode: PMNode, afterNode: PMNode): boolean =>
	isEqual(getComparableExtensionAttrs(beforeNode), getComparableExtensionAttrs(afterNode));

const getStepAttrs = (step: AttrChangeStep): string[] => {
	if (step instanceof AttrStep) {
		return [step.attr];
	}
	if (step.attrs) {
		return Object.keys(step.attrs);
	}
	return [];
};

export const getAttrChangeRanges = (
	doc: PMNode,
	attrStepContexts: AttrStepContext[],
	originalDoc: PMNode,
): StepRange[] => {
	return (
		attrStepContexts
			.map((attrStepContext): StepRange | undefined => {
				const { afterNode, attributionKey, beforeNode, finalPos, originalPos, step } =
					attrStepContext;
				if (!(step instanceof AttrStep) && !(step instanceof SetAttrsStep)) {
					return undefined;
				}
				const stepAttrs = getStepAttrs(step);
				// SetAttrsStep contains the complete replacement attrs, not only the attrs that changed.
				// Keep the legacy payload-based checks until the rollout gate is enabled, and fall back
				// to them if either step-time node is unavailable.
				const attrsToCheck =
					fg('platform_editor_reduce_diff_attr_sensitivity') && beforeNode && afterNode
						? stepAttrs.filter(
								(attrName) => !isEqual(beforeNode.attrs[attrName], afterNode.attrs[attrName]),
							)
						: stepAttrs;
				const $pos = doc.resolve(finalPos);
				const nodeAtPos = doc.nodeAt(finalPos);
				const originalNodeAtPos =
					originalPos === undefined ? null : originalDoc.nodeAt(originalPos);

				// The changeset path (createDecorationsForChange) handles the deletion widget via
				// prosemirror-changeset; we only need to add the inline insertion highlight here.
				if (nodeAtPos) {
					const nodeName = nodeAtPos.type.name;
					if (isInlineAttrChangeNodeName(nodeName)) {
						const watchedAttrs = inlineNodeAttrMap[nodeName];
						if (attrsToCheck.some((v) => watchedAttrs.includes(v))) {
							return {
								...(attributionKey ? { attributionKey } : {}),
								fromB: finalPos,
								toB: finalPos + nodeAtPos.nodeSize,
								isInline: true,
								inlineNodeName: nodeName,
								...(originalPos !== undefined &&
									originalNodeAtPos && {
										fromA: originalPos,
										toA: originalPos + originalNodeAtPos.nodeSize,
									}),
							};
						}
					}
				}

				// taskItem node: state attribute change — highlight the taskItem node
				if (
					attrsToCheck.some((v) => taskItemAttrs.includes(v)) &&
					nodeAtPos?.type.name === 'taskItem'
				) {
					return {
						...(attributionKey ? { attributionKey } : {}),
						fromB: finalPos,
						toB: finalPos + nodeAtPos.nodeSize,
					};
				}

				// panel node (incl. variants like panel_c1): type/colour/icon attribute change
				// (e.g. note -> warning) — highlight the new panel and, when the original node
				// is resolvable, expose its range (fromA/toA) so the caller can render the old
				// panel as a "deleted" widget for a before/after comparison.
				if (
					attrsToCheck.some((v) => panelAttrs.includes(v)) &&
					nodeAtPos &&
					getBaseNodeTypeName(nodeAtPos.type) === 'panel'
				) {
					return {
						...(attributionKey ? { attributionKey } : {}),
						fromB: finalPos,
						toB: finalPos + nodeAtPos.nodeSize,
						...(originalPos !== undefined &&
							originalNodeAtPos && {
								fromA: originalPos,
								toA: originalPos + originalNodeAtPos.nodeSize,
							}),
					};
				}

				// Extension nodes: highlight changes to user-visible configuration. When enabled,
				// transient extension metadata is ignored by the comparison below.
				if (
					nodeAtPos &&
					extensionNodeNames.includes(nodeAtPos.type.name) &&
					attrsToCheck.some((v) => isDiffableAttr(nodeAtPos.type.name, v))
				) {
					if (
						fg('platform_editor_reduce_diff_attr_sensitivity') &&
						beforeNode &&
						afterNode &&
						beforeNode.type === afterNode.type &&
						haveSameRelevantExtensionAttrs(beforeNode, afterNode)
					) {
						return undefined;
					}

					const isInline = nodeAtPos.type.name === 'inlineExtension';
					return {
						...(attributionKey ? { attributionKey } : {}),
						fromB: finalPos,
						toB: finalPos + nodeAtPos.nodeSize,
						isInline,
					};
				}

				// media node: id/collection/url attribute change — highlight the mediaSingle parent
				if (
					attrsToCheck.some((v) => mediaAttrs.includes(v)) &&
					$pos.parent.type === doc.type.schema.nodes.mediaSingle
				) {
					const startPos = $pos.pos + $pos.parentOffset;
					return {
						...(attributionKey ? { attributionKey } : {}),
						fromB: startPos,
						toB: startPos + $pos.parent.nodeSize - 1,
					};
				}

				return undefined;
			})
			.filter(filterUndefined)
			// Deduplicate by node position: multiple AttrSteps on the same node
			// (e.g. setNodeAttribute(pos, 'text', ...) + setNodeAttribute(pos, 'color', ...))
			// should produce only one decoration, not one per step.
			.filter((range, i, arr) => arr.findIndex((r) => r.fromB === range.fromB) === i)
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
): step is AttrChangeStep => {
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
