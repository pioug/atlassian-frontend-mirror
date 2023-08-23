import { CLAUSE_TYPE_NOT, NODE_TYPE_CLAUSE } from '../constants';
import {
  remove,
  removeClause,
  replace,
  replaceClause,
} from '../transformers/notClause';
import {
  AstNode,
  Clause,
  JastListener,
  JastVisitor,
  NotClause,
  NotClauseOperator,
  Position,
} from '../types';

import { assignParent } from './common';
import { notClauseOperator } from './notClauseOperator';

function acceptNotClause<Result>(
  this: NotClause,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitNotClause
    ? visitor.visitNotClause(this)
    : visitor.visitChildren(this);
}

function enterNode(this: NotClause, listener: JastListener): void {
  listener.enterNotClause && listener.enterNotClause(this);
}

function exitNode(this: NotClause, listener: JastListener): void {
  listener.exitNotClause && listener.exitNotClause(this);
}

function getChildren(this: NotClause): AstNode[] {
  return [this.operator, this.clause];
}

export const notClause = (clause: Clause): NotClause => {
  return notClauseInternal(clause, notClauseOperator());
};

export const notClauseInternal = (
  clause: Clause,
  operator: NotClauseOperator,
  position: Position | null = null,
): NotClause => {
  const node: NotClause = {
    type: NODE_TYPE_CLAUSE,
    clauseType: CLAUSE_TYPE_NOT,
    clause,
    operator,
    position,
    accept: acceptNotClause,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
    remove,
    removeClause,
    replace,
    replaceClause,
  };

  assignParent(node);

  return node;
};
