import { assignParent } from '../creators/common';
import { OrderByDirection, OrderByField } from '../types';

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
