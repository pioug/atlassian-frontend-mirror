// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

export const RULE_NAME = 'use-should-render-to-parent';
const PROP_NAME = 'shouldRenderToParent';

const message = `Setting the \`${PROP_NAME}\` prop to anything other than \`true\` causes accessibility issues. Only set to \`false\` as a last resort.`;

export const addProp = `Add \`${PROP_NAME}\` prop.`;
export const setPropToTrue = `Set \`${PROP_NAME}\` prop to \`true\`.`;

const components = ['@atlaskit/popup', '@atlaskit/dropdown-menu'];

const rule = createLintRule({
	meta: {
		name: RULE_NAME,
		type: 'suggestion',
		docs: {
			description: `Encourages makers to use the \`${PROP_NAME}\` where possible in Atlassian Design System \`Popup\` and \`DropdownMenu\` components.`,
			recommended: true,
			severity: 'warn',
		},
		messages: {
			missingShouldRenderToParentProp: `The default value of \`${PROP_NAME}\` is \`false\`. ${message}`,
			falseShouldRenderToParentProp: message,
		},
		hasSuggestions: true,
	},

	create(context: Rule.RuleContext) {
		let componentLocalName: string;

		return {
			ImportDeclaration(node) {
				const source = node.source.value;

				if (typeof source !== 'string') {
					return;
				}

				if (!components.includes(source)) {
					return;
				}

				if (!node.specifiers.length) {
					return;
				}

				const defaultImport = node.specifiers.filter(
					(spec) => spec.type === 'ImportDefaultSpecifier',
				);
				const namedImport = node.specifiers.filter((spec) => spec.type === 'ImportSpecifier');

				// If popup or dropdown menu and using a default import
				if (defaultImport.length && defaultImport[0].local) {
					componentLocalName = defaultImport[0].local.name;
					// or if popup and using a named import
				} else if (
					namedImport.length &&
					namedImport[0].type === 'ImportSpecifier' &&
					'name' in namedImport[0].imported &&
					namedImport[0].imported.name === 'Popup'
				) {
					componentLocalName = namedImport[0].local.name;
				}
			},

			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}
				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const name = node.openingElement.name.name;

				if (name === componentLocalName) {
					const prop = node.openingElement.attributes.find(
						(attr) =>
							isNodeOfType(attr, 'JSXAttribute') &&
							isNodeOfType(attr.name, 'JSXIdentifier') &&
							attr.name.name === PROP_NAME,
					);

					// If the prop does not exist, throw
					if (!prop) {
						return context.report({
							node: node.openingElement.name,
							messageId: 'missingShouldRenderToParentProp',
							suggest: [
								{
									desc: addProp,
									fix: (fixer) => [
										fixer.insertTextAfter(node.openingElement.name, ` ${PROP_NAME}`),
									],
								},
							],
						});
					}

					// If the prop is a boolean attribute with no value (set to `true`),
					// it's valid
					if (!('value' in prop) || prop.value === null) {
						return;
					}

					// If the prop has a falsy literal value or a falsy value in an
					// expression container, throw
					if (
						(isNodeOfType(prop.value, 'Literal') && !prop.value.value) ||
						(isNodeOfType(prop.value, 'JSXExpressionContainer') &&
							prop.value.expression.type === 'Literal' &&
							!prop.value.expression.value)
					) {
						return context.report({
							node: prop,
							messageId: 'falseShouldRenderToParentProp',
							suggest: [
								{
									desc: setPropToTrue,
									fix: (fixer) => [fixer.replaceText(prop, PROP_NAME)],
								},
							],
						});
					}
				}
			},
		};
	},
});

export default rule;
