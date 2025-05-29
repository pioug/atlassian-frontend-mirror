import type { Rule } from 'eslint';
import { type Identifier, type ImportDeclaration, isNodeOfType } from 'eslint-codemod-utils';

type ReturnObject = {
	checkImportDeclarations: (node: ImportDeclaration) => void;
	checkJSXElement: (node: Rule.Node) => void;
	checkIconReference: (node: Identifier & Rule.NodeParentExtension) => void;
	throwErrors: () => void;
};

const specialCases: { [oldImport: string]: string } = {
	'@atlaskit/icon/utility/cross': '@atlaskit/icon/core/close',
	'@atlaskit/icon/utility/migration/cross--editor-close':
		'@atlaskit/icon/core/migration/close--editor-close',
};

const iconPropsinNewButton = ['icon', 'iconBefore', 'iconAfter'];

export const createChecks = (context: Rule.RuleContext): ReturnObject => {
	const importStatementsUtility: { [localName: string]: ImportDeclaration } = {};
	const importStatementsCore: { [source: string]: { node: ImportDeclaration; localName: string } } =
		{};
	const newButtonImports = new Set<string>();
	const errors: {
		[localName: string]: {
			node: Rule.Node;
			localName: string;
			messageId: string;
			fixable: boolean;
			inNewButton: boolean;
		}[];
	} = {};

	/**
	 * Gets the value of a boolean configuration flag
	 * @param key the key of the configuration flag
	 * @param defaultValue The default value of the configuration flag
	 * @returns defaultValue if the configuration flag is not set, the defaultValue of the configuration flag otherwise
	 */
	const getConfigFlag = (key: string, defaultValue: boolean) => {
		if (
			context.options &&
			context.options.length > 0 &&
			context.options[0] &&
			context.options[0].hasOwnProperty(key)
		) {
			return (context.options[0] as { [key: string]: any })[key] === !defaultValue
				? !defaultValue
				: defaultValue;
		}
		return defaultValue;
	};

	const checkImportDeclarations = (node: ImportDeclaration): void => {
		const moduleSource = node.source.value;

		if (typeof moduleSource !== 'string') {
			return;
		}

		if (moduleSource.startsWith('@atlaskit/icon/utility/')) {
			for (const specifier of node.specifiers) {
				if (specifier.type === 'ImportDefaultSpecifier') {
					importStatementsUtility[specifier.local.name] = node;
				}
			}
		} else if (moduleSource.startsWith('@atlaskit/icon/core/')) {
			for (const specifier of node.specifiers) {
				if (specifier.type === 'ImportDefaultSpecifier') {
					importStatementsCore[moduleSource] = { node, localName: specifier.local.name };
				}
			}
		} else if (moduleSource.startsWith('@atlaskit/button/')) {
			for (const specifier of node.specifiers) {
				newButtonImports.add(specifier.local.name);
			}
		}
	};

	const checkJSXElement = (node: Rule.Node): void => {
		if (
			!(
				isNodeOfType(node, 'JSXElement') &&
				isNodeOfType(node.openingElement.name, 'JSXIdentifier') &&
				importStatementsUtility.hasOwnProperty(node.openingElement.name.name) &&
				typeof importStatementsUtility[node.openingElement.name.name].source.value === 'string'
			)
		) {
			return;
		}

		if (!errors.hasOwnProperty(node.openingElement.name.name)) {
			errors[node.openingElement.name.name] = [];
		}

		errors[node.openingElement.name.name].push({
			node,
			messageId: 'noUtilityIconsJSXElement',
			localName: node.openingElement.name.name,
			fixable: true,
			inNewButton: false,
		});
	};

	// Cases: As Props, In Function Calls, In Arrays, In Maps, In Exports
	const checkIconReference = (node: Identifier & Rule.NodeParentExtension): void => {
		//if this is an import statement then exit early
		if (
			node.parent &&
			(isNodeOfType(node.parent, 'ImportSpecifier') ||
				isNodeOfType(node.parent, 'ImportDefaultSpecifier'))
		) {
			return;
		}

		//check the reference to see if it's a utility icon, if not exit early
		if (!importStatementsUtility.hasOwnProperty(node.name)) {
			return;
		}

		// if it is in new Button then we can fix it
		if (
			node.parent &&
			node.parent.parent &&
			node.parent.parent.parent &&
			isNodeOfType(node.parent, 'JSXExpressionContainer') &&
			isNodeOfType(node.parent.parent, 'JSXAttribute') &&
			isNodeOfType(node.parent.parent.name, 'JSXIdentifier') &&
			iconPropsinNewButton.includes(node.parent.parent.name.name) &&
			isNodeOfType(node.parent.parent.parent, 'JSXOpeningElement') &&
			isNodeOfType(node.parent.parent.parent.name, 'JSXIdentifier') &&
			newButtonImports.has(node.parent.parent.parent.name.name)
		) {
			// if it is in new Button then we can fix it
			if (!errors.hasOwnProperty(node.name)) {
				errors[node.name] = [];
			}

			errors[node.name].push({
				node,
				messageId: 'noUtilityIconsReference',
				localName: node.name,
				fixable: true,
				inNewButton: true,
			});
			return;
		}

		// manually error
		if (!errors.hasOwnProperty(node.name)) {
			errors[node.name] = [];
		}

		errors[node.name].push({
			node,
			messageId: 'noUtilityIconsReference',
			localName: node.name,
			fixable: false,
			inNewButton: false,
		});
	};

	/**
	 * Throws the relevant errors in the correct order.
	 */
	const throwErrors = (): void => {
		const shouldAutoFix = getConfigFlag('enableAutoFixer', false);
		for (const utilityIcon of Object.keys(errors)) {
			const allFixable = errors[utilityIcon].every((x) => x.fixable); // Check if ALL errors for a giving import are fixable
			const originalImportNode = importStatementsUtility[utilityIcon];
			const oldImportName = importStatementsUtility[utilityIcon].source.value as string;
			const newImportName = specialCases.hasOwnProperty(oldImportName)
				? specialCases[oldImportName]
				: oldImportName.replace('@atlaskit/icon/utility/', '@atlaskit/icon/core/');
			const existingImport = importStatementsCore.hasOwnProperty(newImportName)
				? importStatementsCore[newImportName].localName
				: null;
			let replacementImportName = existingImport
				? existingImport
				: allFixable
					? utilityIcon
					: `${utilityIcon}Core`;
			let importFixAdded = false;
			for (const [index, error] of errors[utilityIcon].entries()) {
				if (error.fixable && shouldAutoFix) {
					context.report({
						node: error.node,
						messageId: error.messageId,
						fix: (fixer) => {
							const fixes: Rule.Fix[] = [];

							// Add a new import statement if it doesn't already exist
							if (!existingImport && !importFixAdded) {
								importFixAdded = true;
								fixes.push(
									fixer.insertTextBefore(
										originalImportNode,
										`import ${replacementImportName} from '${newImportName}';\n`,
									),
								);
							}

							// Handle JSX elements differently if they are in a "new Button"
							if (error.inNewButton) {
								// Replace the icon with a function that wraps it with iconProps and size="small"
								const wrappedIcon = `(iconProps) => <${replacementImportName} {...iconProps} size="small" />`;
								fixes.push(fixer.replaceText(error.node, wrappedIcon));
							} else if (
								isNodeOfType(error.node, 'JSXElement') &&
								isNodeOfType(error.node.openingElement.name, 'JSXIdentifier')
							) {
								// Replace the JSX element's closing tag with size="small"
								const newOpeningElementText = context.sourceCode
									.getText(error.node.openingElement)
									.replace(/\s*\/\s*>$/, ` size="small"\/>`)
									.replace(
										new RegExp('<s*' + error.node.openingElement.name.name),
										`<${replacementImportName}`,
									);
								fixes.push(fixer.replaceText(error.node.openingElement, newOpeningElementText));
							}

							// Handle the first fixable error for import removal if all fixable for this import
							if (index === 0 && allFixable) {
								fixes.push(fixer.remove(originalImportNode));
							}

							return fixes;
						},
					});
				} else {
					// Report non-fixable errors
					context.report({
						node: error.node,
						messageId: error.messageId,
					});
				}
			}
		}

		// If other utility icons are imported but there were no errors for them - (this should only be unused imports but good to have as a backup), report them
		const otherUtilityImportsWithoutErrors = Object.keys(importStatementsUtility).filter(
			(utilityIcon) => !errors.hasOwnProperty(utilityIcon),
		);
		for (const utilityIcon of otherUtilityImportsWithoutErrors) {
			context.report({
				node: importStatementsUtility[utilityIcon],
				messageId: 'noUtilityIconsImport',
			});
		}
	};

	return {
		checkImportDeclarations,
		checkJSXElement,
		checkIconReference,
		throwErrors,
	};
};
