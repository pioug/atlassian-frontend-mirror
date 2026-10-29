import { Linter } from 'eslint';

import rule from '../index';

const linter = new Linter();
linter.defineRule('use-simple-form', rule);
const config: Linter.Config = {
	parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
	rules: { 'use-simple-form': 'error' },
};

const form = (
	attributes: string,
	children = '<p>Inside</p>',
	outer = '',
	binding = 'formProps',
) => `
	import Form from '@atlaskit/form';
	<Form onSubmit={submit} ${outer}>{({ ${binding} }) =>
		<form ${attributes}>${children}</form>
	}</Form>;
`;

const convert = (code: string) => {
	const messages = linter.verify(code, config);
	expect(messages).toEqual([expect.objectContaining({ messageId: 'useSimpleForm' })]);
	const suggestion = messages[0].suggestions?.[0];
	expect(suggestion).toBeDefined();
	if (!suggestion) {
		throw new Error('Expected a safe form conversion suggestion');
	}
	const { range, text } = suggestion.fix;
	const output = code.slice(0, range[0]) + text + code.slice(range[1]);
	expect(linter.verify(output, config)).toEqual([]);
	return output;
};

test.each([
	['data-value={value}', "'data-value': value"],
	['hidden', "'hidden': true"],
	['data-value={(first, second)}', "'data-value': (first, second)"],
	['title="A &amp; B"', `'title': "A & B"`],
])('preserves the value of %s when creating formProps', (attribute, expected) => {
	expect(convert(form(`{...formProps} ${attribute}`))).toContain(expected);
});

test('converts an aliased formProps binding without retaining it in children', () => {
	const output = convert(form('{...htmlProps}', '<p>Inside</p>', '', 'formProps: htmlProps'));
	expect(output).not.toContain('htmlProps');
});

test.each([
	['unknown spread', form('{...formProps} {...customProps}')],
	['formProps used in children', form('{...formProps}', '<p>{formProps.id}</p>')],
	['custom native submit handler', form('{...formProps} onSubmit={nativeSubmit}')],
	[
		'existing outer formProps',
		form('{...formProps} hidden', '<p>Inside</p>', 'formProps={customProps}'),
	],
	['outer and inner id', form('{...formProps} id="inner"', '<p>Inside</p>', 'id="outer"')],
	['no spread of the supplied handlers', form('id="inner"')],
])('reports %s without offering a conversion that changes its behavior', (_name, code) => {
	const messages = linter.verify(code, config);
	expect(messages).toEqual([expect.objectContaining({ messageId: 'useSimpleForm' })]);
	expect(messages[0].suggestions).toBeUndefined();
});
