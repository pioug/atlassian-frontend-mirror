import { RuleNode } from 'antlr4ts/tree';

import {
  JqlChangedClauseContext,
  JqlComparisonClauseContext,
  JqlEmptyContext,
  JqlEqualsClauseContext,
  JqlFunctionContext,
  JqlInClauseContext,
  JqlIsClauseContext,
  JqlLikeClauseContext,
  JqlListContext,
  JqlTerminalClauseContext,
  JqlValueContext,
  JqlWasClauseContext,
  JqlWasInClauseContext,
} from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import { Clause, Operand, TerminalClauseRhs } from '../types';
import { notUndefined } from '../utils';

import { getPositionFromContext, JastBuildingVisitor } from './common';
import { FieldVisitor } from './field';
import { OperandVisitor } from './operand';
import { OperatorVisitor } from './operator';
import { PredicateVisitor } from './predicate';

type OperandContext =
  | JqlEmptyContext
  | JqlValueContext
  | JqlFunctionContext
  | JqlListContext
  | void;

export class TerminalClauseVisitor extends JastBuildingVisitor<Clause> {
  fieldVisitor = new FieldVisitor(this.tokens);
  terminalClauseRhsVisitor = new TerminalClauseRhsVisitor(this.tokens);

  visitJqlTerminalClause = (ctx: JqlTerminalClauseContext) => {
    const field = ctx.jqlField().accept(this.fieldVisitor);
    const { operator, operand, predicates } = ctx
      .jqlTerminalClauseRhs()
      .accept(this.terminalClauseRhsVisitor);
    const position = getPositionFromContext(ctx);
    return internalCreators.terminalClause(
      field,
      operator,
      operand,
      predicates,
      position,
    );
  };
}

class TerminalClauseRhsVisitor extends JastBuildingVisitor<TerminalClauseRhs> {
  operatorVisitor = new OperatorVisitor(this.tokens);
  terminalClauseOperandVisitor = new TerminalClauseOperandVisitor(this.tokens);
  predicateVisitor = new PredicateVisitor(this.tokens);

  visitJqlEqualsClause = (ctx: JqlEqualsClauseContext) => {
    const operator = ctx.jqlEqualsOperator().accept(this.operatorVisitor);
    const operand = ctx.accept(this.terminalClauseOperandVisitor);
    return { operator, operand, predicates: [] };
  };

  visitJqlLikeClause = (ctx: JqlLikeClauseContext) => {
    const operator = ctx.jqlLikeOperator().accept(this.operatorVisitor);
    const operand = ctx.accept(this.terminalClauseOperandVisitor);
    return { operator, operand, predicates: [] };
  };

  visitJqlComparisonClause = (ctx: JqlComparisonClauseContext) => {
    const operator = ctx.jqlComparisonOperator().accept(this.operatorVisitor);
    const operand = ctx.accept(this.terminalClauseOperandVisitor);
    return { operator, operand, predicates: [] };
  };

  visitJqlInClause = (ctx: JqlInClauseContext) => {
    const operator = ctx.jqlInOperator().accept(this.operatorVisitor);
    const operand = ctx.accept(this.terminalClauseOperandVisitor);
    return { operator, operand, predicates: [] };
  };

  visitJqlIsClause = (ctx: JqlIsClauseContext) => {
    const operator = ctx.jqlIsOperator().accept(this.operatorVisitor);
    const operand = ctx.accept(this.terminalClauseOperandVisitor);
    return { operator, operand, predicates: [] };
  };

  visitJqlWasClause = (ctx: JqlWasClauseContext) => {
    const operator = ctx.jqlWasOperator().accept(this.operatorVisitor);
    const operand = ctx.accept(this.terminalClauseOperandVisitor);
    const predicates = ctx
      .jqlWasPredicate()
      .map(predicate => predicate.accept(this.predicateVisitor))
      .filter(notUndefined);
    return { operator, operand, predicates };
  };

  visitJqlWasInClause = (ctx: JqlWasInClauseContext) => {
    const operator = ctx.jqlWasInOperator().accept(this.operatorVisitor);
    const operand = ctx.accept(this.terminalClauseOperandVisitor);
    const predicates = ctx
      .jqlWasPredicate()
      .map(predicate => predicate.accept(this.predicateVisitor))
      .filter(notUndefined);
    return { operator, operand, predicates };
  };

  visitJqlChangedClause = (ctx: JqlChangedClauseContext): TerminalClauseRhs => {
    const operator = ctx.jqlChangedOperator().accept(this.operatorVisitor);
    const predicates = ctx
      .jqlChangedPredicate()
      .map(predicate => predicate.accept(this.predicateVisitor))
      .filter(notUndefined);
    return { operator, operand: undefined, predicates };
  };

  // Recover from clause type ambiguities, e.g. "issuetype was " (which can be a WAS or WAS IN clause)
  visitChildren = (node: RuleNode): TerminalClauseRhs => {
    const operator = node.accept(this.operatorVisitor);
    return { operator, operand: undefined, predicates: [] };
  };
}

class TerminalClauseOperandVisitor extends JastBuildingVisitor<Operand | void> {
  operandVisitor = new OperandVisitor(this.tokens);

  visitJqlEqualsClause = (ctx: JqlEqualsClauseContext): Operand | void => {
    return this.getOperandForContexts([
      ctx.jqlEmpty(),
      ctx.jqlValue(),
      ctx.jqlFunction(),
    ]);
  };

  visitJqlLikeClause = (ctx: JqlLikeClauseContext) => {
    return this.getOperandForContexts([
      ctx.jqlEmpty(),
      ctx.jqlValue(),
      ctx.jqlFunction(),
    ]);
  };

  visitJqlComparisonClause = (ctx: JqlComparisonClauseContext) => {
    return this.getOperandForContexts([ctx.jqlValue(), ctx.jqlFunction()]);
  };

  visitJqlInClause = (ctx: JqlInClauseContext) => {
    return this.getOperandForContexts([ctx.jqlList(), ctx.jqlFunction()]);
  };

  visitJqlIsClause = (ctx: JqlIsClauseContext) => {
    return this.getOperandForContexts([ctx.jqlEmpty()]);
  };

  visitJqlWasClause = (ctx: JqlWasClauseContext) => {
    return this.getOperandForContexts([
      ctx.jqlEmpty(),
      ctx.jqlValue(),
      ctx.jqlFunction(),
    ]);
  };

  visitJqlWasInClause = (ctx: JqlWasInClauseContext) => {
    return this.getOperandForContexts([ctx.jqlList(), ctx.jqlFunction()]);
  };

  getOperandForContexts = (contexts: OperandContext[]): Operand | void => {
    const operandContext = contexts.find(notUndefined);
    return operandContext?.accept(this.operandVisitor);
  };
}
