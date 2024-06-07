import type { Rule } from 'eslint';
import j from 'jscodeshift';

import * as ast from '../index';

describe('JSXAttribute', () => {
	describe('getName', () => {
		it('returns name of JSXAttribute', () => {
			const root = j(`<div css={myStyles}></div>`);
			const node = root.find(j.JSXAttribute).get().value;

			const result = ast.JSXAttribute.getName(node);
			expect(result).toBe('css');
		});
	});

	describe('updateName', () => {
		it('updates name of JSXAttribute', () => {
			const fixer = {
				replaceText: jest.fn(),
			} as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes
			const root = j(`<div css={myStyles}></div>`);
			const node = root.find(j.JSXAttribute).get().value;

			ast.JSXAttribute.updateName(node, 'xcss', fixer);

			expect(fixer.replaceText).toHaveBeenCalledTimes(1);
		});
	});

	describe('getValue', () => {
		it('returns value when value is an ExpressionStatement', () => {
			const root = j(`<div css={myStyles}></div>`);
			const node = root.find(j.JSXAttribute).get().value;

			const result = ast.JSXAttribute.getValue(node);
			expect(result).toEqual({
				type: 'ExpressionStatement',
				value: 'myStyles',
			});
		});

		it('returns value when value is a Literal', () => {
			const root = j(`<div css='myStyles'></div>`);
			const node = root.find(j.JSXAttribute).get().value;

			const result = ast.JSXAttribute.getValue(node);
			expect(result).toEqual({
				type: 'Literal',
				value: 'myStyles',
			});
		});

		it('returns undefined for unsupported values values', () => {
			const root = j(`<div css={[styles1, styles2]}></div>`);
			const node = root.find(j.JSXAttribute).get().value;

			const result = ast.JSXAttribute.getValue(node);
			expect(result).toBe(undefined);
		});
	});
});
