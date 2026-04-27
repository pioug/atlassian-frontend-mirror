import type { JQLParseError } from '../errors';
// eslint-disable-next-line import/order
import type { Clause, OrderBy, Position, Query, CompoundOperator, CompoundClause, CompoundOperatorValue, Field, Operator, Operand, Predicate, TerminalClause, NotClauseOperator, NotClause, PredicateOperator, PredicateOperatorValue, Property, Argument, OperatorValue, ValueOperand, KeywordOperandValue, KeywordOperand, FunctionString, FunctionOperand, ListOperand, OrderByField, OrderByOperator, OrderByDirection, OrderByDirectionValue, Jast } from '../types';
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
import { notClauseOperator, notClauseOperatorInternal } from './notClauseOperator';
import { operator, operatorInternal } from './operator';
import { orderBy, orderByInternal } from './orderBy';
import { orderByDirection, orderByDirectionInternal } from './orderByDirection';
import { orderByField, orderByFieldInternal } from './orderByField';
import { orderByOperator, orderByOperatorInternal } from './orderByOperator';
import { predicate, predicateInternal } from './predicate';
import { predicateOperator, predicateOperatorInternal } from './predicateOperator';
import { property, propertyInternal } from './property';
import { query, queryInternal } from './query';
import { terminalClause, terminalClauseInternal } from './terminalClause';
import { valueOperand, valueOperandByText, valueOperandInternal } from './valueOperand';

/**
 * Declare separate creator functions for public and internal usage. Internal creators have a more verbose method
 * signature to give granular control over contextual node data such as position. Public creators are a simplified API
 * we provide to consumers to be used during AST transformation.
 */
export const internalCreators: { argument: (value: string, text: string, position?: Position | null) => Argument; compoundClause: (operator: CompoundOperator, clauses: Clause[], position?: Position | null) => CompoundClause; compoundOperator: (value: CompoundOperatorValue, operatorPositions: Position[]) => CompoundOperator; field: (value: string, text: string, properties: Property[] | void, position?: Position | null) => Field; functionOperand: (functionString: FunctionString, args: Argument[], position?: Position | null) => FunctionOperand; functionString: (value: string, text: string, position?: Position | null) => FunctionString; keywordOperand: (value: KeywordOperandValue, position?: Position | null) => KeywordOperand; listOperand: (values: Operand[], position?: Position | null) => ListOperand; notClause: (clause: Clause, operator: NotClauseOperator, position?: Position | null) => NotClause; notClauseOperator: (position?: Position | null) => NotClauseOperator; operator: (value: OperatorValue, text: string, position?: Position | null) => Operator; orderBy: (fields: OrderByField[], operator: OrderByOperator, position?: Position | null) => OrderBy; orderByDirection: (value: OrderByDirectionValue, position?: Position | null) => OrderByDirection; orderByField: (field: Field, direction: OrderByDirection | void, position?: Position | null) => OrderByField; orderByOperator: (position?: Position | null) => OrderByOperator; predicate: (operator: PredicateOperator, operand: Operand | void, position?: Position | null) => Predicate; predicateOperator: (value: PredicateOperatorValue, text: string, position?: Position | null) => PredicateOperator; property: (key: Argument | void, path: Argument[], position?: Position | null) => Property; query: (where: Clause | void, orderBy: OrderBy | void, position?: Position | null) => Query; terminalClause: (field: Field, operator: Operator | void, operand: Operand | void, predicates: Predicate[], position?: Position | null) => TerminalClause; valueOperand: (value: string, text: string, position?: Position | null) => ValueOperand; } = {
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

const _default_1: {
    argument: (value: string) => Argument;
    byText: {
        argument: (text: string) => Argument;
        valueOperand: (text: string) => ValueOperand;
    };
    compoundClause: (operator: CompoundOperator, clauses: Clause[]) => CompoundClause;
    compoundOperator: (value: CompoundOperatorValue) => CompoundOperator;
    field: (value: string, properties?: Property[]) => Field;
    functionOperand: (functionString: FunctionString, args?: Argument[]) => FunctionOperand;
    functionString: (value: string) => FunctionString;
    jast: (query: Query | void, represents?: string, errors?: JQLParseError[]) => Jast;
    keywordOperand: () => KeywordOperand;
    listOperand: (values: Operand[]) => ListOperand;
    notClause: (clause: Clause) => NotClause;
    notClauseOperator: () => NotClauseOperator;
    operator: (value: OperatorValue) => Operator;
    orderBy: (fields: OrderByField[]) => OrderBy;
    orderByDirection: (value: OrderByDirectionValue) => OrderByDirection;
    orderByField: (field: Field, direction?: OrderByDirection) => OrderByField;
    orderByOperator: () => OrderByOperator;
    predicate: (operator: PredicateOperator, operand?: Operand) => Predicate;
    predicateOperator: (value: PredicateOperatorValue) => PredicateOperator;
    property: (key: Argument | void, path?: Argument[]) => Property;
    query: (where: Clause | void, orderBy?: OrderBy) => Query;
    terminalClause: (field: Field, operator?: Operator, operand?: Operand, predicates?: Predicate[]) => TerminalClause;
    valueOperand: (value: string) => ValueOperand;
} = {
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
export default _default_1;
