import {
  CLAUSE_OPERATOR_NOT,
  CLAUSE_TYPE_COMPOUND,
  CLAUSE_TYPE_NOT,
  CLAUSE_TYPE_TERMINAL,
  NODE_TYPE_CLAUSE,
} from '../../constants';

import { AstNode, Removable, Replaceable } from './common';
import { CompoundOperator } from './compound-operator';
import { Field } from './field';
import { Operand } from './operand';
import { Operator } from './operator';
import { Predicate } from './predicate';

export interface ParentOfClause {
  /**
   * Remove the provided clause from the node. If the clause to remove is not found as a child of the current node then
   * no changes will be made.
   *
   * If this is called on a `CompoundClause` node which has only 1 child clause remaining after the operation, then the
   * current node will be replaced with the child clause (flattening the tree structure). If there are 0 child clauses
   * remaining then the compound clause will be removed entirely.
   *
   * If this is called on a `NotClause` node then the not clause will be removed entirely.
   *
   * @param clause Clause to remove
   */
  removeClause: (clause: Clause) => void;
  /**
   * Replace the matching child clause with the provided `nextClause` node. If the clause to replace is not found as a
   * child of the current node then no changes will be made.
   *
   * @param clause Clause to be replaced
   * @param nextClause Clause to set as the new value
   */
  replaceClause: (clause: Clause, nextClause: Clause) => void;
}

/**
 * An individual JQL clause that can be composed together to form a query.
 */
export type Clause = CompoundClause | TerminalClause | NotClause;

/**
 * A JQL query clause that consists of nested clauses.
 * For example, <code>(labels in (urgent, blocker) OR lastCommentedBy = currentUser())</code>.
 * Note that, where nesting is not defined, the parser nests JQL clauses based on the operator precedence. For example,
 * "A OR B AND C" is parsed as "(A OR B) AND C".
 * See <a href="https://confluence.atlassian.com/x/awiiLQ#Advancedsearching-parenthesesSettingtheprecedenceofoperators">Setting the precedence of operators</a>
 * for more information about precedence in JQL queries.
 */
export interface CompoundClause
  extends AstNode<ParentOfClause & AstNode>,
    Removable,
    Replaceable<Clause>,
    ParentOfClause {
  type: typeof NODE_TYPE_CLAUSE;
  clauseType: typeof CLAUSE_TYPE_COMPOUND;
  /**
   * The operator between the clauses.
   */
  operator: CompoundOperator;
  /**
   * List of nested clauses.
   */
  clauses: Clause[];

  /**
   * Append the provided clause to this compound clause. If the clause to append is also a compound clause sharing the
   * same operator as this node then the two compound clauses will be merged.
   *
   * @param clause Clause to append
   */
  appendClause: (clause: Clause) => void;
}

/**
 * A leaf JQL query clause that asserts a field value (present or past), or whether that value has changed.
 */
export interface TerminalClause
  extends AstNode<ParentOfClause & AstNode>,
    Removable,
    Replaceable<Clause> {
  type: typeof NODE_TYPE_CLAUSE;
  clauseType: typeof CLAUSE_TYPE_TERMINAL;
  /**
   * The field in the clause.
   */
  field: Field;
  /**
   * The operator between the field and operand.
   * @see https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-operators
   */
  operator: Operator | void;
  /**
   * The operand to which the operator is applied.
   */
  operand: Operand | void;
  /**
   * The list of time predicates.
   */
  predicates: Predicate[];
  /**
   * Function to update operator
   */
  setOperator: (this: TerminalClause, operator: Operator) => void;
  /**
   * Function to update operand
   */
  setOperand: (this: TerminalClause, operand: Operand) => void;
  /**
   * Function to add operand to existing operand
   */
  appendOperand: (this: TerminalClause, operand: Operand) => void;
}

/**
 * A JQL query clause that is begins with a `NOT` operator followed by a sub-clause to allow logical negation of an
 * expression. For example, <code>NOT (labels in (urgent, blocker) OR lastCommentedBy = currentUser())</code>.
 */
export interface NotClause
  extends AstNode<ParentOfClause & AstNode>,
    Removable,
    Replaceable<Clause>,
    ParentOfClause {
  type: typeof NODE_TYPE_CLAUSE;
  clauseType: typeof CLAUSE_TYPE_NOT;
  clause: Clause;
  operator: NotClauseOperator;
}

/**
 * The operator before the sub-clause in a NOT clause.
 */
export interface NotClauseOperator extends AstNode {
  value: typeof CLAUSE_OPERATOR_NOT;
}

export type TerminalClauseRhs = Pick<
  TerminalClause,
  'operator' | 'operand' | 'predicates'
>;
