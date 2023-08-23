import { COMPOUND_OPERATOR_AND, COMPOUND_OPERATOR_OR } from '../../constants';

import { AstNode, Position } from './common';

export type CompoundOperatorValue =
  | typeof COMPOUND_OPERATOR_AND
  | typeof COMPOUND_OPERATOR_OR;

/**
 * The operator between clauses in a compound clause.
 */
export interface CompoundOperator extends AstNode {
  /**
   * Literal value for an operator
   */
  value: CompoundOperatorValue;
  /**
   * Array of position tuples where each item in the array represents an occurrence of the operator value.
   */
  positions: Position[];
}
