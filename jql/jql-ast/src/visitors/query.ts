import { type JqlQueryContext } from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import { type Query } from '../types';

import { getPositionFromContext, JastBuildingVisitor } from './common';
import { OrderByVisitor } from './order-by';
import { WhereVisitor } from './where';

export class QueryVisitor extends JastBuildingVisitor<Query> {
	whereVisitor: WhereVisitor = new WhereVisitor(this.tokens);
	orderByVisitor: OrderByVisitor = new OrderByVisitor(this.tokens);

	visitJqlQuery = (ctx: JqlQueryContext): Query => {
		const whereContext = ctx.jqlWhere();
		const orderByContext = ctx.jqlOrderBy();

		return internalCreators.query(
			whereContext && whereContext.accept(this.whereVisitor),
			orderByContext && orderByContext.accept(this.orderByVisitor),
			getPositionFromContext(ctx),
		);
	};
}
