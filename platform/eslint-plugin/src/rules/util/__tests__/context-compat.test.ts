import type { Rule, Scope, SourceCode } from 'eslint';
import type { Node } from 'estree';

import { getAncestors, getScope } from '../context-compat';

describe('context-compat', () => {
	describe('getAncestors', () => {
		let context: Rule.RuleContext;
		let node: Node;
		let sourceCode: SourceCode;
		let ancestors: Node[];

		beforeEach(() => {
			node = {} as Node;
			ancestors = [];
			sourceCode = {
				getAncestors: jest.fn().mockReturnValue(ancestors),
			} as unknown as SourceCode;
		});

		it('should return ancestor nodes from context.sourceCode.getAncestors if available', () => {
			context = {
				sourceCode,
			} as unknown as Rule.RuleContext;

			const result = getAncestors(context, node);
			expect(result).toBe(ancestors);
			expect(sourceCode.getAncestors).toHaveBeenCalledWith(node);
		});

		it('should return ancestors from context.getSourceCode().getAncestors if context.sourceCode is not available', () => {
			context = {
				getSourceCode: jest.fn().mockReturnValue(sourceCode),
			} as unknown as Rule.RuleContext;

			const result = getAncestors(context, node);
			expect(result).toBe(ancestors);
			expect(context.getSourceCode).toHaveBeenCalled();
			expect(sourceCode.getAncestors).toHaveBeenCalledWith(node);
		});

		it('should return scope from context.getAncestors if neither context.sourceCode nor context.getSourceCode().getAncestors is available', () => {
			context = {
				getSourceCode: jest.fn().mockReturnValue({}),
				getAncestors: jest.fn().mockReturnValue(ancestors),
			} as unknown as Rule.RuleContext;

			const result = getAncestors(context, node);
			expect(result).toBe(ancestors);
			expect(context.getAncestors).toHaveBeenCalled();
		});

		it('should return scope from context.getAncestors if context.sourceCode does not have getAncestors', () => {
			context = {
				sourceCode: {},
				getAncestors: jest.fn().mockReturnValue(ancestors),
			} as unknown as Rule.RuleContext;

			const result = getAncestors(context, node);
			expect(result).toBe(ancestors);
			expect(context.getAncestors).toHaveBeenCalled();
		});
	});

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
