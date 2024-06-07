import creators from '../creators';
import { assignParent } from '../creators/common';
import {
	type Clause,
	type CompoundOperatorValue,
	type OrderBy,
	type OrderByDirection,
	type OrderByField,
	type Query,
} from '../types';

/**
 * Append the provided clause to the query. If there is no previous `where` clause then it will be set to the provided
 * value, otherwise a compound clause will be formed using the provided compound operator.
 *
 * @param clause Clause to append
 * @param compoundOperatorValue Operator to use when appending to a compound clause
 */
export function appendClause(
	this: Query,
	clause: Clause,
	compoundOperatorValue: CompoundOperatorValue,
): void {
	if (!this.where) {
		this.where = clause;
	} else {
		const nextCompoundOperator = creators.compoundOperator(compoundOperatorValue);
		const nextClause = creators.compoundClause(nextCompoundOperator, []);

		// Append previous and new clause which will flatten compound clauses with matching operators.
		nextClause.appendClause(this.where);
		nextClause.appendClause(clause);

		this.where = nextClause;
	}
	assignParent(this);
}

/**
 * Prepend the provided order by field to the list of fields in the order by node. If `orderBy` is undefined then a
 * new order by node is set with the provided field.
 *
 * @param orderField Field to add to the beginning of the order by field list
 */
export function prependOrderField(this: Query, orderField: OrderByField): void {
	if (!this.orderBy) {
		this.orderBy = creators.orderBy([orderField]);
		assignParent(this);
	} else {
		this.orderBy.prependOrderField(orderField);
	}
}

/**
 * Set the direction of the primary order by field to the provided value. If there is no primary order by field then
 * this function is a noop.
 *
 * @param orderDirection Direction to set for the order by clause
 */
export function setOrderDirection(this: Query, orderDirection: OrderByDirection): void {
	if (this.orderBy) {
		this.orderBy.setOrderDirection(orderDirection);
	}
}

export function removeClause(this: Query, clause: Clause): void {
	if (this.where === clause) {
		this.where = undefined;
	}
}

/**
 * Replace orderBy with the provided orderBy node. If the orderBy node does not contain any fields, then the orderBy node
 * is removed from the query.
 *
 * @param orderBy orderBy to set for the new orderBy node
 */
export function replaceOrderBy(this: Query, orderBy: OrderBy): void {
	if (orderBy && orderBy.fields.length === 0) {
		this.removeOrderBy();
	} else {
		this.orderBy = orderBy;
		assignParent(this);
	}
}

/**
 * Replace the matching child clause with the provided `nextClause` node. If the clause to replace is not found as a
 * child of the current node then no changes will be made.
 *
 * @param clause Clause to be replaced
 * @param nextClause Clause to set as the new value
 */
export function replaceClause(this: Query, clause: Clause, nextClause: Clause): void {
	if (this.where === clause) {
		this.where = nextClause;
		assignParent(this);
	}
}

/**
 * Remove the orderBy from the node.
 */
export function removeOrderBy(this: Query): void {
	this.orderBy = undefined;
}
