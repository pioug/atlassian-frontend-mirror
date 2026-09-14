import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

type BlockMenuApi = ExtractInjectionAPI<BlockMenuPlugin> | undefined;

type TransformedAttrs = {
	isEmptyLine?: boolean;
	isNested: boolean;
	isSuggested?: boolean;
	outputNodesCount: number;
	sourceNodes: readonly PMNode[];
	targetNodeType: string;
};

const sourceTypeName = (sourceNodes: readonly PMNode[]): string =>
	sourceNodes.length === 1 ? sourceNodes[0].type.name : 'multiple';

const sourceNodesCountByType = (sourceNodes: readonly PMNode[]): Record<string, number> => {
	const counts: Record<string, number> = {};
	for (const node of sourceNodes) {
		counts[node.type.name] = (counts[node.type.name] || 0) + 1;
	}
	return counts;
};

export const createTransformAnalytics = (
	api: BlockMenuApi,
	tr: Transaction,
	selection: Selection,
) => ({
	transformed: (
		duration: number,
		startTime: number,
		{
			isEmptyLine = false,
			isNested,
			isSuggested = false,
			outputNodesCount,
			sourceNodes,
			targetNodeType,
		}: TransformedAttrs,
	): void => {
		api?.analytics?.actions?.attachAnalyticsEvent({
			action: ACTION.TRANSFORMED,
			actionSubject: ACTION_SUBJECT.ELEMENT,
			attributes: {
				duration,
				isEmptyLine,
				isNested,
				isSuggested,
				outputNodesCount,
				sourceNodeType: sourceTypeName(sourceNodes),
				sourceNodesCount: sourceNodes.length,
				sourceNodesCountByType: sourceNodesCountByType(sourceNodes),
				startTime,
				targetNodeType,
				inputMethod: INPUT_METHOD.BLOCK_MENU,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);
	},

	errored: (error: unknown, sourceNodes: readonly PMNode[], to: string): void => {
		logException(error as Error, { location: 'editor-plugin-block-menu' });

		api?.analytics?.actions?.attachAnalyticsEvent({
			action: ACTION.ERRORED,
			actionSubject: ACTION_SUBJECT.ELEMENT,
			actionSubjectId: ACTION_SUBJECT_ID.TRANSFORM,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: {
				docSize: tr.doc.nodeSize,
				error: (error as Error).message,
				errorStack: (error as Error).stack,
				from: sourceTypeName(sourceNodes),
				inputMethod: INPUT_METHOD.BLOCK_MENU,
				selection: selection.toJSON(),
				to,
			},
		})(tr);
	},
});
