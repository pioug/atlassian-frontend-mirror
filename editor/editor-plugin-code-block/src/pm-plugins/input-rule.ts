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
import type { InputRuleWrapper } from '@atlaskit/editor-common/types';
import { createRule, inputRuleWithAnalytics } from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { createPlugin, leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';

import { isConvertableToCodeBlock, transformToCodeBlockAction } from '../transform-to-code-block';

export function createCodeBlockInputRule(
	schema: Schema,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	isNestingInQuoteSupported?: boolean,
) {
	const rules: Array<InputRuleWrapper> = getCodeBlockRules(
		editorAnalyticsAPI,
		schema,
		isNestingInQuoteSupported,
	);
	return new SafePlugin(
		createPlugin('code-block-input-rule', rules, {
			isBlockNodeRule: true,
		}),
	);
}

/**
 * Get all code block input rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */
function getCodeBlockRules(
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	schema: Schema,
	isNestingInQuoteSupported?: boolean,
): InputRuleWrapper[] {
	const ruleAnalytics = inputRuleWithAnalytics(
		{
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
			attributes: { inputMethod: INPUT_METHOD.FORMATTING },
			eventType: EVENT_TYPE.TRACK,
		},
		editorAnalyticsAPI,
	);

	const validMatchLength = (match: RegExpExecArray) => match.length > 0 && match[0].length === 3;

	const threeTildeRule = createRule(/(?!\s)(`{3,})$/, (state, match, start, end) => {
		if (!validMatchLength(match)) {
			return null;
		}

		const attributes: any = {};
		if (match[4]) {
			attributes.language = match[4];
		}

		if (isConvertableToCodeBlock(state)) {
			return transformToCodeBlockAction(state, start, attributes, isNestingInQuoteSupported);
		}

		const tr = state.tr;
		tr.delete(start, end);
		const codeBlock = tr.doc.type.schema.nodes.codeBlock.createChecked();
		safeInsert(codeBlock)(tr);

		return tr;
	});

	const leftNodeReplacementThreeTildeRule = createRule(
		new RegExp(`((${leafNodeReplacementCharacter}\`{3,})|^\\s(\`{3,}))(\\S*)$`),
		(state, match, start, end) => {
			if (!validMatchLength(match)) {
				return null;
			}

			const attributes: any = {};
			if (match[4]) {
				attributes.language = match[4];
			}
			const inlineStart = Math.max(match.index + state.selection.$from.start(), 1);
			return insertBlock(state, schema.nodes.codeBlock, inlineStart, end, attributes);
		},
	);

	return [ruleAnalytics(threeTildeRule), ruleAnalytics(leftNodeReplacementThreeTildeRule)];
}
