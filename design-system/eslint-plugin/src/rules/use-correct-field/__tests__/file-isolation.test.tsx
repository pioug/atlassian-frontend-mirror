import { Linter } from 'eslint';

import rule from '../index';

test('component aliases from another file do not change which field is required', () => {
	const linter = new Linter();
	linter.defineRule('use-correct-field', rule);
	const config: Linter.Config = {
		parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
		rules: { 'use-correct-field': 'error' },
	};
	const first = linter.verify(
		`
		import { Field } from '@atlaskit/form';
		import SharedName from '@atlaskit/checkbox';
		<Field name="checked">{({ fieldProps }) => <SharedName {...fieldProps} />}</Field>;
	`,
		config,
		'checkbox.jsx',
	);
	expect(first).toEqual([expect.objectContaining({ messageId: 'useCheckboxField' })]);
	const second = linter.verify(
		`
		import { Field } from '@atlaskit/form';
		import Range from '@atlaskit/range';
		import SharedName from 'another-package';
		<Field name="text">{({ fieldProps }) => <SharedName {...fieldProps} />}</Field>;
	`,
		config,
		'other.jsx',
	);
	expect(second).toEqual([]);
});
