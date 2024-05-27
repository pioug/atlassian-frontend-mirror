import {
  type AstNode,
  type JastListener,
  type JastVisitor,
  type Operand,
  type Position,
  type Predicate,
  type PredicateOperator,
} from '../types';

import { assignParent } from './common';

function acceptPredicate<Result>(
  this: Predicate,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitPredicate
    ? visitor.visitPredicate(this)
    : visitor.visitChildren(this);
}

function enterNode(this: Predicate, listener: JastListener): void {
  listener.enterPredicate && listener.enterPredicate(this);
}

function exitNode(this: Predicate, listener: JastListener): void {
  listener.exitPredicate && listener.exitPredicate(this);
}

function getChildren(this: Predicate): AstNode[] {
  const children: AstNode[] = [this.operator];
  if (this.operand) {
    children.push(this.operand);
  }
  return children;
}

export const predicate = (
  operator: PredicateOperator,
  operand?: Operand,
): Predicate => predicateInternal(operator, operand);

export const predicateInternal = (
  operator: PredicateOperator,
  operand: Operand | void,
  position: Position | null = null,
): Predicate => {
  const node: Predicate = {
    operator,
    operand,
    position,
    accept: acceptPredicate,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
  };

  assignParent(node);

  return node;
};
