import type { Rule, SourceCode } from 'eslint';
import { type Expression, isNodeOfType, type SpreadElement } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { createLintRule } from '../utils/create-rule';

export const name = 'no-unsafe-inline-snapshot';

const MAX_LINES = 100;

/**
 * Checks if a snapshot contains internal implementation details
 */
function containsInternalDetails(snapshotContent: string): {
	hasIssues: boolean;
	issues: string[];
} {
	const issues: string[] = [];

	// Check for className attributes (unless they equal "REDACTED")
	// Handles: className="value", className='value', and whitespace variations
	const classNameRegex = /className\s*=\s*(["'])((?:(?!\1)[^\\]|\\.)*)\1/gi;
	let match;
	while ((match = classNameRegex.exec(snapshotContent)) !== null) {
		const classNameValue = match[2];
		if (classNameValue && classNameValue !== 'REDACTED') {
			issues.push(`className="${classNameValue}"`);
		}
	}

	// Check for style attributes (unless they equal "REDACTED")
	// Handles: style="value", style='value', and whitespace variations
	// Style values can contain colons, semicolons, etc., so we need to capture the full quoted value
	const styleRegex = /style\s*=\s*(["'])((?:(?!\1)[^\\]|\\.)*)\1/gi;
	while ((match = styleRegex.exec(snapshotContent)) !== null) {
		const styleValue = match[2];
		if (styleValue && styleValue !== 'REDACTED') {
			issues.push(`style="${styleValue}"`);
		}
	}

	// Check for style blocks (unless they contain "REDACTED")
	const styleBlockRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
	while ((match = styleBlockRegex.exec(snapshotContent)) !== null) {
		const styleContent = match[1];
		if (styleContent && !styleContent.trim().includes('REDACTED')) {
			issues.push('style block');
		}
	}

	return {
		hasIssues: issues.length > 0,
		issues,
	};
}

/**
 * Extracts the snapshot content from a template literal or string literal
 */
function extractSnapshotContent(
	node: Expression | SpreadElement,
	sourceCode: SourceCode,
): string | null {
	if (isNodeOfType(node, 'TemplateLiteral')) {
		// For template literals, get the raw text including the template parts
		return sourceCode.getText(node);
	}

	if (isNodeOfType(node, 'Literal') && typeof node.value === 'string') {
		return node.value;
	}

	return null;
}

const rule = createLintRule({
	meta: {
		name,
		type: 'problem',
		docs: {
			description:
				'Enforce guardrails on toMatchInlineSnapshot usage: snapshots must not exceed 100 lines and must not contain internal implementation details like className or style attributes.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			exceedsMaxLines: `Inline snapshot exceeds ${MAX_LINES} lines. Consider breaking it into smaller snapshots or using a different testing approach.`,
			containsInternalDetails:
				'Inline snapshot contains internal implementation details: {{details}}. Use "REDACTED" for className and style values, or remove these details from the snapshot.',
		},
	},
	create(context: Rule.RuleContext) {
		const sourceCode = getSourceCode(context);

		return {
			MemberExpression(node) {
				// Check if this is a call to toMatchInlineSnapshot
				if (
					!isNodeOfType(node.property, 'Identifier') ||
					node.property.name !== 'toMatchInlineSnapshot'
				) {
					return;
				}

				// Check if the object is an expect() call
				if (
					!isNodeOfType(node.object, 'CallExpression') ||
					!isNodeOfType(node.object.callee, 'Identifier') ||
					node.object.callee.name !== 'expect'
				) {
					return;
				}

				// Only report if this is being called (i.e., it's part of a CallExpression)
				if (!node.parent || !isNodeOfType(node.parent, 'CallExpression')) {
					return;
				}

				// Get the snapshot content from the first argument
				const callExpression = node.parent;
				if (callExpression.arguments.length === 0) {
					return;
				}

				const snapshotArg = callExpression.arguments[0];
				const snapshotContent = extractSnapshotContent(snapshotArg, sourceCode);

				if (!snapshotContent) {
					return;
				}

				// Check line count
				const lines = snapshotContent.split('\n');
				if (lines.length > MAX_LINES) {
					context.report({ node: snapshotArg, messageId: 'exceedsMaxLines' });
					return;
				}

				// Check for internal implementation details
				const { hasIssues, issues } = containsInternalDetails(snapshotContent);
				if (hasIssues) {
					context.report({
						node: snapshotArg,
						messageId: 'containsInternalDetails',
						data: {
							details: issues.slice(0, 3).join(', '), // Show first 3 issues
						},
					});
				}
			},
		};
	},
});

export default rule;
