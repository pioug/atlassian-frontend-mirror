import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

export const defaultIgnoredTokens = new Set([
  JQLLexer.EOF,
  JQLLexer.LPAREN,
  JQLLexer.RPAREN,
  JQLLexer.LBRACKET,
  JQLLexer.RBRACKET,
  JQLLexer.STRING,
  JQLLexer.QUOTE_STRING,
  JQLLexer.SQUOTE_STRING,
  JQLLexer.POSNUMBER,
  JQLLexer.NEGNUMBER,
  JQLLexer.BANG,
  JQLLexer.CUSTOMFIELD,
  JQLLexer.COMMA,
]);

/**
 * Rule paths to be excluded from suggestions. When multiple rules in preferredRules belong to the
 * rule stack for a collected token, c3 returns the most specific rule. This means unhandledRules
 * are effectively stopping autocomplete from returning field and operand rules when these are part
 * of the only path to a preferred rule from collected tokens.
 *
 * Example A:
 * - c3 collects token A
 * - Rule stack for token A is A -> x -> y -> z, being z the top level rule, and x the most specific
 * - If z and x are defined as preferredRules, c3 will return x (the most specific one)
 * - This means adding x to unhandledRules (which are automatically included in preferredRules)
 *   is stopping z from being returned in this situation, as this is a path we don't want to handle
 *
 * Example B:
 * - c3 collects tokens A and B
 * - Rule stack for token A is A -> x -> y -> z
 * - Rule stack for token B is B -> n -> y -> z
 * - If z and x are defined as preferredRules, now c3 will return both z and x
 * - Even if we have an unhandled path, if other paths lead to a handled preferred rule, that
 *   rule will still be returned
 */
export const unhandledRules: number[] = [
  JQLParser.RULE_jqlFieldProperty, // stop field from being suggested after whitespace
];

const operatorRules = [
  JQLParser.RULE_jqlEqualsOperator,
  JQLParser.RULE_jqlLikeOperator,
  JQLParser.RULE_jqlComparisonOperator,
  JQLParser.RULE_jqlInOperator,
  JQLParser.RULE_jqlIsOperator,
  JQLParser.RULE_jqlWasOperator,
  JQLParser.RULE_jqlWasInOperator,
  JQLParser.RULE_jqlChangedOperator,
];

const operandRules = [
  JQLParser.RULE_jqlValue,
  JQLParser.RULE_jqlFunction,
  // If a new list can be started at caret position, autocomplete will return a special `list` rule
  // that consumers can use do special handling. In the case of JQL editor, this means showing
  // operands before the opening parenthesis has been typed, and then auto-inserting it for the user.
  JQLParser.RULE_jqlListStart,
];

/**
 * In some situations, tokens are not very informative predictions on their own, e.g. STRING can
 * mean we are expecting either a field or an operand. This constant specifies the rules we are
 * interested in for suggestions. Whenever the c3 engine hits a lexer token when collecting
 * candidates from a specific ATN state it will check the call stack for it and, if that contains
 * any of the preferred rules, will select that instead of the lexer token.
 *
 * More info at https://github.com/mike-lischke/antlr4-c3#preferred-rules
 */
export const defaultPreferredRules = new Set([
  JQLParser.RULE_jqlField,
  ...operatorRules,
  ...operandRules,
  ...unhandledRules,
  // Disable token suggestions for predicate operands.
  // To be removed when we build proper autocomplete support.
  JQLParser.RULE_jqlPredicateOperand,
]);

export const defaultDelimiterTokens = new Set([
  JQLLexer.LPAREN,
  JQLLexer.COMMA,
]);
