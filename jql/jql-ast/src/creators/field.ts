import {
  type AstNode,
  type Field,
  type JastListener,
  type JastVisitor,
  type Position,
  type Property,
} from '../types';
import { sanitiseJqlString } from '../utils/sanitise-jql-string';

import { assignParent } from './common';

function acceptField<Result>(this: Field, visitor: JastVisitor<Result>) {
  return visitor.visitField
    ? visitor.visitField(this)
    : visitor.visitChildren(this);
}

function enterNode(this: Field, listener: JastListener): void {
  listener.enterField && listener.enterField(this);
}

function exitNode(this: Field, listener: JastListener): void {
  listener.exitField && listener.exitField(this);
}

function getChildren(this: Field): AstNode[] {
  return this.properties ? [...this.properties] : [];
}

export const field = (value: string, properties?: Property[]): Field => {
  return fieldInternal(value, sanitiseJqlString(value), properties);
};

export const fieldInternal = (
  value: string,
  text: string,
  properties: Property[] | void,
  position: Position | null = null,
): Field => {
  const node: Field = {
    text,
    value,
    properties,
    position,
    accept: acceptField,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
  };

  assignParent(node);

  return node;
};
