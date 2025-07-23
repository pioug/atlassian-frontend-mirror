import type { Rule } from 'eslint';
import type { CallExpression as ESCallExpression, ObjectExpression, Property } from 'estree';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

type Reporter = Rule.RuleContext['report'];
type CallExpression = ESCallExpression & Rule.NodeParentExtension;

export const getCssMapObject = (node: CallExpression): ObjectExpression | undefined => {
	// We assume the argument `node` is already a cssMap() call.

	// Things like the number of arguments to cssMap and the type of
	// cssMap's argument are handled by the TypeScript compiler, so
	// we don't bother with creating eslint errors for these here

	if (node.arguments.length !== 1 || node.arguments[0].type !== 'ObjectExpression') {
		return;
	}

	return node.arguments[0];
};

export class UnusedCssMapChecker {
	private readonly cssMapObject: ObjectExpression;
	private readonly cssMapCallNode: CallExpression;

	private readonly report: Reporter;
	private readonly context: Rule.RuleContext;

	constructor(
		cssMapObject: ObjectExpression,
		context: Rule.RuleContext,
		cssMapCallNode: CallExpression,
	) {
		this.cssMapObject = cssMapObject;
		this.cssMapCallNode = cssMapCallNode;

		this.report = context.report;
		this.context = context;
	}

	private checkForUnusedStyles(): void {
		// Get all defined style keys
		const definedStyles = new Map<string, Property>();

		for (const property of this.cssMapObject.properties) {
			if (property.type === 'Property' && property.key.type === 'Identifier') {
				definedStyles.set(property.key.name, property);
			}
		}

		if (definedStyles.size === 0) {
			return;
		}

		// Find the variable that holds the cssMap result
		const cssMapVariable = this.findCssMapVariable();
		if (!cssMapVariable) {
			return;
		}

		// Early return if no references - all styles are unused
		if (cssMapVariable.references.length === 0) {
			for (const [styleName, property] of definedStyles) {
				this.report({
					node: property.key,
					messageId: 'unusedCssMapStyle',
					data: { styleName },
				});
			}
			return;
		}

		const usedStyles = new Set<string>();

		for (const ref of cssMapVariable.references) {
			const node = ref.identifier as Rule.Node;
			const parent = node.parent;

			if (parent?.type === 'MemberExpression') {
				if (!parent.computed && parent.property.type === 'Identifier') {
					// Static access: styles.danger (not computed)
					usedStyles.add(parent.property.name);

					// Early exit if all styles are found
					if (usedStyles.size === definedStyles.size) {
						return;
					}
				} else {
					// Dynamic access: styles[key], styles['danger'], etc. (computed)
					// Immediately exit - no styles will be reported as unused
					return;
				}
			}
		}

		// No dynamic access - report all unused styles
		for (const [styleName, property] of definedStyles) {
			if (!usedStyles.has(styleName)) {
				this.report({
					node: property.key,
					messageId: 'unusedCssMapStyle',
					data: { styleName },
				});
			}
		}
	}

	private findCssMapVariable() {
		const callNode = this.cssMapCallNode;
		const parent = callNode.parent;

		if (parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
			return findVariable({
				identifier: parent.id,
				sourceCode: getSourceCode(this.context),
			});
		}

		return null;
	}

	run(): void {
		this.checkForUnusedStyles();
	}
}
