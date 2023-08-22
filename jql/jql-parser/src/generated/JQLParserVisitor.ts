/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// Generated from JQLParser.g4 by ANTLR 4.7.3-SNAPSHOT

import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor';

import { JqlNumberFieldContext } from './JQLParser';
import { JqlNonNumberFieldContext } from './JQLParser';
import { JqlEqualsClauseContext } from './JQLParser';
import { JqlLikeClauseContext } from './JQLParser';
import { JqlComparisonClauseContext } from './JQLParser';
import { JqlInClauseContext } from './JQLParser';
import { JqlIsClauseContext } from './JQLParser';
import { JqlWasClauseContext } from './JQLParser';
import { JqlWasInClauseContext } from './JQLParser';
import { JqlChangedClauseContext } from './JQLParser';
import { JqlQueryContext } from './JQLParser';
import { JqlWhereContext } from './JQLParser';
import { JqlOrClauseContext } from './JQLParser';
import { JqlAndClauseContext } from './JQLParser';
import { JqlNotClauseContext } from './JQLParser';
import { JqlSubClauseContext } from './JQLParser';
import { JqlTerminalClauseContext } from './JQLParser';
import { JqlTerminalClauseRhsContext } from './JQLParser';
import { JqlEqualsOperatorContext } from './JQLParser';
import { JqlLikeOperatorContext } from './JQLParser';
import { JqlComparisonOperatorContext } from './JQLParser';
import { JqlInOperatorContext } from './JQLParser';
import { JqlIsOperatorContext } from './JQLParser';
import { JqlWasOperatorContext } from './JQLParser';
import { JqlWasInOperatorContext } from './JQLParser';
import { JqlChangedOperatorContext } from './JQLParser';
import { JqlFieldContext } from './JQLParser';
import { JqlFieldPropertyContext } from './JQLParser';
import { JqlCustomFieldContext } from './JQLParser';
import { JqlStringContext } from './JQLParser';
import { JqlNumberContext } from './JQLParser';
import { JqlOperandContext } from './JQLParser';
import { JqlEmptyContext } from './JQLParser';
import { JqlValueContext } from './JQLParser';
import { JqlFunctionContext } from './JQLParser';
import { JqlFunctionNameContext } from './JQLParser';
import { JqlArgumentListContext } from './JQLParser';
import { JqlListContext } from './JQLParser';
import { JqlListStartContext } from './JQLParser';
import { JqlListEndContext } from './JQLParser';
import { JqlPropertyArgumentContext } from './JQLParser';
import { JqlArgumentContext } from './JQLParser';
import { JqlWasPredicateContext } from './JQLParser';
import { JqlChangedPredicateContext } from './JQLParser';
import { JqlDatePredicateOperatorContext } from './JQLParser';
import { JqlDateRangePredicateOperatorContext } from './JQLParser';
import { JqlUserPredicateOperatorContext } from './JQLParser';
import { JqlValuePredicateOperatorContext } from './JQLParser';
import { JqlPredicateOperandContext } from './JQLParser';
import { JqlOrderByContext } from './JQLParser';
import { JqlSearchSortContext } from './JQLParser';

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `JQLParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface JQLParserVisitor<Result> extends ParseTreeVisitor<Result> {
  /**
   * Visit a parse tree produced by the `jqlNumberField`
   * labeled alternative in `JQLParser.jqlField`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlNumberField?: (ctx: JqlNumberFieldContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlNonNumberField`
   * labeled alternative in `JQLParser.jqlField`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlNonNumberField?: (ctx: JqlNonNumberFieldContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlEqualsClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlEqualsClause?: (ctx: JqlEqualsClauseContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlLikeClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlLikeClause?: (ctx: JqlLikeClauseContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlComparisonClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlComparisonClause?: (ctx: JqlComparisonClauseContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlInClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlInClause?: (ctx: JqlInClauseContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlIsClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlIsClause?: (ctx: JqlIsClauseContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlWasClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlWasClause?: (ctx: JqlWasClauseContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlWasInClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlWasInClause?: (ctx: JqlWasInClauseContext) => Result;

  /**
   * Visit a parse tree produced by the `jqlChangedClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlChangedClause?: (ctx: JqlChangedClauseContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlQuery`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlQuery?: (ctx: JqlQueryContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlWhere`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlWhere?: (ctx: JqlWhereContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlOrClause`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlOrClause?: (ctx: JqlOrClauseContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlAndClause`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlAndClause?: (ctx: JqlAndClauseContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlNotClause`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlNotClause?: (ctx: JqlNotClauseContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlSubClause`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlSubClause?: (ctx: JqlSubClauseContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlTerminalClause`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlTerminalClause?: (ctx: JqlTerminalClauseContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlTerminalClauseRhs?: (ctx: JqlTerminalClauseRhsContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlEqualsOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlEqualsOperator?: (ctx: JqlEqualsOperatorContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlLikeOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlLikeOperator?: (ctx: JqlLikeOperatorContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlComparisonOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlComparisonOperator?: (ctx: JqlComparisonOperatorContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlInOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlInOperator?: (ctx: JqlInOperatorContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlIsOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlIsOperator?: (ctx: JqlIsOperatorContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlWasOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlWasOperator?: (ctx: JqlWasOperatorContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlWasInOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlWasInOperator?: (ctx: JqlWasInOperatorContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlChangedOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlChangedOperator?: (ctx: JqlChangedOperatorContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlField`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlField?: (ctx: JqlFieldContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlFieldProperty`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlFieldProperty?: (ctx: JqlFieldPropertyContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlCustomField`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlCustomField?: (ctx: JqlCustomFieldContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlString`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlString?: (ctx: JqlStringContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlNumber`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlNumber?: (ctx: JqlNumberContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlOperand`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlOperand?: (ctx: JqlOperandContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlEmpty`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlEmpty?: (ctx: JqlEmptyContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlValue`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlValue?: (ctx: JqlValueContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlFunction`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlFunction?: (ctx: JqlFunctionContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlFunctionName`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlFunctionName?: (ctx: JqlFunctionNameContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlArgumentList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlArgumentList?: (ctx: JqlArgumentListContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlList?: (ctx: JqlListContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlListStart`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlListStart?: (ctx: JqlListStartContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlListEnd`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlListEnd?: (ctx: JqlListEndContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlPropertyArgument`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlPropertyArgument?: (ctx: JqlPropertyArgumentContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlArgument`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlArgument?: (ctx: JqlArgumentContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlWasPredicate`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlWasPredicate?: (ctx: JqlWasPredicateContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlChangedPredicate`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlChangedPredicate?: (ctx: JqlChangedPredicateContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlDatePredicateOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlDatePredicateOperator?: (
    ctx: JqlDatePredicateOperatorContext,
  ) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlDateRangePredicateOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlDateRangePredicateOperator?: (
    ctx: JqlDateRangePredicateOperatorContext,
  ) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlUserPredicateOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlUserPredicateOperator?: (
    ctx: JqlUserPredicateOperatorContext,
  ) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlValuePredicateOperator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlValuePredicateOperator?: (
    ctx: JqlValuePredicateOperatorContext,
  ) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlPredicateOperand`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlPredicateOperand?: (ctx: JqlPredicateOperandContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlOrderBy`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlOrderBy?: (ctx: JqlOrderByContext) => Result;

  /**
   * Visit a parse tree produced by `JQLParser.jqlSearchSort`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJqlSearchSort?: (ctx: JqlSearchSortContext) => Result;
}
