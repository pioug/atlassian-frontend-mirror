import { JqlOrderByContext, JqlSearchSortContext } from '@atlaskit/jql-parser';

import { ORDER_BY_DIRECTION_ASC, ORDER_BY_DIRECTION_DESC } from '../constants';
import { internalCreators } from '../creators';
import { OrderBy, OrderByField } from '../types';
import { notUndefined } from '../utils';

import {
  getPositionFromContext,
  getPositionFromToken,
  JastBuildingVisitor,
} from './common';
import { FieldVisitor } from './field';

export class OrderByVisitor extends JastBuildingVisitor<OrderBy> {
  searchSortVisitor = new SearchSortVisitor(this.tokens);

  visitJqlOrderBy = (ctx: JqlOrderByContext): OrderBy | void => {
    // If this rule returned due to an exception then the order by operator is incomplete so we should exit early,
    // e.g. 'order '.
    if (ctx.exception) {
      return undefined;
    }

    const operator = internalCreators.orderByOperator(
      getPositionFromToken(ctx.ORDER().payload, ctx.BY().payload),
    );

    const fields = ctx
      .jqlSearchSort()
      .map(searchSortCtx => searchSortCtx.accept(this.searchSortVisitor))
      .filter(notUndefined);

    return internalCreators.orderBy(
      fields,
      operator,
      getPositionFromContext(ctx),
    );
  };
}

class SearchSortVisitor extends JastBuildingVisitor<OrderByField | void> {
  fieldVisitor = new FieldVisitor(this.tokens);

  visitJqlSearchSort = (ctx: JqlSearchSortContext): OrderByField | void => {
    const fieldCtx = ctx.jqlField();

    // If the field rule is returned due to an exception then we should ignore this search search rule. This happens
    // when there are no fields following and order by clause, e.g. 'order by '
    if (fieldCtx.exception) {
      return undefined;
    }

    let direction;
    const desc = ctx.DESC();
    const asc = ctx.ASC();
    if (desc !== undefined) {
      direction = internalCreators.orderByDirection(
        ORDER_BY_DIRECTION_DESC,
        getPositionFromToken(desc.payload),
      );
    } else if (asc !== undefined) {
      direction = internalCreators.orderByDirection(
        ORDER_BY_DIRECTION_ASC,
        getPositionFromToken(asc.payload),
      );
    }

    return internalCreators.orderByField(
      ctx.jqlField().accept(this.fieldVisitor),
      direction,
      getPositionFromContext(ctx),
    );
  };
}
