import { closeHistory } from '@atlaskit/editor-prosemirror/history';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { canJoin, findWrapping } from '@atlaskit/editor-prosemirror/transform';

import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '../analytics';
import { JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST } from '../analytics';
import type { InputRuleHandler, InputRuleWrapper } from '../types';

type GetPayload =
	| AnalyticsEventPayload
	| ((state: EditorState, matchResult: RegExpExecArray) => AnalyticsEventPayload);

// Roughly based on atlassian-frontend/packages/editor/editor-core/src/utils/input-rules.ts but with the Editor Analytics API that's injected in plugins
export const inputRuleWithAnalytics = (
	getPayload: GetPayload,
	analyticsApi: EditorAnalyticsAPI | undefined,
) => {
	return (originalRule: InputRuleWrapper): InputRuleWrapper => {
		const onHandlerApply = (state: EditorState, tr: Transaction, matchResult: RegExpExecArray) => {
			const payload: AnalyticsEventPayload =
				typeof getPayload === 'function' ? getPayload(state, matchResult) : getPayload;
			if (payload && payload.attributes) {
				payload.attributes.formatSize =
					typeof matchResult[0] === 'string' ? matchResult[0].length : 0;
			}
			analyticsApi?.attachAnalyticsEvent(payload)(tr);

			if (originalRule.onHandlerApply) {
				originalRule.onHandlerApply(state, tr, matchResult);
			}
		};

		return {
			...originalRule,
			onHandlerApply,
		};
	};
};

type WrappingRuleProps = {
	match: RegExp;
	nodeType: NodeType;
	getAttrs?: Record<string, any> | ((matchResult: RegExpExecArray) => Record<string, any>);
	joinPredicate?: (
		matchResult: RegExpExecArray,
		node: PMNode,
		joinScenario: JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST,
	) => boolean;
};

export const createWrappingJoinRule = ({
	match,
	nodeType,
	getAttrs,
	joinPredicate,
}: WrappingRuleProps): InputRuleWrapper => {
	const handler: InputRuleHandler = (
		state: EditorState,
		match: RegExpExecArray,
		start: number,
		end: number,
	) => {
		const attrs = (getAttrs instanceof Function ? getAttrs(match) : getAttrs) || {};

		const tr = state.tr;
		const fixedStart = Math.max(start, 1);
		tr.delete(fixedStart, end);

		const $start = tr.doc.resolve(fixedStart);
		const range = $start.blockRange();
		const wrapping = range && findWrapping(range, nodeType, attrs);

		if (!wrapping || !range) {
			return null;
		}

		const parentNodePosMapped = tr.mapping.map(range.start);
		const parentNode = tr.doc.nodeAt(parentNodePosMapped);
		const lastWrap = wrapping[wrapping.length - 1];

		if (parentNode && lastWrap) {
			const allowedMarks = lastWrap.type.allowedMarks(parentNode.marks) || [];
			tr.setNodeMarkup(parentNodePosMapped, parentNode.type, parentNode.attrs, allowedMarks);
		}

		tr.wrap(range, wrapping);

		const before = tr.doc.resolve(fixedStart - 1).nodeBefore;

		if (
			before &&
			before.type === nodeType &&
			canJoin(tr.doc, fixedStart - 1) &&
			(!joinPredicate ||
				joinPredicate(
					match,
					before,
					JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST.JOINED_TO_LIST_ABOVE,
				))
		) {
			tr.join(fixedStart - 1);
		}

		return tr;
	};

	return createRule(match, handler);
};

export const createRule = (match: RegExp, handler: InputRuleHandler): InputRuleWrapper => {
	return {
		match,
		handler,
		onHandlerApply: (_state, tr) => {
			closeHistory(tr);
		},
	};
};
