import { NODE_TYPE_QUERY } from '../constants';
import {
  appendClause,
  prependOrderField,
  removeClause,
  replaceClause,
  setOrderDirection,
} from '../transformers/query';
import {
  type AstNode,
  type Clause,
  type JastListener,
  type JastVisitor,
  type OrderBy,
  type Position,
  type Query,
} from '../types';

import { assignParent } from './common';

/**
 * AstNode accept functions. We define them outside of the creator function so the same function reference is returned
 * when a creator is invoked multiple times (which is helpful when testing for equality of AST objects).
 */
function acceptQuery<Result>(this: Query, visitor: JastVisitor<Result>) {
  return visitor.visitQuery
    ? visitor.visitQuery(this)
    : visitor.visitChildren(this);
}

function enterNode(this: Query, listener: JastListener): void {
  listener.enterQuery && listener.enterQuery(this);
}

function exitNode(this: Query, listener: JastListener): void {
  listener.exitQuery && listener.exitQuery(this);
}

function getChildren(this: Query): AstNode[] {
  const children: AstNode[] = [];
  if (this.where) {
    children.push(this.where);
  }
  if (this.orderBy) {
    children.push(this.orderBy);
  }
  return children;
}

export const query = (where: Clause | void, orderBy?: OrderBy): Query =>
  queryInternal(where, orderBy);

export const queryInternal = (
  where: Clause | void,
  orderBy: OrderBy | void,
  position: Position | null = null,
): Query => {
  const node: Query = {
    type: NODE_TYPE_QUERY,
    where,
    orderBy,
    position,
    accept: acceptQuery,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
    appendClause,
    prependOrderField,
    setOrderDirection,
    removeClause,
    replaceClause,
  };

  assignParent(node);

  return node;
};
