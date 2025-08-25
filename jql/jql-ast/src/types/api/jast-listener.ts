import {
	type Argument,
	type AstNode,
	type CompoundClause,
	type CompoundOperator,
	type Field,
	type FunctionOperand,
	type FunctionString,
	type KeywordOperand,
	type ListOperand,
	type NotClause,
	type NotClauseOperator,
	type Operator,
	type OrderBy,
	type OrderByDirection,
	type OrderByField,
	type OrderByOperator,
	type Predicate,
	type PredicateOperator,
	type Property,
	type Query,
	type TerminalClause,
	type ValueOperand,
} from '../ast';

/**
 * This interface defines a complete listener for a JQL AST.
 */
export interface JastListener {
	enterArgument?: (argument: Argument) => void;

	enterCompoundClause?: (compoundClause: CompoundClause) => void;

	enterCompoundOperator?: (compoundOperator: CompoundOperator) => void;

	enterEveryNode?: (query: AstNode) => void;

	enterField?: (field: Field) => void;

	enterFunction?: (functionString: FunctionString) => void;

	enterFunctionOperand?: (functionOperand: FunctionOperand) => void;

	enterKeywordOperand?: (keywordOperand: KeywordOperand) => void;

	enterListOperand?: (listOperand: ListOperand) => void;

	enterNotClause?: (notClause: NotClause) => void;

	enterNotClauseOperator?: (notClauseOperator: NotClauseOperator) => void;

	enterOperator?: (operator: Operator) => void;

	enterOrderBy?: (orderBy: OrderBy) => void;

	enterOrderByDirection?: (orderByDirection: OrderByDirection) => void;

	enterOrderByField?: (orderByField: OrderByField) => void;

	enterOrderByOperator?: (orderByOperator: OrderByOperator) => void;

	enterPredicate?: (predicate: Predicate) => void;

	enterPredicateOperator?: (predicateOperator: PredicateOperator) => void;

	enterProperty?: (field: Property) => void;

	enterQuery?: (query: Query) => void;

	enterTerminalClause?: (terminalClause: TerminalClause) => void;

	enterValueOperand?: (valueOperand: ValueOperand) => void;

	exitArgument?: (argument: Argument) => void;

	exitCompoundClause?: (compoundClause: CompoundClause) => void;

	exitCompoundOperator?: (compoundOperator: CompoundOperator) => void;

	exitEveryNode?: (query: AstNode) => void;

	exitField?: (field: Field) => void;

	exitFunction?: (functionString: FunctionString) => void;

	exitFunctionOperand?: (functionOperand: FunctionOperand) => void;

	exitKeywordOperand?: (keywordOperand: KeywordOperand) => void;

	exitListOperand?: (listOperand: ListOperand) => void;

	exitNotClause?: (notClause: NotClause) => void;

	exitNotClauseOperator?: (notClauseOperator: NotClauseOperator) => void;

	exitOperator?: (operator: Operator) => void;

	exitOrderBy?: (orderBy: OrderBy) => void;

	exitOrderByDirection?: (orderByDirection: OrderByDirection) => void;

	exitOrderByField?: (orderByField: OrderByField) => void;

	exitOrderByOperator?: (orderByOperator: OrderByOperator) => void;

	exitPredicate?: (predicate: Predicate) => void;

	exitPredicateOperator?: (predicateOperator: PredicateOperator) => void;

	exitProperty?: (field: Property) => void;

	exitQuery?: (query: Query) => void;

	exitTerminalClause?: (terminalClause: TerminalClause) => void;

	exitValueOperand?: (valueOperand: ValueOperand) => void;
}
