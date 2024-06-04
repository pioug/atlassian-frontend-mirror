import { assignParent } from '../creators/common';
import { type OrderByDirection, type OrderByField } from '../types';

/**
 * Set the direction of this order by field to the provided value.
 *
 * @param orderDirection Direction to set for the order by clause
 */
export function setOrderDirection(
  this: OrderByField,
  orderDirection: OrderByDirection,
): void {
  this.direction = orderDirection;
  assignParent(this);
}

/**
 * Replace the current orderBy field with the provided field in `orderByField`.
 *
 * @param orderByField field to set as the new value
 */
export function replace(
  this: OrderByField,
  orderByField: OrderByField,
): void {
  if (this.parent) {
    this.parent.replaceOrderField(this, orderByField)
  }
}

/**
 * Remove the current orderBy field from the orderBy node.
 * The parent node is responsible for implementing the logic to remove any
 * references to the child node.
 *
 */
export function remove(
  this: OrderByField,
): void {
  if (this.parent) {
    this.parent.removeOrderField(this)
  }
}
