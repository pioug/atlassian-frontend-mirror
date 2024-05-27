import { type NODE_TYPE_QUERY } from '../../constants';
import { type JQLParseError } from '../../errors';

import { type Clause, type ParentOfClause } from './clause';
import { type AstNode } from './common';
import { type CompoundOperatorValue } from './compound-operator';
import { type OrderBy, type OrderByDirection, type OrderByField } from './order-by';

/**
 * A parsed JQL query.
 */
export interface Query extends AstNode, ParentOfClause {
  type: typeof NODE_TYPE_QUERY;
  /**
   * The <em>where</em> part of the JQL query.
   */
  where: Clause | void;
  /**
   * The <em>order by</em> part of the JQL query.
   */
  orderBy: OrderBy | void;

  /**
   * Append the provided clause to the query. If there is no previous `where` clause then it will be set to the provided
   * value, otherwise a compound clause will be formed using the provided compound operator.
   *
   * @param clause Clause to append
   * @param compoundOperatorValue Operator to use when appending to a compound clause
   */
  appendClause: (
    clause: Clause,
    compoundOperatorValue: CompoundOperatorValue,
  ) => void;

  /**
   * Prepend the provided order by field to the list of fields in the order by node. If `orderBy` is undefined then a
   * new order by node is set with the provided field.
   *
   * @param orderField Field to add to the beginning of the order by field list
   */
  prependOrderField: (orderField: OrderByField) => void;

  /**
   * Set the direction of the primary order by field to the provided value. If there is no primary order by field then
   * this function is a noop.
   *
   * @param orderDirection Direction to set for the order by clause
   */
  setOrderDirection: (orderDirection: OrderByDirection) => void;
}

/**
 * A complete abstract syntax tree for a JQL expression.
 */
export interface Jast {
  /**
   * A parsed JQL query. This will be undefined if the JQL could not be parsed.
   */
  query: Query | void;
  /**
   * The original query string used to construct the AST.
   */
  represents: string;
  /**
   * Collection of errors that occurred while parsing the JQL expression.
   */
  errors: JQLParseError[];
}
