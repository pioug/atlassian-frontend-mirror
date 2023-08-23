import { assignParent } from '../creators/common';
import { OrderBy, OrderByDirection, OrderByField } from '../types';

/**
 * Prepend the provided order by field to the list of fields in this node.
 *
 * @param orderField Field to add to the beginning of the order by node
 */
export function prependOrderField(
  this: OrderBy,
  orderField: OrderByField,
): void {
  this.fields.unshift(orderField);
  assignParent(this);
}

/**
 * Set the direction of the primary order by field to the provided value. If there is no primary order by field then
 * this function is a noop.
 *
 * @param orderDirection Direction to set for the order by clause
 */
export function setOrderDirection(
  this: OrderBy,
  orderDirection: OrderByDirection,
): void {
  if (this.fields.length > 0) {
    this.fields[0].setOrderDirection(orderDirection);
  }
}
