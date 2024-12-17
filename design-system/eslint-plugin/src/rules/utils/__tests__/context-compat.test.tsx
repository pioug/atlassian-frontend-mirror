import type { Rule, Scope, SourceCode } from 'eslint';
import type { Node } from 'estree';

import { getScope, getSourceCode } from '../context-compat';

describe('context-compat', () => {
	const node: Node = {} as Node;
	const scope: Scope.Scope = {} as Scope.Scope;
	const sourceCode: SourceCode = {
		getScope: jest.fn().mockReturnValue(scope),
	} as unknown as SourceCode;

	describe('getScope', () => {
		it('should return scope from context.sourceCode.getScope if available', () => {
			const context = {
				sourceCode,
			} as unknown as Rule.RuleContext;

			const result = getScope(context, node);
			expect(result).toBe(scope);
			expect(sourceCode.getScope).toHaveBeenCalledWith(node);
		});

		it('should return scope from context.getSourceCode().getScope if context.sourceCode is not available', () => {
			const context = {
				getSourceCode: jest.fn().mockReturnValue(sourceCode),
			} as unknown as Rule.RuleContext;

			const result = getScope(context, node);
			expect(result).toBe(scope);
			expect(context.getSourceCode).toHaveBeenCalled();
			expect(sourceCode.getScope).toHaveBeenCalledWith(node);
		});

		it('should return scope from context.getScope if neither context.sourceCode nor context.getSourceCode().getScope is available', () => {
			const context = {
				getSourceCode: jest.fn().mockReturnValue({}),
				getScope: jest.fn().mockReturnValue(scope),
			} as unknown as Rule.RuleContext;

			const result = getScope(context, node);
			expect(result).toBe(scope);
			expect(context.getScope).toHaveBeenCalled();
		});

		it('should return scope from context.getScope if context.sourceCode does not have getScope', () => {
			const context = {
				sourceCode: {},
				getScope: jest.fn().mockReturnValue(scope),
			} as unknown as Rule.RuleContext;

			const result = getScope(context, node);
			expect(result).toBe(scope);
			expect(context.getScope).toHaveBeenCalled();
		});
	});

	describe('getSourceCode', () => {
		it('should return sourceCode from context.sourceCode if available', () => {
			const context = {
				sourceCode,
			} as unknown as Rule.RuleContext;

			const result = getSourceCode(context);
			expect(result).toBe(sourceCode);
		});

		it('should return sourceCode from context.getSourceCode() if context.sourceCode is not available', () => {
			const context = {
				getSourceCode: jest.fn().mockReturnValue(sourceCode),
			} as unknown as Rule.RuleContext;

			const result = getSourceCode(context);
			expect(result).toBe(sourceCode);
			expect(context.getSourceCode).toHaveBeenCalled();
		});
	});
});
