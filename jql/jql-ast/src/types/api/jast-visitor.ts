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
 * This interface defines a complete visitor for a JQL AST.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface JastVisitor<Result> {
	/**
	 * Visit a node, and return a user-defined result of the operation.
	 *
	 * @param node The {@link AstNode} who should be visited.
	 * @returns The result of visiting the node.
	 */
	visit(node: AstNode): Result;

	visitArgument?: (argument: Argument) => Result;

	/**
	 * Visit the children of a node, and return a user-defined result
	 * of the operation.
	 *
	 * @param node The {@link AstNode} whose children should be visited.
	 * @returns The result of visiting the children of the node.
	 */
	visitChildren(node: AstNode): Result;

	visitCompoundClause?: (compoundClause: CompoundClause) => Result;

	visitCompoundOperator?: (compoundOperator: CompoundOperator) => Result;

	visitField?: (field: Field) => Result;

	visitFunction?: (functionString: FunctionString) => Result;

	visitFunctionOperand?: (functionOperand: FunctionOperand) => Result;

	visitKeywordOperand?: (keywordOperand: KeywordOperand) => Result;

	visitListOperand?: (listOperand: ListOperand) => Result;

	visitNotClause?: (notClause: NotClause) => Result;

	visitNotClauseOperator?: (notClauseOperator: NotClauseOperator) => Result;

	visitOperator?: (operator: Operator) => Result;

	visitOrderBy?: (orderBy: OrderBy) => Result;

	visitOrderByDirection?: (orderByDirection: OrderByDirection) => Result;

	visitOrderByField?: (orderByField: OrderByField) => Result;

	visitOrderByOperator?: (orderByOperator: OrderByOperator) => Result;

	visitPredicate?: (predicate: Predicate) => Result;

	visitPredicateOperator?: (predicateOperator: PredicateOperator) => Result;

	visitProperty?: (property: Property) => Result;

	visitQuery?: (query: Query) => Result;

	visitTerminalClause?: (terminalClause: TerminalClause) => Result;

	visitValueOperand?: (valueOperand: ValueOperand) => Result;
}
