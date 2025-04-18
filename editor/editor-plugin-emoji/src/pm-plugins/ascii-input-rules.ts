import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import { createRule } from '@atlaskit/editor-common/utils';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EmojiProvider } from '@atlaskit/emoji/resource';
import type { EmojiDescription } from '@atlaskit/emoji/types';
import { createPlugin, leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';

import { type EmojiPlugin } from '../emojiPluginType';

let matcher: AsciiEmojiMatcher;

export function inputRulePlugin(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	pluginInjectionApi: ExtractInjectionAPI<EmojiPlugin> | undefined,
): SafePlugin | undefined {
	if (schema.nodes.emoji) {
		initMatcher(pluginInjectionApi);
		const asciiEmojiRule = createRule(
			AsciiEmojiMatcher.REGEX,
			inputRuleHandler(editorAnalyticsAPI),
		);

		return new SafePlugin(createPlugin('emoji', [asciiEmojiRule]));
	}
	return;
}

function initMatcher(pluginInjectionApi: ExtractInjectionAPI<EmojiPlugin> | undefined) {
	pluginInjectionApi?.emoji.sharedState.onChange(({ nextSharedState }) => {
		const emojiProvider = nextSharedState?.emojiProvider;
		if (emojiProvider) {
			emojiProvider.getAsciiMap().then((map) => {
				matcher = new RecordingAsciiEmojiMatcher(emojiProvider, map);
			});
		}
	});
}

const inputRuleHandler =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		state: EditorState,
		matchParts: Array<string>,
		start: number,
		end: number,
	): Transaction | null => {
		if (!matcher) {
			return null;
		}

		const match = matcher.match(matchParts);
		if (match) {
			const transactionCreator = new AsciiEmojiTransactionCreator(
				state,
				match,
				start,
				end,
				editorAnalyticsAPI,
			);
			return transactionCreator.create();
		}
		return null;
	};

type AsciiEmojiMatch = {
	emoji: EmojiDescription;
	leadingString: string;
	trailingString: string;
};

const REGEX_LEADING_CAPTURE_INDEX = 1;
const REGEX_EMOJI_LEADING_PARENTHESES = 2;
const REGEX_EMOJI_ASCII_CAPTURE_INDEX = 3;
const REGEX_TRAILING_CAPTURE_INDEX = 4;

const getLeadingString = (match: string[], withParenthesis: boolean = true): string =>
	match[REGEX_LEADING_CAPTURE_INDEX] +
	(withParenthesis ? match[REGEX_EMOJI_LEADING_PARENTHESES] : '');

const getLeadingStringWithoutParentheses = (match: string[]): string =>
	getLeadingString(match, false);

const getAscii = (match: string[], withParentheses: boolean = false) =>
	(withParentheses ? match[REGEX_EMOJI_LEADING_PARENTHESES] : '') +
	match[REGEX_EMOJI_ASCII_CAPTURE_INDEX].trim();

const getAsciiWithParentheses = (matchParts: string[]): string => getAscii(matchParts, true);

const getTrailingString = (match: string[]): string => match[REGEX_TRAILING_CAPTURE_INDEX] || '';

class AsciiEmojiMatcher {
	/**
	 * This regex matches 2 scenarios:
	 * 1. an emoticon starting with a colon character (e.g. :D => 😃)
	 * 2. an emoticon not starting with a colon character (e.g. 8-D => 😎)
	 *
	 * Explanation (${leafNodeReplacementCharacter} is replaced with character \ufffc)
	 *
	 *  1st Capturing Group ((?:^|[\s\ufffc])(?:\(*?))
	 *    Non-capturing group (?:^|[\s\ufffc])
	 *      1st Alternative ^
	 *        ^ asserts position at start of the string
	 *      2nd Alternative [\s\ufffc]
	 *        matches a single character present in [\s\ufffc]
	 *    Non-capturing group (?:\(*?)
	 *      matches the character ( literally between zero and unlimited times, as few times as possible, expanding as needed (lazy)
	 *  2nd Capturing Group (\(?)
	 *    matches a single ( if present
	 *  3rd Capturing Group ([^:\s\ufffc\(]\S{1,3}|:\S{1,3}( ))
	 *    1st Alternative [^:\s\ufffc\(]\S{1,3}
	 *      matches a single character not present in [^:\s\ufffc\(] between 1 and 3 times, as many times as possible, giving back as needed (greedy)
	 *    2nd Alternative :\S{1,3}( )
	 *      : matches the character : literally
	 *      \S{1,3} matches any non-whitespace character between 1 and 3 times, as many times as possible, giving back as needed (greedy)
	 *  4th Capturing Group ( )
	 *
	 * See https://regex101.com/r/HRS9O2/4
	 */
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	static REGEX = new RegExp(
		`((?:^|[\\s${leafNodeReplacementCharacter}])(?:\\(*?))(\\(?)([^:\\s${leafNodeReplacementCharacter}\\(]\\S{1,3}|:\\S{1,3}( ))$`,
	);

	private asciiToEmojiMap: Map<string, EmojiDescription>;

	constructor(asciiToEmojiMap: Map<string, EmojiDescription>) {
		this.asciiToEmojiMap = asciiToEmojiMap;
	}

	match(matchParts: string[]): AsciiEmojiMatch | undefined {
		return (
			this.getAsciiEmojiMatch(
				getLeadingStringWithoutParentheses(matchParts),
				getAsciiWithParentheses(matchParts),
				getTrailingString(matchParts),
			) ||
			this.getAsciiEmojiMatch(
				getLeadingString(matchParts),
				getAscii(matchParts),
				getTrailingString(matchParts),
			)
		);
	}

	private getAsciiEmojiMatch(
		leading: string,
		ascii: string,
		trailing: string,
	): AsciiEmojiMatch | undefined {
		const emoji = this.asciiToEmojiMap.get(ascii);
		return emoji
			? {
					emoji,
					leadingString: leading,
					trailingString: trailing,
				}
			: undefined;
	}
}

/**
 * A matcher that will record ascii matches as usages of the matched emoji.
 */
class RecordingAsciiEmojiMatcher extends AsciiEmojiMatcher {
	private emojiProvider: EmojiProvider;

	constructor(emojiProvider: EmojiProvider, asciiToEmojiMap: Map<string, EmojiDescription>) {
		super(asciiToEmojiMap);
		this.emojiProvider = emojiProvider;
	}

	match(matchParts: string[]): AsciiEmojiMatch | undefined {
		const match = super.match(matchParts);
		if (match && this.emojiProvider.recordSelection) {
			this.emojiProvider.recordSelection(match.emoji);
		}

		return match;
	}
}

class AsciiEmojiTransactionCreator {
	private state: EditorState;
	private match: AsciiEmojiMatch;
	private start: number;
	private end: number;
	private editorAnalyticsAPI: EditorAnalyticsAPI | undefined;

	constructor(
		state: EditorState,
		match: AsciiEmojiMatch,
		start: number,
		end: number,
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	) {
		this.state = state;
		this.match = match;
		this.start = start;
		this.end = end;
		this.editorAnalyticsAPI = editorAnalyticsAPI;
	}

	create(): Transaction {
		const tr = this.state.tr.replaceWith(this.from, this.to, this.createNodes());
		this.editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
			attributes: { inputMethod: INPUT_METHOD.ASCII },
			eventType: EVENT_TYPE.TRACK,
		})(tr);
		return tr;
	}

	private get from(): number {
		return this.start + this.match.leadingString.length;
	}

	private get to(): number {
		return this.end;
	}

	private createNodes(): Node[] {
		const nodes = [this.createEmojiNode()];
		if (this.trailingTextNodeRequired()) {
			nodes.push(this.createTrailingTextNode());
		}
		return nodes;
	}

	private createEmojiNode(): Node {
		const { emoji: emojiTypeNode } = this.state.schema.nodes;
		return emojiTypeNode.create(this.getEmojiNodeAttrs());
	}

	private getEmojiNodeAttrs() {
		const emoji = this.match.emoji;
		return {
			id: emoji.id,
			shortName: emoji.shortName,
			text: emoji.fallback || emoji.shortName,
		};
	}

	private trailingTextNodeRequired(): boolean {
		return this.match.trailingString.length > 0;
	}

	private createTrailingTextNode(): Node {
		return this.state.schema.text(this.match.trailingString);
	}
}

export const stateKey = new PluginKey('asciiEmojiPlugin');

const plugins = (
	schema: Schema,
	providerFactory: ProviderFactory,
	featureFlags: FeatureFlags,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	pluginInjectionApi: ExtractInjectionAPI<EmojiPlugin> | undefined,
) => {
	return [inputRulePlugin(schema, editorAnalyticsAPI, pluginInjectionApi)].filter(
		(plugin) => !!plugin,
	) as SafePlugin[];
};

export default plugins;
