import { remove, replace, setOrderDirection } from '../transformers/orderByField';
import {
  type AstNode,
  type Field,
  type JastListener,
  type JastVisitor,
  type OrderByDirection,
  type OrderByField,
  type Position,
} from '../types';

import { assignParent } from './common';

function acceptOrderByField<Result>(
  this: OrderByField,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitOrderByField
    ? visitor.visitOrderByField(this)
    : visitor.visitChildren(this);
}

function enterNode(this: OrderByField, listener: JastListener): void {
  listener.enterOrderByField && listener.enterOrderByField(this);
}

function exitNode(this: OrderByField, listener: JastListener): void {
  listener.exitOrderByField && listener.exitOrderByField(this);
}

function getChildren(this: OrderByField): AstNode[] {
  const children: AstNode[] = [this.field];
  if (this.direction) {
    children.push(this.direction);
  }
  return children;
}

export const orderByField = (
  field: Field,
  direction?: OrderByDirection,
): OrderByField => orderByFieldInternal(field, direction);

export const orderByFieldInternal = (
  field: Field,
  direction: OrderByDirection | void,
  position: Position | null = null,
): OrderByField => {
  const node: OrderByField = {
    field,
    direction,
    position,
    accept: acceptOrderByField,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
    setOrderDirection,
    replace,
    remove
  };

  assignParent(node);

  return node;
};
