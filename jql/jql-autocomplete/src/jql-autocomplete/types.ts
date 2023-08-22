import { ParserRuleContext } from 'antlr4ts';
import { ErrorNode } from 'antlr4ts/tree';

import { RuleSuggestion, TokenSuggestions } from '../base-autocomplete/types';

import { ORDER_BY_CLAUSE, WHERE_CLAUSE } from './constants';

export type JQLClause = typeof WHERE_CLAUSE | typeof ORDER_BY_CLAUSE;

export type JQLRuleContext = {
  field?: string;
  operator?: string;
  isList?: boolean;
  clause?: JQLClause;
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
  tokens: TokenSuggestions;
  rules: JQLRuleSuggestions;
};

export type MaybeParserRuleContext = ParserRuleContext | undefined;
