import { Linter } from 'eslint';

import rule from '../../index';

const linter = new Linter();
linter.defineRule('no-duplicate-dependencies', rule);
const config: Linter.Config = {
	parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
	rules: { 'no-duplicate-dependencies': 'error' },
};

test.each([{ foo: '^1.0.0' }, { foo: '^1.0.0', bar: '^2.0.0' }, { bar: '^2.0.0', foo: '^1.0.0' }])(
	'autofixing a compact manifest preserves other declarations: %j',
	(devDependencies) => {
		const manifest = { dependencies: { foo: '^1.0.0' }, devDependencies };
		const code = `module.exports = ${JSON.stringify(manifest)};`;
		expect(linter.verify(code, config)).toEqual([
			expect.objectContaining({ messageId: 'unexpectedDuplicateDependency' }),
		]);
		const result = linter.verifyAndFix(code, config);
		expect(result.messages).toEqual([]);
		const json = result.output.slice('module.exports = '.length, -1);
		const fixed = JSON.parse(json);
		const { foo: _duplicate, ...remaining } = devDependencies;
		expect(fixed).toEqual({ ...manifest, devDependencies: remaining });
	},
);
