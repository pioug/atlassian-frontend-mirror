import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	PUNC,
	SYMBOL,
} from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { InputRuleHandler, InputRuleWrapper } from '@atlaskit/editor-common/types';
import { createRule, inputRuleWithAnalytics } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { createPlugin } from '@atlaskit/prosemirror-input-rules';

/**
 * Creates an InputRuleHandler that will match on a regular expression of the
 * form `(prefix, content, suffix?)`, and replace it with some given text,
 * maintaining prefix and suffix around the replacement.
 *
 * @param text text to replace with
 */
function replaceTextUsingCaptureGroup(text: string): InputRuleHandler {
	return (state, match, start, end): Transaction => {
		const [, prefix, , suffix] = match;
		const replacement = text + (suffix || '');

		const {
			tr,
			selection: { $to },
		} = state;

		const startPos = start + (prefix || '').length;
		const safePos = Math.min(
			// I know it is almost impossible to have a negative value at this point.
			// But, this is JS #trustnoone
			Math.max(startPos, 0),
			end,
		);
		tr.replaceWith(safePos, end, state.schema.text(replacement, $to.marks()));
		tr.setSelection(Selection.near(tr.doc.resolve(tr.selection.to)));
		return tr;
	};
}

function createReplacementRule(to: string, from: RegExp): InputRuleWrapper {
	return createRule(from, replaceTextUsingCaptureGroup(to));
}

/**
 * Create replacement rules fiven a replacement map
 * @param replMap - Replacement map
 * @param trackingEventName - Analytics V2 tracking event name
 * @param replacementRuleWithAnalytics - Analytics GAS V3 middleware for replacement and rules.
 */
function createReplacementRules(
	replMap: { [replacement: string]: RegExp },
	replacementRuleWithAnalytics?: (
		replacement: string,
	) => (rule: InputRuleWrapper) => InputRuleWrapper,
): Array<InputRuleWrapper> {
	return Object.keys(replMap).map((replacement) => {
		const regex = replMap[replacement];
		const rule = createReplacementRule(replacement, regex);

		if (replacementRuleWithAnalytics) {
			return replacementRuleWithAnalytics(replacement)(rule);
		}

		return rule;
	});
}

// We don't agressively upgrade single quotes to smart quotes because
// they may clash with an emoji. Only do that when we have a matching
// single quote, or a contraction.
function createSingleQuotesRules(): Array<InputRuleWrapper> {
	return [
		// wrapped text
		// eslint-disable-next-line require-unicode-regexp
		createRule(/(\s|^)'(\S+.*\S+)'$/, (state, match, start, end): Transaction => {
			const OPEN_SMART_QUOTE_CHAR = '‘';
			const CLOSED_SMART_QUOTE_CHAR = '’';
			const [, spacing, innerContent] = match;
			// Edge case where match begins with some spacing. We need to add
			// it back to the document
			const openQuoteReplacement = spacing + OPEN_SMART_QUOTE_CHAR;
			// End is not always where the closed quote is, edge case exists
			// when there is spacing after the closed quote. We need to
			// determine position of closed quote from the start position.
			const positionOfClosedQuote = start + openQuoteReplacement.length + innerContent.length;
			return state.tr
				.insertText(CLOSED_SMART_QUOTE_CHAR, positionOfClosedQuote, end)
				.insertText(openQuoteReplacement, start, start + openQuoteReplacement.length);
		}),

		// apostrophe
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		createReplacementRule('’', /(\w+)(')(\w+)$/),
	];
}

/**
 * Get replacement rules related to product
 */
function getProductRules(
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Array<InputRuleWrapper> {
	const productRuleWithAnalytics = (product: string) =>
		inputRuleWithAnalytics(
			(_, match) => ({
				action: ACTION.SUBSTITUTED,
				actionSubject: ACTION_SUBJECT.TEXT,
				actionSubjectId: ACTION_SUBJECT_ID.PRODUCT_NAME,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					product,
					originalSpelling: match[2],
				},
			}),
			editorAnalyticsAPI,
		);

	return createReplacementRules(
		{
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			Atlassian: /(\s+|^)(atlassian)(\s)$/,
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			Jira: /(\s+|^)(jira|JIRA)(\s)$/,
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			Bitbucket: /(\s+|^)(bitbucket|BitBucket)(\s)$/,
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			Hipchat: /(\s+|^)(hipchat|HipChat)(\s)$/,
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			Trello: /(\s+|^)(trello)(\s)$/,
		},
		productRuleWithAnalytics,
	);
}

/**
 * Get replacement rules related to symbol
 */
function getSymbolRules(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) {
	const symbolToString: {
		[s: string]: SYMBOL.ARROW_RIGHT | SYMBOL.ARROW_LEFT | SYMBOL.ARROW_DOUBLE;
	} = {
		'→': SYMBOL.ARROW_RIGHT,
		'←': SYMBOL.ARROW_LEFT,
		'↔︎': SYMBOL.ARROW_DOUBLE,
	};

	const symbolRuleWithAnalytics = (symbol: string) =>
		inputRuleWithAnalytics(
			{
				action: ACTION.SUBSTITUTED,
				actionSubject: ACTION_SUBJECT.TEXT,
				actionSubjectId: ACTION_SUBJECT_ID.SYMBOL,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					symbol: symbolToString[symbol],
				},
			},
			editorAnalyticsAPI,
		);

	return createReplacementRules(
		{
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			'→': /(\s+|^)(--?>)(\s)$/,
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			'←': /(\s+|^)(<--?)(\s)$/,
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			'↔︎': /(\s+|^)(<->?)(\s)$/,
		},
		symbolRuleWithAnalytics,
	);
}

/**
 * Get replacement rules related to punctuation
 */
function getPunctuationRules(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) {
	const punctuationToString: {
		[s: string]: PUNC.DASH | PUNC.ELLIPSIS | PUNC.QUOTE_DOUBLE | PUNC.QUOTE_SINGLE;
	} = {
		'–': PUNC.DASH,
		'…': PUNC.ELLIPSIS,

		'”': PUNC.QUOTE_DOUBLE,
		[PUNC.QUOTE_SINGLE]: PUNC.QUOTE_SINGLE,
	};

	const punctuationRuleWithAnalytics = (punctuation: string) =>
		inputRuleWithAnalytics(
			{
				action: ACTION.SUBSTITUTED,
				actionSubject: ACTION_SUBJECT.TEXT,
				actionSubjectId: ACTION_SUBJECT_ID.PUNC,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					punctuation: punctuationToString[punctuation],
				},
			},
			editorAnalyticsAPI,
		);

	const dashEllipsisRules = createReplacementRules(
		{
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			'–': /(\s+|^)(--)(\s)$/,
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			'…': /()(\.\.\.)$/,
		},
		punctuationRuleWithAnalytics,
	);

	const doubleQuoteRules = createReplacementRules(
		{
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			'“': /((?:^|[\s\{\[\(\<'"\u2018\u201C]))(")$/,
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			'”': /"$/,
		},
		punctuationRuleWithAnalytics,
	);

	const singleQuoteRules = createSingleQuotesRules();

	return [
		...dashEllipsisRules,
		...doubleQuoteRules,
		...singleQuoteRules.map((rule) => punctuationRuleWithAnalytics(PUNC.QUOTE_SINGLE)(rule)),
	];
}

export default (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	new SafePlugin(
		createPlugin('text-formatting:smart-input', [
			...getProductRules(editorAnalyticsAPI),
			...getSymbolRules(editorAnalyticsAPI),
			...getPunctuationRules(editorAnalyticsAPI),
		]),
	);
