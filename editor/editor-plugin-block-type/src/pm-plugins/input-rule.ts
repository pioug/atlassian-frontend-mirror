import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { insertBlock } from '@atlaskit/editor-common/commands';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	FeatureFlags,
	HeadingLevelsAndNormalText,
	InputRuleWrapper,
} from '@atlaskit/editor-common/types';
import { createRule, inputRuleWithAnalytics } from '@atlaskit/editor-common/utils';
import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { createPlugin, leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';

import { createJoinNodesRule, createWrappingTextBlockRule } from './utils';

const MAX_HEADING_LEVEL = 6;

function getHeadingLevel(match: string[]): {
	level: HeadingLevelsAndNormalText;
} {
	return {
		level: match[1].length as HeadingLevelsAndNormalText,
	};
}

function headingRule(nodeType: NodeType, maxLevel: number) {
	return createWrappingTextBlockRule({
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		match: new RegExp('^(#{1,' + maxLevel + '})\\s$'),
		nodeType,
		getAttrs: getHeadingLevel,
	});
}

function blockQuoteRule(nodeType: NodeType) {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return createJoinNodesRule(/^\s*>\s$/, nodeType) as InputRuleWrapper;
}

/**
 * Get heading rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */
function getHeadingRules(
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	schema: Schema,
): InputRuleWrapper[] {
	// '# ' for h1, '## ' for h2 and etc
	const hashRule = headingRule(schema.nodes.heading, MAX_HEADING_LEVEL);

	const leftNodeReplacementHashRule = createRule(
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		new RegExp(`${leafNodeReplacementCharacter}(#{1,6})\\s$`),
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/max-params
		(state, match, start, end) => {
			const level = match[1].length;
			return insertBlock(state, schema.nodes.heading, start, end, { level });
		},
	);

	// New analytics handler
	const ruleWithHeadingAnalytics = inputRuleWithAnalytics(
		(_state, matchResult: RegExpExecArray) => ({
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			eventType: EVENT_TYPE.TRACK,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
			attributes: {
				inputMethod: INPUT_METHOD.FORMATTING,
				newHeadingLevel: getHeadingLevel(matchResult).level,
			},
		}),
		editorAnalyticsAPI,
	);

	return [
		ruleWithHeadingAnalytics(hashRule),
		ruleWithHeadingAnalytics(leftNodeReplacementHashRule),
	];
}

/**
 * Get all block quote input rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */
function getBlockQuoteRules(
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	schema: Schema,
): InputRuleWrapper[] {
	// '> ' for blockquote
	const greatherThanRule = blockQuoteRule(schema.nodes.blockquote);

	const leftNodeReplacementGreatherRule = createRule(
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		new RegExp(`${leafNodeReplacementCharacter}\\s*>\\s$`),
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/max-params
		(state, _match, start, end) => {
			return insertBlock(state, schema.nodes.blockquote, start, end);
		},
	);

	// Analytics V3 handler
	const ruleWithBlockQuoteAnalytics = inputRuleWithAnalytics(
		{
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			eventType: EVENT_TYPE.TRACK,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
			attributes: {
				inputMethod: INPUT_METHOD.FORMATTING,
			},
		},
		editorAnalyticsAPI,
	);

	return [
		ruleWithBlockQuoteAnalytics(greatherThanRule),
		ruleWithBlockQuoteAnalytics(leftNodeReplacementGreatherRule),
	];
}

function inputRulePlugin(
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	schema: Schema,
	featureFlags: FeatureFlags,
): SafePlugin | undefined {
	const rules: Array<InputRuleWrapper> = [];

	if (schema.nodes.heading) {
		rules.push(...getHeadingRules(editorAnalyticsAPI, schema));
	}

	if (schema.nodes.blockquote) {
		rules.push(...getBlockQuoteRules(editorAnalyticsAPI, schema));
	}

	if (rules.length !== 0) {
		return new SafePlugin(
			createPlugin('block-type', rules, {
				isBlockNodeRule: true,
			}),
		);
	}

	return;
}

export default inputRulePlugin;
