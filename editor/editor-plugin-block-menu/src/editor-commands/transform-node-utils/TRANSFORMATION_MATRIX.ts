import { flattenStep } from './flattenStep';
import { applyTargetTextTypeStep } from './steps/applyTargetTextTypeStep';
import { convertEachNodeStep } from './steps/convertEachNodeStep';
import { decisionListToListStep } from './steps/decisionListToListStep';
import { flattenListStep } from './steps/flattenListStep';
import { listToDecisionListStep } from './steps/listToDecisionListStep';
import { listToListStep } from './steps/listToListStep';
import { mergeNeighbourListsStep } from './steps/mergeNeighbourListsStep';
import { unwrapLayoutStep } from './steps/unwrapLayoutStep';
import { unwrapListStep } from './steps/unwrapListStep';
import { wrapBlockquoteToDecisionListStep } from './steps/wrapBlockquoteToDecisionListStep';
import { wrapMixedContentStep } from './steps/wrapMixedContentStep';
import type { NodeTypeName, TransformStep } from './types';
import { unwrapExpandStep } from './unwrapExpandStep';
import { unwrapStep } from './unwrapStep';
import { wrapIntoListStep } from './wrapIntoListStep';
import { wrapStep } from './wrapStep';

// Transform steps for all node type pairs.
// If a transformation is not defined (undefined), it is not available.
export const TRANSFORMATION_MATRIX: Record<
	NodeTypeName,
	Partial<Record<NodeTypeName, TransformStep[]>>
> = {
	paragraph: {
		heading: [flattenStep, applyTargetTextTypeStep],
		blockquote: [wrapMixedContentStep],
		codeBlock: [wrapMixedContentStep],
		expand: [wrapMixedContentStep],
		nestedExpand: [wrapMixedContentStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapMixedContentStep],
		bulletList: [wrapIntoListStep],
		orderedList: [wrapIntoListStep],
		taskList: [wrapIntoListStep],
		decisionList: [wrapIntoListStep],
	},
	heading: {
		heading: [flattenStep, applyTargetTextTypeStep],
		paragraph: [flattenStep, applyTargetTextTypeStep],
		blockquote: [wrapMixedContentStep],
		codeBlock: [wrapMixedContentStep],
		expand: [wrapMixedContentStep],
		nestedExpand: [wrapMixedContentStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapMixedContentStep],
		bulletList: [wrapIntoListStep],
		orderedList: [wrapIntoListStep],
		taskList: [wrapIntoListStep],
		decisionList: [wrapIntoListStep],
	},
	panel: {
		blockquote: [unwrapStep, wrapMixedContentStep],
		codeBlock: [unwrapStep, wrapMixedContentStep],
		expand: [unwrapStep, wrapStep],
		nestedExpand: [unwrapStep, wrapStep],
		layoutSection: [unwrapStep, wrapMixedContentStep],
		paragraph: [unwrapStep],
	},
	expand: {
		panel: [unwrapExpandStep, wrapMixedContentStep],
		blockquote: [unwrapExpandStep, wrapMixedContentStep],
		layoutSection: [unwrapExpandStep, wrapMixedContentStep],
		nestedExpand: [unwrapExpandStep, wrapStep],
		paragraph: [unwrapExpandStep],
	},
	nestedExpand: {
		panel: [unwrapExpandStep, wrapMixedContentStep],
		blockquote: [unwrapExpandStep, wrapMixedContentStep],
		layoutSection: [unwrapExpandStep, wrapMixedContentStep],
		paragraph: [unwrapExpandStep],
	},
	blockquote: {
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [unwrapStep, wrapStep],
		paragraph: [unwrapStep],
		decisionList: [unwrapStep, wrapBlockquoteToDecisionListStep],
	},
	layoutSection: {
		blockquote: [unwrapLayoutStep, wrapMixedContentStep],
		expand: [unwrapLayoutStep, wrapStep],
		nestedExpand: [unwrapLayoutStep, wrapStep],
		panel: [unwrapLayoutStep, wrapMixedContentStep],
		paragraph: [unwrapLayoutStep],
	},
	codeBlock: {
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		paragraph: [applyTargetTextTypeStep],
	},
	bulletList: {
		orderedList: [listToListStep],
		taskList: [listToListStep],
		decisionList: [flattenListStep, listToDecisionListStep],
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		paragraph: [flattenListStep, unwrapListStep, applyTargetTextTypeStep],
	},
	orderedList: {
		bulletList: [listToListStep],
		taskList: [listToListStep],
		decisionList: [flattenListStep, listToDecisionListStep],
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		paragraph: [flattenListStep, unwrapListStep, applyTargetTextTypeStep],
	},
	taskList: {
		bulletList: [listToListStep],
		orderedList: [listToListStep],
		decisionList: [flattenListStep, listToDecisionListStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		paragraph: [flattenListStep, unwrapListStep, applyTargetTextTypeStep],
	},
	table: {
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
	},
	mediaSingle: {
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		bulletList: [wrapIntoListStep],
		orderedList: [wrapIntoListStep],
	},
	mediaGroup: {
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
	},
	media: {
		blockquote: [wrapStep],
		codeBlock: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapStep],
		panel: [wrapStep],
		bulletList: [wrapIntoListStep],
		orderedList: [wrapIntoListStep],
		taskList: [wrapIntoListStep],
		decisionList: [wrapIntoListStep],
	},
	decisionList: {
		bulletList: [decisionListToListStep],
		orderedList: [decisionListToListStep],
		taskList: [decisionListToListStep],
		blockquote: [unwrapListStep, wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		paragraph: [flattenListStep, unwrapListStep, applyTargetTextTypeStep],
		heading: [flattenListStep, unwrapListStep, applyTargetTextTypeStep],
	},
	blockCard: {
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
	},
	embedCard: {
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
	},
	extension: {
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
	},
	bodiedExtension: {
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
	},
	multiBodiedExtension: {
		blockquote: [wrapStep],
		codeBlock: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapStep],
		panel: [wrapStep],
		bulletList: [wrapIntoListStep],
		orderedList: [wrapIntoListStep],
		taskList: [wrapIntoListStep],
		decisionList: [wrapIntoListStep],
	},
	multi: {
		blockquote: [wrapMixedContentStep],
		codeBlock: [wrapMixedContentStep],
		expand: [wrapMixedContentStep],
		nestedExpand: [wrapMixedContentStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapMixedContentStep],
		bulletList: [convertEachNodeStep, mergeNeighbourListsStep],
		orderedList: [convertEachNodeStep, mergeNeighbourListsStep],
		taskList: [convertEachNodeStep, mergeNeighbourListsStep],
		decisionList: [convertEachNodeStep, mergeNeighbourListsStep],
		paragraph: [convertEachNodeStep],
		heading: [applyTargetTextTypeStep],
	},
};
