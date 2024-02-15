import { argument, argumentByText, argumentInternal } from './argument';
import { compoundClause, compoundClauseInternal } from './compoundClause';
import { compoundOperator, compoundOperatorInternal } from './compoundOperator';
import { field, fieldInternal } from './field';
import { functionOperand, functionOperandInternal } from './functionOperand';
import { functionString, functionStringInternal } from './functionString';
import { jast } from './jast';
import { keywordOperand, keywordOperandInternal } from './keywordOperand';
import { listOperand, listOperandInternal } from './listOperand';
import { notClause, notClauseInternal } from './notClause';
import {
  notClauseOperator,
  notClauseOperatorInternal,
} from './notClauseOperator';
import { operator, operatorInternal } from './operator';
import { orderBy, orderByInternal } from './orderBy';
import { orderByDirection, orderByDirectionInternal } from './orderByDirection';
import { orderByField, orderByFieldInternal } from './orderByField';
import { orderByOperator, orderByOperatorInternal } from './orderByOperator';
import { predicate, predicateInternal } from './predicate';
import {
  predicateOperator,
  predicateOperatorInternal,
} from './predicateOperator';
import { property, propertyInternal } from './property';
import { query, queryInternal } from './query';
import { terminalClause, terminalClauseInternal } from './terminalClause';
import {
  valueOperand,
  valueOperandByText,
  valueOperandInternal,
} from './valueOperand';

/**
 * Declare separate creator functions for public and internal usage. Internal creators have a more verbose method
 * signature to give granular control over contextual node data such as position. Public creators are a simplified API
 * we provide to consumers to be used during AST transformation.
 */
export const internalCreators = {
  query: queryInternal,
  compoundClause: compoundClauseInternal,
  compoundOperator: compoundOperatorInternal,
  terminalClause: terminalClauseInternal,
  notClause: notClauseInternal,
  notClauseOperator: notClauseOperatorInternal,
  predicate: predicateInternal,
  predicateOperator: predicateOperatorInternal,
  field: fieldInternal,
  property: propertyInternal,
  operator: operatorInternal,
  valueOperand: valueOperandInternal,
  keywordOperand: keywordOperandInternal,
  functionOperand: functionOperandInternal,
  functionString: functionStringInternal,
  argument: argumentInternal,
  listOperand: listOperandInternal,
  orderBy: orderByInternal,
  orderByOperator: orderByOperatorInternal,
  orderByField: orderByFieldInternal,
  orderByDirection: orderByDirectionInternal,
};

export default {
  jast,
  query,
  compoundClause,
  compoundOperator,
  terminalClause,
  notClause,
  notClauseOperator,
  predicate,
  predicateOperator,
  field,
  property,
  operator,
  valueOperand,
  keywordOperand,
  functionOperand,
  functionString,
  argument,
  listOperand,
  orderBy,
  orderByOperator,
  orderByField,
  orderByDirection,
  byText: {
    argument: argumentByText,
    valueOperand: valueOperandByText,
  },
};
