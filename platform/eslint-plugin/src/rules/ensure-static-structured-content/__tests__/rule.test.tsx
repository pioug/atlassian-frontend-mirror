import { RuleTester } from 'eslint';

import '../../../__tests__/utils/_tester';
import rule from '../index';

const tester = new RuleTester({
	parser: require.resolve('@babel/eslint-parser'),
	parserOptions: {
		babelOptions: {
			babelrc: false,
			configFile: false,
			parserOpts: { plugins: ['typescript'] },
		},
		ecmaVersion: 2022,
		requireConfigFile: false,
		sourceType: 'module',
	},
});

tester.run('ensure-static-structured-content', rule, {
	valid: [
		{
			filename: 'button.docs.tsx',
			code: `
				import { type StructuredContentSource } from '@atlassian/structured-docs-types/types';
				import packageJson from './package.json';
				import { type SharedContent } from './shared.docs.tsx';

				const packagePath = __dirname;
				const documentation: StructuredContentSource = {
					components: [{ name: 'Button', packageJson, packagePath }],
				};
				export default documentation;
			`,
		},
		{
			filename: 'non-docs.tsx',
			code: `const build = () => ({ name: 'Dynamic' }); export default build();`,
		},
	],
	invalid: [
		{
			filename: 'call.docs.tsx',
			code: `export default makeDocumentation();`,
			errors: [{ messageId: 'dynamicStructuredContent', data: { nodeType: 'CallExpression' } }],
		},
		{
			filename: 'function.docs.tsx',
			code: `function makeDocumentation() { return { components: [] }; } export default { components: [] };`,
			errors: [
				{ messageId: 'dynamicStructuredContent', data: { nodeType: 'FunctionDeclaration' } },
			],
		},
		{
			filename: 'conditional.docs.tsx',
			code: `const documentation = condition ? { components: [] } : { components: [] }; export default documentation;`,
			errors: [
				{ messageId: 'dynamicStructuredContent', data: { nodeType: 'ConditionalExpression' } },
			],
		},
		{
			filename: 'mutable.docs.tsx',
			code: `let documentation = { components: [] }; export default documentation;`,
			errors: [
				{ messageId: 'dynamicStructuredContent', data: { nodeType: 'VariableDeclaration' } },
			],
		},
		{
			filename: 'imported.docs.tsx',
			code: `import generatedDocumentation from './generated-documentation'; export default { components: [] };`,
			errors: [{ messageId: 'dynamicStructuredContent', data: { nodeType: 'ImportDeclaration' } }],
		},
		{
			filename: 'dynamic-import.docs.tsx',
			code: `export default import('./generated.docs.tsx');`,
			errors: [{ messageId: 'dynamicStructuredContent', data: { nodeType: 'ImportExpression' } }],
		},
		{
			filename: 're-export.docs.tsx',
			code: `export { documentation as default } from './generated-documentation';`,
			errors: [
				{ messageId: 'dynamicStructuredContent', data: { nodeType: 'ExportNamedDeclaration' } },
			],
		},
		{
			filename: 'export-all.docs.tsx',
			code: ['export', "* from './generated-documentation';"].join(' '),
			errors: [
				{
					messageId: 'dynamicStructuredContent',
					data: { nodeType: ['ExportAll', 'Declaration'].join('') },
				},
			],
		},
		{
			filename: 'mutation.docs.tsx',
			code: `const documentation = { components: [] }; documentation.components.push({ name: 'Button' }); export default documentation;`,
			errors: [{ messageId: 'dynamicStructuredContent', data: { nodeType: 'CallExpression' } }],
		},
		{
			filename: 'dynamic-join.docs.tsx',
			code: `const values = ['one', 'two']; export default { value: values.join('\\n') };`,
			errors: [{ messageId: 'dynamicStructuredContent', data: { nodeType: 'CallExpression' } }],
		},
		{
			filename: 'platform-labs.docs.tsx',
			code: `import path from 'path'; export default { packagePath: path.resolve(__dirname) };`,
			errors: [{ messageId: 'nodeBuiltin' }, { messageId: 'nodeBuiltin' }],
		},
		{
			filename: 'platform-labs-node-protocol.docs.tsx',
			code: `import path from 'node:path'; export default { packagePath: path.resolve(__dirname) };`,
			errors: [{ messageId: 'nodeBuiltin' }, { messageId: 'nodeBuiltin' }],
		},
	],
});
