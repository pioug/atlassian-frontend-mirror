import { applyTargetTextTypeStep } from './steps/applyTargetTextTypeStep';
import { convertEachNodeStep } from './steps/convertEachNodeStep';
import { decisionListToListStep } from './steps/decisionListToListStep';
import { flattenListStep } from './steps/flattenListStep';
import { flattenStep } from './steps/flattenStep';
import { listToDecisionListStep } from './steps/listToDecisionListStep';
import { listToListStep } from './steps/listToListStep';
import { mergeNeighbourListsStep } from './steps/mergeNeighbourListsStep';
import { unwrapExpandStep } from './steps/unwrapExpandStep';
import { unwrapLayoutStep } from './steps/unwrapLayoutStep';
import { unwrapListStep } from './steps/unwrapListStep';
import { unwrapStep } from './steps/unwrapStep';
import { wrapBlockquoteToDecisionListStep } from './steps/wrapBlockquoteToDecisionListStep';
import { wrapIntoListStep } from './steps/wrapIntoListStep';
import { wrapMixedContentStep } from './steps/wrapMixedContentStep';
import { wrapStep } from './steps/wrapStep';
import type { NodeTypeName, TransformStep } from './types';

type TransformationMatrix = Record<NodeTypeName, Partial<Record<NodeTypeName, TransformStep[]>>>;

/**
 * Creates the transformation matrix for all node type pairs.
 * When includePanelC1 is true (platform_editor_nest_table_in_panel experiment on),
 * panel_c1 entries are included as both source and target types.
 * If a transformation is not defined (undefined), it is not available.
 */
const createTransformationMatrix = (includePanelC1: boolean): TransformationMatrix => ({
	paragraph: {
		heading: [flattenStep, applyTargetTextTypeStep],
		blockquote: [wrapMixedContentStep],
		codeBlock: [wrapMixedContentStep],
		expand: [wrapMixedContentStep],
		nestedExpand: [wrapMixedContentStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapMixedContentStep],
		...(includePanelC1 ? { panel_c1: [wrapMixedContentStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapMixedContentStep] } : {}),
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
	panel_c1: includePanelC1
		? {
				blockquote: [unwrapStep, wrapMixedContentStep],
				codeBlock: [unwrapStep, wrapMixedContentStep],
				expand: [unwrapStep, wrapStep],
				nestedExpand: [unwrapStep, wrapStep],
				layoutSection: [unwrapStep, wrapMixedContentStep],
				paragraph: [unwrapStep],
			}
		: {},
	expand: {
		panel: [unwrapExpandStep, wrapMixedContentStep],
		...(includePanelC1 ? { panel_c1: [unwrapExpandStep, wrapMixedContentStep] } : {}),
		blockquote: [unwrapExpandStep, wrapMixedContentStep],
		layoutSection: [unwrapExpandStep, wrapMixedContentStep],
		nestedExpand: [unwrapExpandStep, wrapStep],
		paragraph: [unwrapExpandStep],
	},
	nestedExpand: {
		panel: [unwrapExpandStep, wrapMixedContentStep],
		...(includePanelC1 ? { panel_c1: [unwrapExpandStep, wrapMixedContentStep] } : {}),
		blockquote: [unwrapExpandStep, wrapMixedContentStep],
		layoutSection: [unwrapExpandStep, wrapMixedContentStep],
		paragraph: [unwrapExpandStep],
	},
	blockquote: {
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [unwrapStep, wrapStep],
		...(includePanelC1 ? { panel_c1: [unwrapStep, wrapStep] } : {}),
		paragraph: [unwrapStep],
		decisionList: [unwrapStep, wrapBlockquoteToDecisionListStep],
	},
	layoutSection: {
		blockquote: [unwrapLayoutStep, wrapMixedContentStep],
		expand: [unwrapLayoutStep, wrapStep],
		nestedExpand: [unwrapLayoutStep, wrapStep],
		panel: [unwrapLayoutStep, wrapMixedContentStep],
		...(includePanelC1 ? { panel_c1: [unwrapLayoutStep, wrapMixedContentStep] } : {}),
		paragraph: [unwrapLayoutStep],
	},
	codeBlock: {
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
		bulletList: [wrapIntoListStep],
		orderedList: [wrapIntoListStep],
	},
	mediaGroup: {
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
	},
	media: {
		blockquote: [wrapStep],
		codeBlock: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapStep],
		panel: [wrapStep],
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
		paragraph: [flattenListStep, unwrapListStep, applyTargetTextTypeStep],
		heading: [flattenListStep, unwrapListStep, applyTargetTextTypeStep],
	},
	blockCard: {
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapMixedContentStep],
		panel: [wrapStep],
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapStep] } : {}),
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
		...(includePanelC1 ? { panel_c1: [wrapMixedContentStep] } : {}),
		bulletList: [convertEachNodeStep, mergeNeighbourListsStep],
		orderedList: [convertEachNodeStep, mergeNeighbourListsStep],
		taskList: [convertEachNodeStep, mergeNeighbourListsStep],
		decisionList: [convertEachNodeStep, mergeNeighbourListsStep],
		paragraph: [convertEachNodeStep],
		heading: [applyTargetTextTypeStep],
	},
});

export const TRANSFORMATION_MATRIX: TransformationMatrix = createTransformationMatrix(false);
export const TRANSFORMATION_MATRIX_PANEL_C1: TransformationMatrix =
	createTransformationMatrix(true);
