import {
	type API,
	type FileInfo,
	type JSCodeshift,
	type JSXElement,
	type Options,
} from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import {
	addJSXAttributeToJSXElement,
	getImportDeclarationCollection,
	getImportDefaultSpecifierCollection,
	getImportDefaultSpecifierName,
	hasImportDeclaration,
} from './utils/helpers';

const importPath = '@atlaskit/form';

const convertToSimpleForm = (j: JSCodeshift, collection: Collection<any>) => {
	const importDeclarationCollection = getImportDeclarationCollection(j, collection, importPath);
	const defaultImport = getImportDefaultSpecifierCollection(j, importDeclarationCollection);
	const defaultImportName = getImportDefaultSpecifierName(defaultImport);

	// if no default import is present, exit early
	if (defaultImportName === null) {
		return;
	}

	collection.findJSXElements(defaultImportName).forEach((jsxElementPath) => {
		const node = jsxElementPath.node;
		// If no children, exit early
		if (!node.children || node.children.length === 0) {
			return;
		}

		// if component but child is not a function, exit early
		const children = node.children.filter((child) => child.type === 'JSXExpressionContainer');
		if (children.length === 0 || children.length > 1) {
			return;
		}

		// If expression child is not a function, exit early
		const childFunction = children[0];
		if (
			childFunction.type !== 'JSXExpressionContainer' ||
			childFunction.expression.type !== 'ArrowFunctionExpression'
		) {
			return;
		}

		// if function child but more than just `fieldProps`, exit early
		const args = childFunction.expression.params
			.filter((arg) => arg.type === 'ObjectPattern' && 'properties' in arg)
			.flatMap((arg) => arg.properties)
			.filter((property) => property.type === 'ObjectProperty');
		if (
			args.length !== 1 ||
			args[0].key.type !== 'Identifier' ||
			args[0].value.type !== 'Identifier'
		) {
			return;
		}
		if (args[0].key.name !== 'formProps') {
			return;
		}

		// This is the name that is used within, e.g. if something like
		// `{({ formProps: fooBar }) => ()}` is used, this will be `fooBar`
		const argName = args[0].value.name;

		// get HTML form inside the child function
		const body = childFunction.expression.body;
		let htmlForm: JSXElement | null = null;
		const q: any[] = [body];
		while (q.length > 0) {
			// pop child from end of q
			const child = q.pop();
			// if children, add children to q
			if (!child || child.type !== 'JSXElement') {
				continue;
			}
			child.children?.forEach((el: any) => q.push(el));
			// if child is a JSXElement with an openingElement of `form`, save to htmlForm and exit loop
			if (child.type === 'JSXElement' && child.openingElement.name.name === 'form') {
				htmlForm = child;
				break;
			}
		}

		// if no HTML form, exit early
		if (htmlForm === null) {
			return;
		}

		// make new object and add each attribute on HTML `form` that is not a spread of `formProps` to new object
		let otherSpreadPropsSeen = false;
		// We are required to do it this way instead of a map to make the types work correctly.
		// We also have to use `any` here and below because typing in this SUCKS.
		const nonFormPropsAttributes: any[] = [];
		htmlForm?.openingElement?.attributes?.forEach((attr) => {
			if (otherSpreadPropsSeen) {
				return;
			}

			if (attr.type === 'JSXSpreadAttribute') {
				if (attr.argument.type === 'Identifier' && attr.argument.name === argName) {
					return;
				} else {
					otherSpreadPropsSeen = true;
					return;
				}
			}

			if (attr.name.type !== 'JSXIdentifier') {
				return;
			}

			if (attr.value === undefined) {
				return;
			}

			let value: any;
			if (attr.value === null) {
				value = j.booleanLiteral(true) as any;
			} else if (attr.value.type === 'JSXExpressionContainer') {
				value = attr.value.expression as any;
			} else {
				value = attr.value as any;
			}

			nonFormPropsAttributes.push(j.property('init', attr.name, value));
		});

		// We don't know how to handle other spread props in the formProps object, so ignore it
		if (otherSpreadPropsSeen) {
			return;
		}

		if (nonFormPropsAttributes.length !== 0) {
			// make new attribute for parent `Form` default import called `formProps` and set new attribute to new object
			const formPropsAttr = j.jsxAttribute(
				j.jsxIdentifier('formProps'),
				j.jsxExpressionContainer(j.objectExpression(nonFormPropsAttributes.filter(Boolean))),
			);
			addJSXAttributeToJSXElement(j, jsxElementPath, formPropsAttr, 1);
		}

		// replace functional child with inner (all children of HTML `form`)
		const htmlFormChildren = htmlForm.children?.filter((child) => child.type !== 'JSXText');
		if (!htmlFormChildren) {
			return;
		}

		node.children.splice(0);
		node.children.splice(0, 0, ...htmlFormChildren);
	});

	return;
};

export default function transformer(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) {
	const { source } = fileInfo;
	const collection = j(source);

	// If our component is not here, skip the file
	if (!hasImportDeclaration(j, collection, importPath)) {
		return source;
	}

	// Convert form if possible
	convertToSimpleForm(j, collection);

	return collection.toSource(options.printOptions || { quote: 'single' });
}
