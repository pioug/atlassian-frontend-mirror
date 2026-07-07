import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('test no-internal-dependencies-in-public-packages rule', () => {
	tester.run('no-internal-dependencies-in-public-packages', rule, {
		valid: [
			// Public package with only public + third-party dependencies.
			{
				code: `const foo = { "name": "@atlaskit/button", "dependencies": { "@atlaskit/theme": "^1.0.0", "react": "^18.0.0" } }`,
				filename: 'packages/foo/package.json',
			},
			// Internal package depending on internal packages is fine (not public-prefixed).
			{
				code: `const foo = { "name": "@atlassian/internal-tool", "dependencies": { "@atlassian/other": "^1.0.0", "@af/thing": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
			},
			// Public package that is explicitly excepted.
			{
				options: [{ exceptions: ['@atlaskit/legacy'] }],
				code: `const foo = { "name": "@atlaskit/legacy", "dependencies": { "@atlassian/internal": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
			},
			// Boundary case: `@affoo` must NOT match the `@af` prefix.
			{
				code: `const foo = { "name": "@atlaskit/button", "dependencies": { "@affoo/bar": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
			},
			// devDependencies are deliberately NOT scanned.
			{
				code: `const foo = { "name": "@atlaskit/button", "devDependencies": { "@atlassian/internal": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
			},
			// Private packages are skipped (never published to public npm).
			{
				code: `const foo = { "name": "@atlaskit/internal-only", "private": true, "dependencies": { "@atlassian/internal": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
			},
			// `private: false` is still enforced (it is published).
			// (positive counterpart lives in the invalid block below)
			// Non package.json files are ignored.
			{
				code: `const foo = { "name": "@atlaskit/button", "dependencies": { "@atlassian/internal": "^1.0.0" } }`,
				filename: 'packages/foo/index.ts',
			},
		],
		invalid: [
			// Internal dep in `dependencies`.
			{
				code: `const foo = { "name": "@atlaskit/button", "dependencies": { "@atlassian/internal": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
				errors: [
					{
						messageId: 'internalDependencyInPublicPackage',
						data: {
							packageName: '@atlaskit/button',
							dependency: '@atlassian/internal',
							field: 'dependencies',
						},
					},
				],
			},
			// `private: false` is published, so it is still enforced.
			{
				code: `const foo = { "name": "@atlaskit/button", "private": false, "dependencies": { "@atlassian/internal": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
				errors: [
					{
						messageId: 'internalDependencyInPublicPackage',
						data: {
							packageName: '@atlaskit/button',
							dependency: '@atlassian/internal',
							field: 'dependencies',
						},
					},
				],
			},
			// Internal dep in `peerDependencies`.
			{
				code: `const foo = { "name": "@atlaskit/button", "peerDependencies": { "@atlassiansox/thing": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
				errors: [
					{
						messageId: 'internalDependencyInPublicPackage',
						data: {
							packageName: '@atlaskit/button',
							dependency: '@atlassiansox/thing',
							field: 'peerDependencies',
						},
					},
				],
			},
			// Internal dep in `optionalDependencies`.
			{
				code: `const foo = { "name": "@atlaskit/button", "optionalDependencies": { "@af/thing": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
				errors: [
					{
						messageId: 'internalDependencyInPublicPackage',
						data: {
							packageName: '@atlaskit/button',
							dependency: '@af/thing',
							field: 'optionalDependencies',
						},
					},
				],
			},
			// Bare-scope internal dep matches (e.g. `@af`).
			{
				code: `const foo = { "name": "@atlaskit/button", "dependencies": { "@af": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
				errors: [
					{
						messageId: 'internalDependencyInPublicPackage',
						data: {
							packageName: '@atlaskit/button',
							dependency: '@af',
							field: 'dependencies',
						},
					},
				],
			},
			// Multiple internal deps across multiple fields -> multiple reports.
			{
				code: `const foo = { "name": "@atlaskit/button", "dependencies": { "@atlassian/a": "^1.0.0", "react": "^18.0.0" }, "peerDependencies": { "@af/b": "^1.0.0" } }`,
				filename: 'packages/foo/package.json',
				errors: [
					{
						messageId: 'internalDependencyInPublicPackage',
						data: {
							packageName: '@atlaskit/button',
							dependency: '@atlassian/a',
							field: 'dependencies',
						},
					},
					{
						messageId: 'internalDependencyInPublicPackage',
						data: {
							packageName: '@atlaskit/button',
							dependency: '@af/b',
							field: 'peerDependencies',
						},
					},
				],
			},
		],
	});
});
