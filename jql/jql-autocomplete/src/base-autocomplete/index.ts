import {
	type CandidateRule,
	CodeCompletionCore,
	type RuleList,
	type TokenList,
} from 'antlr4-c3/lib/src/CodeCompletionCore';
import { type BufferedTokenStream, type Parser, Token } from 'antlr4ts';

import { type Position } from '../common/types';

import {
	type RuleSuggestion,
	type RuleSuggestionsWithRuleList,
	type Suggestions,
	type TokenSuggestions,
} from './types';
import { getMatchedText } from './util';

/**
 * Antlr-based, grammar agnostic, autocomplete class. Consumers can provide options to adjust the
 * suggestions returned by the autocompletion engine, or extend the class to enrich suggestions with
 * additional contextual data.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class BaseAutocomplete<RuleContext extends {} = {}> {
	private readonly parser: Parser;
	private readonly core: CodeCompletionCore;

	/**
	 * A delimiter token instructs us that we want to get suggestions for the **next** token in the
	 * stream. This is useful when you know there are no more characters that will follow a token. For
	 * instance, with the following expression `order by field,` the comma is our `caretToken`. If we
	 * specify comma as a delimiter token then we will get suggestions for tokens **after** the comma.
	 * Without it we would get alternatives for the comma character, e.g. `ASC` and `DESC`.
	 */
	private readonly delimiterTokens: Set<number>;

	/**
	 * Compute autocomplete suggestions for the given Parser.
	 *
	 * @param parser Parser instance to compute suggestions for.
	 * @param ignoredTokens Tokens which we do not want to return as suggestions, used by [antlr4-c3](https://github.com/mike-lischke/antlr4-c3#ignored-tokens).
	 * @param preferredRules Rules we want to return as suggestions, used by [antlr4-c3](https://github.com/mike-lischke/antlr4-c3#preferred-rules).
	 * @param delimiterTokens Tokens to use as delimiters. When the caret is positioned at a delimiter
	 * token then we'll look for suggestions **after** the current token.
	 */
	constructor(
		parser: Parser,
		ignoredTokens: Set<number> = new Set<number>(),
		preferredRules: Set<number> = new Set<number>(),
		delimiterTokens: Set<number> = new Set<number>(),
	) {
		this.parser = parser;

		this.core = new CodeCompletionCore(this.parser);
		this.core.ignoredTokens = ignoredTokens;
		this.core.preferredRules = preferredRules;

		// This ensures we get more specific matches for recursive rules, e.g. list operands `status in (`
		this.core.translateRulesTopDown = true;

		this.delimiterTokens = delimiterTokens;
	}

	protected getTokenStream(): BufferedTokenStream {
		return this.parser.inputStream as BufferedTokenStream;
	}

	/**
	 * Return the matched text for the current token and range of selected characters.
	 *
	 * @param maybeCaretToken The token to retrieve autocomplete suggestions for. When undefined we
	 * return suggestions for the beginning of the input.
	 * @param caretSelectionRange The range of characters that are selected in the input stream. This
	 * will determine the `replacePosition` computed for the returned {@link Suggestions}.
	 * @private
	 */
	private getMatchedText(maybeCaretToken: Token | void, caretSelectionRange: Position): string {
		if (!maybeCaretToken) {
			return '';
		}

		// If the caret is at a delimiter or hidden token then our matched text should be computed
		// starting at the next token
		const startTokenIndex = this.isCaretAtDelimiterOrHiddenToken(maybeCaretToken)
			? maybeCaretToken.tokenIndex + 1
			: maybeCaretToken.tokenIndex;

		return getMatchedText(
			this.getTokenStream(),
			startTokenIndex,
			maybeCaretToken,
			caretSelectionRange,
		);
	}

	/**
	 * Map the provided collection of candidate tokens into {@link TokenSuggestions} using a
	 * consumer-friendly token name.
	 *
	 * @param maybeCaretToken The token to retrieve autocomplete suggestions for. When undefined we
	 * return suggestions for the beginning of the input.
	 * @param caretSelectionRange The range of characters that are selected in the input stream. This
	 * will determine the `replacePosition` computed for the returned {@link Suggestions}.
	 * @param collectedCandidateTokens Token suggestions from `antlr4-c3`
	 */
	private getCandidateTokens(
		maybeCaretToken: Token | void,
		caretSelectionRange: Position,
		collectedCandidateTokens: Map<number, TokenList>,
	): TokenSuggestions {
		const candidateTokens: string[] = [];
		collectedCandidateTokens.forEach((value: TokenList, key: number) => {
			const tokenSequence = [key, ...value]; // handle token sequences that are always used together, e.g. ORDER + BY
			const tokenName = tokenSequence
				.map((tokenType) => this.parser.vocabulary.getDisplayName(tokenType).replace(/^'|'$/g, ''))
				.join(' ');
			if (tokenName) {
				candidateTokens.push(tokenName);
			}
		});
		candidateTokens.sort();

		const matchedText = this.getMatchedText(maybeCaretToken, caretSelectionRange);
		const replacePosition = this.getReplacePosition(
			maybeCaretToken,
			maybeCaretToken,
			caretSelectionRange,
		);

		return {
			matchedText,
			replacePosition,
			values: candidateTokens,
		};
	}

	/**
	 * Map the provided collection of candidate rules into {@link RuleSuggestionsWithRuleList}. This
	 * allows subclasses to assign contextual data to each suggestion.
	 *
	 * @param maybeCaretToken The token to retrieve autocomplete suggestions for. When undefined we
	 * return suggestions for the beginning of the input.
	 * @param caretSelectionRange The range of characters that are selected in the input stream. This
	 * will determine the `replacePosition` computed for the returned {@link Suggestions}.
	 * @param collectedCandidateRules Rule suggestions from `antlr4-c3`
	 */
	private getCandidateRules(
		maybeCaretToken: Token | void,
		caretSelectionRange: Position,
		collectedCandidateRules: Map<number, CandidateRule>,
	): RuleSuggestionsWithRuleList<RuleContext> {
		const rules = this.mapCandidateRules(
			maybeCaretToken,
			caretSelectionRange,
			collectedCandidateRules,
		);

		return this.assignRuleContextData(maybeCaretToken, rules);
	}

	/**
	 * Map the provided collection of candidate rules into {@link RuleSuggestionsWithRuleList}.
	 *
	 * @param collectedCandidateRules Rule suggestions from `antlr4-c3`
	 * @param maybeCaretToken The token to retrieve autocomplete suggestions for. When undefined we
	 * return suggestions for the beginning of the input.
	 * @param caretSelectionRange The range of characters that are selected in the input stream. This
	 * will determine the `replacePosition` computed for the returned {@link Suggestions}.
	 */
	private mapCandidateRules(
		maybeCaretToken: Token | void,
		caretSelectionRange: Position,
		collectedCandidateRules: Map<number, CandidateRule>,
	): RuleSuggestionsWithRuleList<RuleContext> {
		const rules: RuleSuggestionsWithRuleList<RuleContext> = new Map<
			number,
			[RuleSuggestion<RuleContext>, RuleList]
		>();

		const tokens = this.getTokenStream();
		collectedCandidateRules.forEach(({ startTokenIndex, ruleList }, key) => {
			let defaultRule: RuleSuggestion<RuleContext>;
			const startToken = tokens.get(startTokenIndex);
			const replacePosition = this.getReplacePosition(
				startToken,
				maybeCaretToken,
				caretSelectionRange,
			);

			if (!maybeCaretToken) {
				// The only case where maybeCaretToken is not defined is when the cursor is at the beginning of
				// the string. In this case we can safely assume our start position is 0.
				defaultRule = {
					matchedText: '',
					replacePosition: replacePosition,
					context: null,
				};
			} else {
				const matchedText = getMatchedText(
					tokens,
					startTokenIndex,
					maybeCaretToken,
					caretSelectionRange,
				);

				defaultRule = {
					matchedText,
					replacePosition: replacePosition,
					context: null,
				};
			}

			rules.set(key, [defaultRule, ruleList]);
		});

		return rules;
	}

	/**
	 * Return the input token for a given caret position. If the caret is positioned at the start of
	 * the input, or no matching token could be found then `undefined` is returned.
	 *
	 * @param caretStartPosition Caret position.
	 * @private
	 */
	private getCaretToken(caretStartPosition: number): Token | void {
		if (caretStartPosition === 0) {
			return undefined;
		}

		const tokens = this.getTokenStream().getTokens();
		for (const token of tokens) {
			if (
				(caretStartPosition > token.startIndex && caretStartPosition <= token.stopIndex + 1) ||
				token.type === Token.EOF
			) {
				return token;
			}
		}

		return undefined;
	}

	/**
	 * Determines if the provided token is one of the configured {@link delimiterTokens}.
	 *
	 * @param caretToken The token matched for a given caret position.
	 * @private
	 */
	private isCaretAtDelimiterToken(caretToken: Token): boolean {
		return this.delimiterTokens.has(caretToken.type);
	}

	/**
	 * Determine if the provided token is one of the configured {@link delimiterTokens}, or a hidden
	 * token. Hidden token refers to a token on ANTLR's HIDDEN_CHANNEL. This means the token is not
	 * represented in the parse tree and effectively ignored.
	 *
	 * @param caretToken The token matched for a given caret position.
	 * @protected
	 */
	protected isCaretAtDelimiterOrHiddenToken(caretToken: Token): boolean {
		return this.isCaretAtDelimiterToken(caretToken) || caretToken.channel === Token.HIDDEN_CHANNEL;
	}

	/**
	 * This method has no default implementation. The class which wants to override a specific scenario to calculate replace position,
	 * will have to provide implementation. If this method returns null, the position will be calculated by {@see BaseAutocomplete#getReplacePosition}
	 *
	 * @param replaceStartToken The token which should be used when determining the replacement start
	 * position. For token suggestions this will match `maybeCaretToken`, for rules this will refer to
	 * the start token where the rule should be replaced.
	 * @param maybeCaretToken The token to retrieve autocomplete suggestions for. When undefined we
	 * return suggestions for the beginning of the input.
	 * @param caretSelectionRange The range of characters that are selected in the input stream. This
	 * will determine the `replacePosition` computed for the returned {@link Suggestions}.
	 * @protected
	 */
	protected overrideReplacePosition(
		_replaceStartToken: Token | void,
		_maybeCaretToken: Token | void,
		_caretSelectionRange: Position,
	): Position | null {
		return null;
	}

	/**
	 * Determine the range of characters that should be replaced for a token or rule suggestion.
	 * Token and rule replacement adheres to the following strategy:
	 * - If the caret selection is **inside** a token, then the entire token will be replaced.
	 * e.g. `s|tatu|s => story|`
	 * - If the caret selection starts **before** a token, then the selection will be replaced.
	 * e.g. `|statu|s => story|s`
	 * - If the caret selection spans **across** tokens, then the beginning of the start token, up
	 * until selection end, will be replaced. e.g. `s|tatus = op|en => story|en`
	 *
	 *
	 * @param replaceStartToken The token which should be used when determining the replacement start
	 * position. For token suggestions this will match `maybeCaretToken`, for rules this will refer to
	 * the start token where the rule should be replaced.
	 * @param maybeCaretToken The token to retrieve autocomplete suggestions for. When undefined we
	 * return suggestions for the beginning of the input.
	 * @param caretSelectionRange The range of characters that are selected in the input stream. This
	 * will determine the `replacePosition` computed for the returned {@link Suggestions}.
	 * @private
	 */
	private getReplacePosition(
		replaceStartToken: Token | void,
		maybeCaretToken: Token | void,
		caretSelectionRange: Position,
	): Position {
		// Replace position will be overridden, if only the grammar specific class has overriden method `overrideReplacePosition`
		// else the method `overrideReplacePosition` will return null and the calculation of position will continue further in the current method.
		const overriddenReplacePosition = this.overrideReplacePosition(
			replaceStartToken,
			maybeCaretToken,
			caretSelectionRange,
		);

		if (overriddenReplacePosition) {
			return overriddenReplacePosition;
		}

		const [start, stop] = caretSelectionRange;

		// If the replaceStartToken is not defined (i.e. cursor at beginning of string) or the caret is
		// positioned at a delimiter/hidden token then we want to append at selection start.
		// Otherwise we want our replacement to start from the beginning of specified token.
		const startPosition =
			replaceStartToken === undefined || this.isCaretAtDelimiterOrHiddenToken(replaceStartToken)
				? start
				: Math.min(replaceStartToken.startIndex, start);

		// If the maybeCaretToken is not defined (i.e. cursor at beginning of string) or the caret is
		// positioned at a delimiter/hidden token then we want to replace up until selection stop.
		// Otherwise we want our replacement to replace the entire token beneath the caret.
		const stopPosition =
			maybeCaretToken === undefined || this.isCaretAtDelimiterOrHiddenToken(maybeCaretToken)
				? stop
				: Math.max(maybeCaretToken.stopIndex + 1, stop);

		return [startPosition, stopPosition];
	}

	/**
	 * Return autocomplete suggestions for the provided caret position in the input stream.
	 *
	 * @param maybeCaretToken The token to retrieve autocomplete suggestions for. When undefined we
	 * return suggestions for the beginning of the input.
	 * @param caretSelectionRange The range of characters that are selected in the input stream. This
	 * will determine the `replacePosition` computed for the returned {@link Suggestions}.
	 */
	private getCandidates(
		maybeCaretToken: Token | void,
		caretSelectionRange: Position,
	): Suggestions<RuleContext> {
		let caretTokenIndex;
		if (maybeCaretToken === undefined) {
			caretTokenIndex = 0;
		} else {
			caretTokenIndex = this.isCaretAtDelimiterToken(maybeCaretToken)
				? maybeCaretToken.tokenIndex + 1
				: maybeCaretToken.tokenIndex;
		}

		const collectedCandidates = this.core.collectCandidates(caretTokenIndex);
		const tokens = this.getCandidateTokens(
			maybeCaretToken,
			caretSelectionRange,
			collectedCandidates.tokens,
		);
		const rules = this.getCandidateRules(
			maybeCaretToken,
			caretSelectionRange,
			collectedCandidates.rules,
		);
		return {
			tokens,
			rules,
		};
	}

	/**
	 * Returns list of expected next tokens based on the provided caret position.
	 *
	 * @param caretSelectionRange The range of characters that are selected in the input stream. This
	 * will determine the `replacePosition` computed for the returned {@link Suggestions}.
	 */
	getSuggestionsForCaretPosition(caretSelectionRange: Position): Suggestions<RuleContext> {
		const maybeCaretToken = this.getCaretToken(caretSelectionRange[0]);
		return this.getCandidates(maybeCaretToken, caretSelectionRange);
	}

	/**
	 * Returns list of expected next tokens based on the provided token index.
	 *
	 * @param tokenIndex Index of the token to retrieve suggestions for.
	 */
	getSuggestionsForTokenIndex(tokenIndex: number): Suggestions<RuleContext> {
		const caretToken = this.getTokenStream().get(tokenIndex);

		// When token index is provided, we behave as if the caret was at the end of the token
		const caretSelectionRange: Position = [caretToken.stopIndex + 1, caretToken.stopIndex + 1];
		return this.getCandidates(caretToken, caretSelectionRange);
	}

	/**
	 * Subclasses can override this method to assign contextual data to the provided `ruleSuggestions`.
	 * For example, a grammar may return the following rule for the RHS of a simple boolean expression:
	 * `loading === `
	 * ```
	 * {
	 *   rhs: {
	 *     matchedText: '',
	 *     replacePosition: [16, 16],
	 *     context: {}
	 *   }
	 * }
	 * ```
	 * The subclass can enrich this suggestion with the LHS variable reference. e.g.
	 * ```
	 * {
	 *   rhs: {
	 *     matchedText: '',
	 *     replacePosition: [16, 16],
	 *     context: {
	 *       lhs: 'loading'
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * @param maybeCaretToken The token to retrieve autocomplete suggestions for. When undefined we
	 * return suggestions for the beginning of the input.
	 * @param rules Map of {@link RuleSuggestion} to assign context data to keyed by parser rule index.
	 * @protected
	 */
	protected assignRuleContextData(
		_maybeCaretToken: Token | void,
		rules: RuleSuggestionsWithRuleList<RuleContext>,
	): RuleSuggestionsWithRuleList<RuleContext> {
		return rules;
	}
}
