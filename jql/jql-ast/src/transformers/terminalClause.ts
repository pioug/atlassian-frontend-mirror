import { OPERAND_TYPE_LIST } from '../constants';
import creators from '../creators';
import { assignParent } from '../creators/common';
import { type Clause, type Operand, type Operator, type TerminalClause } from '../types';

/**
 * Set the operator of the current terminal clause.
 *
 * @param operator Operator to update
 */
export function setOperator(this: TerminalClause, operator: Operator): void {
	this.operator = operator;

	assignParent(this);
}

/**
 * Set the operand of the current terminal clause.
 *
 * @param operand Operand to update
 */
export function setOperand(this: TerminalClause, operand: Operand): void {
	this.operand = operand;

	assignParent(this);
}

/**
 * Append the provided operand to the end of this terminal clause. If the existing operand is a singular value then it
 * will be converted into a list operand and the provided value will be appended.
 *
 * @param operand Operand to append
 */
export function appendOperand(this: TerminalClause, operand: Operand): void {
	if (this.operand) {
		if (this.operand.operandType === OPERAND_TYPE_LIST) {
			this.operand.appendOperand(operand);
		} else {
			this.setOperand(
				creators.listOperand([
					this.operand,
					...(operand.operandType === OPERAND_TYPE_LIST ? operand.values : [operand]),
				]),
			);
		}
	} else {
		this.setOperand(operand);
	}
}

/**
 * Remove the current node from its parent. The parent node is responsible for implementing the logic to remove any
 * references to the child node.
 */
export function remove(this: TerminalClause): void {
	if (this.parent) {
		this.parent.removeClause(this);
	}
}
/**
 * Replace the current node from its parent with the provided node. The parent node is responsible for implementing
 * the logic to replace any references to the child node.
 */
export function replace(this: TerminalClause, nextClause: Clause): void {
	if (this.parent) {
		this.parent.replaceClause(this, nextClause);
	}
}
