// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import {
	type ImportDeclaration,
	type ImportDefaultSpecifier,
	isNodeOfType,
	type JSXAttribute,
} from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { createLintRule } from '../utils/create-rule';
import { getImportName } from '../utils/get-import-name';
import type { Fix } from '../utils/types';

import {
	getUniqueButtonItemName,
	hasImportOfName,
	hrefHasInvalidValue,
	insertButtonItemDefaultImport,
	insertButtonItemImport,
} from './utils';

export const hrefRequiredSuggestionText = 'Convert LinkItem to ButtonItem';

const rule = createLintRule({
	meta: {
		name: 'use-href-in-link-item',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description:
				'Inform developers of eventual requirement of `href` prop in `LinkItem` component. Elements with a `link` role require an `href` attribute for users to properly navigate, particularly those using assistive technologies. If no valid `href` is required for your use case, consider using a `ButtonItem` instead.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			hrefRequired:
				'A valid `href` will be required in future releases on LinkItem. This may be able to be replaced by a ButtonItem.',
		},
	},
	create(context) {
		let menuNode: ImportDeclaration | null = null;
		let buttonItemDefaultImportNode: ImportDeclaration | null = null;
		let linkItemDefaultImportNode: ImportDeclaration | null = null;
		let customDefaultLinkItemSpecifier: string | null = null;
		const allImportDeclarations: ImportDeclaration[] = [];

		return {
			ImportDeclaration(node) {
				if (node.source.value === '@atlaskit/menu') {
					menuNode = node;
				} else if (node.source.value === '@atlaskit/menu/link-item') {
					linkItemDefaultImportNode = node;
					customDefaultLinkItemSpecifier = (node.specifiers[0] as ImportDefaultSpecifier).local
						.name;
				} else if (node.source.value === '@atlaskit/menu/button-item') {
					buttonItemDefaultImportNode = node;
				}

				allImportDeclarations.push(node);
			},
			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				// Get the name of the LinkItem import
				const linkItemImportName =
					customDefaultLinkItemSpecifier ||
					getImportName(getScope(context, node), '@atlaskit/menu', 'LinkItem');

				if (node.openingElement.name.name === linkItemImportName) {
					// and if href prop does not exist
					const linkProps = node.openingElement.attributes
						.filter((attr): attr is JSXAttribute => isNodeOfType(attr, 'JSXAttribute'))
						.filter((attr: JSXAttribute) => attr.name.type === 'JSXIdentifier');

					const href = linkProps.find((attr: JSXAttribute) => attr.name.name === 'href');

					if (hrefHasInvalidValue(getScope(context, node), href)) {
						context.report({
							node: node,
							messageId: 'hrefRequired',
							suggest: [
								{
									desc: hrefRequiredSuggestionText,
									fix(fixer) {
										let importFix: Fix | null = null;

										const uniqueButtonItemName = getUniqueButtonItemName(
											menuNode,
											allImportDeclarations,
										);

										if (
											// Default link item import but no button item imports
											linkItemDefaultImportNode &&
											!buttonItemDefaultImportNode &&
											(!menuNode || (menuNode && !hasImportOfName(menuNode, 'ButtonItem')))
										) {
											importFix = insertButtonItemDefaultImport(fixer, linkItemDefaultImportNode);
										} else if (
											// No button item imports of any kind
											menuNode &&
											!hasImportOfName(menuNode, 'ButtonItem') &&
											!buttonItemDefaultImportNode
										) {
											importFix = insertButtonItemImport(fixer, menuNode, uniqueButtonItemName);
										}

										const fixes = (importFix ? [importFix] : []).concat(
											href ? [fixer.remove(href)] : [],
											[fixer.replaceText(node.openingElement.name, uniqueButtonItemName)],
										);

										if (node.closingElement) {
											fixes.push(fixer.replaceText(node.closingElement.name, uniqueButtonItemName));
										}

										return fixes;
									},
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
