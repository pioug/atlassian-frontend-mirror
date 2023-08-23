import {
  Argument,
  AstNode,
  CompoundClause,
  CompoundOperator,
  Field,
  FunctionOperand,
  FunctionString,
  KeywordOperand,
  ListOperand,
  NotClause,
  NotClauseOperator,
  Operator,
  OrderBy,
  OrderByDirection,
  OrderByField,
  OrderByOperator,
  Predicate,
  PredicateOperator,
  Property,
  Query,
  TerminalClause,
  ValueOperand,
} from '../ast';

/**
 * This interface defines a complete visitor for a JQL AST.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface JastVisitor<Result> {
  visitQuery?: (query: Query) => Result;

  visitCompoundClause?: (compoundClause: CompoundClause) => Result;

  visitCompoundOperator?: (compoundOperator: CompoundOperator) => Result;

  visitTerminalClause?: (terminalClause: TerminalClause) => Result;

  visitNotClause?: (notClause: NotClause) => Result;

  visitNotClauseOperator?: (notClauseOperator: NotClauseOperator) => Result;

  visitField?: (field: Field) => Result;

  visitProperty?: (property: Property) => Result;

  visitOperator?: (operator: Operator) => Result;

  visitListOperand?: (listOperand: ListOperand) => Result;

  visitValueOperand?: (valueOperand: ValueOperand) => Result;

  visitKeywordOperand?: (keywordOperand: KeywordOperand) => Result;

  visitFunctionOperand?: (functionOperand: FunctionOperand) => Result;

  visitFunction?: (functionString: FunctionString) => Result;

  visitArgument?: (argument: Argument) => Result;

  visitPredicate?: (predicate: Predicate) => Result;

  visitPredicateOperator?: (predicateOperator: PredicateOperator) => Result;

  visitOrderBy?: (orderBy: OrderBy) => Result;

  visitOrderByOperator?: (orderByOperator: OrderByOperator) => Result;

  visitOrderByField?: (orderByField: OrderByField) => Result;

  visitOrderByDirection?: (orderByDirection: OrderByDirection) => Result;

  /**
   * Visit a node, and return a user-defined result of the operation.
   *
   * @param node The {@link AstNode} who should be visited.
   * @returns The result of visiting the node.
   */
  visit(node: AstNode): Result;

  /**
   * Visit the children of a node, and return a user-defined result
   * of the operation.
   *
   * @param node The {@link AstNode} whose children should be visited.
   * @returns The result of visiting the children of the node.
   */
  visitChildren(node: AstNode): Result;
}
