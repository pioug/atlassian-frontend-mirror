import {
  type CompoundOperator,
  type CompoundOperatorValue,
  type JastListener,
  type JastVisitor,
  type Position,
} from '../types';

import { noChildren } from './common';

function acceptCompoundOperator<Result>(
  this: CompoundOperator,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitCompoundOperator
    ? visitor.visitCompoundOperator(this)
    : visitor.visitChildren(this);
}

function enterNode(this: CompoundOperator, listener: JastListener): void {
  listener.enterCompoundOperator && listener.enterCompoundOperator(this);
}

function exitNode(this: CompoundOperator, listener: JastListener): void {
  listener.exitCompoundOperator && listener.exitCompoundOperator(this);
}

export const compoundOperator = (
  value: CompoundOperatorValue,
): CompoundOperator => compoundOperatorInternal(value, []);

export const compoundOperatorInternal = (
  value: CompoundOperatorValue,
  operatorPositions: Position[],
): CompoundOperator => ({
  value,
  positions: operatorPositions,
  position: null,
  accept: acceptCompoundOperator,
  enterNode,
  exitNode,
  getChildren: noChildren,
  parent: null,
});
