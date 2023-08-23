import cloneDeepWith from 'lodash/cloneDeepWith';

import { JastBuilder } from '../api';

import { print } from './index';

const testCases = [
  // Simple
  {
    input: 'status = open',
    expected: 'status = open',
  },
  // Redundant whitespace
  {
    input: '   status  IN  (1,2,  3, 4 ) ',
    expected: 'status IN (1, 2, 3, 4)',
  },
  // Redundant new lines
  {
    input: 'status\n = \nopen\n',
    expected: 'status = open',
  },
  // Implicit grouping
  {
    input:
      'status = closed and assignee = currentUser() or status = open and assignee is EMPTY',
    expected:
      '(status = closed and assignee = currentUser()) or (status = open and assignee is empty)',
  },
  // Explicit grouping
  {
    input:
      'status = closed and (assignee = currentUser() or status = open) and assignee is EMPTY',
    expected:
      'status = closed and (assignee = currentUser() or status = open) and assignee is empty',
  },
  // Explicit and implicit grouping
  {
    input:
      '(status = closed and assignee = currentUser() or status = open) and assignee is EMPTY',
    expected:
      '((status = closed and assignee = currentUser()) or status = open) and assignee is empty',
  },
  // Large compound clause
  {
    input:
      'status = closed and assignee is not empty and project = ABC and created >= -1w and reporter = currentUser()',
    expected:
      'status = closed\nand assignee is not empty\nand project = ABC\nand created >= -1w\nand reporter = currentUser()',
  },
  // Large query with where and order by
  {
    input:
      'status = closed and assignee = currentUser() or status = open and assignee is EMPTY order by created , key asc',
    expected:
      '(status = closed and assignee = currentUser()) or (status = open and assignee is empty)\nORDER BY created, key ASC',
  },
  // Field properties
  {
    input: 'foo[a.b].x.y = 4 and foo[a][b].x [c].y .z = 4',
    expected: 'foo[a.b].x.y = 4 and foo[a][b].x[c].y .z = 4',
  },
  // History predicate
  {
    input:
      'assignee was EMPTY before -1w DURING("2010/01/01","2011/01/01") and status  changed  from  open  to  closed  by  currentUser()',
    expected:
      'assignee was empty before -1w DURING ("2010/01/01", "2011/01/01")\nand status changed from open to closed by currentUser()',
  },
  // Nested lists
  {
    input:
      'type in ( bug, 1,EMPTY, (task,story, (epic, subtask) ), standardIssueTypes(), customFunc(1,2,3)  )',
    expected:
      'type in (bug, 1, empty, (task, story, (epic, subtask)), standardIssueTypes(), customFunc(1, 2, 3))',
  },
];

const keysToIgnore = ['represents', 'position', 'positions'];

// To be used with lodash/cloneDeepWith to produce an AST ignoring any formatting related data, e.g. node positions.
const minimalAstCustomizer = (value: any, key: number | string | undefined) => {
  if (typeof key === 'string' && keysToIgnore.includes(key)) {
    return null;
  }
};

describe('print', () => {
  testCases.forEach(({ input, expected }) => {
    it(`prints expected output for jql string "${input}"`, () => {
      const jast = new JastBuilder().build(input);

      const output = print(jast);
      expect(output).toEqual(expected);

      const newJast = new JastBuilder().build(output);
      const minimalJast = cloneDeepWith(jast, minimalAstCustomizer);
      const minimalNewJast = cloneDeepWith(newJast, minimalAstCustomizer);

      expect(minimalJast).toEqual(minimalNewJast);
    });
  });
});
