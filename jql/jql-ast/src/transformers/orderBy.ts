import { assignParent } from '../creators/common';
import { type OrderBy, type OrderByDirection, type OrderByField } from '../types';

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

/**
 * Replace the current orderBy node with the provided node. The parent node is
 * responsible for implementing the logic to replace any references to the child node.
 *
 * @param nextOrderBy orderBy node to set as a new node
 */
export function replace(this: OrderBy, nextOrderBy: OrderBy): void {
  if (this.parent) {
    this.parent.replaceOrderBy(nextOrderBy);
  }
}

/**
 * Replace the matching child field with the provided `nextOrderByField` node. If the field to replace is not found as a
 * child of the current node then no changes will be made.
 *
 * @param orderByField orderByField to be replaced
 * @param nextOrderByField orderByField to set as the new value
 */
export function replaceOrderField(
  this: OrderBy,
  orderByField: OrderByField,
  nextOrderByField: OrderByField,
): void {
  this.fields = this.fields.map(child => {
    return child === orderByField ? nextOrderByField : child;
  });
  assignParent(this);
}

/**
 * Remove the current node from its parent. The parent node is responsible for implementing the logic to remove any
 * references to the child node.
 */
export function remove(this: OrderBy): void {
  if (this.parent) {
    this.parent.removeOrderBy();
  }
}
/**
 * Remove the provided orderByField from the node. If the field to remove is not found as a child of the current node then
 * no changes will be made.
 *
 * If there are 0 child fields remaining then the orderBy node will be removed entirely
 *
 * @param orderByField OrderByField to remove
 */
export function removeOrderField(this: OrderBy, orderByField: OrderByField): void {

  this.fields = this.fields.filter(field => field !== orderByField);
  if (this.fields.length === 0) {
    this.remove();
  }
}
