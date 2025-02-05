import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule, Scope, SourceCode } from 'eslint';
import type { Node } from 'estree';

import {
	getAllComments,
	getAncestors,
	getDeclaredVariables,
	getScope,
	getSourceCode,
} from '../context-compat';

describe('context-compat', () => {
	const node: Node = {} as Node;
	const scope: Scope.Scope = {} as Scope.Scope;
	const sourceCode: SourceCode = {
		getScope: jest.fn().mockReturnValue(scope),
		getAncestors: jest.fn(),
		getAllComments: jest.fn(),
		getDeclaredVariables: jest.fn(),
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

	describe('getAncestors', () => {
		it('should return ancestors from context.sourceCode.getAncestors if available', () => {
			const ancestors = [node];
			const context = {
				sourceCode: {
					getAncestors: jest.fn().mockReturnValue(ancestors),
				},
			} as unknown as Rule.RuleContext;

			const result = getAncestors(context, node);
			expect(result).toBe(ancestors);
			expect(context.sourceCode.getAncestors).toHaveBeenCalledWith(node);
		});

		it('should return ancestors from context.getAncestors if context.sourceCode is not available', () => {
			const ancestors = [node];
			const context = {
				getSourceCode: jest.fn().mockReturnValue({}),
				getAncestors: jest.fn().mockReturnValue(ancestors),
			} as unknown as Rule.RuleContext;

			const result = getAncestors(context, node);
			expect(result).toBe(ancestors);
			expect(context.getAncestors).toHaveBeenCalled();
		});
	});

	describe('getAllComments', () => {
		it('should return comments from context.sourceCode.getAllComments if available', () => {
			const comments = [{} as TSESTree.Comment];
			const context = {
				sourceCode: {
					getAllComments: jest.fn().mockReturnValue(comments),
				},
			} as unknown as Rule.RuleContext;

			const result = getAllComments(context);
			expect(result).toBe(comments);
			expect(context.sourceCode.getAllComments).toHaveBeenCalledWith();
		});

		it('should return comments from context.getAllComments if context.sourceCode is not available', () => {
			const comments = [{} as TSESTree.Comment];
			const context = {
				getSourceCode: jest.fn().mockReturnValue({}),
				getAllComments: jest.fn().mockReturnValue(comments),
			} as unknown as Rule.RuleContext;

			const result = getAllComments(context);
			expect(result).toBe(comments);
			// @ts-expect-error difference in types between typescript eslint and eslint
			expect(context.getAllComments).toHaveBeenCalled();
		});
	});

	describe('getDeclaredVariables', () => {
		it('should return variables from context.sourceCode.getDeclaredVariables if available', () => {
			const variables = [{} as Scope.Variable];
			const context = {
				sourceCode: {
					getDeclaredVariables: jest.fn().mockReturnValue(variables),
				},
			} as unknown as Rule.RuleContext;

			const result = getDeclaredVariables(context, node);
			expect(result).toBe(variables);
			expect(context.sourceCode.getDeclaredVariables).toHaveBeenCalledWith(node);
		});

		it('should return variables from context.getDeclaredVariables if context.sourceCode is not available', () => {
			const variables = [{} as Scope.Variable];
			const context = {
				getSourceCode: jest.fn().mockReturnValue({}),
				getDeclaredVariables: jest.fn().mockReturnValue(variables),
			} as unknown as Rule.RuleContext;

			const result = getDeclaredVariables(context, node);
			expect(result).toBe(variables);
			expect(context.getDeclaredVariables).toHaveBeenCalledWith(node);
		});
	});
});
