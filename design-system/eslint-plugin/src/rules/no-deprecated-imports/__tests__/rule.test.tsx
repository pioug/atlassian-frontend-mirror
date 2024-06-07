import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import { getConfig } from '../../utils/get-deprecated-config';
import rule, { importNameWithCustomMessageId, pathWithCustomMessageId } from '../index';

const deprecatedImports = getConfig('imports');

const pathImports: { path: string; message: string }[] = [];
const namedImports: {
	path: string;
	import: { importName: string; message: string };
}[] = [];

for (const [path, value] of Object.entries(deprecatedImports)) {
	if (value.message) {
		pathImports.push({ path, message: value.message as string });
	} else if (value.importSpecifiers) {
		for (const individualImport of value.importSpecifiers) {
			namedImports.push({
				path,
				import: individualImport,
			});
		}
	}
}

typescriptEslintTester.run('no-deprecated-imports', rule, {
	valid: [
		{
			code: `import foo from 'foo';`,
		},
		{
			code: `import Table from '@atlaskit/table'`,
		},
	],
	invalid: [
		{
			code: `import * as _ from '@atlaskit/global-navigation';`,
			errors: [{ messageId: pathWithCustomMessageId }],
		},
		{
			code: `import _ from 'foo';`,
			errors: [{ messageId: pathWithCustomMessageId }],
			options: [
				{
					deprecatedConfig: JSON.parse('{"foo":{"message":"foo message."}}'),
				},
			],
		},
		{
			code: `import { foo } from 'foo';`,
			errors: [{ messageId: importNameWithCustomMessageId }],
			options: [
				{
					deprecatedConfig: JSON.parse(
						'{"foo":{"importSpecifiers":[{"importName":"foo","message":"foo message."}]}}',
					),
				},
			],
		},

		...namedImports.map(({ path, import: { importName } }) => ({
			code: `import { ${importName} } from '${path}';`,
			errors: [
				{
					messageId: importNameWithCustomMessageId,
				},
			],
		})),

		...pathImports.map(({ path }) => ({
			code: `import _ from '${path}';`,
			errors: [
				{
					messageId: pathWithCustomMessageId,
				},
			],
		})),
	],
});
