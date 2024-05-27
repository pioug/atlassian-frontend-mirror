import { OPERAND_TYPE_LIST } from '../constants';
import { assignParent } from '../creators/common';
import { type ListOperand, type Operand } from '../types';

/**
 * Add the provided operand at the end of the current list. If the provided value is also a list then it will be merged
 * into the current operand.
 *
 * @param operand Operand to add
 */
export function appendOperand(this: ListOperand, operand: Operand): void {
  this.values.push(
    ...(operand.operandType === OPERAND_TYPE_LIST ? operand.values : [operand]),
  );

  assignParent(this);
}
