import { type ParserRuleContext } from 'antlr4ts';
import { type ErrorNode } from 'antlr4ts/tree';

import { type RuleSuggestion, type TokenSuggestions } from '../base-autocomplete/types';

import { type ORDER_BY_CLAUSE, type WHERE_CLAUSE } from './constants';

export type JQLClause = typeof WHERE_CLAUSE | typeof ORDER_BY_CLAUSE;

export type JQLRuleContext = {
	clause?: JQLClause;
	field?: string;
	isList?: boolean;
	operator?: string;
};

export type JQLRuleContextWithErrors = JQLRuleContext & {
	errorNodes: ErrorNode[];
};

export type JQLRuleSuggestion = RuleSuggestion<JQLRuleContext>;

export type JQLRuleKey =
	| 'field'
	| 'customField'
	| 'operator'
	| 'value'
	| 'list'
	| 'function'
	| 'fieldProperty'
	| 'fieldPropertyId'
	| 'fieldPropertyArgument'
	| 'functionArgument';

export type JQLRuleSuggestions = Partial<Record<JQLRuleKey, JQLRuleSuggestion>>;

/**
 * Represents a collection of tokens and rules which are valid inputs for a given JQL query.
 */
export type JQLSuggestions = {
	rules: JQLRuleSuggestions;
	tokens: TokenSuggestions;
};

export type MaybeParserRuleContext = ParserRuleContext | undefined;
