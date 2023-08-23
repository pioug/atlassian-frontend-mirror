import { ORDER_BY_OPERATOR_ORDER_BY } from '../constants';
import { JastListener, JastVisitor, OrderByOperator, Position } from '../types';

import { noChildren } from './common';

function acceptOrderByOperator<Result>(
  this: OrderByOperator,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitOrderByOperator
    ? visitor.visitOrderByOperator(this)
    : visitor.visitChildren(this);
}

function enterNode(this: OrderByOperator, listener: JastListener): void {
  listener.enterOrderByOperator && listener.enterOrderByOperator(this);
}

function exitNode(this: OrderByOperator, listener: JastListener): void {
  listener.exitOrderByOperator && listener.exitOrderByOperator(this);
}

export const orderByOperator = (): OrderByOperator => orderByOperatorInternal();

export const orderByOperatorInternal = (
  position: Position | null = null,
): OrderByOperator => ({
  value: ORDER_BY_OPERATOR_ORDER_BY,
  position,
  accept: acceptOrderByOperator,
  enterNode,
  exitNode,
  getChildren: noChildren,
  parent: null,
});
