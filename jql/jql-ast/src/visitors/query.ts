import { JqlQueryContext } from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import { Query } from '../types';

import { getPositionFromContext, JastBuildingVisitor } from './common';
import { OrderByVisitor } from './order-by';
import { WhereVisitor } from './where';

export class QueryVisitor extends JastBuildingVisitor<Query> {
  whereVisitor = new WhereVisitor(this.tokens);
  orderByVisitor = new OrderByVisitor(this.tokens);

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
