import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

const cwd = process.cwd();

describe('test ensure-valid-workspace-protocol-usage rule', () => {
	tester.run('ensure-valid-workspace-protocol-usage', rule, {
		// Workspace protocol is allowed in private packages as dependencies
		valid: [
			{
				code: `const foo = {
            "private": true,
            "dependencies": {
              "@atlaskit/button": "workspace:^",
              "@atlaskit/primitives": "workspace:*",
              "@atlaskit/tokens": "workspace:*"
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
			// Workspace protocol is allowed in private packages as devDependencies
			{
				code: `const foo = {
            "private": true,
            "devDependencies": {
              "@atlaskit/button": "workspace:^",
              "@atlaskit/primitives": "workspace:^"
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
			// Workspace protocol is allowed in private packages dependencies and devDependencies
			{
				code: `const foo = {
            "private": true,
            "dependencies": {
              "@atlaskit/button": "workspace:^",
              "@atlaskit/primitives": "workspace:^"
            },
            "devDependencies": {
              "@atlaskit/button": "workspace:^",
              "@atlaskit/primitives": "workspace:^"
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
		],
		invalid: [
			// Workspace protocol is not allowed in public packages as dependencies
			{
				code: `const foo = {
            "dependencies": {
              "@atlaskit/button": "workspace:^",
              "@atlaskit/primitives": "workspace:*",
              "@atlaskit/tokens": "workspace:*"
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidWorkspaceProtocolUsage',
					},
				],
			},
			// Workspace protocol is not allowed in public packages as devDependencies
			{
				code: `const foo = {
            "devDependencies": {
              "@atlaskit/button": "workspace:^",
              "@atlaskit/primitives": "^1.0.0"
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidWorkspaceProtocolUsage',
					},
				],
			},
			// Workspace protocol is not allowed in public packages as dependencies and devDependencies
			{
				code: `const foo = {
            "dependencies": {
              "@atlaskit/button": "workspace:^"
            },
            "devDependencies": {
              "@atlaskit/primitives": "workspace:^"
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidWorkspaceProtocolUsage',
					},
				],
			},
		],
	});
});
