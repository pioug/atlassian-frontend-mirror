import { CLAUSE_TYPE_COMPOUND } from '../constants';
import { assignParent } from '../creators/common';
import { type Clause, type CompoundClause } from '../types';

/**
 * Append the provided clause to this compound clause. If the clause to append is also a compound clause sharing the
 * same operator as this node then the two compound clauses will be merged.
 *
 * @param clause Clause to append
 */
export function appendClause(this: CompoundClause, clause: Clause): void {
	let clausesToAppend = [clause];

	// If the clause to append is compound with a matching operator then we flatten it into the current clause
	if (clause.clauseType === CLAUSE_TYPE_COMPOUND && clause.operator.value === this.operator.value) {
		clausesToAppend = clause.clauses;
	}

	this.clauses.push(...clausesToAppend);
	assignParent(this);
}

/**
 * Remove the current node from its parent. The parent node is responsible for implementing the logic to remove any
 * references to the child node.
 */
export function remove(this: CompoundClause): void {
	if (this.parent) {
		this.parent.removeClause(this);
	}
}

/**
 * Remove the provided clause from the node. If the clause to remove is not found as a child of the current node then
 * no changes will be made.
 *
 * If the `CompoundClause` has only 1 child clause remaining after the operation, then the current node will be replaced
 * with the child clause (flattening the tree structure). If there are 0 child clauses remaining then the compound
 * clause will be removed entirely.
 *
 * @param clause Clause to remove
 */
export function removeClause(this: CompoundClause, clause: Clause): void {
	this.clauses = this.clauses.filter((val) => val !== clause);
	if (this.clauses.length === 1) {
		this.replace(this.clauses[0]);
	} else if (this.clauses.length === 0) {
		this.remove();
	}
}

/**
 * Replace the current node from its parent with the provided node. The parent node is responsible for implementing
 * the logic to replace any references to the child node.
 */
export function replace(this: CompoundClause, nextClause: Clause): void {
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
export function replaceClause(this: CompoundClause, clause: Clause, nextClause: Clause): void {
	this.clauses = this.clauses.map((child) => {
		return child === clause ? nextClause : child;
	});
	assignParent(this);
}
