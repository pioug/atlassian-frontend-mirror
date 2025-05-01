import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import { type BlockControlsPlugin } from '../../blockControlsPluginType';

export const attachMoveNodeAnalytics = (
	tr: Transaction,
	inputMethod: string,
	fromDepth: number,
	fromNodeType: string,
	toDepth?: number,
	toNodeType?: string,
	isSameParent?: boolean,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	fromNodeTypes?: string,
	hasSelectedMultipleNodes?: boolean,
) => {
	return api?.analytics?.actions?.attachAnalyticsEvent({
		eventType: EVENT_TYPE.TRACK,
		action: ACTION.MOVED,
		actionSubject: ACTION_SUBJECT.ELEMENT,
		actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
		attributes: {
			nodeDepth: fromDepth,
			nodeType: fromNodeType,
			nodeTypes: fromNodeTypes,
			hasSelectedMultipleNodes,
			destinationNodeDepth: toDepth,
			destinationNodeType: toNodeType,
			isSameParent: isSameParent,
			inputMethod,
		},
	})(tr);
};

export const fireInsertLayoutAnalytics = (
	tr: Transaction,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	nodeTypes?: string,
	hasSelectedMultipleNodes?: boolean,
	columnCount?: number,
) => {
	api?.analytics?.actions?.attachAnalyticsEvent({
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
		attributes: {
			inputMethod: INPUT_METHOD.DRAG_AND_DROP,
			nodeTypes,
			hasSelectedMultipleNodes,
			columnCount,
		},
		eventType: EVENT_TYPE.TRACK,
	})(tr);
};

/**
 * Given a range, return distinctive types of node and whether there are multiple nodes in the range
 */
export const getMultiSelectAnalyticsAttributes = (
	tr: Transaction,
	anchor: number,
	head: number,
) => {
	const nodeTypes: string[] = [];
	const from = Math.min(anchor, head);
	const to = Math.max(anchor, head);

	tr.doc.nodesBetween(from, to, (node, pos) => {
		if (pos < from) {
			// ignore parent node
			return true;
		}
		nodeTypes.push(node.type.name);

		// only care about the top level (relatively in the range) nodes
		return false;
	});

	return {
		nodeTypes: fg('platform_editor_track_node_types')
			? [...new Set(nodeTypes)].sort().join(',')
			: undefined,
		hasSelectedMultipleNodes: nodeTypes.length > 1,
	};
};
