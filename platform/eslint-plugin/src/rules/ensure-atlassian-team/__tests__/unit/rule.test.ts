import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('test no-pre-post-installs rule', () => {
	tester.run('no-pre-post-installs', rule, {
		valid: [
			{
				code: `const foo = {}`,
				filename: 'package.json',
			},
			{
				code: `const foo = { "atlassian": { "team": "bar" } }`,
				filename: 'foo/package.json',
			},
		],
		invalid: [
			{
				code: `const foo = { "atlassian": {} }`,
				filename: 'foo/package.json',
				errors: [{ messageId: 'atlassianTeamRequired' }],
			},
		],
	});
});
