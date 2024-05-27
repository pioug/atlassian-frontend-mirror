import { CLAUSE_TYPE_COMPOUND, NODE_TYPE_CLAUSE } from '../constants';
import {
  appendClause,
  remove,
  removeClause,
  replace,
  replaceClause,
} from '../transformers/compoundClause';
import {
  type AstNode,
  type Clause,
  type CompoundClause,
  type CompoundOperator,
  type JastListener,
  type JastVisitor,
  type Position,
} from '../types';

import { assignParent } from './common';

function acceptCompoundClause<Result>(
  this: CompoundClause,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitCompoundClause
    ? visitor.visitCompoundClause(this)
    : visitor.visitChildren(this);
}

function enterNode(this: CompoundClause, listener: JastListener): void {
  listener.enterCompoundClause && listener.enterCompoundClause(this);
}

function exitNode(this: CompoundClause, listener: JastListener): void {
  listener.exitCompoundClause && listener.exitCompoundClause(this);
}

function getChildren(this: CompoundClause): AstNode[] {
  return [this.operator, ...this.clauses];
}

export const compoundClause = (
  operator: CompoundOperator,
  clauses: Clause[],
): CompoundClause => {
  return compoundClauseInternal(operator, clauses);
};

export const compoundClauseInternal = (
  operator: CompoundOperator,
  clauses: Clause[],
  position: Position | null = null,
): CompoundClause => {
  const node: CompoundClause = {
    type: NODE_TYPE_CLAUSE,
    clauseType: CLAUSE_TYPE_COMPOUND,
    operator,
    clauses,
    position,
    accept: acceptCompoundClause,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
    appendClause,
    remove,
    removeClause,
    replace,
    replaceClause,
  };

  assignParent(node);

  return node;
};
