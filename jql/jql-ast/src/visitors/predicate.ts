import {
  JqlChangedPredicateContext,
  JqlDatePredicateOperatorContext,
  JqlDateRangePredicateOperatorContext,
  JqlPredicateOperandContext,
  JqlUserPredicateOperatorContext,
  JqlValuePredicateOperatorContext,
  JqlWasPredicateContext,
} from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import {
  isPredicateOperator,
  Operand,
  Predicate,
  PredicateOperator,
} from '../types';
import { notUndefined } from '../utils';

import { getPositionFromContext, JastBuildingVisitor } from './common';
import { OperandVisitor } from './operand';

type PredicateOperatorContext =
  | JqlDatePredicateOperatorContext
  | JqlDateRangePredicateOperatorContext
  | JqlUserPredicateOperatorContext
  | JqlValuePredicateOperatorContext
  | void;

export class PredicateVisitor extends JastBuildingVisitor<Predicate> {
  predicateOperatorVisitor = new PredicateOperatorVisitor(this.tokens);
  predicateOperandVisitor = new PredicateOperandVisitor(this.tokens);

  visitJqlWasPredicate = (ctx: JqlWasPredicateContext): Predicate => {
    const operator = this.getOperatorForContexts([
      ctx.jqlDatePredicateOperator(),
      ctx.jqlDateRangePredicateOperator(),
      ctx.jqlUserPredicateOperator(),
    ]);
    const operand = ctx
      .jqlPredicateOperand()
      .accept(this.predicateOperandVisitor);
    const position = getPositionFromContext(ctx);
    return internalCreators.predicate(operator, operand, position);
  };

  visitJqlChangedPredicate = (ctx: JqlChangedPredicateContext): Predicate => {
    const operator = this.getOperatorForContexts([
      ctx.jqlDatePredicateOperator(),
      ctx.jqlDateRangePredicateOperator(),
      ctx.jqlUserPredicateOperator(),
      ctx.jqlValuePredicateOperator(),
    ]);
    const operand = ctx
      .jqlPredicateOperand()
      .accept(this.predicateOperandVisitor);
    const position = getPositionFromContext(ctx);
    return internalCreators.predicate(operator, operand, position);
  };

  getOperatorForContexts = (
    contexts: PredicateOperatorContext[],
  ): PredicateOperator => {
    const operatorContext = contexts.find(notUndefined);
    if (operatorContext !== undefined) {
      return operatorContext.accept(this.predicateOperatorVisitor);
    } else {
      throw new Error('Undefined predicate operator context');
    }
  };
}

class PredicateOperatorVisitor extends JastBuildingVisitor<PredicateOperator> {
  visitJqlDatePredicateOperator = (
    ctx: JqlDatePredicateOperatorContext,
  ): PredicateOperator => {
    return this.getPredicateOperator(ctx);
  };

  visitJqlDateRangePredicateOperator = (
    ctx: JqlDateRangePredicateOperatorContext,
  ): PredicateOperator => {
    return this.getPredicateOperator(ctx);
  };

  visitJqlUserPredicateOperator = (
    ctx: JqlUserPredicateOperatorContext,
  ): PredicateOperator => {
    return this.getPredicateOperator(ctx);
  };

  visitJqlValuePredicateOperator = (
    ctx: JqlValuePredicateOperatorContext,
  ): PredicateOperator => {
    return this.getPredicateOperator(ctx);
  };

  getPredicateOperator = (
    ctx: Exclude<PredicateOperatorContext, void>,
  ): PredicateOperator => {
    const text = this.tokens.getText(ctx);

    // Replace consecutive whitespace chars with single space
    const value = text.toLowerCase().replace(/\s+/g, ' ');

    if (!isPredicateOperator(value)) {
      throw new Error(
        `Found a history predicate operator which does not map to a changed time predicate operator in the ast: ${text}`,
      );
    }

    return internalCreators.predicateOperator(
      value,
      text,
      getPositionFromContext(ctx),
    );
  };
}

class PredicateOperandVisitor extends JastBuildingVisitor<Operand> {
  operandVisitor = new OperandVisitor(this.tokens);

  visitJqlPredicateOperand = (ctx: JqlPredicateOperandContext) => {
    return ctx.jqlOperand().accept(this.operandVisitor);
  };
}
