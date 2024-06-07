import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('test ensure-publish-valid-rule', () => {
	tester.run('ensure-publish-valid', rule, {
		valid: [
			{
				code: `const foo = { "name": "@af/test" }`,
				filename: 'package.json',
			},
			{
				options: [{ exceptions: ['@atlaskit/test'] }],
				code: `const foo = { "name": "@atlaskit/test" }`,
				filename: 'package.json',
			},
			{
				code: `const foo = { "name": "@atlaskit/test", "private": false, "publishConfig": { "registry": "https://registry.npmjs.org/" } }`,
				filename: 'foo/package.json',
			},
		],
		invalid: [
			{
				code: `const foo = { "name": "@atlaskit/test" }`,
				filename: 'foo/package.json',
				errors: [
					{
						messageId: 'publishConfigRequired',
						data: { packageName: '@atlaskit/test' },
					},
				],
			},
			{
				code: `const foo = { "name": "@atlaskit/test", "private": true, "publishConfig": { "registry": "https://registry.npmjs.org/" } }`,
				filename: 'foo/package.json',
				errors: [{ messageId: 'noPrivate', data: { packageName: '@atlaskit/test' } }],
			},
		],
	});
});
