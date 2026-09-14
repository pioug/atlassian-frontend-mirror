import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

const filename = 'platform/packages/product-collection/pill/package.json';

describe('test ensure-product-collection-name-prefix rule', () => {
	tester.run('ensure-product-collection-name-prefix', rule, {
		valid: [
			{
				code: `module.exports = { "name": "@atlassian/product-collection__pill" }`,
				filename,
			},
			{
				code: `module.exports = { "name": "@atlassian/product-collection__pill", "dependencies": { "name": "1.0.0" } }`,
				filename,
			},
			{
				code: `module.exports = { "name": "@atlassian/pill" }`,
				filename: 'platform/packages/design-system/pill/package.json',
			},
			{
				// Generated entry point manifests nested inside a package are not package manifests.
				code: `module.exports = { "main": "../dist/cjs/index.js" }`,
				filename: 'platform/packages/product-collection/pill/entry-point/package.json',
			},
		],
		invalid: [
			{
				code: `module.exports = { "name": "@atlassian/pill" }`,
				filename,
				errors: [
					{
						messageId: 'invalidNamePrefix',
						data: {
							requiredPrefix: '@atlassian/product-collection__',
							packageName: '@atlassian/pill',
						},
					},
				],
			},
			{
				code: `module.exports = { "name": "@atlaskit/product-collection__pill" }`,
				filename,
				errors: [{ messageId: 'invalidNamePrefix' }],
			},
			{
				code: `module.exports = { "version": "1.0.0" }`,
				filename,
				errors: [{ messageId: 'nameRequired' }],
			},
		],
	});
});
