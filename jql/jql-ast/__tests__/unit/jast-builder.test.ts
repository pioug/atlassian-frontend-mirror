import { JastBuilder } from '../../src';
import {
  jqlChangedClause,
  jqlChangedClauseQuery,
  jqlCompoundClause,
  jqlCompoundClauseQuery,
  jqlEntityProperty,
  jqlEntityPropertyQuery,
  jqlFunctionOperand,
  jqlFunctionOperandQuery,
  jqlKeywordOperand,
  jqlKeywordOperandQuery,
  jqlListOperand,
  jqlListOperandQuery,
  jqlMixedCasing,
  jqlMixedCasingQuery,
  jqlMixedSpacing,
  jqlMixedSpacingQuery,
  jqlNotClause,
  jqlNotClauseQuery,
  jqlOrderBy,
  jqlOrderByQuery,
  jqlQuotedStrings,
  jqlQuotedStringsQuery,
  jqlSimple,
  jqlSimpleQuery,
  jqlWasClause,
  jqlWasClauseQuery,
} from '../../test-utils/ast';

describe('JastBuilder', () => {
  it('correctly parses simple JQL', () => {
    const result = new JastBuilder().build(jqlSimple);
    const expected = {
      query: jqlSimpleQuery,
      represents: jqlSimple,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with list operands', () => {
    const result = new JastBuilder().build(jqlListOperand);
    const expected = {
      query: jqlListOperandQuery,
      represents: jqlListOperand,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with keyword operands', () => {
    const result = new JastBuilder().build(jqlKeywordOperand);
    const expected = {
      query: jqlKeywordOperandQuery,
      represents: jqlKeywordOperand,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with function operands', () => {
    const result = new JastBuilder().build(jqlFunctionOperand);
    const expected = {
      query: jqlFunctionOperandQuery,
      represents: jqlFunctionOperand,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with order by', () => {
    const result = new JastBuilder().build(jqlOrderBy);
    const expected = {
      query: jqlOrderByQuery,
      represents: jqlOrderBy,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with compound clause', () => {
    const result = new JastBuilder().build(jqlCompoundClause);
    const expected = {
      query: jqlCompoundClauseQuery,
      represents: jqlCompoundClause,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with changed clause', () => {
    const result = new JastBuilder().build(jqlChangedClause);
    const expected = {
      query: jqlChangedClauseQuery,
      represents: jqlChangedClause,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with was clause', () => {
    const result = new JastBuilder().build(jqlWasClause);
    const expected = {
      query: jqlWasClauseQuery,
      represents: jqlWasClause,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with mixed casing', () => {
    const result = new JastBuilder().build(jqlMixedCasing);
    const expected = {
      query: jqlMixedCasingQuery,
      represents: jqlMixedCasing,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with mixed spacing', () => {
    const result = new JastBuilder().build(jqlMixedSpacing);
    const expected = {
      query: jqlMixedSpacingQuery,
      represents: jqlMixedSpacing,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with NOT clauses', () => {
    const result = new JastBuilder().build(jqlNotClause);
    const expected = {
      query: jqlNotClauseQuery,
      represents: jqlNotClause,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with entity properties', () => {
    const result = new JastBuilder().build(jqlEntityProperty);
    const expected = {
      query: jqlEntityPropertyQuery,
      represents: jqlEntityProperty,
      errors: [],
    };

    expect(result).toEqual(expected);
  });

  it('correctly parses JQL with quoted strings', () => {
    const result = new JastBuilder().build(jqlQuotedStrings);
    const expected = {
      query: jqlQuotedStringsQuery,
      represents: jqlQuotedStrings,
      errors: [],
    };

    expect(result).toEqual(expected);
  });
});
