import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

export const ignoredTokens = new Set([
	JQLLexer.EOF,
	JQLLexer.LPAREN,
	JQLLexer.LBRACKET,
	JQLLexer.STRING,
	JQLLexer.QUOTE_STRING,
	JQLLexer.SQUOTE_STRING,
	JQLLexer.POSNUMBER,
	JQLLexer.NEGNUMBER,
	JQLLexer.BANG,
	JQLLexer.CUSTOMFIELD,
]);

export const preferredRules = new Set([
	JQLParser.RULE_jqlField,
	JQLParser.RULE_jqlFieldProperty,
	JQLParser.RULE_jqlEqualsOperator,
	JQLParser.RULE_jqlLikeOperator,
	JQLParser.RULE_jqlComparisonOperator,
	JQLParser.RULE_jqlInOperator,
	JQLParser.RULE_jqlIsOperator,
	JQLParser.RULE_jqlWasOperator,
	JQLParser.RULE_jqlWasInOperator,
	JQLParser.RULE_jqlChangedOperator,
	JQLParser.RULE_jqlValue,
	JQLParser.RULE_jqlListStart,
	JQLParser.RULE_jqlFunction,
	JQLParser.RULE_jqlCustomField,
	// Produces rules for fieldPropertyId, fieldPropertyArgument and functionArgument
	JQLParser.RULE_jqlArgument,
]);

// The following tokens are returned by autocomplete but they are considered "lower" priority suggestions. We only want
// to show these if there are no other viable tokens to suggest.
export const lowPriorityTokens = [JQLLexer.RPAREN, JQLLexer.RBRACKET, JQLLexer.COMMA];
