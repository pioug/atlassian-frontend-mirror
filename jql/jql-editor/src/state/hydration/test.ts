import { JastBuilder } from '@atlaskit/jql-ast';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ValidQueryVisitor } from './util';

// Base queries that don't involve membersOf
const baseQueries = [
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
		// Ignoring function and keyword operands (except membersOf)
		original: 'project = EM and status in (Done, currentUser(), EMPTY) and reporter in',
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

// membersOf queries when feature flag is ON
const membersOfQueriesFlagOn = [
	{
		// membersOf function with complete argument
		original: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")',
		valid: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")',
	},
	{
		// membersOf function with incomplete query
		original: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c") and reporter in',
		valid: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")',
	},
	{
		// membersOf function in list
		original: 'assignee in (user-123, membersOf("team-id"))',
		valid: 'assignee in (user-123, membersOf("team-id"))',
	},
	{
		// Multiple membersOf functions
		original: 'assignee in membersOf("team-1") and reporter in membersOf("team-2")',
		valid: 'assignee in membersOf("team-1") and reporter in membersOf("team-2")',
	},
];

// membersOf queries when feature flag is OFF - membersOf should be excluded
const membersOfQueriesFlagOff = [
	{
		// membersOf function should be excluded when flag is off - entire clause excluded
		original: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")',
		valid: '',
	},
	{
		// membersOf function in list should be excluded, leaving only user value
		original: 'assignee in (user-123, membersOf("team-id"))',
		valid: 'assignee in (user-123)',
	},
];

const visitor = new ValidQueryVisitor();

describe('ValidQueryVisitor', () => {
	baseQueries.forEach(({ original, valid }) => {
		it(`generates valid query for ${original}`, () => {
			const ast = new JastBuilder().build(original);
			expect(ast.query).toBeDefined();
			if (ast.query) {
				expect(ast.query.accept(visitor)).toEqual(valid);
			}
		});
	});

	describe('membersOf queries with flag ON', () => {
		ffTest.on(
			'jira-membersof-team-support',
			'membersOf function arguments included in hydration query',
			() => {
				membersOfQueriesFlagOn.forEach(({ original, valid }) => {
					it(`generates valid query for ${original}`, () => {
						const ast = new JastBuilder().build(original);
						expect(ast.query).toBeDefined();
						if (ast.query) {
							expect(ast.query.accept(visitor)).toEqual(valid);
						}
					});
				});
			},
		);
	});

	describe('membersOf queries with flag OFF', () => {
		ffTest.off(
			'jira-membersof-team-support',
			'membersOf function arguments excluded from hydration query',
			() => {
				membersOfQueriesFlagOff.forEach(({ original, valid }) => {
					it(`generates valid query for ${original}`, () => {
						const ast = new JastBuilder().build(original);
						expect(ast.query).toBeDefined();
						if (ast.query) {
							expect(ast.query.accept(visitor)).toEqual(valid);
						}
					});
				});
			},
		);
	});
});
