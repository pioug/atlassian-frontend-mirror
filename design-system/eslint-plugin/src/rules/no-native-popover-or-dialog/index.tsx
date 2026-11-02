import type { Rule } from 'eslint';
import {
	isNodeOfType,
	type JSXAttribute,
	type MemberExpression,
	type Node,
} from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

/**
 * The value of a static string: `'popover'` or `` `popover` ``. `null` for anything else.
 */
function getStaticString(node: Node | null | undefined): string | null {
	if (!node) {
		return null;
	}
	if (isNodeOfType(node, 'Literal') && typeof node.value === 'string') {
		return node.value;
	}
	if (isNodeOfType(node, 'TemplateLiteral') && node.expressions.length === 0) {
		return node.quasis[0]?.value.cooked ?? null;
	}
	return null;
}

/**
 * `true` for a string value: a static string, `'auto' as const`, or a ternary with a static string
 * branch, such as `isHint ? 'hint' : 'auto'`.
 */
function isStringValue(node: Node): boolean {
	if (getStaticString(node) !== null) {
		return true;
	}
	const { type } = node as { type: string };
	if (type === 'TSAsExpression' || type === 'TSSatisfiesExpression') {
		return isStringValue((node as unknown as { expression: Node }).expression);
	}
	if (isNodeOfType(node, 'ConditionalExpression')) {
		return isStringValue(node.consequent) || isStringValue(node.alternate);
	}
	return false;
}

/**
 * Calls that create an element from a tag name: `createElement('dialog')` (from `document`, `React`
 * or an import) and the JSX runtime's `jsx('dialog')`.
 */
const createElementNames = new Set(['createElement', 'jsx', 'jsxs', 'jsxDEV']);

/**
 * The static property name of `element.name` or `element['name']`. `null` if it is not static.
 */
function getPropertyName(node: MemberExpression): string | null {
	if (!node.computed && isNodeOfType(node.property, 'Identifier')) {
		return node.property.name;
	}
	if (node.computed) {
		return getStaticString(node.property);
	}
	return null;
}

/**
 * `true` for an HTML element name, such as `div` or `my-element`. A component name starts with a
 * capital letter.
 */
function isIntrinsicElementName(name: string): boolean {
	return /^[a-z]/.test(name);
}

/**
 * The HTML element that a JSX tag renders: `div` for `<div>`, and for a wrapper such as
 * `<motion.div>`. `null` for a component, such as `<Popup>` or `<Layers.Item>`.
 */
function getIntrinsicElementName(name: Node): string | null {
	if (isNodeOfType(name, 'JSXIdentifier')) {
		return isIntrinsicElementName(name.name) ? name.name : null;
	}
	if (isNodeOfType(name, 'JSXMemberExpression')) {
		return isIntrinsicElementName(name.property.name) ? name.property.name : null;
	}
	return null;
}

/**
 * `true` for props that set `popover`: `{ popover: 'auto' }` or `{ popover }`, also inside a ternary
 * or `&&`, such as `isOpen ? { popover: 'auto' } : {}`. Props only known at runtime, such as
 * `{...props}`, are not checked.
 */
function hasPopoverProp(node: Node | null | undefined): boolean {
	if (!node) {
		return false;
	}
	if (isNodeOfType(node, 'ObjectExpression')) {
		return node.properties.some(
			(property) =>
				isNodeOfType(property, 'Property') &&
				((!property.computed &&
					isNodeOfType(property.key, 'Identifier') &&
					property.key.name === 'popover') ||
					getStaticString(property.key) === 'popover'),
		);
	}
	if (isNodeOfType(node, 'ConditionalExpression')) {
		return hasPopoverProp(node.consequent) || hasPopoverProp(node.alternate);
	}
	if (isNodeOfType(node, 'LogicalExpression')) {
		return hasPopoverProp(node.right);
	}
	return false;
}

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-native-popover-or-dialog',
		type: 'problem',
		docs: {
			description:
				'Disallow native `popover` and `<dialog>` elements. Use a Design System component, or `@atlaskit/top-layer` if no Design System component fits.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			noNativeDialog:
				'Use a Design System component instead of a native `<dialog>`, such as Modal dialog or Drawer. Use `@atlaskit/top-layer` only if no Design System component fits.',
			noNativePopover:
				'Use a Design System component instead of a native `popover`, such as Popup, Dropdown menu, Tooltip, Inline dialog or Flag. Use `@atlaskit/top-layer` only if no Design System component fits.',
		},
	},
	create(context) {
		return {
			// <dialog>, <motion.dialog>, <div {...{ popover: 'auto' }}>
			JSXOpeningElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXOpeningElement')) {
					return;
				}
				const elementName = getIntrinsicElementName(node.name);
				if (!elementName) {
					return;
				}
				if (elementName === 'dialog') {
					context.report({ node: node.name, messageId: 'noNativeDialog' });
				}
				for (const attribute of node.attributes) {
					if (isNodeOfType(attribute, 'JSXSpreadAttribute') && hasPopoverProp(attribute.argument)) {
						context.report({ node: attribute, messageId: 'noNativePopover' });
					}
				}
			},

			// <div popover="auto">, <motion.div popover="auto">
			JSXAttribute(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXAttribute')) {
					return;
				}
				if (!isNodeOfType(node.name, 'JSXIdentifier') || node.name.name !== 'popover') {
					return;
				}
				// A component can take its own `popover` prop.
				const parent = (node as JSXAttribute & Partial<Rule.NodeParentExtension>).parent;
				if (
					!parent ||
					!isNodeOfType(parent, 'JSXOpeningElement') ||
					!getIntrinsicElementName(parent.name)
				) {
					return;
				}
				context.report({ node, messageId: 'noNativePopover' });
			},

			// document.createElement('dialog'), createElement('div', { popover: 'auto' }),
			// styled('dialog'), element.setAttribute('popover', 'auto')
			CallExpression(node: Rule.Node) {
				if (!isNodeOfType(node, 'CallExpression')) {
					return;
				}
				let method: string | null = null;
				if (isNodeOfType(node.callee, 'MemberExpression')) {
					method = getPropertyName(node.callee);
				} else if (isNodeOfType(node.callee, 'Identifier')) {
					method = node.callee.name;
				}
				const firstArgument = getStaticString(node.arguments[0] as Node | undefined)?.toLowerCase();
				if (method && createElementNames.has(method) && firstArgument) {
					if (firstArgument === 'dialog') {
						context.report({ node, messageId: 'noNativeDialog' });
					} else if (
						isIntrinsicElementName(firstArgument) &&
						hasPopoverProp(node.arguments[1] as Node | undefined)
					) {
						context.report({ node, messageId: 'noNativePopover' });
					}
					return;
				}
				if (method === 'styled' && firstArgument === 'dialog') {
					context.report({ node, messageId: 'noNativeDialog' });
					return;
				}
				if (
					(method === 'setAttribute' || method === 'toggleAttribute') &&
					firstArgument === 'popover'
				) {
					context.report({ node, messageId: 'noNativePopover' });
				}
			},

			// styled.dialog
			MemberExpression(node: Rule.Node) {
				if (
					isNodeOfType(node, 'MemberExpression') &&
					isNodeOfType(node.object, 'Identifier') &&
					node.object.name === 'styled' &&
					getPropertyName(node) === 'dialog'
				) {
					context.report({ node, messageId: 'noNativeDialog' });
				}
			},

			// element.popover = 'auto'
			AssignmentExpression(node: Rule.Node) {
				if (
					!isNodeOfType(node, 'AssignmentExpression') ||
					!isNodeOfType(node.left, 'MemberExpression') ||
					getPropertyName(node.left) !== 'popover'
				) {
					return;
				}
				if (!isStringValue(node.right)) {
					return;
				}
				context.report({ node, messageId: 'noNativePopover' });
			},
		};
	},
});

export default rule;
