import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	ExtractInjectionAPI,
	InputRuleHandler,
	InputRuleWrapper,
} from '@atlaskit/editor-common/types';
import { createRule, inputRuleWithAnalytics } from '@atlaskit/editor-common/utils';
import type { MarkType, Schema } from '@atlaskit/editor-prosemirror/model';
import { createPlugin, leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { TextFormattingPlugin } from '../textFormattingPluginType';

enum ValidAutoformatChars {
	STRONG = '__',
	STRIKE = '~~',
	STRONG_MARKDOWN = '**',
	ITALIC_MARKDOWN = '*',
	ITALIC = '_',
	CODE = '`',
}

export const ValidCombinations: Record<ValidAutoformatChars, string[]> = {
	[ValidAutoformatChars.STRIKE]: [
		// e.g: _~~lol~~_
		ValidAutoformatChars.ITALIC,
		// e.g: __~~lol~~__
		ValidAutoformatChars.STRONG,
		// e.g: **~~lol~~**
		ValidAutoformatChars.STRONG_MARKDOWN,
		// e.g: *~~lol~~*
		ValidAutoformatChars.ITALIC_MARKDOWN,
	],
	[ValidAutoformatChars.STRONG]: [
		// e.g: ~~__lol__~~
		ValidAutoformatChars.STRIKE,
		// e.g: *__lol__*
		ValidAutoformatChars.ITALIC_MARKDOWN,
	],
	[ValidAutoformatChars.STRONG_MARKDOWN]: [
		// e.g: _**lol**_
		ValidAutoformatChars.ITALIC,
		// e.g: ~~**lol**~~
		ValidAutoformatChars.STRIKE,
	],
	[ValidAutoformatChars.ITALIC_MARKDOWN]: [
		// e.g: ~~*lol*~~
		ValidAutoformatChars.STRIKE,
		// e.g: __*lol*__
		ValidAutoformatChars.STRONG,
	],
	[ValidAutoformatChars.ITALIC]: [
		// e.g: ~~_lol_~~
		ValidAutoformatChars.STRIKE,
		// e.g: **_lol_**
		ValidAutoformatChars.STRONG_MARKDOWN,
	],
	[ValidAutoformatChars.CODE]: [
		// e.g: loko (`some code`
		'( ',
	],
};
function addMark(
	markType: MarkType,
	_schema: Schema,
	char: ValidAutoformatChars,
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): InputRuleHandler {
	return (state, _match, start, end) => {
		const { doc, schema, tr } = state;
		const textPrefix = state.doc.textBetween(start, start + char.length);

		// fixes the following case: my `*name` is *
		// expected result: should ignore special characters inside "code"
		if (textPrefix !== char || schema?.marks?.code?.isInSet(doc.resolve(start + 1).marks())) {
			if (!expValEquals('platform_editor_lovability_inline_code', 'isEnabled', true)) {
				return null;
			}
			// if the prefix is not a character but the suffix is, continue
			const suffix = state.doc.textBetween(end - char.length, end);
			if (suffix !== char) {
				return null;
			}
		}

		// Prevent autoformatting across hardbreaks
		let containsHardBreak: boolean | undefined;
		doc.nodesBetween(start, end, (node) => {
			if (node.type === schema.nodes.hardBreak) {
				containsHardBreak = true;
				return false;
			}
			return !containsHardBreak;
		});
		if (containsHardBreak) {
			return null;
		}

		// fixes autoformatting in heading nodes: # Heading *bold*
		// expected result: should not autoformat *bold*; <h1>Heading *bold*</h1>
		const startPosResolved = doc.resolve(start);
		const endPosResolved = doc.resolve(end);
		if (
			startPosResolved.sameParent(endPosResolved) &&
			!startPosResolved.parent.type.allowsMarkType(markType)
		) {
			return null;
		}

		if (markType.name === 'code') {
				api?.base?.actions?.resolveMarks(tr.mapping.map(start), tr.mapping.map(end), tr);
		}

		const mappedStart = tr.mapping.map(start);
		const mappedEnd = tr.mapping.map(end);

		tr.addMark(mappedStart, mappedEnd, markType.create());

		const textSuffix = tr.doc.textBetween(mappedEnd - char.length, mappedEnd);
		if (textSuffix === char) {
			tr.delete(mappedEnd - char.length, mappedEnd);
		}

		if (textPrefix === char) {
			tr.delete(mappedStart, mappedStart + char.length);
		}

		return tr.removeStoredMark(markType);
	};
}

class ReverseRegexExp extends RegExp {
	exec(str: string): RegExpExecArray | null {
		if (!str) {
			return null;
		}

		const reverseStr = [...str].reverse().join('');

		const result = super.exec(reverseStr);

		if (!result) {
			return null;
		}

		for (let i = 0; i < result.length; i++) {
			if (result[i] && typeof result[i] === 'string') {
				result[i] = [...result[i]].reverse().join('');
			}
		}

		if (result.input && typeof result.input === 'string') {
			result.input = [...result.input].reverse().join('');
		}

		if (result.input && result[0]) {
			result.index = result.input.length - result[0].length;
		}

		return result;
	}
}

const buildRegex = (char: ValidAutoformatChars) => {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const escapedChar = char.replace(/(\W)/g, '\\$1');
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const combinations = ValidCombinations[char].map((c) => c.replace(/(\W)/g, '\\$1')).join('|');

	// Single X - https://regex101.com/r/McT3yq/14/
	// Double X - https://regex101.com/r/pQUgjx/1/
	const baseRegex = '^X(?=[^X\\s]).*?[^\\sX]X(?=[\\sOBJECT_REPLACEMENT_CHARACTER]COMBINATIONS|$)'
		.replace('OBJECT_REPLACEMENT_CHARACTER', leafNodeReplacementCharacter)
		.replace('COMBINATIONS', combinations ? `|${combinations}` : '');

	const replacedRegex = String.prototype.hasOwnProperty('replaceAll')
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(baseRegex as any).replaceAll('X', escapedChar)
		: // Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			baseRegex.replace(/X/g, escapedChar);

	return new ReverseRegexExp(replacedRegex);
};

const buildRegexNew = (char: ValidAutoformatChars, allowsBackwardMatch: boolean = false) => {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const escapedChar = char.replace(/(\W)/g, '\\$1');
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const combinations = ValidCombinations[char].map((c) => c.replace(/(\W)/g, '\\$1')).join('|');

	// Single X - https://regex101.com/r/McT3yq/14/
	// Double X - https://regex101.com/r/pQUgjx/1/
	// if backwards matches are allowed, do not prefix the regex with an anchor (^)
	const maybeAnchor = allowsBackwardMatch ? '' : '^';
	const orCombinations = combinations ? `|${combinations}` : '';
	const baseRegex = `${maybeAnchor}X(?=[^X\\s]).*?[^\\sX]X(?=[\\s${leafNodeReplacementCharacter}]${orCombinations}|$)`;

	const replacedRegex = String.prototype.hasOwnProperty('replaceAll')
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(baseRegex as any).replaceAll('X', escapedChar)
		: // Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			baseRegex.replace(/X/g, escapedChar);

	return new ReverseRegexExp(replacedRegex);
};

export const strongRegex1 = buildRegex(ValidAutoformatChars.STRONG);
export const strongRegex2 = buildRegex(ValidAutoformatChars.STRONG_MARKDOWN);
export const italicRegex1 = buildRegex(ValidAutoformatChars.ITALIC);
export const italicRegex2 = buildRegex(ValidAutoformatChars.ITALIC_MARKDOWN);
export const strikeRegex = buildRegex(ValidAutoformatChars.STRIKE);
export const codeRegex = buildRegex(ValidAutoformatChars.CODE);
export const codeRegexWithBackwardMatch = buildRegexNew(ValidAutoformatChars.CODE, true);

/**
 * Create input rules for strong mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */
function getStrongInputRules(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): InputRuleWrapper[] {
	const ruleWithStrongAnalytics = inputRuleWithAnalytics(
		{
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				inputMethod: INPUT_METHOD.FORMATTING,
			},
		},
		editorAnalyticsAPI,
	);
	// **string** or __strong__ should bold the text
	const doubleUnderscoreRule = createRule(
		strongRegex1,
		addMark(schema.marks.strong, schema, ValidAutoformatChars.STRONG),
	);

	const doubleAsterixRule = createRule(
		strongRegex2,
		addMark(schema.marks.strong, schema, ValidAutoformatChars.STRONG_MARKDOWN),
	);

	return [
		ruleWithStrongAnalytics(doubleUnderscoreRule),
		ruleWithStrongAnalytics(doubleAsterixRule),
	];
}

/**
 * Create input rules for em mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */
function getItalicInputRules(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): InputRuleWrapper[] {
	const ruleWithItalicAnalytics = inputRuleWithAnalytics(
		{
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				inputMethod: INPUT_METHOD.FORMATTING,
			},
		},
		editorAnalyticsAPI,
	);

	const underscoreRule = createRule(
		italicRegex1,
		addMark(schema.marks.em, schema, ValidAutoformatChars.ITALIC),
	);

	const asterixRule = createRule(
		italicRegex2,
		addMark(schema.marks.em, schema, ValidAutoformatChars.ITALIC_MARKDOWN),
	);

	return [ruleWithItalicAnalytics(underscoreRule), ruleWithItalicAnalytics(asterixRule)];
}

/**
 * Create input rules for strike mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */
function getStrikeInputRules(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): InputRuleWrapper[] {
	const ruleWithStrikeAnalytics = inputRuleWithAnalytics(
		{
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRIKE,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				inputMethod: INPUT_METHOD.FORMATTING,
			},
		},
		editorAnalyticsAPI,
	);

	const doubleTildeRule = createRule(
		strikeRegex,
		addMark(schema.marks.strike, schema, ValidAutoformatChars.STRIKE),
	);

	return [ruleWithStrikeAnalytics(doubleTildeRule)];
}

/**
 * Create input rules for code mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */
function getCodeInputRules(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	api: ExtractInjectionAPI<TextFormattingPlugin> | undefined,
): InputRuleWrapper[] {
	const ruleWithCodeAnalytics = inputRuleWithAnalytics(
		{
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				inputMethod: INPUT_METHOD.FORMATTING,
			},
		},
		editorAnalyticsAPI,
	);

	const allowsBackwardMatch = expValEquals(
		'platform_editor_lovability_inline_code',
		'isEnabled',
		true,
	);
	const backTickRule = createRule(
		allowsBackwardMatch ? codeRegexWithBackwardMatch : codeRegex,
		addMark(schema.marks.code, schema, ValidAutoformatChars.CODE, api),
		allowsBackwardMatch,
	);

	return [ruleWithCodeAnalytics(backTickRule)];
}

export function inputRulePlugin(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	api: ExtractInjectionAPI<TextFormattingPlugin> | undefined,
): SafePlugin | undefined {
	const rules: Array<InputRuleWrapper> = [];

	if (schema.marks.strong) {
		rules.push(...getStrongInputRules(schema, editorAnalyticsAPI));
	}

	if (schema.marks.em) {
		rules.push(...getItalicInputRules(schema, editorAnalyticsAPI));
	}

	if (schema.marks.strike) {
		rules.push(...getStrikeInputRules(schema, editorAnalyticsAPI));
	}

	if (schema.marks.code) {
		rules.push(...getCodeInputRules(schema, editorAnalyticsAPI, api));
	}

	if (rules.length !== 0) {
		return new SafePlugin(createPlugin('text-formatting', rules));
	}
	return;
}

export default inputRulePlugin;
