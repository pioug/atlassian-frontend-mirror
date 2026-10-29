import type { Rule } from 'eslint';

import { getScope } from '../util/context-compat';
import { skipForExampleFiles, skipForTestFiles } from '../util/file-exclusions';

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Enforce using getDocument from @atlaskit/browser-apis instead of direct document usage',
			recommended: true,
		},
		messages: {
			useGetDocument:
				'Import getDocument from @atlaskit/browser-apis and replace direct document access with getDocument(); handle its possibly null result in environments without a DOM.',
		},
		schema: [],
	},
	create(context) {
		const filename = context.filename;

		// Skip test files
		const skipResult = skipForTestFiles(context);
		if (skipResult) {
			return skipResult;
		}

		// Skip example files
		const skipResult2 = skipForExampleFiles(context);
		if (skipResult2) {
			return skipResult2;
		}

		// Skip the getDocument.ts file itself
		if (filename.endsWith('getDocument.ts')) {
			return {};
		}

		return {
			Identifier(node) {
				if (node.name === 'document') {
					// Only the global DOM binding is restricted; caller-supplied document models are valid.
					let scope = getScope(context, node);
					while (scope) {
						const binding = scope.set.get('document');
						if (binding?.defs.length) {
							return;
						}
						if (!scope.upper) {
							break;
						}
						scope = scope.upper;
					}

					const parent = node.parent;

					// Skip if 'document' is used as a property key in an object literal
					if (parent?.type === 'Property' && parent.key === node) {
						return;
					}

					// Skip if 'document' is used as a shorthand property value
					if (parent?.type === 'Property' && parent.value === node && parent.shorthand) {
						return;
					}

					// Skip if 'document' is used as a property being accessed in a member expression
					if (parent?.type === 'MemberExpression' && parent.property === node && !parent.computed) {
						return;
					}

					// Skip if 'document' is being declared as a variable
					if (parent?.type === 'VariableDeclarator' && parent.id === node) {
						return;
					}

					// Skip if 'document' is a function name
					if (parent?.type === 'FunctionDeclaration' && 'id' in parent && parent.id === node) {
						return;
					}

					if (parent?.type === 'FunctionExpression' && 'id' in parent && parent.id === node) {
						return;
					}

					// Skip if 'document' is a method name in a class or object
					if (parent?.type === 'MethodDefinition' && parent.key === node) {
						return;
					}

					// Skip if 'document' is being assigned to (shadowing the global)
					if (parent?.type === 'AssignmentExpression' && parent.left === node) {
						return;
					}

					// Skip if 'document' is in a destructuring pattern (could be destructuring from an object)
					if (parent?.type === 'ObjectPattern' || parent?.type === 'ArrayPattern') {
						return;
					}

					context.report({
						node,
						messageId: 'useGetDocument',
					});
				}
			},
		};
	},
};

export default rule;
