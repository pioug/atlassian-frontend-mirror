import { CLAUSE_OPERATOR_NOT } from '../constants';
import {
  type JastListener,
  type JastVisitor,
  type NotClauseOperator,
  type Position,
} from '../types';

import { noChildren } from './common';

function acceptNotClauseOperator<Result>(
  this: NotClauseOperator,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitNotClauseOperator
    ? visitor.visitNotClauseOperator(this)
    : visitor.visitChildren(this);
}

function enterNode(this: NotClauseOperator, listener: JastListener): void {
  listener.enterNotClauseOperator && listener.enterNotClauseOperator(this);
}

function exitNode(this: NotClauseOperator, listener: JastListener): void {
  listener.exitNotClauseOperator && listener.exitNotClauseOperator(this);
}

export const notClauseOperator = () => notClauseOperatorInternal();

export const notClauseOperatorInternal = (
  position: Position | null = null,
): NotClauseOperator => ({
  value: CLAUSE_OPERATOR_NOT,
  position,
  accept: acceptNotClauseOperator,
  enterNode,
  exitNode,
  getChildren: noChildren,
  parent: null,
});
