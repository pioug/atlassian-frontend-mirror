import { JQLParser } from '@atlaskit/jql-parser';
import { fg } from '@atlaskit/platform-feature-flags';

export const WHERE_CLAUSE = 'where';
export const ORDER_BY_CLAUSE = 'orderBy';

// TODO: do something with this

export const operators: string[] = [
	'=',
	'!=',
	'>',
	'<',
	'>=',
	'<=',
	'in',
	'not in',
	'~',
	'!~',
	'is',
	'is not',
	'was',
	'was in',
	'was not in',
	'was not',
	'changed',
];

export const predicateOperators: string[] = ['after', 'before', 'on', 'during', 'by', 'from', 'to'];

/**
 * Here we maintain an opinionated subset of rules we believe need to leverage context data.
 * New rules supported by autocomplete that require contextual data should be included here.
 */
export const rulesWithContext: number[] = [
	JQLParser.RULE_jqlField,
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
];

export const isRuleWithContext = (ruleNumber: number): boolean =>
	rulesWithContext.includes(ruleNumber) ||
	(ruleNumber === JQLParser.RULE_jqlArgument && fg('enable-jql-membersof-autocomplete'));

/**
 * A subset/collection of parser tokens for strings with unclosed single or double quote
 */
export const unclosedStringTokens: number[] = [
	JQLParser.UNCLOSED_QUOTE_STRING,
	JQLParser.UNCLOSED_SQUOTE_STRING,
];
