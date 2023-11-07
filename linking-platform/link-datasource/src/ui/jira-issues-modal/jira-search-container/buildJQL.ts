import {
  COMPOUND_OPERATOR_AND,
  COMPOUND_OPERATOR_OR,
  creators,
  Jast,
  JastBuilder,
  OPERATOR_EQUALS,
  OPERATOR_GT_EQUALS,
  OPERATOR_IN,
  OPERATOR_LIKE,
  OperatorValue,
  ORDER_BY_DIRECTION_ASC,
  ORDER_BY_DIRECTION_DESC,
  print,
} from '@atlaskit/jql-ast';

import { BasicFilterFieldType, SelectOption } from '../basic-filters/types';

type BuildJQLInput = {
  rawSearch: string;
  orderDirection?: string;
  orderKey?: string;
  filterValues?: {
    [key in BasicFilterFieldType]?: SelectOption[];
  };
};

const fuzzySearchRegExp = /^"(.+)"$/;
const jiraIssueKeyRegExp = /[A-Z]+-\d+/;
export const fuzzyCharacter = '*';

const constructTerminalClause = (
  field: string,
  operator: OperatorValue,
  value: string,
) =>
  creators.terminalClause(
    creators.field(field),
    creators.operator(operator),
    creators.valueOperand(value),
  );

export const buildJQL = (input: BuildJQLInput): string => {
  /**
   * Jql ast - Transforming the ast
   * https://atlaskit.atlassian.com/packages/jql/jql-ast/docs/transforming-the-ast
   */
  const jast: Jast = new JastBuilder().build('');

  const { query } = jast;
  const {
    rawSearch,
    orderDirection = ORDER_BY_DIRECTION_DESC,
    orderKey = 'created',
    filterValues,
  } = input;

  const trimmedRawSearch = rawSearch.trim();

  if (!query) {
    return '';
  }

  if (trimmedRawSearch) {
    const fuzzy = !trimmedRawSearch.match(fuzzySearchRegExp)
      ? fuzzyCharacter
      : '';
    const basicSearch = trimmedRawSearch.replace(/['"?*]+/g, '');

    const text = constructTerminalClause(
      'text',
      OPERATOR_LIKE,
      `${basicSearch}${fuzzy}`,
    );
    const summary = constructTerminalClause(
      'summary',
      OPERATOR_LIKE,
      `${basicSearch}${fuzzy}`,
    );

    const orClauseFields = [text, summary];

    if (jiraIssueKeyRegExp.test(trimmedRawSearch)) {
      const key = constructTerminalClause('key', OPERATOR_EQUALS, basicSearch);
      orClauseFields.push(key);
    }

    const orClause = creators.compoundClause(
      creators.compoundOperator(COMPOUND_OPERATOR_OR),
      orClauseFields,
    );

    query.appendClause(orClause, COMPOUND_OPERATOR_AND);
  }

  if (filterValues) {
    Object.entries(filterValues).forEach(([key, filterFieldValues]) => {
      if (!key || filterFieldValues.length === 0) {
        return;
      }

      const filterInClause = creators.terminalClause(
        creators.field(key),
        creators.operator(OPERATOR_IN),
        creators.listOperand(
          filterFieldValues.map(filterFieldValue =>
            creators.valueOperand(filterFieldValue.value),
          ),
        ),
      );

      query.appendClause(filterInClause, COMPOUND_OPERATOR_AND);
    });
  }

  if (!trimmedRawSearch) {
    const created = constructTerminalClause(
      'created',
      OPERATOR_GT_EQUALS,
      '-30d',
    );

    query.appendClause(created, COMPOUND_OPERATOR_AND);
  }

  const orderField = creators.orderByField(creators.field(orderKey));
  query.prependOrderField(orderField);
  query.setOrderDirection(
    creators.orderByDirection(
      orderDirection.toLowerCase() === 'asc'
        ? ORDER_BY_DIRECTION_ASC
        : ORDER_BY_DIRECTION_DESC,
    ),
  );

  return print(jast, {
    printWidth: null, // this ensures jql string is not broken to new line
  });
};
