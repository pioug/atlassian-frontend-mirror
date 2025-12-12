const { RuleTester } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const warnSchemaChangeRule = require('./warn-schema-change');

const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 2015 },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
	'warn-schema-change', // rule name
	warnSchemaChangeRule, // rule code
	{
		// checks
		// 'valid' checks cases that should pass
		valid: [
			{
				code: 'const codeBlock = codeBlockFactory({noDOM: []})',
			},
			{
				code: "const codeBlock = adfNode('codeBlock').define({noAttrs: {}})",
			},
		],
		// 'invalid' checks cases that should not pass
		invalid: [
			{
				code: 'const codeBlock = codeBlockFactory({parseDOM: [],toDOM: []})',
				errors: 2,
			},
			{
				code: "const codeBlock = adfNode('codeBlock').define({attrs: {}})",
				errors: 1,
			},
			{
				code: "const codeBlock = adfNode('codeBlock').define({attrs: {}}).variant('with_marks', {})",
				errors: 1,
			},
		],
	},
);

// eslint-disable-next-line no-console
console.log('All tests passed!');
