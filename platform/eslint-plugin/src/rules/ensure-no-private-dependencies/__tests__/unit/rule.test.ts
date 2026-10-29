import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

const cwd = process.cwd();

jest.mock('@manypkg/find-root');

jest.mock('@manypkg/get-packages', () => ({
	getPackagesSync: () => {
		return {
			packages: [
				// Private packages
				{
					packageJson: {
						name: '@af/private-pkg',
						private: true,
					},
				},
				{
					packageJson: {
						name: '@atlassian/private-pkg',
						private: true,
					},
				},
				{
					packageJson: {
						name: '@atlassiansox/private-pkg',
						private: true,
					},
				},
				// Public packages
				{
					packageJson: {
						name: '@atlassian/public-pkg',
						publishConfig: { registry: 'https://pkg-registry.com' },
					},
				},
				{
					packageJson: {
						name: '@atlassiansox/public-pkg',
						publishConfig: { registry: 'https://pkg-registry.com' },
					},
				},
				{
					packageJson: {
						name: '@atlaskit/public-pkg',
						publishConfig: { registry: 'https://pkg-registry.com' },
					},
				},
			],
		};
	},
}));

const getErrorMessage = (pkgName: string) =>
	`Published package depends on private package ${pkgName}, which consumers cannot install. Replace the dependency with a publishable API or resolve its publication with the owner; make this package private only if it is intended to stop being published.`;

describe('test ensure-no-private-dependencies', () => {
	tester.run('ensure-no-private-dependencies', rule, {
		valid: [
			// Private and public dependencies are allowed in private '@af' scoped packages
			{
				code: `const foo = {
				"name:": "@af/test",
				"private": true,
				"dependencies": {
					"@af/private-pkg": "workspace:*",
					"@af/public-pkg": "workspace:*",
					"@atlassian/private-pkg": "workspace:*",
					"@atlassian/public-pkg": "workspace:*",
					"@atlassiansox/private-pkg": "workspace:*",
					"@atlassiansox/public-pkg": "workspace:*",
					"react": "root:*"
				}
			}`,
				filename: `${cwd}/packages/fpp/package.json`,
			},
			// Private and public dependencies are allowed in private '@atlassian' scoped packages
			{
				code: `const foo = {
				"name:": "@atlassian/test",
				"private": true,
				"dependencies": {
					"@af/private-pkg": "workspace:*",
					"@af/public-pkg": "workspace:*",
					"@atlassian/private-pkg": "workspace:*",
					"@atlassian/public-pkg": "workspace:*",
					"@atlassiansox/private-pkg": "workspace:*",
					"@atlassiansox/public-pkg": "workspace:*",
					"react": "root:*"
				}
			}`,
				filename: `${cwd}/packages/fpp/package.json`,
			},
			// Private dependencies are allowed in private '@atlassiansox' scoped packages
			{
				code: `const foo = {
	        "name:": "@atlassiansox/test",
	        "private": true,
	        "dependencies": {
	          "@af/private-pkg": "workspace:*",
	          "@atlassian/private-pkg": "workspace:*",
 	          "@atlassiansox/private-pkg": "workspace:*",
 	          "react": "root:*"
	        }
	      }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
			// Private and public dependencies are allowed in private '@atlassiansox' scoped packages
			{
				code: `const foo = {
				"name:": "@atlassiansox/test",
				"private": true,
				"dependencies": {
	        "@af/private-pkg": "workspace:*",
	        "@af/public-pkg": "workspace:*",
	        "@atlassian/private-pkg": "workspace:*",
	        "@atlassian/public-pkg": "workspace:*",
	        "@atlassiansox/private-pkg": "workspace:*",
	        "@atlassiansox/public-pkg": "workspace:*",
	        "react": "root:*"
				}
			}`,
				filename: `${cwd}/packages/fpp/package.json`,
			},
		],
		invalid: [
			// Disallow private dependencies in public '@atlaskit' scoped packages
			{
				code: `const foo = {
	        "name": "@atlaskit/test",
	        "publishConfig": { "registry": "https://pkg-registry.com" },
	        "dependencies": {
	          "@af/private-pkg": "workspace:*",
	          "@atlassian/private-pkg": "workspace:*",
 	          "@atlassiansox/private-pkg": "workspace:*",
 	          "react": "root:*"
	        }
				}`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						message:
							'Published package depends on private package @af/private-pkg, which consumers cannot install. Replace the dependency with a publishable API or resolve its publication with the owner; make this package private only if it is intended to stop being published.',
					},
					{
						message:
							'Published package depends on private package @atlassian/private-pkg, which consumers cannot install. Replace the dependency with a publishable API or resolve its publication with the owner; make this package private only if it is intended to stop being published.',
					},
					{
						message:
							'Published package depends on private package @atlassiansox/private-pkg, which consumers cannot install. Replace the dependency with a publishable API or resolve its publication with the owner; make this package private only if it is intended to stop being published.',
					},
				],
			},
			// Disallow private dependencies in public '@atlassian' scoped packages
			{
				code: `const foo = {
	        "name": "@atlassian/test",
	        "publishConfig": { "registry": "https://registry.npmjs.org/" },
	        "dependencies": {
	          "@af/private-pkg": "workspace:*",
	          "@atlassian/private-pkg": "workspace:*",
 	          "@atlassiansox/private-pkg": "workspace:*"
	        }
	        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{ message: getErrorMessage('@af/private-pkg') },
					{ message: getErrorMessage('@atlassian/private-pkg') },
					{ message: getErrorMessage('@atlassiansox/private-pkg') },
				],
			},
			// Disallow private dependencies in public '@atlassiansox' scoped packages
			{
				code: `const foo = {
					"name": "@atlassian/test3",
					"publishConfig": { "registry": "https://registry.npmjs.org/" },
					"dependencies": {
	          "@af/private-pkg": "workspace:*",
	          "@atlassian/private-pkg": "workspace:*",
 	          "@atlassiansox/private-pkg": "workspace:*"
					}
					}`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{ message: getErrorMessage('@af/private-pkg') },
					{ message: getErrorMessage('@atlassian/private-pkg') },
					{ message: getErrorMessage('@atlassiansox/private-pkg') },
				],
			},
			// Disallow private peer dependencies
			{
				code: `const foo = {
	        "name": "@atlaskit/test",
	        "publishConfig": { "registry": "https://registry.npmjs.org/" },
	        "peerDependencies": {
	          "@af/private-pkg": "workspace:*",
	          "@atlassian/private-pkg": "workspace:*",
 	          "@atlassiansox/private-pkg": "workspace:*"
	        }
					}`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{ message: getErrorMessage('@af/private-pkg') },
					{ message: getErrorMessage('@atlassian/private-pkg') },
					{ message: getErrorMessage('@atlassiansox/private-pkg') },
				],
			},
		],
	});
});
