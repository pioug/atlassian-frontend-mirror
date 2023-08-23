import {
  JastListener,
  JastVisitor,
  OrderByDirection,
  OrderByDirectionValue,
  Position,
} from '../types';

import { noChildren } from './common';

function acceptOrderByDirection<Result>(
  this: OrderByDirection,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitOrderByDirection
    ? visitor.visitOrderByDirection(this)
    : visitor.visitChildren(this);
}

function enterNode(this: OrderByDirection, listener: JastListener): void {
  listener.enterOrderByDirection && listener.enterOrderByDirection(this);
}

function exitNode(this: OrderByDirection, listener: JastListener): void {
  listener.exitOrderByDirection && listener.exitOrderByDirection(this);
}

export const orderByDirection = (
  value: OrderByDirectionValue,
): OrderByDirection => orderByDirectionInternal(value);

export const orderByDirectionInternal = (
  value: OrderByDirectionValue,
  position: Position | null = null,
): OrderByDirection => ({
  value,
  position,
  accept: acceptOrderByDirection,
  enterNode,
  exitNode,
  getChildren: noChildren,
  parent: null,
});
