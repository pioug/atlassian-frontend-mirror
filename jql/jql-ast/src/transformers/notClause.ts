import { assignParent } from '../creators/common';
import { Clause, NotClause } from '../types';

/**
 * Remove the current node from its parent. The parent node is responsible for implementing the logic to remove any
 * references to the child node.
 */
export function remove(this: NotClause): void {
  if (this.parent) {
    this.parent.removeClause(this);
  }
}

/**
 * If the clause to remove is not found as a child of the current node then no changes will be made. Otherwise, this
 * node will be removed entirely.
 *
 * @param clause Clause to remove
 */
export function removeClause(this: NotClause, clause: Clause): void {
  if (this.clause === clause) {
    this.remove();
  }
}

/**
 * Replace the current node from its parent with the provided node. The parent node is responsible for implementing
 * the logic to replace any references to the child node.
 */
export function replace(this: NotClause, nextClause: Clause): void {
  if (this.parent) {
    this.parent.replaceClause(this, nextClause);
  }
}

/**
 * Replace the matching child clause with the provided `nextClause` node. If the clause to replace is not found as a
 * child of the current node then no changes will be made.
 *
 * @param clause Clause to be replaced
 * @param nextClause Clause to set as the new value
 */
export function replaceClause(
  this: NotClause,
  clause: Clause,
  nextClause: Clause,
): void {
  if (this.clause === clause) {
    this.clause = nextClause;
    assignParent(this);
  }
}
