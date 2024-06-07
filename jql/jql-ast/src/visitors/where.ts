import {
	type JqlAndClauseContext,
	type JqlNotClauseContext,
	type JqlOrClauseContext,
	type JqlSubClauseContext,
	type JqlWhereContext,
} from '@atlaskit/jql-parser';

import { COMPOUND_OPERATOR_AND, COMPOUND_OPERATOR_OR } from '../constants';
import { internalCreators } from '../creators';
import { type Clause } from '../types';
import { notUndefined } from '../utils';

import {
	getPositionFromContext,
	getPositionFromToken,
	getPositionsFromTerminalNodes,
	JastBuildingVisitor,
} from './common';
import { TerminalClauseVisitor } from './terminal-clause';

export class WhereVisitor extends JastBuildingVisitor<Clause | void> {
	terminalClauseVisitor = new TerminalClauseVisitor(this.tokens);

	visitJqlWhere = (ctx: JqlWhereContext): Clause | void => {
		return this.visitJqlOrClause(ctx.jqlOrClause());
	};

	visitJqlOrClause = (ctx: JqlOrClauseContext): Clause | void => {
		const clauses = ctx
			.jqlAndClause()
			.map((andClauseContext) => andClauseContext.accept(this))
			.filter(notUndefined);
		if (clauses.length > 1) {
			const operator = internalCreators.compoundOperator(
				COMPOUND_OPERATOR_OR,
				getPositionsFromTerminalNodes(ctx.OR()),
			);

			return internalCreators.compoundClause(operator, clauses, getPositionFromContext(ctx));
		}

		return clauses.length === 0 ? undefined : clauses[0];
	};

	visitJqlAndClause = (ctx: JqlAndClauseContext): Clause | void => {
		const clauses = ctx
			.jqlNotClause()
			.map((notClauseContext) => notClauseContext.accept(this))
			.filter(notUndefined);

		if (clauses.length > 1) {
			const operator = internalCreators.compoundOperator(
				COMPOUND_OPERATOR_AND,
				getPositionsFromTerminalNodes(ctx.AND()),
			);

			return internalCreators.compoundClause(operator, clauses, getPositionFromContext(ctx));
		}

		return clauses.length === 0 ? undefined : clauses[0];
	};

	visitJqlNotClause = (ctx: JqlNotClauseContext): Clause | void => {
		const notClauseContext = ctx.jqlNotClause();
		const subClauseContext = ctx.jqlSubClause();
		const terminalClauseContext = ctx.jqlTerminalClause();

		let clause: Clause | undefined;

		if (notClauseContext !== undefined) {
			clause = notClauseContext.accept(this) || undefined;
		} else if (subClauseContext !== undefined) {
			clause = subClauseContext.accept(this) || undefined;
		} else if (terminalClauseContext !== undefined) {
			clause = terminalClauseContext.accept(this.terminalClauseVisitor);
		}

		// Our token can be either NOT or !
		let notToken = ctx.NOT();
		notToken = notToken === undefined ? ctx.BANG() : notToken;
		if (notToken && clause) {
			return internalCreators.notClause(
				clause,
				internalCreators.notClauseOperator(getPositionFromToken(notToken.payload)),
				getPositionFromContext(ctx),
			);
		}

		return clause;
	};

	visitJqlSubClause = (ctx: JqlSubClauseContext): Clause | void => {
		return this.visitJqlOrClause(ctx.jqlOrClause());
	};
}
