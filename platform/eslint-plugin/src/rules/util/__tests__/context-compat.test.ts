import type { Rule, Scope, SourceCode } from 'eslint';
import type { Node } from 'estree';

import { getScope } from '../context-compat';

describe('context-compat', () => {
	describe('getScope', () => {
		let context: Rule.RuleContext;
		let node: Node;
		let sourceCode: SourceCode;
		let scope: Scope.Scope;

		beforeEach(() => {
			node = {} as Node;
			scope = {} as Scope.Scope;
			sourceCode = {
				getScope: jest.fn().mockReturnValue(scope),
			} as unknown as SourceCode;
		});

		it('should return scope from context.sourceCode.getScope if available', () => {
			context = {
				sourceCode,
			} as unknown as Rule.RuleContext;

			const result = getScope(context, node);
			expect(result).toBe(scope);
			expect(sourceCode.getScope).toHaveBeenCalledWith(node);
		});

		it('should return scope from context.getSourceCode().getScope if context.sourceCode is not available', () => {
			context = {
				getSourceCode: jest.fn().mockReturnValue(sourceCode),
			} as unknown as Rule.RuleContext;

			const result = getScope(context, node);
			expect(result).toBe(scope);
			expect(context.getSourceCode).toHaveBeenCalled();
			expect(sourceCode.getScope).toHaveBeenCalledWith(node);
		});

		it('should return scope from context.getScope if neither context.sourceCode nor context.getSourceCode().getScope is available', () => {
			context = {
				getSourceCode: jest.fn().mockReturnValue({}),
				getScope: jest.fn().mockReturnValue(scope),
			} as unknown as Rule.RuleContext;

			const result = getScope(context, node);
			expect(result).toBe(scope);
			expect(context.getScope).toHaveBeenCalled();
		});

		it('should return scope from context.getScope if context.sourceCode does not have getScope', () => {
			context = {
				sourceCode: {},
				getScope: jest.fn().mockReturnValue(scope),
			} as unknown as Rule.RuleContext;

			const result = getScope(context, node);
			expect(result).toBe(scope);
			expect(context.getScope).toHaveBeenCalled();
		});
	});
});
