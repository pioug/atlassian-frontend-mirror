import type { Rule } from 'eslint';
import type { Variable } from 'eslint-scope';
import type {
	CallExpression,
	Expression,
	Identifier,
	Node,
	ObjectExpression,
	Property,
} from 'estree-jsx';

import {
	type AllowList,
	getAllowedDynamicKeys,
	getAllowedFunctionCalls,
	isAllowListedVariable,
} from '@atlaskit/eslint-utils/allowed-function-calls';
import { findIdentifierNode } from '@atlaskit/eslint-utils/find-identifier-node';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

import type { MessageId } from './messages';

function isReferenceToCssVar(variable: Variable) {
	const definitions = variable.defs;

	return definitions.every((definition) => {
		if (definition.type !== 'Variable') {
			return false;
		}

		const initializer = definition.node.init;
		if (!initializer) {
			return false;
		}

		return (
			initializer.type === 'Literal' &&
			typeof initializer.value === 'string' &&
			initializer.value.startsWith('--')
		);
	});
}

export class Linter {
	private readonly allowedDynamicKeys: AllowList;
	private readonly allowedFunctionCalls: AllowList;

	constructor(
		private readonly context: Rule.RuleContext,
		private readonly baseNode: CallExpression,
	) {
		this.allowedDynamicKeys = getAllowedDynamicKeys(context.options);
		this.allowedFunctionCalls = getAllowedFunctionCalls(context.options);
	}

	/**
	 * Wrapper around `context.report` to provide type checking on the message ID.
	 */
	private report(descriptor: { node: Node; messageId: MessageId }) {
		this.context.report(descriptor);
	}

	/**
	 * Fallback case to lint any identifier that is not otherwise handled.
	 */
	private lintUnhandledIdentifier(identifier: Identifier) {
		this.report({ node: identifier, messageId: 'no-variables' });
	}

	private lintIdentifier(value: Identifier) {
		if (value.name === 'undefined') {
			/**
			 * `undefined` gets caught implicitly anyway by other checks below,
			 * but we are explicitly handling it here.
			 *
			 * We could potentially introduce a distinct message for it as well.
			 */
			this.lintUnhandledIdentifier(value);
			return;
		}

		const variable = findVariable({
			identifier: value,
			sourceCode: this.context.getSourceCode(),
		});
		if (!variable) {
			this.lintUnhandledIdentifier(value);
			return;
		}

		/**
		 * Allows using whitelisted imported values
		 */
		if (
			isAllowListedVariable({
				allowList: this.allowedFunctionCalls,
				variable,
			})
		) {
			return;
		}

		const definitions = variable.defs;
		if (definitions.length === 0) {
			this.lintUnhandledIdentifier(value);
			return;
		}

		definitions.forEach((definition) => {
			if (definition.type === 'Variable') {
				const initializer = definition.node.init;
				if (!initializer) {
					this.lintUnhandledIdentifier(value);
					return;
				}

				/**
				 * Variables can be used if they resolve to a literal.
				 */
				if (initializer.type === 'Literal') {
					return;
				}

				/**
				 * Not allowing tagged template expressions through variables.
				 */
				if (initializer.type === 'TaggedTemplateExpression') {
					this.report({ node: value, messageId: 'no-function-calls' });
					return;
				}

				/**
				 * Variables can be used if they resolve to an allowed function call.
				 */
				if (initializer.type === 'CallExpression') {
					if (this.isAllowedFunctionCall(initializer)) {
						return;
					}
					this.report({ node: value, messageId: 'no-function-calls' });
					return;
				}

				if (initializer.type === 'TemplateLiteral') {
					for (const expression of initializer.expressions) {
						this.lintValue(expression);
					}
					return;
				}

				/**
				 * This branch is only here for clarity.
				 *
				 * We could fallback to `no-variables` for it too.
				 */
				if (initializer.type === 'ObjectExpression') {
					this.report({ node: value, messageId: 'no-object-references' });
					return;
				}
			}

			this.lintUnhandledIdentifier(value);
		});
	}

	private isAllowedDynamicKey(expression: Expression) {
		const identifier = findIdentifierNode(expression);
		if (!identifier) {
			return false;
		}

		const variable = findVariable({
			identifier,
			sourceCode: this.context.getSourceCode(),
		});
		if (!variable) {
			return false;
		}

		return (
			isReferenceToCssVar(variable) ||
			isAllowListedVariable({ allowList: this.allowedDynamicKeys, variable })
		);
	}

	private lintKey(property: Property) {
		/**
		 * If it's not computed then it must be a plain string.
		 *
		 * Private identifiers cannot be computed,
		 * but we need the extra check for type narrowing.
		 */
		if (!property.computed || property.key.type === 'PrivateIdentifier') {
			return;
		}

		/**
		 * Some dynamic keys are explicitly allowed.
		 */
		if (this.isAllowedDynamicKey(property.key)) {
			return;
		}

		this.report({ node: property.key, messageId: 'no-dynamic-keys' });
	}

	private isAllowedFunctionCall(value: CallExpression) {
		const identifier = findIdentifierNode(value);
		if (!identifier) {
			return false;
		}

		const variable = findVariable({
			identifier,
			sourceCode: this.context.getSourceCode(),
		});
		if (!variable) {
			return false;
		}

		return isAllowListedVariable({
			allowList: this.allowedFunctionCalls,
			variable,
		});
	}

	private lintFunctionCall(value: CallExpression) {
		if (this.isAllowedFunctionCall(value)) {
			return;
		}

		this.report({ node: value, messageId: 'no-function-calls' });
	}

	private lintObjectExpression(expression: ObjectExpression) {
		for (const property of expression.properties) {
			if (property.type === 'SpreadElement') {
				this.report({
					node: property,
					messageId: 'no-spread-elements',
				});
			} else {
				this.lintKey(property);
				this.lintValue(property.value);
			}
		}
	}

	private lintUnhandledValue(value: Node) {
		/**
		 * Default to blocking value if it isn't explictly handled.
		 */
		this.report({ node: value, messageId: 'no-unsafe-values' });
	}

	private lintValue(value: Property['value']): void {
		/**
		 * Literals are always allowed by this rule.
		 */
		if (value.type === 'Literal') {
			return;
		}

		/**
		 * Allow negative numbers.
		 */
		if (
			value.type === 'UnaryExpression' &&
			value.operator === '-' &&
			value.argument.type === 'Literal'
		) {
			return;
		}

		if (value.type === 'TemplateLiteral') {
			for (const expression of value.expressions) {
				this.lintValue(expression);
			}
			return;
		}

		if (value.type === 'ConditionalExpression' || value.type === 'LogicalExpression') {
			this.report({ node: value, messageId: 'no-conditional-values' });
			return;
		}

		if (value.type === 'BinaryExpression') {
			this.lintValue(value.left);
			this.lintValue(value.right);
			return;
		}

		if (value.type === 'ObjectExpression') {
			this.lintObjectExpression(value);
			return;
		}

		if (value.type === 'Identifier') {
			this.lintIdentifier(value);
			return;
		}

		if (value.type === 'TaggedTemplateExpression') {
			this.report({ node: value, messageId: 'no-function-calls' });
			return;
		}

		if (value.type === 'CallExpression') {
			this.lintFunctionCall(value);
			return;
		}

		if (value.type === 'ArrowFunctionExpression' || value.type === 'FunctionExpression') {
			/**
			 * Function values are handled by `no-dynamic-styles` instead
			 */
			return;
		}

		if (value.type === 'MemberExpression') {
			this.report({ node: value, messageId: 'no-object-access' });
			return;
		}

		if (value.type === 'ArrayExpression') {
			this.report({ node: value, messageId: 'no-array-values' });
			return;
		}

		this.lintUnhandledValue(value);
	}

	private lintArgument(argument: CallExpression['arguments'][number]) {
		if (argument.type === 'ArrowFunctionExpression') {
			if (argument.body.type === 'ObjectExpression') {
				// Something in this form:
				//
				// const styles = styled.div(
				//     (props) => ({ color: props.height }),
				// );
				this.lintArgument(argument.body);
			}
			return;
		}

		if (argument.type === 'ArrayExpression') {
			for (const element of argument.elements) {
				if (element === null) {
					continue;
				}
				this.lintArgument(element);
			}
			return;
		}

		if (argument.type === 'ObjectExpression') {
			this.lintObjectExpression(argument);
			return;
		}

		if (argument.type === 'CallExpression') {
			this.lintFunctionCall(argument);
			return;
		}

		if (argument.type === 'ConditionalExpression' || argument.type === 'LogicalExpression') {
			this.report({ node: argument, messageId: 'no-conditional-values' });
			return;
		}

		if (argument.type === 'Identifier' || argument.type === 'MemberExpression') {
			this.report({ node: argument, messageId: 'no-identifier-arguments' });
			return;
		}

		this.lintUnhandledValue(argument);
	}

	private lintArguments(args: CallExpression['arguments']) {
		for (const argument of args) {
			this.lintArgument(argument);
		}
	}

	run(): void {
		this.lintArguments(this.baseNode.arguments);
	}
}
