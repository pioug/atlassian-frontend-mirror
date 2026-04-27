import { type RuleNode } from 'antlr4ts/tree';

import {
	type JqlChangedClauseContext,
	type JqlComparisonClauseContext,
	type JqlEmptyContext,
	type JqlEqualsClauseContext,
	type JqlFunctionContext,
	type JqlInClauseContext,
	type JqlIsClauseContext,
	type JqlLikeClauseContext,
	type JqlListContext,
	type JqlTerminalClauseContext,
	type JqlValueContext,
	type JqlWasClauseContext,
	type JqlWasInClauseContext,
} from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import { type Clause, type Operand, type Operator, type Predicate, type TerminalClause, type TerminalClauseRhs } from '../types';
import { notUndefined } from '../utils';

import { getPositionFromContext, JastBuildingVisitor } from './common';
import { FieldVisitor } from './field';
import { OperandVisitor } from './operand';
import { OperatorVisitor } from './operator';
import { PredicateVisitor } from './predicate';

type OperandContext =
	| JqlEmptyContext
	| JqlValueContext
	| JqlFunctionContext
	| JqlListContext
	| void;

export class TerminalClauseVisitor extends JastBuildingVisitor<Clause> {
	fieldVisitor: FieldVisitor = new FieldVisitor(this.tokens);
	terminalClauseRhsVisitor: TerminalClauseRhsVisitor = new TerminalClauseRhsVisitor(this.tokens);

	visitJqlTerminalClause = (ctx: JqlTerminalClauseContext): TerminalClause => {
		const field = ctx.jqlField().accept(this.fieldVisitor);
		const { operator, operand, predicates } = ctx
			.jqlTerminalClauseRhs()
			.accept(this.terminalClauseRhsVisitor);
		const position = getPositionFromContext(ctx);
		return internalCreators.terminalClause(field, operator, operand, predicates, position);
	};
}

class TerminalClauseRhsVisitor extends JastBuildingVisitor<TerminalClauseRhs> {
	operatorVisitor: OperatorVisitor = new OperatorVisitor(this.tokens);
	terminalClauseOperandVisitor: TerminalClauseOperandVisitor = new TerminalClauseOperandVisitor(this.tokens);
	predicateVisitor: PredicateVisitor = new PredicateVisitor(this.tokens);

	visitJqlEqualsClause = (ctx: JqlEqualsClauseContext): {
        operand: void | Operand;
        operator: void | Operator | undefined;
        predicates: never[];
    } => {
		const operator = ctx.jqlEqualsOperator().accept(this.operatorVisitor);
		const operand = ctx.accept(this.terminalClauseOperandVisitor);
		return { operator, operand, predicates: [] };
	};

	visitJqlLikeClause = (ctx: JqlLikeClauseContext): {
        operand: void | Operand;
        operator: void | Operator | undefined;
        predicates: never[];
    } => {
		const operator = ctx.jqlLikeOperator().accept(this.operatorVisitor);
		const operand = ctx.accept(this.terminalClauseOperandVisitor);
		return { operator, operand, predicates: [] };
	};

	visitJqlComparisonClause = (ctx: JqlComparisonClauseContext): {
        operand: void | Operand;
        operator: void | Operator | undefined;
        predicates: never[];
    } => {
		const operator = ctx.jqlComparisonOperator().accept(this.operatorVisitor);
		const operand = ctx.accept(this.terminalClauseOperandVisitor);
		return { operator, operand, predicates: [] };
	};

	visitJqlInClause = (ctx: JqlInClauseContext): {
        operand: void | Operand;
        operator: void | Operator | undefined;
        predicates: never[];
    } => {
		const operator = ctx.jqlInOperator().accept(this.operatorVisitor);
		const operand = ctx.accept(this.terminalClauseOperandVisitor);
		return { operator, operand, predicates: [] };
	};

	visitJqlIsClause = (ctx: JqlIsClauseContext): {
        operand: void | Operand;
        operator: void | Operator | undefined;
        predicates: never[];
    } => {
		const operator = ctx.jqlIsOperator().accept(this.operatorVisitor);
		const operand = ctx.accept(this.terminalClauseOperandVisitor);
		return { operator, operand, predicates: [] };
	};

	visitJqlWasClause = (ctx: JqlWasClauseContext): {
        operand: void | Operand;
        operator: void | Operator | undefined;
        predicates: Predicate[];
    } => {
		const operator = ctx.jqlWasOperator().accept(this.operatorVisitor);
		const operand = ctx.accept(this.terminalClauseOperandVisitor);
		const predicates = ctx
			.jqlWasPredicate()
			.map((predicate) => predicate.accept(this.predicateVisitor))
			.filter(notUndefined);
		return { operator, operand, predicates };
	};

	visitJqlWasInClause = (ctx: JqlWasInClauseContext): {
        operand: void | Operand;
        operator: void | Operator | undefined;
        predicates: Predicate[];
    } => {
		const operator = ctx.jqlWasInOperator().accept(this.operatorVisitor);
		const operand = ctx.accept(this.terminalClauseOperandVisitor);
		const predicates = ctx
			.jqlWasPredicate()
			.map((predicate) => predicate.accept(this.predicateVisitor))
			.filter(notUndefined);
		return { operator, operand, predicates };
	};

	visitJqlChangedClause = (ctx: JqlChangedClauseContext): TerminalClauseRhs => {
		const operator = ctx.jqlChangedOperator().accept(this.operatorVisitor);
		const predicates = ctx
			.jqlChangedPredicate()
			.map((predicate) => predicate.accept(this.predicateVisitor))
			.filter(notUndefined);
		return { operator, operand: undefined, predicates };
	};

	// Recover from clause type ambiguities, e.g. "issuetype was " (which can be a WAS or WAS IN clause)
	visitChildren = (node: RuleNode): TerminalClauseRhs => {
		const operator = node.accept(this.operatorVisitor);
		return { operator, operand: undefined, predicates: [] };
	};
}

class TerminalClauseOperandVisitor extends JastBuildingVisitor<Operand | void> {
	operandVisitor: OperandVisitor = new OperandVisitor(this.tokens);

	visitJqlEqualsClause = (ctx: JqlEqualsClauseContext): Operand | void => {
		return this.getOperandForContexts([ctx.jqlEmpty(), ctx.jqlValue(), ctx.jqlFunction()]);
	};

	visitJqlLikeClause = (ctx: JqlLikeClauseContext): void | Operand => {
		return this.getOperandForContexts([ctx.jqlEmpty(), ctx.jqlValue(), ctx.jqlFunction()]);
	};

	visitJqlComparisonClause = (ctx: JqlComparisonClauseContext): void | Operand => {
		return this.getOperandForContexts([ctx.jqlValue(), ctx.jqlFunction()]);
	};

	visitJqlInClause = (ctx: JqlInClauseContext): void | Operand => {
		return this.getOperandForContexts([ctx.jqlList(), ctx.jqlFunction()]);
	};

	visitJqlIsClause = (ctx: JqlIsClauseContext): void | Operand => {
		return this.getOperandForContexts([ctx.jqlEmpty()]);
	};

	visitJqlWasClause = (ctx: JqlWasClauseContext): void | Operand => {
		return this.getOperandForContexts([ctx.jqlEmpty(), ctx.jqlValue(), ctx.jqlFunction()]);
	};

	visitJqlWasInClause = (ctx: JqlWasInClauseContext): void | Operand => {
		return this.getOperandForContexts([ctx.jqlList(), ctx.jqlFunction()]);
	};

	getOperandForContexts = (contexts: OperandContext[]): Operand | void => {
		const operandContext = contexts.find(notUndefined);
		return operandContext?.accept(this.operandVisitor);
	};
}
