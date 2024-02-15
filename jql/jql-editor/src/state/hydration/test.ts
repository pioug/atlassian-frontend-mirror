import { JastBuilder } from '@atlaskit/jql-ast';

import { ValidQueryVisitor } from './util';

const queries = [
  {
    // Incomplete list
    original: 'assignee in (abc-123-def',
    valid: 'assignee in (abc-123-def)',
  },
  {
    // Incomplete list with multiple values
    original: 'assignee in (abc-123-def, 123-abc-456',
    valid: 'assignee in (abc-123-def, 123-abc-456)',
  },
  {
    // Incomplete predicate
    original: 'assignee was abc-123-def before',
    valid: 'assignee was abc-123-def',
  },
  {
    // NOT clause
    original: 'not assignee in (abc-123-def',
    valid: 'assignee in (abc-123-def)',
  },
  {
    // AND clause
    original: 'summary ~ test and assignee in (abc-123-def, 123-abc-456',
    valid: 'summary ~ test and assignee in (abc-123-def, 123-abc-456)',
  },
  {
    // OR clause
    original: 'summary ~ test or assignee in (abc-123-def, 123-abc-456',
    valid: 'summary ~ test and assignee in (abc-123-def, 123-abc-456)',
  },
  {
    // ORDER BY clause
    original: 'assignee in (abc-123-def order by summary desc',
    valid: 'assignee in (abc-123-def)',
  },
  {
    // Ignoring function and keyword operands
    original:
      'project = EM and status in (Done, currentUser(), EMPTY) and reporter in',
    valid: 'project = EM and status in (Done)',
  },
  {
    // Ignoring predicate operands (currently unsupported by hydration API and autocomplete)
    original:
      'assignee = abc-123-def or assignee changed from 123-abc-456 to 123-abc-456 by 123-abc-456',
    valid: 'assignee = abc-123-def',
  },
  {
    // Complex query with multiple errors
    original:
      'project not in (EM, "MC", currentUser(), EMPTY or reporter and "Custom field[People]" = abc-123-def order by created asc',
    valid: 'project not in (EM, "MC") and "Custom field[People]" = abc-123-def',
  },
  {
    // Reserved words
    original: 'field = value and ',
    valid: '',
  },
  {
    // When last item in list is a function
    original: 'project = EM and status in (Done, currentUser()',
    valid: 'project = EM and status in (Done)',
  },
];

const visitor = new ValidQueryVisitor();

describe('ValidQueryVisitor', () => {
  queries.forEach(({ original, valid }) => {
    it(`generates valid query for ${original}`, () => {
      const ast = new JastBuilder().build(original);
      expect(ast.query).toBeDefined();
      if (ast.query) {
        expect(ast.query.accept(visitor)).toEqual(valid);
      }
    });
  });
});
