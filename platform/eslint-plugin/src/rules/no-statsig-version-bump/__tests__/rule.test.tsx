import { tester } from '../../../__tests__/utils/_tester';
import rule from '../index';

describe('no-statsig-version-bump', () => {
	tester.run('no-statsig-version-bump', rule, {
		valid: [
			// Exact safe pin - @statsig/js-client
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "3.30.2"
					}
				}`,
				filename: 'packages/foo/package.json',
			},
			// Exact safe pin - @statsig/client-core
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/client-core": "3.30.2"
					}
				}`,
				filename: 'packages/foo/package.json',
			},
			// Tilde patch range that stays within 3.30.x
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "~3.30.0"
					}
				}`,
				filename: 'packages/foo/package.json',
			},
			// Tilde patch range at 3.30.2
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "~3.30.2"
					}
				}`,
				filename: 'packages/foo/package.json',
			},
			// Safe version in resolutions
			{
				code: `module.exports = {
					"resolutions": {
						"@statsig/js-client": "3.30.2"
					}
				}`,
				filename: 'package.json',
			},
			// Older safe version
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "3.29.0"
					}
				}`,
				filename: 'packages/foo/package.json',
			},
			// Non-statsig package with a wide range - should not be flagged
			{
				code: `module.exports = {
					"dependencies": {
						"react": "^18.0.0"
					}
				}`,
				filename: 'packages/foo/package.json',
			},
			// workspace: protocol - should not be flagged
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "workspace:^"
					}
				}`,
				filename: 'packages/foo/package.json',
			},
			// root: protocol - should not be flagged
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "root:*"
					}
				}`,
				filename: 'packages/foo/package.json',
			},
			// Not a package.json file - should not be flagged
			{
				code: `const deps = { "@statsig/js-client": "^3.33.0" }`,
				filename: 'src/some-file.ts',
			},
		],
		invalid: [
			// Caret range that resolves to >= 3.31.0 - @statsig/js-client
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "^3.33.0"
					}
				}`,
				filename: 'packages/foo/package.json',
				errors: [{ messageId: 'bannedStatsigVersion' }],
			},
			// Caret range starting from 3.30.x still allows 3.31+
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "^3.30.0"
					}
				}`,
				filename: 'packages/foo/package.json',
				errors: [{ messageId: 'bannedStatsigVersion' }],
			},
			// Wide caret range - @statsig/client-core
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/client-core": "^3.27.0"
					}
				}`,
				filename: 'packages/foo/package.json',
				errors: [{ messageId: 'bannedStatsigVersion' }],
			},
			// Specific affected version 3.33.2 - @statsig/js-client
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "3.33.2"
					}
				}`,
				filename: 'packages/foo/package.json',
				errors: [{ messageId: 'bannedStatsigVersion' }],
			},
			// Specific affected version - @statsig/client-core
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/client-core": "3.33.2"
					}
				}`,
				filename: 'packages/foo/package.json',
				errors: [{ messageId: 'bannedStatsigVersion' }],
			},
			// Affected version in devDependencies
			{
				code: `module.exports = {
					"devDependencies": {
						"@statsig/js-client": "^3.10.0"
					}
				}`,
				filename: 'packages/foo/package.json',
				errors: [{ messageId: 'bannedStatsigVersion' }],
			},
			// Affected version in resolutions
			{
				code: `module.exports = {
					"resolutions": {
						"@statsig/js-client": "^3.30.0"
					}
				}`,
				filename: 'package.json',
				errors: [{ messageId: 'bannedStatsigVersion' }],
			},
			// Both packages flagged simultaneously
			{
				code: `module.exports = {
					"dependencies": {
						"@statsig/js-client": "^3.33.0",
						"@statsig/client-core": "^3.33.0"
					}
				}`,
				filename: 'packages/foo/package.json',
				errors: [{ messageId: 'bannedStatsigVersion' }, { messageId: 'bannedStatsigVersion' }],
			},
		],
	});
});
