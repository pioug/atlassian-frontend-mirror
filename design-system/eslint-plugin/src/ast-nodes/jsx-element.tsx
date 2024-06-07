import type { Rule } from 'eslint';
import {
	isNodeOfType,
	type JSXAttribute,
	type JSXElement,
	type JSXFragment,
	jsxIdentifier,
	type JSXSpreadAttribute,
} from 'eslint-codemod-utils';

import { JSXAttribute as HelperJSXAttribute } from './jsx-attribute';

export const JSXElementHelper = {
	/**
	 * Names of JSXElements can be any of:
	 * `<Component></Component>` - (JSXIdentifier)
	 * `<MyComponents.Component></MyComponents.Component>` - `MyComponents` is a namespace (JSXNamespacedName)
	 * `<MyComponents.Component></MyComponents.Component>` - `MyComponents` is an object (JSXMemberExpression)
	 *
	 * getting the name of a JSXMemberExpression is difficult, because object can contain objects, which is recursively defined in the AST.
	 * e.g. Getting the name of `<MyComponents.PresentationLayer.LeftSideBar.Header />` would require `getName` to recursively resolve all parts of the name.
	 * `getName` does not currently have this functionality. Add it if you need it.
	 */
	getName(node: JSXElement): string {
		if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
			// TODO: We may want to log this
			return '';
		}

		return node.openingElement.name.name;
	},

	updateName(node: JSXElement, newName: string, fixer: Rule.RuleFixer): Rule.Fix[] {
		const isSelfClosing = JSXElementHelper.isSelfClosing(node);
		const openingElementFix = fixer.replaceText(
			node.openingElement.name,
			jsxIdentifier(newName).toString(),
		);

		if (isSelfClosing || !node.closingElement) {
			return [openingElementFix];
		}

		const closingElementFix = fixer.replaceText(
			node.closingElement.name,
			jsxIdentifier(newName).toString(),
		);

		return [openingElementFix, closingElementFix];
	},

	isSelfClosing(node: JSXElement) {
		return node.openingElement.selfClosing;
	},

	getAttributes(node: JSXElement): (JSXAttribute | JSXSpreadAttribute)[] {
		return node.openingElement.attributes;
	},

	getAttributeByName(node: JSXElement, name: string): JSXAttribute | undefined {
		return node.openingElement.attributes.find(
			(attr: JSXAttribute | JSXSpreadAttribute): attr is JSXAttribute => {
				// Ignore anything other than JSXAttribute
				if (!isNodeOfType(attr, 'JSXAttribute')) {
					return false;
				}

				return attr.name.name === name;
			},
		);
	},

	containsSpreadAttributes(node: JSXElement): boolean {
		return node.openingElement.attributes.some((attr: JSXAttribute | JSXSpreadAttribute) => {
			return isNodeOfType(attr, 'JSXSpreadAttribute');
		});
	},

	addAttribute(node: JSXElement, name: string, value: string, fixer: Rule.RuleFixer): Rule.Fix {
		const attributeString = ` ${name}='${value}'`;
		const isSelfClosing = JSXElementHelper.isSelfClosing(node);
		const start = node.openingElement.range ? node.openingElement.range[0] : 0;
		const end = node.openingElement.range
			? node.openingElement.range[1] - (isSelfClosing ? 3 : 1)
			: 0;
		const range: [number, number] = [start, end];
		const fix = fixer.insertTextAfterRange(range, attributeString);
		return fix;
	},

	getChildren(node: JSXElement | JSXFragment): JSXElement['children'] {
		// Filter out text children with whitespace characters only as JSX removes whitespace used for intendation
		const filteredChildren = node.children.filter((child) => {
			if (isNodeOfType(child, 'JSXText')) {
				const whiteSpaceChars = new RegExp('\\s', 'g');
				return !whiteSpaceChars.test(child.value);
			}
			return true;
		});
		return filteredChildren;
	},

	hasAllowedAttrsOnly(node: JSXElement, allowedProps: string[]): boolean {
		const attrs = JSXElementHelper.getAttributes(node);

		return attrs.every((attr: JSXAttribute | JSXSpreadAttribute) => {
			if (!isNodeOfType(attr, 'JSXAttribute')) {
				return false;
			}

			const name = HelperJSXAttribute.getName(attr);

			return allowedProps.includes(name);
		});
	},
};

export { JSXElementHelper as JSXElement };
