import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute, literal } from 'eslint-codemod-utils';

const HelperJSXAttribute = {
	getName(node: JSXAttribute): string {
		if (!isNodeOfType(node, 'JSXAttribute')) {
			throw new Error('Not a JSXAttribute');
		}

		if (!isNodeOfType(node.name, 'JSXIdentifier')) {
			throw new Error('name is not a JSXIdentifier');
		}

		return node.name.name;
	},

	updateName(node: JSXAttribute, name: string, fixer: Rule.RuleFixer): Rule.Fix {
		if (!isNodeOfType(node, 'JSXAttribute')) {
			throw new Error('Not a JSXAttribute');
		}

		if (!isNodeOfType(node.name, 'JSXIdentifier')) {
			throw new Error('name is not a JSXIdentifier');
		}

		return fixer.replaceText(node.name, literal(name).toString());
	},

	/**
	 * A JSXAttribute value can be many things:
	 * - css='myStyles'
	 * - css={myStyles}
	 * - css={[styles1, styles2]}
	 * - header={<></>}
	 * - css={styleMap.header}
	 * - css={...styles}
	 *
	 * Currently, `getValue` has only implemented strategies for when the value is a string, or an ExpressionStatement
	 * If you need additional functionality add it, and set the correct `type` on the returned object
	 */
	getValue(
		node: JSXAttribute,
	):
		| { type: 'ExpressionStatement'; value: string }
		| { type: 'Literal'; value: string }
		| undefined {
		if (!isNodeOfType(node, 'JSXAttribute')) {
			return;
		}

		if (!node.value) {
			return;
		}

		// handle `css={myStyles}`
		if (
			isNodeOfType(node.value, 'JSXExpressionContainer') &&
			isNodeOfType(node.value.expression, 'Identifier')
		) {
			return { type: 'ExpressionStatement', value: node.value.expression.name };
		}

		// handle `css='myStyles'`
		if (isNodeOfType(node.value, 'Literal') && node.value.value) {
			return { type: 'Literal', value: node.value.value?.toString() };
		}
	},
};

export { HelperJSXAttribute as JSXAttribute };
