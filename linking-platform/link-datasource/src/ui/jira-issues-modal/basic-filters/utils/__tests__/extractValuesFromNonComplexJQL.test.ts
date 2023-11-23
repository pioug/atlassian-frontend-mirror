import { asMock } from '@atlaskit/link-test-helpers/jest';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  extractValuesFromNonComplexJQL,
  ResultMap,
} from '../extractValuesFromNonComplexJQL';

jest.mock('@atlaskit/platform-feature-flags');

const cases: [string, ResultMap][] = [
  ['status = done', { status: ['done'] }],
  ['status = EMPTY', { status: ['empty'] }],
  ['status = empty', { status: ['empty'] }],
  ['status in (done, todo)', { status: ['done', 'todo'] }],
  ['ORDER BY assignee asc', {}],
  [
    'text = "testing" or summary = "testing"',
    { text: ['testing'], summary: ['testing'] },
  ],
  [
    'text ~ "testing" or summary ~ "testing" ORDER BY status ASC',
    { text: ['testing'], summary: ['testing'] },
  ],
  [
    'text ~ "testing*" or summary ~ "testing*" ORDER BY status ASC',
    { text: ['testing*'], summary: ['testing*'] },
  ],
  [
    'text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created DESC',
    {
      text: ['EDM-6023*'],
      summary: ['EDM-6023*'],
      key: ['EDM-6023'],
    },
  ],
  [
    'project in ("Commitment Register") and assignee in ("Mike Dao") and issuetype in ("[CTB]Bug") and status in (Progress) and created >= -30d ORDER BY created DESC',
    {
      assignee: ['Mike Dao'],
      project: ['Commitment Register'],
      issuetype: ['[CTB]Bug'],
      status: ['Progress'],
      created: ['-30d'],
    },
  ],
  [
    'project in ("Commitment Register", "Commitment Register1") and assignee in ("Mike Dao", "Mike Dao1") and issuetype in ("[CTB]Bug", "[CTB]Bug1") and status in (Progress, Progress1) and created >= -30d ORDER BY created DESC',
    {
      assignee: ['Mike Dao', 'Mike Dao1'],
      project: ['Commitment Register', 'Commitment Register1'],
      issuetype: ['[CTB]Bug', '[CTB]Bug1'],
      status: ['Progress', 'Progress1'],
      created: ['-30d'],
    },
  ],
  // invalid cases
  ['project = EM and project in (ABC, DEF)', {}],
  ['notAValidField = EM', {}],
  ['text ~ "EDM-6023*" or text ~ "EDM-6*"', {}],
  ['text ~ "EDM-6023*" or summary ~ "EDM-6*"', {}],
];

describe('Testing parseNonComplexJqlToValues', () => {
  it.each<[string, ResultMap]>(cases)(
    'should evaluate %s and return result as %s',
    (jql, expected) => {
      asMock(getBooleanFF).mockReturnValue(true);
      const values = extractValuesFromNonComplexJQL(jql);
      expect(values).toEqual(expected);
    },
  );
});
