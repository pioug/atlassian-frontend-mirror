import {
	type EslintNode,
	isNodeOfType,
	type JSXElement as JSXElementType,
} from 'eslint-codemod-utils';

import { JSXElementHelper as JSXElement } from '../../ast-nodes/jsx-element-helper';
import { createLintRule } from '../utils/create-lint-rule';

import { AFFECTED_ATLASKIT_PACKAGES } from './affected-atlaskit-packages';
import { AFFECTED_HTML_ELEMENTS } from './affected-html-elements';
import { UNWANTED_ATLASKIT_ATTRIBUTES } from './unwanted-atlaskit-attributes';
import { UNWANTED_HTML_ATTRIBUTES } from './unwanted-html-attributes';

const isUnwantedHTMLAtrribute = (s: string): s is 'disabled' | 'readonly' => {
	const attrs: readonly string[] = UNWANTED_HTML_ATTRIBUTES;
	return attrs.includes(s);
};

const isUnwantedAtlaskitAtrribute = (s: string): s is 'isDisabled' | 'isReadOnly' => {
	const attrs: readonly string[] = UNWANTED_ATLASKIT_ATTRIBUTES;
	return attrs.includes(s);
};

type UnwantedAttribute =
	| (typeof UNWANTED_HTML_ATTRIBUTES)[number]
	| (typeof UNWANTED_ATLASKIT_ATTRIBUTES)[number];
const isUnwantedAttribute = (s: string): s is UnwantedAttribute =>
	isUnwantedHTMLAtrribute(s) || isUnwantedAtlaskitAtrribute(s);

const hasUnwantedAttributes = (
	node: JSXElementType,
	type: 'html' | 'atlaskit',
): UnwantedAttribute[] => {
	const attrNames: UnwantedAttribute[] = [
		...(type === 'html' ? UNWANTED_HTML_ATTRIBUTES : UNWANTED_ATLASKIT_ATTRIBUTES),
	];
	const unwantedAttrs = node.openingElement.attributes
		.filter((attr) => isNodeOfType(attr, 'JSXAttribute'))
		.map((attr) => String(attr.name.name))
		.filter(isUnwantedAttribute)
		.filter((unwantedAttribute) => attrNames.includes(unwantedAttribute));
	return unwantedAttrs;
};

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-readonly-or-disabled-inputs',
		type: 'problem',
		docs: {
			description:
				'Inputs should almost always be interactive. Disabled and read-only inputs can usually be replaced by a more user-friendly design pattern.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noDisabled:
				'Inputs should almost always be interactive. Instead of disabling an input, consider removing it altogether, as it cannot be used anyway. Disabled inputs are much less accessible than a well labeled and described input with clear error, valid, and/or helper messages.',
			noReadOnly:
				'Inputs should almost always be interactive. Instead of making an input read-only, consider making it normal text. Read-only inputs do the same thing as normal text but appear as interactive elements and add themselves to the tab-order, which can be confusing for users.',
		},
	},

	create(context) {
		const localComponentNames: string[] = [];

		return {
			ImportDeclaration(node) {
				const source = node.source.value;

				if (typeof source !== 'string') {
					return;
				}

				// Ignore non-atlaskit input packages
				if (!Object.keys(AFFECTED_ATLASKIT_PACKAGES).includes(source)) {
					return;
				}

				if (!node.specifiers.length) {
					return;
				}

				const defaultImport = node.specifiers.filter(
					(spec) => spec.type === 'ImportDefaultSpecifier',
				);
				const namedImport = node.specifiers.filter((spec) => spec.type === 'ImportSpecifier');

				const importNames = AFFECTED_ATLASKIT_PACKAGES[source];
				const usesDefaultImport = importNames.includes('default');
				const possibleNamedImports = importNames.filter((importName) => importName !== 'default');

				if (usesDefaultImport && defaultImport.length && defaultImport[0].local) {
					localComponentNames.push(defaultImport[0].local.name);
				} else if (possibleNamedImports.length >= 1 && namedImport.length) {
					namedImport.forEach((imp) => {
						if (
							imp.type === 'ImportSpecifier' &&
							'name' in imp.imported &&
							possibleNamedImports.includes(imp.imported.name)
						) {
							localComponentNames.push(imp.local.name);
						}
					});
				}
			},
			JSXElement(node: EslintNode) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return false;
				}

				const elName = JSXElement.getName(node);
				if (!elName) {
					return false;
				}

				const fixes = [];

				// If it is one of the affected native HTML elements
				if (AFFECTED_HTML_ELEMENTS.includes(elName)) {
					const unwantedAttributes = hasUnwantedAttributes(node, 'html');
					if (unwantedAttributes.includes('disabled')) {
						fixes.push(
							context.report({
								node: node.openingElement,
								messageId: 'noDisabled',
							}),
						);
					}
					if (unwantedAttributes.includes('readonly')) {
						fixes.push(
							context.report({
								node: node.openingElement,
								messageId: 'noReadOnly',
							}),
						);
					}
					// Else, it is a React component
				} else {
					// if none of the affected packages is imported, return
					if (localComponentNames.length === 0) {
						return;
					}
					// if component name is not in the list, exit
					if (
						!isNodeOfType(node.openingElement.name, 'JSXIdentifier') ||
						!localComponentNames.includes(node.openingElement.name.name)
					) {
						return;
					}

					const unwantedAttributes = hasUnwantedAttributes(node, 'atlaskit');

					if (unwantedAttributes.includes('isDisabled')) {
						fixes.push(
							context.report({
								node: node.openingElement,
								messageId: 'noDisabled',
							}),
						);
					}
					if (unwantedAttributes.includes('isReadOnly')) {
						fixes.push(
							context.report({
								node: node.openingElement,
								messageId: 'noReadOnly',
							}),
						);
					}
				}

				return fixes;
			},
		};
	},
});

export default rule;
