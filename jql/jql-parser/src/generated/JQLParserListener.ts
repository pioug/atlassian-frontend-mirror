/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// Generated from JQLParser.g4 by ANTLR 4.7.3-SNAPSHOT

import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

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
 * This interface defines a complete listener for a parse tree produced by
 * `JQLParser`.
 */
export interface JQLParserListener extends ParseTreeListener {
  /**
   * Enter a parse tree produced by the `jqlNumberField`
   * labeled alternative in `JQLParser.jqlField`.
   * @param ctx the parse tree
   */
  enterJqlNumberField?: (ctx: JqlNumberFieldContext) => void;
  /**
   * Exit a parse tree produced by the `jqlNumberField`
   * labeled alternative in `JQLParser.jqlField`.
   * @param ctx the parse tree
   */
  exitJqlNumberField?: (ctx: JqlNumberFieldContext) => void;

  /**
   * Enter a parse tree produced by the `jqlNonNumberField`
   * labeled alternative in `JQLParser.jqlField`.
   * @param ctx the parse tree
   */
  enterJqlNonNumberField?: (ctx: JqlNonNumberFieldContext) => void;
  /**
   * Exit a parse tree produced by the `jqlNonNumberField`
   * labeled alternative in `JQLParser.jqlField`.
   * @param ctx the parse tree
   */
  exitJqlNonNumberField?: (ctx: JqlNonNumberFieldContext) => void;

  /**
   * Enter a parse tree produced by the `jqlEqualsClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlEqualsClause?: (ctx: JqlEqualsClauseContext) => void;
  /**
   * Exit a parse tree produced by the `jqlEqualsClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlEqualsClause?: (ctx: JqlEqualsClauseContext) => void;

  /**
   * Enter a parse tree produced by the `jqlLikeClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlLikeClause?: (ctx: JqlLikeClauseContext) => void;
  /**
   * Exit a parse tree produced by the `jqlLikeClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlLikeClause?: (ctx: JqlLikeClauseContext) => void;

  /**
   * Enter a parse tree produced by the `jqlComparisonClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlComparisonClause?: (ctx: JqlComparisonClauseContext) => void;
  /**
   * Exit a parse tree produced by the `jqlComparisonClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlComparisonClause?: (ctx: JqlComparisonClauseContext) => void;

  /**
   * Enter a parse tree produced by the `jqlInClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlInClause?: (ctx: JqlInClauseContext) => void;
  /**
   * Exit a parse tree produced by the `jqlInClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlInClause?: (ctx: JqlInClauseContext) => void;

  /**
   * Enter a parse tree produced by the `jqlIsClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlIsClause?: (ctx: JqlIsClauseContext) => void;
  /**
   * Exit a parse tree produced by the `jqlIsClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlIsClause?: (ctx: JqlIsClauseContext) => void;

  /**
   * Enter a parse tree produced by the `jqlWasClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlWasClause?: (ctx: JqlWasClauseContext) => void;
  /**
   * Exit a parse tree produced by the `jqlWasClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlWasClause?: (ctx: JqlWasClauseContext) => void;

  /**
   * Enter a parse tree produced by the `jqlWasInClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlWasInClause?: (ctx: JqlWasInClauseContext) => void;
  /**
   * Exit a parse tree produced by the `jqlWasInClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlWasInClause?: (ctx: JqlWasInClauseContext) => void;

  /**
   * Enter a parse tree produced by the `jqlChangedClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlChangedClause?: (ctx: JqlChangedClauseContext) => void;
  /**
   * Exit a parse tree produced by the `jqlChangedClause`
   * labeled alternative in `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlChangedClause?: (ctx: JqlChangedClauseContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlQuery`.
   * @param ctx the parse tree
   */
  enterJqlQuery?: (ctx: JqlQueryContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlQuery`.
   * @param ctx the parse tree
   */
  exitJqlQuery?: (ctx: JqlQueryContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlWhere`.
   * @param ctx the parse tree
   */
  enterJqlWhere?: (ctx: JqlWhereContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlWhere`.
   * @param ctx the parse tree
   */
  exitJqlWhere?: (ctx: JqlWhereContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlOrClause`.
   * @param ctx the parse tree
   */
  enterJqlOrClause?: (ctx: JqlOrClauseContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlOrClause`.
   * @param ctx the parse tree
   */
  exitJqlOrClause?: (ctx: JqlOrClauseContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlAndClause`.
   * @param ctx the parse tree
   */
  enterJqlAndClause?: (ctx: JqlAndClauseContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlAndClause`.
   * @param ctx the parse tree
   */
  exitJqlAndClause?: (ctx: JqlAndClauseContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlNotClause`.
   * @param ctx the parse tree
   */
  enterJqlNotClause?: (ctx: JqlNotClauseContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlNotClause`.
   * @param ctx the parse tree
   */
  exitJqlNotClause?: (ctx: JqlNotClauseContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlSubClause`.
   * @param ctx the parse tree
   */
  enterJqlSubClause?: (ctx: JqlSubClauseContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlSubClause`.
   * @param ctx the parse tree
   */
  exitJqlSubClause?: (ctx: JqlSubClauseContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlTerminalClause`.
   * @param ctx the parse tree
   */
  enterJqlTerminalClause?: (ctx: JqlTerminalClauseContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlTerminalClause`.
   * @param ctx the parse tree
   */
  exitJqlTerminalClause?: (ctx: JqlTerminalClauseContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  enterJqlTerminalClauseRhs?: (ctx: JqlTerminalClauseRhsContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlTerminalClauseRhs`.
   * @param ctx the parse tree
   */
  exitJqlTerminalClauseRhs?: (ctx: JqlTerminalClauseRhsContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlEqualsOperator`.
   * @param ctx the parse tree
   */
  enterJqlEqualsOperator?: (ctx: JqlEqualsOperatorContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlEqualsOperator`.
   * @param ctx the parse tree
   */
  exitJqlEqualsOperator?: (ctx: JqlEqualsOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlLikeOperator`.
   * @param ctx the parse tree
   */
  enterJqlLikeOperator?: (ctx: JqlLikeOperatorContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlLikeOperator`.
   * @param ctx the parse tree
   */
  exitJqlLikeOperator?: (ctx: JqlLikeOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlComparisonOperator`.
   * @param ctx the parse tree
   */
  enterJqlComparisonOperator?: (ctx: JqlComparisonOperatorContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlComparisonOperator`.
   * @param ctx the parse tree
   */
  exitJqlComparisonOperator?: (ctx: JqlComparisonOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlInOperator`.
   * @param ctx the parse tree
   */
  enterJqlInOperator?: (ctx: JqlInOperatorContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlInOperator`.
   * @param ctx the parse tree
   */
  exitJqlInOperator?: (ctx: JqlInOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlIsOperator`.
   * @param ctx the parse tree
   */
  enterJqlIsOperator?: (ctx: JqlIsOperatorContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlIsOperator`.
   * @param ctx the parse tree
   */
  exitJqlIsOperator?: (ctx: JqlIsOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlWasOperator`.
   * @param ctx the parse tree
   */
  enterJqlWasOperator?: (ctx: JqlWasOperatorContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlWasOperator`.
   * @param ctx the parse tree
   */
  exitJqlWasOperator?: (ctx: JqlWasOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlWasInOperator`.
   * @param ctx the parse tree
   */
  enterJqlWasInOperator?: (ctx: JqlWasInOperatorContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlWasInOperator`.
   * @param ctx the parse tree
   */
  exitJqlWasInOperator?: (ctx: JqlWasInOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlChangedOperator`.
   * @param ctx the parse tree
   */
  enterJqlChangedOperator?: (ctx: JqlChangedOperatorContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlChangedOperator`.
   * @param ctx the parse tree
   */
  exitJqlChangedOperator?: (ctx: JqlChangedOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlField`.
   * @param ctx the parse tree
   */
  enterJqlField?: (ctx: JqlFieldContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlField`.
   * @param ctx the parse tree
   */
  exitJqlField?: (ctx: JqlFieldContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlFieldProperty`.
   * @param ctx the parse tree
   */
  enterJqlFieldProperty?: (ctx: JqlFieldPropertyContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlFieldProperty`.
   * @param ctx the parse tree
   */
  exitJqlFieldProperty?: (ctx: JqlFieldPropertyContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlCustomField`.
   * @param ctx the parse tree
   */
  enterJqlCustomField?: (ctx: JqlCustomFieldContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlCustomField`.
   * @param ctx the parse tree
   */
  exitJqlCustomField?: (ctx: JqlCustomFieldContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlString`.
   * @param ctx the parse tree
   */
  enterJqlString?: (ctx: JqlStringContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlString`.
   * @param ctx the parse tree
   */
  exitJqlString?: (ctx: JqlStringContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlNumber`.
   * @param ctx the parse tree
   */
  enterJqlNumber?: (ctx: JqlNumberContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlNumber`.
   * @param ctx the parse tree
   */
  exitJqlNumber?: (ctx: JqlNumberContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlOperand`.
   * @param ctx the parse tree
   */
  enterJqlOperand?: (ctx: JqlOperandContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlOperand`.
   * @param ctx the parse tree
   */
  exitJqlOperand?: (ctx: JqlOperandContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlEmpty`.
   * @param ctx the parse tree
   */
  enterJqlEmpty?: (ctx: JqlEmptyContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlEmpty`.
   * @param ctx the parse tree
   */
  exitJqlEmpty?: (ctx: JqlEmptyContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlValue`.
   * @param ctx the parse tree
   */
  enterJqlValue?: (ctx: JqlValueContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlValue`.
   * @param ctx the parse tree
   */
  exitJqlValue?: (ctx: JqlValueContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlFunction`.
   * @param ctx the parse tree
   */
  enterJqlFunction?: (ctx: JqlFunctionContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlFunction`.
   * @param ctx the parse tree
   */
  exitJqlFunction?: (ctx: JqlFunctionContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlFunctionName`.
   * @param ctx the parse tree
   */
  enterJqlFunctionName?: (ctx: JqlFunctionNameContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlFunctionName`.
   * @param ctx the parse tree
   */
  exitJqlFunctionName?: (ctx: JqlFunctionNameContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlArgumentList`.
   * @param ctx the parse tree
   */
  enterJqlArgumentList?: (ctx: JqlArgumentListContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlArgumentList`.
   * @param ctx the parse tree
   */
  exitJqlArgumentList?: (ctx: JqlArgumentListContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlList`.
   * @param ctx the parse tree
   */
  enterJqlList?: (ctx: JqlListContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlList`.
   * @param ctx the parse tree
   */
  exitJqlList?: (ctx: JqlListContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlListStart`.
   * @param ctx the parse tree
   */
  enterJqlListStart?: (ctx: JqlListStartContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlListStart`.
   * @param ctx the parse tree
   */
  exitJqlListStart?: (ctx: JqlListStartContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlListEnd`.
   * @param ctx the parse tree
   */
  enterJqlListEnd?: (ctx: JqlListEndContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlListEnd`.
   * @param ctx the parse tree
   */
  exitJqlListEnd?: (ctx: JqlListEndContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlPropertyArgument`.
   * @param ctx the parse tree
   */
  enterJqlPropertyArgument?: (ctx: JqlPropertyArgumentContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlPropertyArgument`.
   * @param ctx the parse tree
   */
  exitJqlPropertyArgument?: (ctx: JqlPropertyArgumentContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlArgument`.
   * @param ctx the parse tree
   */
  enterJqlArgument?: (ctx: JqlArgumentContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlArgument`.
   * @param ctx the parse tree
   */
  exitJqlArgument?: (ctx: JqlArgumentContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlWasPredicate`.
   * @param ctx the parse tree
   */
  enterJqlWasPredicate?: (ctx: JqlWasPredicateContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlWasPredicate`.
   * @param ctx the parse tree
   */
  exitJqlWasPredicate?: (ctx: JqlWasPredicateContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlChangedPredicate`.
   * @param ctx the parse tree
   */
  enterJqlChangedPredicate?: (ctx: JqlChangedPredicateContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlChangedPredicate`.
   * @param ctx the parse tree
   */
  exitJqlChangedPredicate?: (ctx: JqlChangedPredicateContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlDatePredicateOperator`.
   * @param ctx the parse tree
   */
  enterJqlDatePredicateOperator?: (
    ctx: JqlDatePredicateOperatorContext,
  ) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlDatePredicateOperator`.
   * @param ctx the parse tree
   */
  exitJqlDatePredicateOperator?: (ctx: JqlDatePredicateOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlDateRangePredicateOperator`.
   * @param ctx the parse tree
   */
  enterJqlDateRangePredicateOperator?: (
    ctx: JqlDateRangePredicateOperatorContext,
  ) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlDateRangePredicateOperator`.
   * @param ctx the parse tree
   */
  exitJqlDateRangePredicateOperator?: (
    ctx: JqlDateRangePredicateOperatorContext,
  ) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlUserPredicateOperator`.
   * @param ctx the parse tree
   */
  enterJqlUserPredicateOperator?: (
    ctx: JqlUserPredicateOperatorContext,
  ) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlUserPredicateOperator`.
   * @param ctx the parse tree
   */
  exitJqlUserPredicateOperator?: (ctx: JqlUserPredicateOperatorContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlValuePredicateOperator`.
   * @param ctx the parse tree
   */
  enterJqlValuePredicateOperator?: (
    ctx: JqlValuePredicateOperatorContext,
  ) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlValuePredicateOperator`.
   * @param ctx the parse tree
   */
  exitJqlValuePredicateOperator?: (
    ctx: JqlValuePredicateOperatorContext,
  ) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlPredicateOperand`.
   * @param ctx the parse tree
   */
  enterJqlPredicateOperand?: (ctx: JqlPredicateOperandContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlPredicateOperand`.
   * @param ctx the parse tree
   */
  exitJqlPredicateOperand?: (ctx: JqlPredicateOperandContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlOrderBy`.
   * @param ctx the parse tree
   */
  enterJqlOrderBy?: (ctx: JqlOrderByContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlOrderBy`.
   * @param ctx the parse tree
   */
  exitJqlOrderBy?: (ctx: JqlOrderByContext) => void;

  /**
   * Enter a parse tree produced by `JQLParser.jqlSearchSort`.
   * @param ctx the parse tree
   */
  enterJqlSearchSort?: (ctx: JqlSearchSortContext) => void;
  /**
   * Exit a parse tree produced by `JQLParser.jqlSearchSort`.
   * @param ctx the parse tree
   */
  exitJqlSearchSort?: (ctx: JqlSearchSortContext) => void;
}
