import { type BufferedTokenStream, type ParserRuleContext, type Token } from 'antlr4ts';
import { type ErrorNode, type RuleNode } from 'antlr4ts/tree';

import {
	type JqlAndClauseContext,
	type JqlChangedClauseContext,
	type JqlChangedOperatorContext,
	type JqlComparisonClauseContext,
	type JqlComparisonOperatorContext,
	type JqlEqualsClauseContext,
	type JqlEqualsOperatorContext,
	type JqlFieldContext,
	type JqlInClauseContext,
	type JqlInOperatorContext,
	type JqlIsClauseContext,
	type JqlIsOperatorContext,
	JQLLexer,
	type JqlLikeClauseContext,
	type JqlLikeOperatorContext,
	type JqlListContext,
	type JqlNonNumberFieldContext,
	type JqlNotClauseContext,
	type JqlNumberFieldContext,
	type JqlOrClauseContext,
	JQLParser,
	type JQLParserVisitor,
	type JqlQueryContext,
	type JqlSubClauseContext,
	type JqlTerminalClauseContext,
	type JqlWasClauseContext,
	type JqlWasInClauseContext,
	type JqlWasInOperatorContext,
	type JqlWasOperatorContext,
	type JqlWhereContext,
} from '@atlaskit/jql-parser';

import { type RuleSuggestion } from '../base-autocomplete/types';

import { ORDER_BY_CLAUSE, WHERE_CLAUSE } from './constants';
import {
	type JQLRuleContext,
	type JQLRuleContextWithErrors,
	type MaybeParserRuleContext,
} from './types';
import { getPositionFromParserRule, isOperator, normalizeText } from './util';

export class RuleContextVisitor implements JQLParserVisitor<JQLRuleContext> {
	private readonly ruleList: number[];
	private readonly rule: number;
	private readonly tokenStream: BufferedTokenStream;
	private readonly maybeCaretToken: Token | void;
	private readonly replacePositionStart: number;

	constructor(
		ruleSuggestion: RuleSuggestion<JQLRuleContext>,
		ruleList: number[],
		rule: number,
		tokenStream: BufferedTokenStream,
		maybeCaretToken: Token | void,
	) {
		this.ruleList = ruleList;
		this.rule = rule;
		this.tokenStream = tokenStream;
		this.maybeCaretToken = maybeCaretToken;
		[this.replacePositionStart] = ruleSuggestion.replacePosition;
	}

	visitJqlQuery = (ctx: JqlQueryContext): JQLRuleContext => {
		const whereCtx = ctx.jqlWhere();
		const orderByCtx = ctx.jqlOrderBy();
		const ctxToVisit = this.getCtxToVisit([whereCtx, orderByCtx]);

		const ruleContext: JQLRuleContext = {
			...ctxToVisit?.accept(this),
		};

		if (this.rule === JQLParser.RULE_jqlField) {
			ruleContext.clause = this.ruleList.includes(JQLParser.RULE_jqlWhere)
				? WHERE_CLAUSE
				: ORDER_BY_CLAUSE;
		}

		return ruleContext;
	};

	visitJqlWhere = (ctx: JqlWhereContext): JQLRuleContext => {
		return ctx.jqlOrClause().accept(this);
	};

	visitJqlOrderBy = (): JQLRuleContext => {
		return {};
	};

	visitJqlOrClause = (ctx: JqlOrClauseContext): JQLRuleContext => {
		const ctxToVisit = this.getCtxToVisit(ctx.jqlAndClause());
		return { ...ctxToVisit?.accept(this) };
	};

	visitJqlAndClause = (ctx: JqlAndClauseContext): JQLRuleContext => {
		const ctxToVisit = this.getCtxToVisit(ctx.jqlNotClause());
		return { ...ctxToVisit?.accept(this) };
	};

	visitJqlNotClause = (ctx: JqlNotClauseContext): JQLRuleContext => {
		const ctxToVisit = this.getCtxToVisit([
			ctx.jqlNotClause(),
			ctx.jqlSubClause(),
			ctx.jqlTerminalClause(),
		]);

		return { ...ctxToVisit?.accept(this) };
	};

	visitJqlSubClause = (ctx: JqlSubClauseContext): JQLRuleContext => {
		const orCtx = ctx.jqlOrClause();
		return { ...orCtx?.accept(this) };
	};

	visitJqlTerminalClause = (ctx: JqlTerminalClauseContext): JQLRuleContext => {
		const fieldCtx = ctx.jqlField();
		const rhsCtx = ctx.jqlTerminalClauseRhs();
		const { errorNodes, ...rhsRuleContext } = rhsCtx.accept(this);
		return {
			...fieldCtx.accept(this),
			...rhsRuleContext,
			...this.getCtxFromErrorNodes(errorNodes),
		};
	};

	visitJqlField = (ctx: JqlFieldContext): JQLRuleContext => {
		if (this.rule === JQLParser.RULE_jqlField) {
			return {};
		}
		return { field: this.tokenStream.getText(ctx) };
	};

	visitJqlNumberField = (ctx: JqlNumberFieldContext): JQLRuleContext => {
		return this.visitJqlField(ctx);
	};

	visitJqlNonNumberField = (ctx: JqlNonNumberFieldContext): JQLRuleContext => {
		return this.visitJqlField(ctx);
	};

	visitJqlEqualsClause = (ctx: JqlEqualsClauseContext): JQLRuleContext => {
		// We can skip visiting operand in this case as this clause type doesn't support list operands
		return ctx.jqlEqualsOperator().accept(this);
	};

	visitJqlEqualsOperator = (ctx: JqlEqualsOperatorContext): JQLRuleContext => {
		return this.visitOperator(ctx);
	};

	visitJqlLikeClause = (ctx: JqlLikeClauseContext): JQLRuleContext => {
		// We can skip visiting operand in this case as this clause type doesn't support list operands
		return ctx.jqlLikeOperator().accept(this);
	};

	visitJqlLikeOperator = (ctx: JqlLikeOperatorContext): JQLRuleContext => {
		return this.visitOperator(ctx);
	};

	visitJqlComparisonClause = (ctx: JqlComparisonClauseContext): JQLRuleContext => {
		// We can skip visiting operand in this case as this clause type doesn't support list operands
		return ctx.jqlComparisonOperator().accept(this);
	};

	visitJqlComparisonOperator = (ctx: JqlComparisonOperatorContext): JQLRuleContext => {
		return this.visitOperator(ctx);
	};

	visitJqlInClause = (ctx: JqlInClauseContext): JQLRuleContext => {
		const operatorContext = ctx.jqlInOperator().accept(this);

		const listCtx = ctx.jqlList();
		if (listCtx !== undefined && this.isReplacePosAtCtx(listCtx)) {
			return {
				...operatorContext,
				...listCtx.accept(this),
			};
		}

		return { ...operatorContext };
	};

	visitJqlInOperator = (ctx: JqlInOperatorContext): JQLRuleContext => {
		return this.visitOperator(ctx);
	};

	visitJqlIsClause = (ctx: JqlIsClauseContext): JQLRuleContext => {
		// We can skip visiting operand in this case as this clause type doesn't support list operands
		return ctx.jqlIsOperator().accept(this);
	};

	visitJqlIsOperator = (ctx: JqlIsOperatorContext): JQLRuleContext => {
		return this.visitOperator(ctx);
	};

	visitJqlWasClause = (ctx: JqlWasClauseContext): JQLRuleContext => {
		// We can skip visiting operand in this case as this clause type doesn't support list operands
		return ctx.jqlWasOperator().accept(this);
	};

	visitJqlWasOperator = (ctx: JqlWasOperatorContext): JQLRuleContext => {
		return this.visitOperator(ctx);
	};

	visitJqlWasInClause = (ctx: JqlWasInClauseContext): JQLRuleContext => {
		const operatorContext = ctx.jqlWasInOperator().accept(this);

		const listCtx = ctx.jqlList();
		if (listCtx !== undefined && this.isReplacePosAtCtx(listCtx)) {
			return {
				...operatorContext,
				...listCtx.accept(this),
			};
		}

		return { ...operatorContext };
	};

	visitJqlWasInOperator = (ctx: JqlWasInOperatorContext): JQLRuleContext => {
		return this.visitOperator(ctx);
	};

	visitJqlChangedClause = (ctx: JqlChangedClauseContext): JQLRuleContext => {
		// We can skip visiting operand in this case as this clause type doesn't support list operands
		return ctx.jqlChangedOperator().accept(this);
	};

	visitJqlChangedOperator = (ctx: JqlChangedOperatorContext): JQLRuleContext => {
		return this.visitOperator(ctx);
	};

	visitJqlList = (ctx: JqlListContext): JQLRuleContext => {
		const [_, leftParenStop] = getPositionFromParserRule(ctx.jqlListStart());

		try {
			const [rightParenStart] = getPositionFromParserRule(ctx.jqlListEnd());
			if (
				this.replacePositionStart >= leftParenStop &&
				this.replacePositionStart <= rightParenStart
			) {
				return {
					isList: true,
				};
			}
		} catch (error) {
			// There are some queries (e.g. "project in (jsw jsd") where visiting `jqlListEnd` context
			// results in an error, as RPAREN token doesn't exist and parse tree contains an error node
			// that prevents ANTLR from recovering. For context purposes, this means we are inside the list.
			return {
				isList: true,
			};
		}

		return {};
	};

	private visitOperator = (ctx: ParserRuleContext): JQLRuleContext => {
		// In some situations, e.g. "project was in|", autocomplete returns both operator and operand
		// rules as candidates. For the operand rule, we want to have "was" as operator in context, even
		// though the parse tree in this case says that the operator is "was in". For this reason, we
		// get text before replace position start and check if result is one of the supported operators.
		const textBeforeReplacePosition = this.tokenStream
			.getText(ctx)
			.substring(0, this.replacePositionStart - ctx.start.startIndex);

		const maybeOperator = normalizeText(textBeforeReplacePosition);

		if (isOperator(maybeOperator)) {
			return {
				operator: maybeOperator,
			};
		}

		return {};
	};

	/**
	 * Returns whether replace position start for our candidate lies within the provided rule context,
	 * or it's a whitespace token starting where the rule context ends. In those cases, we can assume
	 * the provided rule context contains the relevant contextual data for our candidate rule.
	 *
	 * NOTE: This assumption is not airtight and there could be scenarios which violate this
	 * assumption if we introduce new candidates or context nodes in the future.
	 */
	private isReplacePosAtCtx = (ctx: ParserRuleContext): boolean => {
		const [start, stop] = getPositionFromParserRule(ctx);
		return (
			(this.replacePositionStart >= start && this.replacePositionStart <= stop) ||
			(!!this.maybeCaretToken &&
				this.maybeCaretToken.type === JQLLexer.MATCHWS &&
				this.maybeCaretToken.startIndex === stop)
		);
	};

	/**
	 * Given a list of parser rule contexts, this function returns which one should be visited
	 * based on replace position start (i.e. the parser rule context that contains the relevant
	 * information for our candidate rule).
	 *
	 * This can be called by visitor functions to select the adequate child rule context to visit,
	 * for instance when we have multiple terminal clauses in a compound clause.
	 */
	private getCtxToVisit = (contexts: MaybeParserRuleContext[]): MaybeParserRuleContext => {
		const definedContexts = contexts.filter(
			(context) => context !== undefined,
		) as ParserRuleContext[];
		for (let i = 0; i < definedContexts.length; i++) {
			const ctx = definedContexts[i];
			if (this.isReplacePosAtCtx(ctx)) {
				return ctx;
			}
		}
		return undefined;
	};

	/**
	 * Recover from the clause type ambiguities described in {@link visitChildren}.
	 */
	private getCtxFromErrorNodes = (errorNodes: ErrorNode[] | undefined): JQLRuleContext => {
		if (errorNodes !== undefined) {
			const textBeforeReplacePosition = errorNodes
				.filter((errorNode) => errorNode.payload.startIndex < this.replacePositionStart)
				.map((errorNode) => errorNode.payload.text)
				.join(' ');

			const maybeOperator = normalizeText(textBeforeReplacePosition);

			if (isOperator(maybeOperator)) {
				return {
					operator: maybeOperator,
				};
			}
		}

		return {};
	};

	/**
	 * If this function is called, it means parse tree contains error nodes. In some situations, this
	 * is due to ambiguities we can recover from (e.g. "issuetype was ", which can be a WAS or WAS IN
	 * clause). To help return the right context in these cases, we expose error nodes in the current
	 * rule context, allowing upstream visitors to decide how to handle them.
	 */
	visitChildren = (node: RuleNode): JQLRuleContextWithErrors => {
		const errorNodes: ErrorNode[] = [];
		for (let i = 0; i < node.childCount; i++) {
			errorNodes.push(node.getChild(i) as ErrorNode);
		}
		return { errorNodes };
	};

	visit = () => {
		throw new Error('Unsupported operation visit(ParseTree)');
	};

	visitErrorNode = () => {
		throw new Error('Unsupported operation visitErrorNode(ErrorNode)');
	};

	visitTerminal = () => {
		throw new Error('Unsupported operation visitTerminal(TerminalNode)');
	};
}
