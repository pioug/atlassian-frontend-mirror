import { JQLParser } from '@atlaskit/jql-parser/JQLParser';

export const isPredicateOperand: any = (ruleStack: number[]): boolean => {
	return ruleStack.includes(JQLParser.RULE_jqlPredicateOperand);
};
