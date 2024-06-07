import { type RuleList } from 'antlr4-c3/lib/src/CodeCompletionCore';

import { type Position } from '../common/types';

export type RuleSuggestion<RuleContext> = {
	context: RuleContext | null;
	matchedText: string;
	replacePosition: Position;
};

export type RuleSuggestionsWithRuleList<RuleContext> = Map<
	number,
	[RuleSuggestion<RuleContext>, RuleList]
>;

export type TokenSuggestions = {
	values: string[];
	matchedText: string;
	replacePosition: Position;
};

/**
 * Represents a collection of tokens and rules which are valid inputs for a given query.
 *
 * **Note** - Rules are keyed using the parser rule index. For developers that wish to expose
 * suggestions for a particular grammar, it is recommended that they map these rule indexes into
 * subset of hardcoded rule names. This will ensure the downstream consumers are not impacted if
 * grammer changes need to be introduced, as hardcoded names remain unchanged.
 */
export type Suggestions<RuleContext> = {
	tokens: TokenSuggestions;
	rules: RuleSuggestionsWithRuleList<RuleContext>;
};
