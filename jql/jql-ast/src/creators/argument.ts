import { type Argument, type JastListener, type JastVisitor, type Position } from '../types';
import { normaliseJqlString, sanitiseJqlString } from '../utils';

import { noChildren } from './common';

function acceptArgument<Result>(this: Argument, visitor: JastVisitor<Result>) {
  return visitor.visitArgument
    ? visitor.visitArgument(this)
    : visitor.visitChildren(this);
}

function enterNode(this: Argument, listener: JastListener): void {
  listener.enterArgument && listener.enterArgument(this);
}

function exitNode(this: Argument, listener: JastListener): void {
  listener.exitArgument && listener.exitArgument(this);
}

/**
 * Creates a Argument AST node from a raw value that hasn't been pre-treated for use in a JQL string (for example,
 * if it can contain reserved characters or whitespaces without being wrapped in quotes).
 *
 * The provided value will be sanitised (quoted and escaped) if necessary before being set to the node's text property.
 *
 * @link argumentByText can be used instead if you are looking to create an Argument node from a text that has
 * already been quoted/escaped, e.g. in situations where your data provider returns terms that are guaranteed to be valid JQL.
 *
 * @param value String to be set as the AST node's value. This value will typically come from some type of user input
 * which may require quoting/escaping to produce a valid JQL string.
 */
export const argument = (value: string): Argument =>
  argumentInternal(value, sanitiseJqlString(value));

/**
 * Creates a Argument AST node from a value that has been pre-treated to produce a valid JQL string.
 *
 * @link argument can be used instead if you are looking to create a Argument node from a text that can potentially
 * contain invalid JQL, e.g. from a user input which may require quoting/escaping due to special characters or whitespaces.
 *
 * @param text String to be set as the AST node's text. This text should be valid JQL as it will be preserved as-is
 * when building the AST node.
 */
export const argumentByText = (text: string): Argument =>
  argumentInternal(normaliseJqlString(text), text);

export const argumentInternal = (
  value: string,
  text: string,
  position: Position | null = null,
): Argument => ({
  text,
  value,
  position,
  accept: acceptArgument,
  enterNode,
  exitNode,
  getChildren: noChildren,
  parent: null,
});
