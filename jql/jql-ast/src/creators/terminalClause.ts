import { CLAUSE_TYPE_TERMINAL, NODE_TYPE_CLAUSE } from '../constants';
import {
  appendOperand,
  remove,
  replace,
  setOperand,
  setOperator,
} from '../transformers/terminalClause';
import {
  type AstNode,
  type Field,
  type JastListener,
  type JastVisitor,
  type Operand,
  type Operator,
  type Position,
  type Predicate,
  type TerminalClause,
} from '../types';

import { assignParent } from './common';

function acceptTerminalClause<Result>(
  this: TerminalClause,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitTerminalClause
    ? visitor.visitTerminalClause(this)
    : visitor.visitChildren(this);
}

function enterNode(this: TerminalClause, listener: JastListener): void {
  listener.enterTerminalClause && listener.enterTerminalClause(this);
}

function exitNode(this: TerminalClause, listener: JastListener): void {
  listener.exitTerminalClause && listener.exitTerminalClause(this);
}

function getChildren(this: TerminalClause): AstNode[] {
  const children: AstNode[] = [this.field];
  if (this.operator) {
    children.push(this.operator);
  }
  if (this.operand) {
    children.push(this.operand);
  }

  return children.concat(this.predicates);
}

export const terminalClause = (
  field: Field,
  operator?: Operator,
  operand?: Operand,
  predicates: Predicate[] = [],
): TerminalClause => {
  return terminalClauseInternal(field, operator, operand, predicates);
};

export const terminalClauseInternal = (
  field: Field,
  operator: Operator | void,
  operand: Operand | void,
  predicates: Predicate[],
  position: Position | null = null,
): TerminalClause => {
  const node: TerminalClause = {
    type: NODE_TYPE_CLAUSE,
    clauseType: CLAUSE_TYPE_TERMINAL,
    field,
    operator,
    operand,
    predicates,
    position,
    accept: acceptTerminalClause,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
    setOperator,
    setOperand,
    appendOperand,
    remove,
    replace,
  };

  assignParent(node);

  return node;
};
