import { Linter } from 'eslint';

import rule from '../../index';

test.each([
	'ffTest()',
	'ffTest("gate")',
	'ffTest("gate", undefined)',
	'ffTest("outer", () => ffTest("inner"))',
])('linting incomplete %s does not crash the other checks', (code) => {
	const linter = new Linter();
	linter.defineRule('nested-count', rule);
	const messages = linter.verify(code, {
		parserOptions: { ecmaVersion: 2020 },
		rules: { 'nested-count': 'error' },
	});
	expect(messages).toEqual([]);
});
