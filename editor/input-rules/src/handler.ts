import type { EditorState, PluginKey, Transaction } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	leafNodeReplacementCharacter,
	MAX_REGEX_MATCH,
	TEXT_INPUT_RULE_TRANSACTION_KEY,
	TYPEAHEAD_TRIGGERS,
} from './constants';
import { isGapCursorSelection } from './editor-common';
import type { InputRuleWrapper } from './editor-common';
import type {
	HandleInputEvent,
	InputRulePluginState,
	MatchedRule,
	OnBeforeRegexMatch,
	OnInputEvent,
} from './types';

type Options = {
	allowInsertTextOnDocument: boolean;
	onBeforeRegexMatch?: OnBeforeRegexMatch;
	onInputEvent?: OnInputEvent;
	pluginKey: PluginKey;
	rules: InputRuleWrapper[];
};

export const createInputEventHandler =
	({
		rules,
		pluginKey,
		allowInsertTextOnDocument,
		onInputEvent,
		onBeforeRegexMatch,
	}: Options): HandleInputEvent =>
	({ view, from, to, text }) => {
		if (view.composing) {
			return false;
		}

		const state = view.state;
		const $from = state.doc.resolve(from);

		if ($from.parent.type.spec.code) {
			return false;
		}
		if (onInputEvent && !onInputEvent({ state, from, to })) {
			return false;
		}

		const textBefore =
			$from.parent.textBetween(
				Math.max(0, $from.parentOffset - MAX_REGEX_MATCH),
				$from.parentOffset,
				undefined,
				leafNodeReplacementCharacter,
			) + text;

		let result = findMatchOnRules({
			rules,
			textToMatch: textBefore,
			from,
			to,
			state,
		});

		let isBackwardMatch;
		if (!result && expValEquals('platform_editor_lovability_inline_code', 'isEnabled', true)) {
			if (TYPEAHEAD_TRIGGERS.includes(text)) {
				return false;
			}

			const textAfter =
				text +
				$from.parent.textBetween(
					$from.parentOffset,
					Math.min($from.parent.content.size, $from.parentOffset + MAX_REGEX_MATCH),
					undefined,
					leafNodeReplacementCharacter,
				);

			isBackwardMatch = true;
			result = findMatchOnRules({
				rules,
				textToMatch: textAfter,
				from,
				to,
				state,
				isBackwardMatch,
			});

			if (!result) {
				return false;
			}
		}

		if (!result) {
			return false;
		}

		const tr = allowInsertTextOnDocument ? state.tr.insertText(text, from, to) : state.tr;
		tr.setMeta(TEXT_INPUT_RULE_TRANSACTION_KEY, true);
		tr.setMeta(pluginKey, {
			textInserted: text,
			from: result.from,
			to: result.to,
			matchedRule: result.matchedRule,
			isBackwardMatch: isBackwardMatch,
		} as InputRulePluginState);

		if (onBeforeRegexMatch) {
			onBeforeRegexMatch(tr);
		}

		view.dispatch(tr);
		return true;
	};

type FindMatchOnRulesProps = {
	from: number;
	isBackwardMatch?: boolean;
	rules: InputRuleWrapper[];
	state: EditorState;
	textToMatch: string;
	to: number;
};
type RuleMatchedResult = {
	from: number;
	matchedRule: MatchedRule;
	to: number;
};
function findMatchOnRules({
	rules,
	textToMatch,
	from,
	to,
	state,
	isBackwardMatch,
}: FindMatchOnRulesProps): RuleMatchedResult | null {
	for (let i = 0; i < rules.length; i++) {
		const rule = rules[i];

		// Some plugins like Typeahead require a whitespace before a trigger character.
		// We want them to fire inside a gap cursor. Yet, a gap cursor is not considered a whitespace,
		// and `textToMatch` contains the text in the previous block before the gap cursor.
		// Here is a workaround: if we inside a gap cursor, match the input rule only against the last typed character
		// (which may be a typeahead trigger) and ignore the rest.
		const matchString: string = isGapCursorSelection(state.selection)
			? (textToMatch.at(-1) ?? '')
			: textToMatch;

		// EDITOR-2460
		// if the user is formatting text to inline code from R to L i.e. backwards
		if (
			rule.allowsBackwardMatch &&
			isBackwardMatch &&
			expValEquals('platform_editor_lovability_inline_code', 'isEnabled', true)
		) {
			const match = rule.match.exec(matchString);
			if (!match) {
				continue;
			}

			const matchEndPos = from + match[0].length - 1;
			const transform: Transaction | null = rule.handler(state, match, from, matchEndPos);

			if (transform) {
				return {
					from: from,
					to: matchEndPos,
					matchedRule: {
						...rule,
						result: match,
					},
				};
			}

			return null;
		}

		const match = rule.match.exec(matchString);
		if (!match) {
			continue;
		}

		const parentNodeStartAt = state.selection.$from.start();
		const offset = Math.max(0, state.selection.$from.parentOffset - MAX_REGEX_MATCH);
		const fromFixed = Math.max(parentNodeStartAt + match.index + offset, 1);
		const transform: Transaction | null = rule.handler(state, match, fromFixed, to);

		if (transform) {
			return {
				from: fromFixed,
				to,
				matchedRule: {
					...rule,
					result: match,
				},
			};
		}
	}

	return null;
}
