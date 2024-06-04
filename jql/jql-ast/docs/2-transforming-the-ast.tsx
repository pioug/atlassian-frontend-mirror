import { code, md } from '@atlaskit/docs';

export default md`

  We define a collection of transformation functions on various node types within the AST. This can be used in conjunction
  with the \`creators\` API to add, remove and update nodes within the tree. The modified tree can be printed to a JQL
  string using the [print API](https://atlaskit.atlassian.com/packages/jql/jql-ast/docs/printing-ast-to-jql-string).

  ### Before you start

  These functions will **mutate the structure of your AST**, meaning any positional data of nodes within the tree may be
  nullified or otherwise inaccurate. As such it's recommended that you clone the AST object before performing any
  transformations if this state is shared across multiple places in your code.

  ## Query

  The following transformations can be applied to the root \`Query\` object in the AST:

  ### appendClause

  Append the provided clause to the query. If there is no previous \`where\` clause then it will be set to the provided
  value, otherwise a compound clause will be formed using the provided compound operator.

  ${code`
enterQuery: (query: Query) => {
    const newClause = creators.terminalClause(
      creators.field('status'),
      creators.operator(OPERATOR_EQUALS),
      creators.valueOperand('open')
    );
    query.appendClause(newClause, COMPOUND_OPERATOR_AND);
}
  `}

  ### removeClause

  Remove the provided clause from the node. If the clause to remove is not found as a child of the current node then no
  changes will be made.

  ${code`
enterQuery: (query: Query) => {
    if (query.where) {
        query.removeClause(query.where);
    }
}
  `}

  ### replaceClause

  Replace the matching child clause with the provided \`nextClause\` node. If the clause to replace is not found as a child
  of the current node then no changes will be made.

  ${code`
enterQuery: (query: Query) => {
    if (query.where) {
        const newClause = creators.terminalClause(
            creators.field('status'),
            creators.operator(OPERATOR_EQUALS),
            creators.valueOperand('open')
        );
        query.replaceClause(query.where, newClause);
    }
}
  `}

  ### prependOrderField

  Prepend the provided order by field to the list of fields in the order by node. If \`orderBy\` is undefined then a new
  order by node is set with the provided field.

  ${code`
enterQuery: (query: Query) => {
    const newOrderField = creators.orderByField(
        creators.field('key'),
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
    );
    query.prependOrderField(newOrderField);
}
  `}

  ### setOrderDirection

  Set the direction of the primary order by field to the provided value. If there is no primary order by field then this
  function is a noop.

  ${code`
enterQuery: (query: Query) => {
    query.setOrderDirection(
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC)
    );
}
  `}

  ### replaceOrderBy

  Replace existing orderBy with the provided orderBy node. If the orderBy node does not contain any fields, then the orderBy node
  is removed from the query.

  ${code`
enterQuery: (query: Query) => {
    const newOrderField = creators.orderByField(
        creators.field('key'),
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
    );
    const orderByNode = creators.orderBy([newOrderField]);
    query.replaceOrderBy(orderByNode);
}
  `}

  ### removeOrderBy

  Remove the existing orderBy from the query.

  ${code`
enterQuery: (query: Query) => {
    query.removeOrderBy();
}
  `}

  ## Clause

  The following transformations can be applied to all \`Clause\` nodes in the AST, i.e. \`CompoundClause\`, \`NotClause\` and
  \`TerminalClause\`:

  ### remove

  Remove the current node from its parent.

  ${code`
enterTerminalClause: (terminalClause: TerminalClause) => {
    if (terminalClause.field.value === 'assignee') {
        terminalClause.remove();
    }
}
  `}

  ### replace

  Replace the current node from its parent with the provided node.

  ${code`
enterTerminalClause: (terminalClause: TerminalClause) => {
    if (terminalClause.field.value === 'assignee') {
        const newClause = creators.terminalClause(
            creators.field('status'),
            creators.operator(OPERATOR_EQUALS),
            creators.valueOperand('open')
        );
        terminalClause.replace(newClause);
    }
}
  `}

  ## TerminalClause

  The following transformations can be applied to terminal clauses in the AST, e.g. \`issuetype = bug\`:

  ### setOperator

  Set the operator of the current terminal clause.

  ${code`
enterTerminalClause: (terminalClause: TerminalClause) => {
    terminalClause.setOperator(creators.operator(OPERATOR_NOT_EQUALS));
}
  `}

  ### setOperand

  Set the operand of the current terminal clause.

  ${code`
enterTerminalClause: (terminalClause: TerminalClause) => {
    terminalClause.setOperand(creators.keywordOperand());
}
  `}

  ### appendOperand

  Append the provided operand to the end of this terminal clause. If the existing operand is a singular value then it will
  be converted into a list operand and the provided value will be appended.

  ${code`
enterTerminalClause: (terminalClause: TerminalClause) => {
    terminalClause.appendOperand(creators.keywordOperand());
}
  `}

  ## CompoundClause

  The following transformations can be applied to compound clauses in the AST, e.g. \`issuetype = bug and created > -1w\`:

  ### appendClause

  Append the provided clause to this compound clause. If the clause to append is also a compound clause sharing the same
  operator as this node then the two compound clauses will be merged.

  ${code`
enterCompoundClause: (compoundClause: CompoundClause) => {
    const newClause = creators.terminalClause(
        creators.field('status'),
        creators.operator(OPERATOR_EQUALS),
        creators.valueOperand('open')
    );
    compoundClause.appendClause(newClause);
}
  `}

  ### removeClause

  Remove the provided clause from the node. If the clause to remove is not found as a child of the current node then no
  changes will be made.

  If the \`CompoundClause\` has only 1 child clause remaining after the operation, then the current node will be replaced
  with the child clause (flattening the tree structure). If there are 0 child clauses remaining then the compound clause
  will be removed entirely.

  ${code`
enterCompoundClause: (compoundClause: CompoundClause) => {
    compoundClause.removeClause(compoundClause.clauses[0]);
}
  `}

  ### replaceClause

  Replace the matching child clause with the provided \`nextClause\` node. If the clause to replace is not found as a child
  of the current node then no changes will be made.

  ${code`
enterCompoundClause: (compoundClause: CompoundClause) => {
    const newClause = creators.terminalClause(
        creators.field('status'),
        creators.operator(OPERATOR_EQUALS),
        creators.valueOperand('open')
    );
    compoundClause.replaceClause(compoundClause.clauses[0], newClause);
}
  `}

  ## NotClause

  The following transformations can be applied to not clauses in the AST, e.g. \`not issuetype = bug\`:

  ### removeClause

  If the clause to remove is not found as a child of the current node then no changes will be made. Otherwise, this node
  will be removed entirely.

  ${code`
enterNotClause: (notClause: NotClause) => {
    notClause.removeClause(notClause.clause);
}
  `}

  ### replaceClause

  Replace the matching child clause with the provided \`nextClause\` node. If the clause to replace is not found as a child
  of the current node then no changes will be made.

  ${code`
enterNotClause: (notClause: NotClause) => {
    const newClause = creators.terminalClause(
        creators.field('status'),
        creators.operator(OPERATOR_EQUALS),
        creators.valueOperand('open')
    );
    notClause.replaceClause(notClause.clause, newClause);
}
  `}

  ## ListOperand

  The following transformations can be applied to list based operands in the AST, e.g. \`(bug, task, subTaskIssueTypes())\`:

  ### appendOperand

  Add the provided operand at the end of the current list. If the provided value is also a list then it will be merged
  into the current operand.

  ${code`
enterListOperand: (listOperand: ListOperand) => {
    listOperand.appendOperand(creators.valueOperand('open'));
}
  `}

  ## OrderBy

  The following transformations can be applied to the order by clause in the AST, e.g. \`ORDER BY key DESC\`:

  ### prependOrderField

  Prepend the provided order by field to the list of fields in this node.

  ${code`
enterOrderBy: (orderBy: OrderBy) => {
    const newOrderField = creators.orderByField(
        creators.field('key'),
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
    );
    orderBy.prependOrderField(newOrderField);
}
  `}

  ### setOrderDirection

  Set the direction of the primary order by field to the provided value. If there is no primary order by field then this
  function is a noop.

  ${code`
enterOrderBy: (orderBy: OrderBy) => {
    orderBy.setOrderDirection(
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC)
    );
}
  `}

  ### replace

  Replace the orderBy with the provided orderBy node. If the orderBy node does not contain any fields, then the orderBy node
  is removed.

  ${code`
enterOrderBy: (orderBy: OrderBy) => {
    const newField = creators.orderByField(
        creators.field('key'),
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
    );
    const newOrderBy = creators.orderBy([newField]);
    orderBy.replace(newOrderBy);
}
  `}

  ### replaceOrderField

  Replace the matching child field with the provided \`nextOrderByField\` node. If the field to replace is not found then
  no changes will be made.

  ${code`
enterOrderBy: (orderBy: OrderBy) => {
    const nextOrderByField = creators.orderByField(
        creators.field('key'),
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
    );

    orderBy.replaceOrderByField(orderBy.fields[0], nextOrderByField);
}
  `}

  ### remove

  Remove the existing orderBy node from the query.

  ${code`
enterOrderBy: (orderBy: OrderBy) => {
    orderBy.remove();
}
  `}

  ### removeOrderField

  Remove the provided orderBy field from the node. If the field to remove is not found as a child of the current node then no
  changes will be made.

  If there are 0 child fields remaining then the orderBy node
  will be removed entirely.

  ${code`
enterOrderBy: (orderBy: OrderBy) => {
    orderBy.removeOrderField(orderBy.fields[0]);
}
  `}

  ## OrderByField

  The following transformations can be applied to the order by fields in the AST, e.g. \`key DESC\`:

  ### setOrderDirection

  Set the direction of this order by field to the provided value.

  ${code`
enterOrderByField: (orderByField: OrderByField) => {
    orderByField.setOrderDirection(
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC)
    );
}
  `}

  ### replace

  Replace the current orderBy field with the provided orderBy field.

  ${code`
enterOrderByField: (orderByField: OrderByField) => {
    const fieldNew = creators.orderByField(
        creators.field('key'),
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
    );
    orderByField.replace(fieldNew);
}
  `}

  ### remove

  Remove the current orderBy field from the orderBy node.

  ${code`
enterOrderByField: (orderByField: OrderByField) => {
    orderByField.remove();
}
  `}
`;
