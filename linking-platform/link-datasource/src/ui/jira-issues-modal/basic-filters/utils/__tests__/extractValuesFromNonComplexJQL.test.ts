import { asMock } from '@atlaskit/link-test-helpers/jest';
import { fg } from '@atlaskit/platform-feature-flags';

import { extractValuesFromNonComplexJQL, type ResultMap } from '../extractValuesFromNonComplexJQL';

jest.mock('@atlaskit/platform-feature-flags');

const cases: [string, ResultMap][] = [
	['status = done', { status: ['done'] }],
	['status = EMPTY', { status: ['empty'] }],
	['status = empty', { status: ['empty'] }],
	['status in (done, todo)', { status: ['done', 'todo'] }],
	['assignee in (empty, bob)', { assignee: ['empty', 'bob'] }],
	['assignee in (EMPTY, bob)', { assignee: ['empty', 'bob'] }],
	['assignee in (EMPTY)', { assignee: ['empty'] }],
	['ORDER BY assignee asc', {}],
	['text = "testing" or summary = "testing"', { text: ['testing'], summary: ['testing'] }],
	[
		'text ~ "testing" or summary ~ "testing" ORDER BY created DESC',
		{ text: ['testing'], summary: ['testing'] },
	],
	[
		'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
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
		'project in ("Commitment Register") and assignee in ("Mike Dao") and type in ("[CTB]Bug") and status in (Progress) ORDER BY created DESC',
		{
			assignee: ['Mike Dao'],
			project: ['Commitment Register'],
			type: ['[CTB]Bug'],
			status: ['Progress'],
		},
	],
	[
		'project in ("Commitment Register", "Commitment Register1") and assignee in ("Mike Dao", "Mike Dao1") and type in ("[CTB]Bug", "[CTB]Bug1") and status in (Progress, Progress1) ORDER BY created DESC',
		{
			assignee: ['Mike Dao', 'Mike Dao1'],
			project: ['Commitment Register', 'Commitment Register1'],
			type: ['[CTB]Bug', '[CTB]Bug1'],
			status: ['Progress', 'Progress1'],
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
			asMock(fg).mockReturnValue(true);
			const values = extractValuesFromNonComplexJQL(jql);
			expect(values).toEqual(expected);
		},
	);
});
