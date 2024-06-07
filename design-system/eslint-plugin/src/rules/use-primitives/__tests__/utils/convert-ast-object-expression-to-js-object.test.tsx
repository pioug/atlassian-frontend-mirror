import j from 'jscodeshift';

import {
	convertASTObjectExpressionToJSObject,
	SPREAD_SYNTAX,
} from '../../utils/convert-ast-object-expression-to-js-object';

describe('convertASTObjectExpressionToJSObject', () => {
	it('gets single property', () => {
		const root = j(`const paddingStyles = css({ padding: '8px' });`);

		const result = convertASTObjectExpressionToJSObject(root.find(j.ObjectExpression).get().value);

		expect(result).toEqual({
			padding: '8px',
			unsupported: [],
		});
	});

	it('gets multiple properties', () => {
		const root = j(`const paddingStyles = css({ display: 'flex', padding: '8px' });`);

		const result = convertASTObjectExpressionToJSObject(root.find(j.ObjectExpression).get().value);

		expect(result).toEqual({
			display: 'flex',
			padding: '8px',
			unsupported: [],
		});
	});

	it('marks as unsupported properties where value is not a string', () => {
		const root = j(`const paddingStyles = css({ display: 'flex', padding: 8 });`);

		const result = convertASTObjectExpressionToJSObject(root.find(j.ObjectExpression).get().value);

		expect(result).toEqual({
			display: 'flex',
			unsupported: ['padding'],
		});
	});

	it('gets tokenised property without fallback', () => {
		const root = j(`const paddingStyles = css({ padding: '8px', margin: token('space.200') });`);

		const result = convertASTObjectExpressionToJSObject(root.find(j.ObjectExpression).get().value);

		expect(result).toEqual({
			margin: {
				fallbackValue: undefined,
				tokenName: 'space.200',
			},
			padding: '8px',
			unsupported: [],
		});
	});

	it('gets tokenised property with fallback', () => {
		const root = j(
			`const paddingStyles = css({ padding: '8px', margin: token('space.200', '16px') });`,
		);

		const result = convertASTObjectExpressionToJSObject(root.find(j.ObjectExpression).get().value);

		expect(result).toEqual({
			margin: {
				fallbackValue: '16px',
				tokenName: 'space.200',
			},
			padding: '8px',
			unsupported: [],
		});
	});

	it('records unsupported if styles are created with a spread', () => {
		const root = j(`const paddingStyles = css({ display: 'flex', ...moreStyles });`);

		const result = convertASTObjectExpressionToJSObject(root.find(j.ObjectExpression).get().value);

		expect(result).toEqual({
			display: 'flex',
			unsupported: [SPREAD_SYNTAX],
		});
	});

	it('marks as unsupported properties where value is a random function call', () => {
		const root = j(`const paddingStyles = css({ display: 'flex', padding: blah() });`);

		const result = convertASTObjectExpressionToJSObject(root.find(j.ObjectExpression).get().value);

		expect(result).toEqual({
			display: 'flex',
			unsupported: ['padding'],
		});
	});

	it('marks as unsupported properties where value is a template literal', () => {
		const root = j(
			`const paddingStyles = css({ display: 'flex', border: \`1px solid \${color}\` });`,
		);

		const result = convertASTObjectExpressionToJSObject(root.find(j.ObjectExpression).get().value);

		expect(result).toEqual({
			display: 'flex',
			unsupported: ['border'],
		});
	});
});
