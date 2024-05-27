import { type CommonTokenStream, type ParserRuleContext, type Token } from 'antlr4ts';
import { type ErrorNode, type ParseTree, type RuleNode, type TerminalNode } from 'antlr4ts/tree';

import { type JQLParserVisitor } from '@atlaskit/jql-parser';

import { type Position } from '../types';

export abstract class JastBuildingVisitor<Result>
  implements JQLParserVisitor<Result>
{
  tokens: CommonTokenStream;

  constructor(tokens: CommonTokenStream) {
    this.tokens = tokens;
  }

  visit(tree: ParseTree): Result {
    throw new Error('Unsupported operation visit(ParseTree)');
  }

  visitChildren(node: RuleNode): Result {
    throw new Error('Unsupported operation visitChildren(RuleNode)');
  }

  visitErrorNode(node: ErrorNode): Result {
    throw new Error('Unsupported operation visitErrorNode(ErrorNode)');
  }

  visitTerminal(node: TerminalNode): Result {
    throw new Error('Unsupported operation visitTerminal(TerminalNode)');
  }
}

export const getPositionFromToken = (
  startToken: Token,
  stopToken?: Token,
): Position => [startToken.startIndex, (stopToken || startToken).stopIndex + 1];

export const getPositionFromContext = (ctx: ParserRuleContext): Position => [
  ctx.start.startIndex,
  ctx.stop ? ctx.stop.stopIndex + 1 : ctx.start.stopIndex,
];

export const getPositionsFromTerminalNodes = (
  terminalNodes: TerminalNode[],
): Position[] =>
  terminalNodes.map((node: TerminalNode) => getPositionFromToken(node.payload));

export const normalizeText = (text: string) =>
  text.toLowerCase().replace(/\s+/g, ' ');
