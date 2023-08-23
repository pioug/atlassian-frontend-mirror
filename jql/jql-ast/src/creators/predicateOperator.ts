import {
  JastListener,
  JastVisitor,
  Position,
  PredicateOperator,
  PredicateOperatorValue,
} from '../types';

import { noChildren } from './common';

function acceptPredicateOperator<Result>(
  this: PredicateOperator,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitPredicateOperator
    ? visitor.visitPredicateOperator(this)
    : visitor.visitChildren(this);
}

function enterNode(this: PredicateOperator, listener: JastListener): void {
  listener.enterPredicateOperator && listener.enterPredicateOperator(this);
}

function exitNode(this: PredicateOperator, listener: JastListener): void {
  listener.exitPredicateOperator && listener.exitPredicateOperator(this);
}

export const predicateOperator = (
  value: PredicateOperatorValue,
): PredicateOperator => predicateOperatorInternal(value, value);

export const predicateOperatorInternal = (
  value: PredicateOperatorValue,
  text: string,
  position: Position | null = null,
): PredicateOperator => ({
  text,
  value,
  position,
  accept: acceptPredicateOperator,
  enterNode,
  exitNode,
  getChildren: noChildren,
  parent: null,
});
