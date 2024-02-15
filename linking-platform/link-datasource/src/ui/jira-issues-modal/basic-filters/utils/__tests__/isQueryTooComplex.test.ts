import { asMock } from '@atlaskit/link-test-helpers/jest';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { isQueryTooComplex } from '../isQueryTooComplex';

jest.mock('@atlaskit/platform-feature-flags');

const nonComplexCases: [string, boolean][] = [
  // empty jql
  ['', false],

  // default jql
  ['order by created DESC', false],

  // jql with order by other than created field
  ['ORDER BY assignee asc', false],

  // default jql with test, summary fields
  ['text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC', false],

  // default jql with test, summary and key fields and order by DESC
  [
    'text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created DESC',
    false,
  ],

  // default jql with test, summary and key fields and order by ASC
  [
    'text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created ASC',
    false,
  ],

  // default jql with a valid field
  ['project in (123) order by created DESC', false],

  // default jql with all valid fields
  [
    'project in ("Commitment Register") and assignee in ("Mike Dao") and type in ("[CTB]Bug") and status in (Progress) ORDER BY created DESC',
    false,
  ],

  // default jql with all valid fields and multiple values
  [
    'project in ("Commitment Register", "Commitment Register") and assignee in ("Mike Dao", "Mike Dao") and type in ("[CTB]Bug", "[CTB]Bug") and status in (Progress, Progress) ORDER BY created DESC',
    false,
  ],

  // jql with test, summary and key fields and order by ASC with = operator
  [
    'text = "EDM-6023*" or summary = "EDM-6023*" or key = EDM-6023 ORDER BY created ASC',
    false,
  ],

  // valid field with = operator
  ['project = 123 order by created DESC', false],
];

const complexCases: [string, boolean][] = [
  // previous default jql
  ['created >= -30d order by created DESC', true],

  // previous default jql with test, summary fields
  [
    'text ~ "testing*" or summary ~ "testing*" and created >= -30d ORDER BY status ASC',
    true,
  ],

  // jql with invalid order by field
  ['project in (ABC, DEF) and ORDER BY test asc', true],

  // repeated fields with AND clause
  ['project = EM and project in (ABC, DEF)', true],

  // repeated fields with or clause
  ['project = EM or project in (ABC, DEF)', true],

  // supported fields, but OR clause
  ['text ~ "EDM-6023*" or project in (123)', true],

  // text and summary, but with different values
  ['text ~ "EDM-6023*" or text ~ "EDM-6*"', true],

  // jql with an invalid field
  ['mynewfield = 123 and created >= -30d order by created DESC', true],

  // jql with NOT clause
  ['NOT (assignee = currentUser())', true],

  // jql with NOT IN operator
  ['project NOT IN ("(Deprecated) Koopa Troopas")', true],

  // added as part of issuetype to type change
  ['issuetype in (Bug) ORDER BY created DESC', true],
  ['issuetype = Bug ORDER BY created DESC', true],
];

const allFieldsCases: [string, boolean][] = [
  ['project in (123)', false],
  ['project = 123', false],
  ['project is 123', true],
  ['project ~ 123', true],
  ['project > 123', true],

  ['assignee in membersOf(apac)', false],
  ['assignee = 123', false],
  ['assignee = currentUser()', false],
  ['assignee is 123', true],
  ['assignee ~ 123', true],
  ['assignee > 123', true],

  ['type in (123)', false],
  ['type = 123', false],
  ['type is 123', true],
  ['type ~ 123', true],
  ['type > 123', true],

  ['status in (123)', false],
  ['status = 123', false],
  ['status is 123', true],
  ['status ~ 123', true],
  ['status > 123', true],

  ['text ~ 123', false],
  ['text = 123', false],
  ['text in (123)', true],
  ['text is 123', true],
  ['text > 123', true],

  ['summary ~ 123', false],
  ['summary = 123', false],
  ['summary in (123)', true],
  ['summary is 123', true],
  ['summary > 123', true],

  ['key = 123', false],
  ['key ~ 123', true],
  ['key in (123)', true],
  ['key is 123', true],
  ['key > 123', true],

  ['created >= 123', true],
  ['created = 123', true],
  ['created in (123)', true],
  ['created ~ 123', true],
  ['created is 123', true],
];

describe('Testing checkIfQueryIsComplex', () => {
  describe('when FF is ON', () => {
    it.each<[string, boolean]>([
      ...nonComplexCases,
      ...complexCases,
      ...allFieldsCases,
    ])('should evaluate %s and return result as %s', (jql, expected) => {
      asMock(getBooleanFF).mockReturnValue(true);
      expect(isQueryTooComplex(jql)).toBe(expected);
    });
  });

  describe('when FF is OFF', () => {
    it.each<[string, boolean]>([
      ...nonComplexCases,
      ...complexCases,
      ...allFieldsCases,
    ])('should evaluate %s and return result as %s', jql => {
      asMock(getBooleanFF).mockReturnValue(false);
      expect(isQueryTooComplex(jql)).toBe(false);
    });
  });
});
