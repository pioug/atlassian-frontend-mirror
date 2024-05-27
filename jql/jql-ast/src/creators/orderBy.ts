import { NODE_TYPE_ORDER_BY } from '../constants';
import { prependOrderField, setOrderDirection } from '../transformers/orderBy';
import {
  type AstNode,
  type JastListener,
  type JastVisitor,
  type OrderBy,
  type OrderByField,
  type OrderByOperator,
  type Position,
} from '../types';

import { assignParent } from './common';
import { orderByOperator } from './orderByOperator';

function acceptOrderBy<Result>(this: OrderBy, visitor: JastVisitor<Result>) {
  return visitor.visitOrderBy
    ? visitor.visitOrderBy(this)
    : visitor.visitChildren(this);
}

function enterNode(this: OrderBy, listener: JastListener): void {
  listener.enterOrderBy && listener.enterOrderBy(this);
}

function exitNode(this: OrderBy, listener: JastListener): void {
  listener.exitOrderBy && listener.exitOrderBy(this);
}

function getChildren(this: OrderBy): AstNode[] {
  return [this.operator, ...this.fields];
}

export const orderBy = (fields: OrderByField[]): OrderBy => {
  return orderByInternal(fields, orderByOperator());
};

export const orderByInternal = (
  fields: OrderByField[],
  operator: OrderByOperator,
  position: Position | null = null,
): OrderBy => {
  const node: OrderBy = {
    type: NODE_TYPE_ORDER_BY,
    operator,
    fields,
    position,
    accept: acceptOrderBy,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
    prependOrderField,
    setOrderDirection,
  };

  assignParent(node);

  return node;
};
