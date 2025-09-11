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

const migrateDataTestIdToTestIdProp = (j: JSCodeshift, collection: Collection<any>) => {
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

		// Check if Form already has a testId prop - if so, skip to avoid conflicts
		const existingTestIdProp = node.openingElement.attributes?.find(
			(attr) => attr.type === 'JSXAttribute' && attr.name.name === 'testId',
		);
		if (existingTestIdProp) {
			return;
		}

		// Find the function child
		const children = node.children.filter((child) => child.type === 'JSXExpressionContainer');
		if (children.length === 0 || children.length > 1) {
			return;
		}

		const childFunction = children[0];
		if (
			childFunction.type !== 'JSXExpressionContainer' ||
			childFunction.expression.type !== 'ArrowFunctionExpression'
		) {
			return;
		}

		// Check if function has formProps parameter
		const args = childFunction.expression.params
			.filter((arg) => arg.type === 'ObjectPattern' && 'properties' in arg)
			.flatMap((arg) => arg.properties)
			.filter((property) => property.type === 'ObjectProperty');

		const formPropsArg = args.find(
			(arg) => arg.key.type === 'Identifier' && arg.key.name === 'formProps',
		);

		if (!formPropsArg || formPropsArg.value.type !== 'Identifier') {
			return;
		}

		// Find the HTML form element inside the child function
		const body = childFunction.expression.body;
		let htmlForm: JSXElement | null = null;
		const q: any[] = [body];

		while (q.length > 0) {
			const child = q.pop();
			if (!child || child.type !== 'JSXElement') {
				continue;
			}
			child.children?.forEach((el: any) => q.push(el));

			if (child.type === 'JSXElement' && child.openingElement.name.name === 'form') {
				htmlForm = child;
				break;
			}
		}

		// if no HTML form, exit early
		if (htmlForm === null) {
			return;
		}

		// Look for data-testid attribute on the form element
		let dataTestIdAttr: any = null;
		let dataTestIdValue: any = null;

		htmlForm.openingElement.attributes?.forEach((attr, index) => {
			// Find data-testid attribute
			if (
				attr.type === 'JSXAttribute' &&
				attr.name.type === 'JSXIdentifier' &&
				attr.name.name === 'data-testid'
			) {
				dataTestIdAttr = attr;
				dataTestIdValue = attr.value;
			}
		});

		// If no data-testid found, exit early
		if (!dataTestIdAttr || !dataTestIdValue) {
			return;
		}

		// Extract the testId value
		let testIdValue: any;
		if (dataTestIdValue.type === 'StringLiteral' || dataTestIdValue.type === 'Literal') {
			// String literal: data-testid="my-form"
			testIdValue = dataTestIdValue;
		} else if (dataTestIdValue.type === 'JSXExpressionContainer') {
			// Expression: data-testid={someVariable}
			testIdValue = j.jsxExpressionContainer(dataTestIdValue.expression);
		} else {
			// Unknown format, skip
			return;
		}

		// Remove the data-testid attribute from the form element
		const filteredAttributes = htmlForm.openingElement.attributes?.filter(
			(attr) => attr !== dataTestIdAttr,
		);
		if (filteredAttributes) {
			htmlForm.openingElement.attributes = filteredAttributes;
		}

		// Add testId prop to the Form component
		const testIdProp = j.jsxAttribute(j.jsxIdentifier('testId'), testIdValue);
		addJSXAttributeToJSXElement(j, jsxElementPath, testIdProp, 1);
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

	// Migrate data-testid to testId prop
	migrateDataTestIdToTestIdProp(j, collection);

	return collection.toSource(options.printOptions || { quote: 'single' });
}
