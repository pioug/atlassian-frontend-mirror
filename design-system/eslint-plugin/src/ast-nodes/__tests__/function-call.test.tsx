import type { Rule } from 'eslint';
import j from 'jscodeshift';

import * as ast from '../index';

describe('FunctionCall', () => {
	describe('getName', () => {
		it('returns name of Function', () => {
			const root = j(`css({ padding: '8px' })`);
			const node = root.find(j.CallExpression).get().value;

			const result = ast.FunctionCall.getName(node);
			expect(result).toBe('css');
		});
	});

	describe('updateName', () => {
		it('updates name of Function', () => {
			const fixer = {
				replaceText: jest.fn(),
			} as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes
			const root = j(`css({ padding: '8px' })`);
			const node = root.find(j.CallExpression).get().value;

			ast.FunctionCall.updateName(node, 'xcss', fixer);

			expect(fixer.replaceText).toHaveBeenCalledTimes(1);
		});
	});

	describe('getArgumentAtPos', () => {
		it('returns value when value is an ObjectExpression', () => {
			const root = j(`css({ padding: '8px' })`);
			const node = root.find(j.CallExpression).get().value;

			const result = ast.FunctionCall.getArgumentAtPos(node, 0);
			expect(result).toEqual({
				type: 'ObjectExpression',
				value: expect.any(Object),
			});
		});

		it('returns value when value is a Literal', () => {
			const root = j(`css('first arg')`);
			const node = root.find(j.CallExpression).get().value;

			const result = ast.FunctionCall.getArgumentAtPos(node, 0);
			expect(result).toEqual({
				type: 'Literal',
				value: 'first arg',
			});
		});

		it('returns undefined when pos is out of range', () => {
			const root = j(`css({ padding: '8px' })`);
			const node = root.find(j.CallExpression).get().value;

			const result = ast.FunctionCall.getArgumentAtPos(node, 1);
			expect(result).toBeUndefined();
		});

		it('returns undefined when function takes no arguments', () => {
			const root = j(`css()`);
			const node = root.find(j.CallExpression).get().value;

			const result = ast.FunctionCall.getArgumentAtPos(node, 0);
			expect(result).toBeUndefined();
		});
	});
});
