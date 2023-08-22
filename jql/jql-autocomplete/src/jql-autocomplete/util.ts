import { ParserRuleContext } from 'antlr4ts/ParserRuleContext';

import { JQLParser } from '@atlaskit/jql-parser';

import { Position } from '../common/types';

import { operators } from './constants';

export const isPredicateOperand = (ruleStack: number[]) => {
  return ruleStack.includes(JQLParser.RULE_jqlPredicateOperand);
};

export const getPositionFromParserRule = (ctx: ParserRuleContext): Position => [
  ctx.start.startIndex,
  ctx.stop ? ctx.stop.stopIndex + 1 : ctx.start.stopIndex + 1,
];

export const normalizeText = (text: string) =>
  text.toLowerCase().replace(/\s+/g, ' ').trim();

export const isOperator = (maybeOperator: string) =>
  operators.includes(maybeOperator);
