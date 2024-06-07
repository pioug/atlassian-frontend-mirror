import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('test no-pre-post-installs rule', () => {
	tester.run('no-pre-post-installs', rule, {
		valid: [
			{
				code: `const foo = { "scripts": { "preinstall": 1, "postinstall": 2 }}`,
				filename: 'hello/foo.ts',
			},
			{
				code: `const foo = { "scripts": { "preinstall": 1, "postinstall": 2 }}`,
				filename: 'foo/dummy.json',
			},
			{
				code: `const foo = { "scripts": { "bar": 1, "dummy": 'echo 1' }}`,
				filename: 'foo/package.json',
			},
			{
				code: `module.exports = { "scripts": { "fakePreinstall": 1 }};`,
				filename: 'bar/package.json',
			},
			{
				code: `module.exports = { "scripts": { "fakePostinstall": 1 }};`,
				filename: 'bar/package.json',
			},
		],
		invalid: [
			{
				code: `module.exports = { "scripts": { "preinstall": 1 }};`,
				filename: 'bar/package.json',
				errors: [{ messageId: 'prePostInstallScriptsNotAllowed' }],
			},
			{
				code: `const foo = { "scripts": { "postinstall": 1 }}`,
				filename: 'baz/package.json',
				errors: [{ messageId: 'prePostInstallScriptsNotAllowed' }],
			},
		],
	});
});
