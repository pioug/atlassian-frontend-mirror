import {
  type NODE_TYPE_ORDER_BY,
  type ORDER_BY_DIRECTION_ASC,
  type ORDER_BY_DIRECTION_DESC,
  type ORDER_BY_OPERATOR_ORDER_BY,
} from '../../constants';

import { type AstNode } from './common';
import { type Field } from './field';

export type OrderByDirectionValue =
  | typeof ORDER_BY_DIRECTION_ASC
  | typeof ORDER_BY_DIRECTION_DESC;

/**
 * Details of the order-by JQL clause.
 */
export interface OrderBy extends AstNode {
  type: typeof NODE_TYPE_ORDER_BY;
  /**
   * The ORDER BY keyword used in an order-by clause.
   */
  operator: OrderByOperator;
  /**
   * The list of order-by clause fields and their ordering directives.
   */
  fields: OrderByField[];

  /**
   * Prepend the provided order by field to the list of fields in this node.
   *
   * @param orderField Field to add to the beginning of the order by node
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
 * The ORDER BY keyword used in an order-by clause.
 */
export interface OrderByOperator extends AstNode {
  /**
   * Literal value for the ORDER BY keyword.
   */
  value: typeof ORDER_BY_OPERATOR_ORDER_BY;
}

/**
 * An element of the order-by JQL clause.
 */
export interface OrderByField extends AstNode {
  /**
   * The field to order by.
   */
  field: Field;
  /**
   * The direction in which to order the results.
   */
  direction: OrderByDirection | void;

  /**
   * Set the direction of this order by field to the provided value.
   *
   * @param orderDirection Direction to set for the order by clause
   */
  setOrderDirection: (orderDirection: OrderByDirection) => void;
}

/**
 * The direction to use when ordering results by a field.
 */
export interface OrderByDirection extends AstNode {
  /**
   * Literal value for a direction.
   */
  value: OrderByDirectionValue;
}
