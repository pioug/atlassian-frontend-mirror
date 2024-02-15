import mergeWith from 'lodash/mergeWith';

import {
  AbstractJastVisitor,
  Field,
  JastBuilder,
  NODE_TYPE_ORDER_BY,
  Operand,
  OPERAND_EMPTY,
  OPERAND_TYPE_KEYWORD,
  OPERAND_TYPE_LIST,
  OPERAND_TYPE_VALUE,
  TerminalClause,
} from '@atlaskit/jql-ast';

import { isQueryTooComplex } from './isQueryTooComplex';

// Map of field keys to their respective clauses in the Jast
export type ResultMap = {
  [k: string]: string[];
};

const getFieldValues = (operand: Operand): string[] => {
  const mapValuesFromList = (value: Operand): string | undefined => {
    if (value.operandType === OPERAND_TYPE_VALUE) {
      return value.value;
    }
    // we only support EMPTY keyword atm, hence making sure if operandType is a KEYWORD, then its an EMPTY keyword
    if (
      value.operandType === OPERAND_TYPE_KEYWORD &&
      value.value === OPERAND_EMPTY
    ) {
      return value.value;
    }

    return undefined;
  };

  switch (operand.operandType) {
    case OPERAND_TYPE_LIST:
      return operand.values
        .map(mapValuesFromList)
        .filter((value): value is string => !!value);
    case OPERAND_TYPE_VALUE:
      return operand.value ? [operand.value] : [];
    case OPERAND_TYPE_KEYWORD:
      return operand.value === OPERAND_EMPTY ? [operand.value] : [];

    default:
      return [];
  }
};

/**
 * Rather than having to navigate the entire tree structure ourself, we extend AbstractJastVisitor
 * class and implement visitField to walk through each field and value.
 * */
class JqlClauseCollectingVisitor extends AbstractJastVisitor<ResultMap> {
  constructor() {
    super();
  }

  visitField = (field: Field) => {
    const fieldName = field.value?.toLowerCase();
    const fieldParent = field.parent;

    if (!fieldParent) {
      return;
    }

    // we do not want to parse and store the order by field+value
    const fieldGrandParent = fieldParent.parent;
    if (fieldGrandParent.type === NODE_TYPE_ORDER_BY) {
      return;
    }

    const operand = (fieldParent as TerminalClause).operand;

    const fieldValues = (operand && getFieldValues(operand)) || [];

    return { [fieldName]: fieldValues };
  };

  protected aggregateResult(
    aggregate: ResultMap,
    nextResult: ResultMap,
  ): ResultMap {
    return mergeWith(aggregate, nextResult, (destValue, srcValue) =>
      srcValue.concat(destValue ?? []),
    );
  }

  protected defaultResult(): ResultMap {
    return {};
  }
}

export const extractValuesFromNonComplexJQL = (jql: string): ResultMap => {
  if (isQueryTooComplex(jql)) {
    return {};
  }

  const jast = new JastBuilder().build(jql);
  const jqlClauseCollectingVisitor = new JqlClauseCollectingVisitor();

  const mappedValues: ResultMap = jast.query
    ? jast.query.accept(jqlClauseCollectingVisitor) || {}
    : {}; // jast.query is defined as void | Query, hence the fallback

  return mappedValues;
};
