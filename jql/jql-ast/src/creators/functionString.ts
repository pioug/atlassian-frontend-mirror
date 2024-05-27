import { type FunctionString, type JastListener, type JastVisitor, type Position } from '../types';
import { sanitiseJqlString } from '../utils/sanitise-jql-string';

import { noChildren } from './common';

function acceptFunctionString<Result>(
  this: FunctionString,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitFunction
    ? visitor.visitFunction(this)
    : visitor.visitChildren(this);
}

function enterNode(this: FunctionString, listener: JastListener): void {
  listener.enterFunction && listener.enterFunction(this);
}

function exitNode(this: FunctionString, listener: JastListener): void {
  listener.exitFunction && listener.exitFunction(this);
}

export const functionString = (value: string): FunctionString =>
  functionStringInternal(value, sanitiseJqlString(value));

export const functionStringInternal = (
  value: string,
  text: string,
  position: Position | null = null,
): FunctionString => ({
  text,
  value,
  position,
  accept: acceptFunctionString,
  enterNode,
  exitNode,
  getChildren: noChildren,
  parent: null,
});
