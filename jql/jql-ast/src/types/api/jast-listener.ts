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
  enterEveryNode?: (query: AstNode) => void;

  exitEveryNode?: (query: AstNode) => void;

  enterQuery?: (query: Query) => void;

  exitQuery?: (query: Query) => void;

  enterCompoundClause?: (compoundClause: CompoundClause) => void;

  exitCompoundClause?: (compoundClause: CompoundClause) => void;

  enterCompoundOperator?: (compoundOperator: CompoundOperator) => void;

  exitCompoundOperator?: (compoundOperator: CompoundOperator) => void;

  enterTerminalClause?: (terminalClause: TerminalClause) => void;

  exitTerminalClause?: (terminalClause: TerminalClause) => void;

  enterNotClause?: (notClause: NotClause) => void;

  exitNotClause?: (notClause: NotClause) => void;

  enterNotClauseOperator?: (notClauseOperator: NotClauseOperator) => void;

  exitNotClauseOperator?: (notClauseOperator: NotClauseOperator) => void;

  enterField?: (field: Field) => void;

  exitField?: (field: Field) => void;

  enterProperty?: (field: Property) => void;

  exitProperty?: (field: Property) => void;

  enterOperator?: (operator: Operator) => void;

  exitOperator?: (operator: Operator) => void;

  enterListOperand?: (listOperand: ListOperand) => void;

  exitListOperand?: (listOperand: ListOperand) => void;

  enterValueOperand?: (valueOperand: ValueOperand) => void;

  exitValueOperand?: (valueOperand: ValueOperand) => void;

  enterKeywordOperand?: (keywordOperand: KeywordOperand) => void;

  exitKeywordOperand?: (keywordOperand: KeywordOperand) => void;

  enterFunctionOperand?: (functionOperand: FunctionOperand) => void;

  exitFunctionOperand?: (functionOperand: FunctionOperand) => void;

  enterFunction?: (functionString: FunctionString) => void;

  exitFunction?: (functionString: FunctionString) => void;

  enterArgument?: (argument: Argument) => void;

  exitArgument?: (argument: Argument) => void;

  enterPredicate?: (predicate: Predicate) => void;

  exitPredicate?: (predicate: Predicate) => void;

  enterPredicateOperator?: (predicateOperator: PredicateOperator) => void;

  exitPredicateOperator?: (predicateOperator: PredicateOperator) => void;

  enterOrderBy?: (orderBy: OrderBy) => void;

  exitOrderBy?: (orderBy: OrderBy) => void;

  enterOrderByOperator?: (orderByOperator: OrderByOperator) => void;

  exitOrderByOperator?: (orderByOperator: OrderByOperator) => void;

  enterOrderByField?: (orderByField: OrderByField) => void;

  exitOrderByField?: (orderByField: OrderByField) => void;

  enterOrderByDirection?: (orderByDirection: OrderByDirection) => void;

  exitOrderByDirection?: (orderByDirection: OrderByDirection) => void;
}
