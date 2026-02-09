import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const CONTROLLED_PROPS = ['size', 'borderColor', 'appearance'];

const rule = createLintRule({
	meta: {
		name: 'ensure-avatar-tag-avatar-props',
		type: 'problem',
		docs: {
			description:
				'Ensures AvatarTag avatar prop does not include controlled props (size, borderColor, appearance) which are managed internally.',
			recommended: true,
			severity: 'error',
		},
		messages: {
			noControlledPropsInAvatar:
				'The `avatar` prop should not include `{{ propName }}` as it is controlled by AvatarTag based on the `type` prop. Remove `{{ propName }}` from the avatar component.',
		},
	},

	create(context: Rule.RuleContext) {
		const avatarTagImports: string[] = [];

		return {
			ImportDeclaration(node) {
				if (node.source.value !== '@atlaskit/tag') {
					return;
				}

				for (const specifier of node.specifiers) {
					if (
						specifier.type === 'ImportSpecifier' &&
						specifier.imported.type === 'Identifier' &&
						specifier.imported.name === 'AvatarTag'
					) {
						avatarTagImports.push(specifier.local.name);
					}
				}
			},

			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const elementName = node.openingElement.name.name;

				// Check if this is an AvatarTag component
				if (!avatarTagImports.includes(elementName)) {
					return;
				}

				// Find the avatar prop
				const avatarProp = node.openingElement.attributes.find(
					(attr) =>
						isNodeOfType(attr, 'JSXAttribute') &&
						isNodeOfType(attr.name, 'JSXIdentifier') &&
						attr.name.name === 'avatar',
				);

				if (!avatarProp || !isNodeOfType(avatarProp, 'JSXAttribute') || !avatarProp.value) {
					return;
				}

				// Check if avatar value is a JSX expression container (arrow function)
				if (isNodeOfType(avatarProp.value, 'JSXExpressionContainer')) {
					const expression = avatarProp.value.expression;

					// Handle arrow function: avatar={(props) => <Avatar {...props} size="small" />}
					if (expression && expression.type === 'ArrowFunctionExpression' && expression.body) {
						checkForControlledProps(context, expression.body as Rule.Node);
					}
				}
			},
		};

		function checkForControlledProps(context: Rule.RuleContext, node: Rule.Node) {
			// Direct JSX return: (props) => <Avatar {...props} />
			if (isNodeOfType(node, 'JSXElement')) {
				checkJSXElementForControlledProps(context, node);
				return;
			}

			// Parenthesized JSX: (props) => (<Avatar {...props} />)
			if (node.type === 'JSXFragment') {
				// Check children of fragment
				for (const child of (node as any).children || []) {
					if (isNodeOfType(child, 'JSXElement')) {
						checkJSXElementForControlledProps(context, child as Rule.Node);
					}
				}
				return;
			}

			// Block body: (props) => { return <Avatar {...props} />; }
			if (node.type === 'BlockStatement') {
				const blockNode = node as any;
				for (const statement of blockNode.body || []) {
					if (statement.type === 'ReturnStatement' && statement.argument) {
						checkForControlledProps(context, statement.argument);
					}
				}
			}
		}

		function checkJSXElementForControlledProps(context: Rule.RuleContext, node: Rule.Node) {
			if (!isNodeOfType(node, 'JSXElement')) {
				return;
			}

			const openingElement = node.openingElement;

			for (const attr of openingElement.attributes) {
				if (!isNodeOfType(attr, 'JSXAttribute')) {
					continue;
				}

				if (!isNodeOfType(attr.name, 'JSXIdentifier')) {
					continue;
				}

				const propName = attr.name.name;

				if (CONTROLLED_PROPS.includes(propName)) {
					context.report({
						node: attr,
						messageId: 'noControlledPropsInAvatar',
						data: { propName },
					});
				}
			}
		}
	},
});

export default rule;
