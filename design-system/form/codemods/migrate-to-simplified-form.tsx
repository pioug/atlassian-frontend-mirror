import * as fs from 'fs';
import * as path from 'path';

import {
	type API,
	type Collection,
	type FileInfo,
	type JSCodeshift,
	type JSXAttribute,
	type JSXElement,
	type Options,
} from 'jscodeshift';

const importPath = '@atlaskit/form';
const EXISTING_FORM_ATTRIBUTES: Record<string, any> = {
	autocomplete: 'autocomplete',
	id: 'id',
	'aria-label': 'label',
	'aria-labelledby': 'labelId',
	name: 'name',
	noValidate: 'noValidate',
};

const shouldSkipFile = (filePath: string): boolean =>
	filePath.includes('__tests__') || filePath.includes('test');

/**
 * Helper functions for JSX manipulation
 */
function getImportDeclarationCollection(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
): Collection<any> {
	return collection.find(j.ImportDeclaration, {
		source: { value: importPath },
	});
}

function getImportDefaultSpecifierCollection(
	j: JSCodeshift,
	importDeclarationCollection: Collection<any>,
): Collection<any> {
	return importDeclarationCollection.find(j.ImportDefaultSpecifier);
}

function getImportDefaultSpecifierName(defaultImport: Collection<any>): string | null {
	if (defaultImport.length === 0) {
		return null;
	}
	return defaultImport.get(0).node.local.name;
}

function hasImportDeclaration(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
): boolean {
	return getImportDeclarationCollection(j, collection, importPath).length > 0;
}

// Currently unused but saving for field conversion
const generateFeatureFlag = (filePath: string): string => {
	if (!filePath) {
		return 'platform-design_system_team-form--unknown';
	}

	let currentDir = path.dirname(filePath);

	while (currentDir !== path.dirname(currentDir)) {
		const packageJsonPath = path.join(currentDir, 'package.json');
		if (fs.existsSync(packageJsonPath)) {
			try {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				const teamName = packageJson.atlassian?.team;
				if (teamName) {
					// Fit switcheroo requirements
					const suffix = teamName
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9-]/g, '');

					const flag = `platform-design_system_team-form--${suffix}`;
					return flag.length > 50 ? flag.substring(0, 50) : flag;
				}
			} catch (e) {
				// Continue searching if JSON parsing fails
			}
		}
		currentDir = path.dirname(currentDir);
	}

	// Fallback if no team found
	return 'platform-design_system_team-form--unknown';
};

const convertToSimpleForm = (j: JSCodeshift, collection: Collection<any>, featureFlag: string) => {
	const importDeclarationCollection = getImportDeclarationCollection(j, collection, importPath);
	const defaultImport = getImportDefaultSpecifierCollection(j, importDeclarationCollection);
	const defaultImportName = getImportDefaultSpecifierName(defaultImport);

	// if no default import is present, exit early
	if (defaultImportName === null) {
		return;
	}

	let transformationsMade = false;

	collection.findJSXElements(defaultImportName).forEach((jsxElementPath) => {
		const node = jsxElementPath.node;
		// If no children, exit early
		if (!node.children || node.children.length === 0) {
			return;
		}

		// if component but child is not an expression, exit early
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

		// if function child but more than just `formProps`, exit early
		const objectPatternArgs = childFunction.expression.params.filter(
			(arg) => arg.type === 'ObjectPattern' && 'properties' in arg,
		);
		const args = objectPatternArgs
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
		// These are the attributes that exist on `Form` that can migrate directly over.
		const existingFormPropsAttributes: JSXAttribute[] = [];
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

			const attrName = attr.name;

			if (attrName.type !== 'JSXIdentifier') {
				return;
			}

			if (attr.value === undefined) {
				return;
			}

			if (Object.keys(EXISTING_FORM_ATTRIBUTES).includes(attrName.name)) {
				existingFormPropsAttributes.push(attr);
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

			nonFormPropsAttributes.push(j.property('init', attrName, value));
		});

		// We don't know how to handle other spread props in the formProps object, so ignore it
		if (otherSpreadPropsSeen) {
			return;
		}

		// Clone the original Form element for the fallback
		const originalForm = j.jsxElement(
			j.jsxOpeningElement(j.jsxIdentifier(defaultImportName), [
				...(node.openingElement.attributes || []),
			]),
			j.jsxClosingElement(j.jsxIdentifier(defaultImportName)),
			[...node.children],
		);

		// Create the simplified Form element
		const simplifiedForm = j.jsxElement(
			j.jsxOpeningElement(j.jsxIdentifier(defaultImportName), [
				...(node.openingElement.attributes || []),
			]),
			j.jsxClosingElement(j.jsxIdentifier(defaultImportName)),
			[],
		);

		// Add formProps attribute if needed
		if (nonFormPropsAttributes.length !== 0) {
			const formPropsAttr = j.jsxAttribute(
				j.jsxIdentifier('formProps'),
				j.jsxExpressionContainer(j.objectExpression(nonFormPropsAttributes.filter(Boolean))),
			);
			simplifiedForm.openingElement.attributes = simplifiedForm.openingElement.attributes || [];
			simplifiedForm.openingElement.attributes.push(formPropsAttr);
		}

		// Add existing form attributes to simplified form
		existingFormPropsAttributes.forEach((attr) => {
			const fromName = attr.name.name;
			if (typeof fromName !== 'string') {
				return;
			}
			const toName = EXISTING_FORM_ATTRIBUTES[fromName];
			const newAttr = j.jsxAttribute(j.jsxIdentifier(toName), attr.value);
			simplifiedForm.openingElement.attributes = simplifiedForm.openingElement.attributes || [];
			simplifiedForm.openingElement.attributes.push(newAttr);
		});

		// Add the children from the HTML form to simplified form
		const htmlFormChildren = htmlForm.children?.filter((child) => child.type !== 'JSXText');
		if (htmlFormChildren) {
			simplifiedForm.children = [...htmlFormChildren];
		}

		// Create the ternary expression: fg('flag') ? simplifiedForm : originalForm
		const ternaryExpression = j.conditionalExpression(
			j.callExpression(j.identifier('fg'), [j.literal(featureFlag)]),
			simplifiedForm,
			originalForm,
		);

		const isInsideJSXContext = (path: any): boolean => {
			const parent = path.parent;
			if (!parent) {
				return false;
			}

			const parentType = parent.node?.type;
			return parentType === 'JSXElement' || parentType === 'JSXFragment';
		};

		// Replace the original Form with the ternary expression
		if (isInsideJSXContext(jsxElementPath)) {
			// Inside JSX - wrap in JSX expression container
			j(jsxElementPath).replaceWith(j.jsxExpressionContainer(ternaryExpression));
		} else {
			j(jsxElementPath).replaceWith(ternaryExpression);
		}

		transformationsMade = true;
	});

	return transformationsMade;
};

export default function transformer(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) {
	const { source, path } = fileInfo;

	// Skip test files
	if (path && shouldSkipFile(path)) {
		return source;
	}

	const collection = j(source);

	// If our component is not here, skip the file
	if (!hasImportDeclaration(j, collection, importPath)) {
		return source;
	}

	// Leaving this here so that we don't get "unused" error, because I want to
	// port this logic to the field codemod later
	generateFeatureFlag(path);
	const featureFlag = 'platform-design_system_team-form_conversion';

	// Convert form if possible
	const transformationsMade = convertToSimpleForm(j, collection, featureFlag);

	// Only add import if transformations were made
	if (transformationsMade) {
		// Add import for fg function if not already present
		const fgImportPath = '@atlaskit/platform-feature-flags';
		if (!hasImportDeclaration(j, collection, fgImportPath)) {
			const fgImport = j.importDeclaration(
				[j.importSpecifier(j.identifier('fg'))],
				j.literal(fgImportPath),
			);

			// Find the last import declaration and insert after it
			const imports = collection.find(j.ImportDeclaration);
			if (imports.length > 0) {
				imports.at(-1).insertAfter(fgImport);
			} else {
				// If no imports, add at the beginning
				collection.find(j.Program).get('body', 0).insertBefore(fgImport);
			}
		}
	}

	return collection.toSource(options.printOptions || { quote: 'single' });
}
