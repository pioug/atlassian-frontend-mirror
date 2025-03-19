import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

const cwd = process.cwd();

describe('test ensure-valid-platform-yarn-protocol-usage rule', () => {
	tester.run('workspace protocol', rule, {
		valid: [
			// Workspace protocol 'workspace:*' is allowed in packages as dependencies
			{
				code: `const foo = {
	        "dependencies": {
	          "@atlaskit/button": "workspace:*",
	          "@atlaskit/primitives": "workspace:*",
	          "@atlaskit/tokens": "workspace:*"
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
			// Workspace protocol 'workspace:*' is allowed in packages as devDependencies
			{
				code: `const foo = {
	        "devDependencies": {
	          "@atlaskit/button": "workspace:*",
	          "@atlaskit/primitives": "workspace:*"
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
			// Workspace protocol is allowed in packages dependencies and devDependencies
			{
				code: `const foo = {
	        "dependencies": {
	          "@atlaskit/button": "workspace:*",
	          "@atlaskit/primitives": "workspace:*"
	        },
	        "devDependencies": {
	          "@atlaskit/button": "workspace:*",
	          "@atlaskit/primitives": "workspace:*"
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
		],
		invalid: [],
	});

	tester.run('root: protocol', rule, {
		// 'root:' protocol is not allowed in any platform package
		valid: [],
		invalid: [
			// 'root:' protocol is not allowed in packages as dependencies
			{
				code: `const foo = {
	        "dependencies": {
	          "react": "root:*",
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidRootProtocolUsage',
					},
				],
			},
			// 'root:' protocol is not allowed in private packages as dependencies
			{
				code: `const foo = {
	        "private": true,
	        "dependencies": {
	          "react": "root:*",
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidRootProtocolUsage',
					},
				],
			},
			// 'root:' protocol is not allowed in public packages as devDependencies
			{
				code: `const foo = {
	        "devDependencies": {
	          "react": "root:*",
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidRootProtocolUsage',
					},
				],
			},
			// 'root:' protocol is not allowed in private packages as devDependencies
			{
				code: `const foo = {
	        "private": true,
	        "devDependencies": {
	          "react": "root:*",
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidRootProtocolUsage',
					},
				],
			},
			// 'root:' protocol is not allowed in public packages as dependencies and devDependencies
			{
				code: `const foo = {
	        "dependencies": {
	          "lodash": "root:*"
	        },
	        "devDependencies": {
	          "react": "root:*"
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidRootProtocolUsage',
					},
				],
			},
			// 'root:' protocol is not allowed in private packages as dependencies and devDependencies
			{
				code: `const foo = {
	        "private": true,
	        "dependencies": {
	          "lodash": "root:*"
	        },
	        "devDependencies": {
	          "react": "root:*"
	        }
	    }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidRootProtocolUsage',
					},
				],
			},
		],
	});
});
