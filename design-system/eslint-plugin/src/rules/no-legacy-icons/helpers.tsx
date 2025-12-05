import type { Rule } from 'eslint';
import {
	type ImportDeclaration,
	isNodeOfType,
	type JSXAttribute,
	type JSXSpreadAttribute,
	literal,
	type Node,
} from 'eslint-codemod-utils';

import baseMigrationMap, {
	type IconMigrationSizeGuidance,
	migrationOutcomeDescriptionMap,
} from '@atlaskit/icon/migration-map';

export type IconMigrationError = Rule.ReportDescriptor;
import { upcomingIcons } from './upcoming-icons';

export type RangeList = {
	start: number;
	end: number;
}[];

export type ErrorListManual = {
	[loc: string]: { errors: IconMigrationError[]; iconName: string; importSource: string };
};
export type ErrorListAuto = {
	[loc: string]: IconMigrationError;
};
export type GuidanceList = { [loc: string]: string };

export type LegacyIconImportList = {
	[key: string]: {
		packageName: string;
		exported: boolean;
		importNode: ImportDeclaration;
		importSpecifier: string;
	};
};

export type MigrationIconImportList = {
	[key: string]: {
		packageName: string;
		exported: boolean;
		importNode: ImportDeclaration;
		importSpecifier: string;
	};
};

const sizes = ['small', 'medium', 'large', 'xlarge'] as const;
export type Size = (typeof sizes)[number];
export const isSize = (size: any): size is Size => sizes.includes(size as Size);

/**
 * Returns the migration map object for a legacy icon or null if not found
 * @param iconPackage The name of the legacy icon package
 * @returns The migration map object for the legacy icon or null if not found
 */
export const getMigrationMapObject = (iconPackage: string) => {
	const key = getIconKey(iconPackage);
	if (Object.keys(baseMigrationMap).includes(key)) {
		return baseMigrationMap[key];
	}
	return null;
};

export const getUpcomingIcons = (iconPackage: string) => {
	const key = getIconKey(iconPackage);
	if (upcomingIcons.includes(key)) {
		const retval: { sizeGuidance: Record<Size, IconMigrationSizeGuidance> } = {
			sizeGuidance: {
				small: 'swap',
				medium: 'swap',
				large: 'icon-tile',
				xlarge: 'icon-tile',
			},
		};
		return retval;
	}
	return null;
};

/**
 * Returns the key of a legacy icon
 * @param iconPackage The name of the legacy icon package
 * @returns The unique identifier for the icon (the part after "@atlaskit/icon/glyph")
 */
const getIconKey = (iconPackage: string) => {
	const key = iconPackage.replace(/^@atlaskit\/icon\/glyph\//, '');
	return key;
};

/**
 * Checks if a new icon can be auto-migrated based on guidance from the migration map
 */
export const canAutoMigrateNewIconBasedOnSize = (guidance?: IconMigrationSizeGuidance) => {
	return guidance
		? ['swap', 'swap-slight-visual-change', 'swap-visual-change'].includes(guidance)
		: false;
};

/**
 *
 * @param iconPackage string
 * @returns object of new icon name and import path
 */
const getNewIconNameAndImportPath = (
	iconPackage: string,
	shouldUseMigrationPath?: boolean,
): { iconName?: string; importPath?: string } => {
	const legacyIconName = getIconKey(iconPackage);

	const migrationMapObject = getMigrationMapObject(iconPackage);
	if (!migrationMapObject || !migrationMapObject.newIcon) {
		return {};
	}
	const { newIcon } = migrationMapObject;

	const migrationPath =
		newIcon.name === legacyIconName
			? `${newIcon.package}/core/migration/${newIcon.name}`
			: `${newIcon.package}/core/migration/${newIcon.name}--${legacyIconName.replaceAll('/', '-')}`;
	return {
		iconName: newIcon.name,
		importPath: shouldUseMigrationPath ? migrationPath : `${newIcon.package}/core/${newIcon.name}`,
	};
};

/**
 * Creates the written guidance for migrating a legacy icon to a new icon
 */
export const createGuidance = ({
	iconPackage,
	insideNewButton,
	size: initialSize,
	shouldUseMigrationPath,
	shouldForceSmallIcon,
}: {
	iconPackage: string;
	insideNewButton?: boolean;
	size?: Size;
	shouldUseMigrationPath?: boolean;
	shouldForceSmallIcon?: boolean;
}) => {
	const size = shouldForceSmallIcon ? 'small' : initialSize;

	const migrationMapObject = getMigrationMapObject(iconPackage);
	const upcomingIcon = getUpcomingIcons(iconPackage);
	if (upcomingIcon) {
		let guidance = '';
		if (size) {
			if (
				upcomingIcon.sizeGuidance[size] &&
				canAutoMigrateNewIconBasedOnSize(upcomingIcon.sizeGuidance[size])
			) {
				guidance += `Fix: An upcoming icon release is planned to migrate this legacy icon.`;
			} else {
				guidance += `No equivalent icon for this size, ${size}, in the current or upcoming set of icons.`;
			}
			guidance += `${Object.keys(migrationOutcomeDescriptionMap).includes(upcomingIcon.sizeGuidance[size]) ? ` Once the upcoming icons are released, please: ${migrationOutcomeDescriptionMap[upcomingIcon.sizeGuidance[size]]}` : ' No migration size advice given.'}\n`;
		} else {
			guidance = `Please wait for the upcoming icons released, as it will contain an alternative for this legacy icon.\nMigration suggestions, depending on the legacy icon size:\n`;
			for (const [size, value] of Object.entries(upcomingIcon.sizeGuidance)) {
				guidance += `\t- ${size}: `;
				if (!Object.keys(migrationOutcomeDescriptionMap).includes(value)) {
					guidance += 'No migration advice given.\n';
				} else {
					guidance += `${migrationOutcomeDescriptionMap[value as IconMigrationSizeGuidance]}.\n`;
				}
			}
		}
		return guidance;
	} else if (migrationMapObject) {
		const newIcon = migrationMapObject.newIcon;
		if (!newIcon) {
			return 'No equivalent icon in new set. An option is to contribute a custom icon into icon-labs package instead.\n';
		}

		const { iconName, importPath } = getNewIconNameAndImportPath(
			iconPackage,
			shouldUseMigrationPath,
		);

		const buttonGuidanceStr =
			"Please set 'spacing' property of the new icon to 'none', to ensure appropriate spacing inside `@atlaskit/button`.\n";
		let guidance = '';
		if (size) {
			if (
				migrationMapObject.sizeGuidance[size] &&
				canAutoMigrateNewIconBasedOnSize(migrationMapObject.sizeGuidance[size])
			) {
				guidance += `Fix: Use ${iconName} from ${importPath} instead.`;
			} else {
				guidance += `No equivalent icon for this size, ${size}, in new set.`;
			}
			guidance += `${Object.keys(migrationOutcomeDescriptionMap).includes(migrationMapObject.sizeGuidance[size]) ? ` Please: ${migrationOutcomeDescriptionMap[migrationMapObject.sizeGuidance[size]]}` : ' No migration size advice given.'}\n`;
		} else {
			guidance = `Use ${iconName} from ${importPath} instead.\nMigration suggestions, depending on the legacy icon size:\n`;
			Object.entries(migrationMapObject.sizeGuidance).forEach(
				([size, value]: [string, unknown]) => {
					guidance += `\t- ${size}: `;
					if (
						!Object.keys(migrationOutcomeDescriptionMap).includes(
							value as IconMigrationSizeGuidance,
						)
					) {
						guidance += 'No migration advice given.\n';
					} else {
						guidance += `${migrationOutcomeDescriptionMap[value as IconMigrationSizeGuidance]}.\n`;
					}
				},
			);
		}
		if (insideNewButton) {
			guidance += buttonGuidanceStr;
		} else if (size === 'medium') {
			guidance +=
				"Setting the spacing='spacious' will maintain the icon's box dimensions - but consider setting spacing='none' as it allows for easier control of spacing by parent elements.\n";
		} else if (size === 'small') {
			if (initialSize !== 'small' && shouldForceSmallIcon) {
				guidance +=
					"For this icon, it's recommended to use a smaller size using size='small'. Alternatively, for special cases where a larger version is needed size='medium' can be used, but it is generally discouraged for this icon.\n";
			} else if (initialSize === 'small') {
				if (shouldForceSmallIcon) {
					guidance +=
						"Setting spacing='compact' will maintain the icon's box dimensions - but consider setting spacing='none' as it allows for easier control of spacing by parent elements.\n";
				} else {
					guidance +=
						"It's recommended to upscale to a medium icon with no spacing. Alternatively for special cases where smaller icons are required, the original icon size and dimensions can be maintained by using size='small' and spacing='compact'.\n";
				}
			}
		} else if (size) {
			guidance += "In the new icon, please use spacing='none'.\n";
		}
		return guidance;
	} else {
		return `Migration suggestions not found for "${iconPackage}".\n`;
	}
};

/**
 * Checks if the color can be migrated
 * @param color String representing the color to check
 * @returns True if the color can be migrated, false otherwise
 */
export const canMigrateColor = (color: string) => {
	if (color.match(/^color\.icon/)) {
		return true;
	} else if (color.match(/^color\.link/)) {
		return true;
	} else if (color.match(/^color\.text/)) {
		return true;
	} else if (color === 'currentColor') {
		return true;
	} else {
		return false;
	}
};

export const locToString = (node: Node) => {
	if (node.range && node.range.length >= 2) {
		return `${node.range[0]}:${node.range[1]}`;
	} else {
		return '';
	}
};

export const createCantMigrateReExportError = (
	node: Node,
	packageName: string,
	exportName: string,
	errors: ErrorListManual,
) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'cantMigrateReExport',
		data: {
			packageName,
			exportName,
		},
	};
	pushManualError(locToString(node), errors, myError, packageName, exportName);
};

export const createCantMigrateIdentifierMapOrArrayError = (
	node: Node,
	packageName: string,
	exportName: string,
	errors: ErrorListManual,
) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'cantMigrateIdentifierMapOrArray',
		data: {
			packageName,
			exportName,
		},
	};
	pushManualError(locToString(node), errors, myError, packageName, exportName);
};

export const createCantMigrateIdentifierError = (
	node: Node,
	packageName: string,
	exportName: string,
	errors: ErrorListManual,
) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'cantMigrateIdentifier',
		data: {
			iconSource: packageName,
			iconName: exportName,
		},
	};
	pushManualError(locToString(node), errors, myError, packageName, exportName);
};

export const createCantFindSuitableReplacementError = (
	node: Node,
	importSource: string,
	iconName: string,
	errors: ErrorListManual,
	sizeIssue?: boolean,
) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'cantFindSuitableReplacement',
		data: {
			importSource,
			iconName,
			sizeGuidance: sizeIssue ? ' at the current size' : '',
		},
	};
	pushManualError(locToString(node), errors, myError, importSource, iconName);
};
export const createCantMigrateFunctionUnknownError = (
	node: Node,
	importSource: string,
	iconName: string,
	errors: ErrorListManual,
) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'cantMigrateFunctionUnknown',
		data: {
			importSource,
			iconName,
		},
	};
	pushManualError(locToString(node), errors, myError, importSource, iconName);
};

export const createCantMigrateColorError = (
	node: Node,
	colorValue: string,
	errors: ErrorListManual,
	importSource: string,
	iconName: string,
) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'cantMigrateColor',
		data: {
			colorValue,
		},
	};
	pushManualError(locToString(node), errors, myError, importSource, iconName);
};

export const createCantMigrateSpreadPropsError = (
	node: Node,
	missingProps: string[],
	errors: ErrorListManual,
	importSource: string,
	iconName: string,
) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'cantMigrateSpreadProps',
		data: {
			missingProps: missingProps.join(', '),
		},
	};
	pushManualError(locToString(node), errors, myError, importSource, iconName);
};

export const createCantMigrateSizeUnknown = (
	node: Node,
	errors: ErrorListManual,
	importSource: string,
	iconName: string,
) => {
	const myError: IconMigrationError = { node, messageId: 'cantMigrateSizeUnknown' };
	pushManualError(locToString(node), errors, myError, importSource, iconName);
};

export const createAutoMigrationError = ({
	node,
	importSource,
	iconName,
	errors,
	spacing,
	insideNewButton,
	shouldForceSmallIcon,
}: {
	node: Node;
	importSource: string;
	iconName: string;
	errors: ErrorListAuto;
	spacing?: string;
	insideNewButton?: boolean;
	shouldForceSmallIcon?: boolean;
}) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'noLegacyIconsAutoMigration',
		data: {
			importSource,
			iconName,
			spacing: spacing ?? '',
			// value type need to be a string in Rule.ReportDescriptor
			insideNewButton: String(insideNewButton),
			shouldForceSmallIcon: String(shouldForceSmallIcon),
		},
	};
	errors[locToString(node)] = myError;
};

const pushManualError = (
	key: string,
	errors: ErrorListManual,
	myError: IconMigrationError,
	importSource: string,
	iconName: string,
) => {
	if (Object.keys(errors).includes(key)) {
		errors[key].errors.push(myError);
	} else {
		errors[key] = { errors: [myError], importSource, iconName };
	}
};

const getLiteralStringValue = (value: any): string | undefined => {
	if (!value) {
		return;
	}

	// propName="value"
	if (isNodeOfType(value, 'Literal') && typeof value.value === 'string') {
		return value.value;
	}

	// propName={"value"}
	if (
		isNodeOfType(value, 'JSXExpressionContainer') &&
		isNodeOfType(value.expression, 'Literal') &&
		typeof value.expression.value === 'string'
	) {
		return value.expression.value;
	}

	return;
};

export const createHelpers = (ctx: Rule.RuleContext) => {
	// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
	const context = ctx as unknown as Omit<Rule.RuleContext, 'options'> & {
		options: [{ [key: string]: boolean }];
	};
	/**
	 * Extracts the token name of a token() call from a JSXExpressionContainer
	 * @param value The JSXExpressionContainer to extract the token call from
	 * @returns The value of the token call, or null if it could not be extracted
	 */
	const getTokenCallValue = (value: any) => {
		/**
		 * Previously, we used getImportName() to extract the token name from a token() call.
		 * However, this was failing in the Issue Automat so we are now using a simpler approach.
		 */

		if (
			isNodeOfType(value, 'JSXExpressionContainer') &&
			isNodeOfType(value.expression, 'CallExpression') &&
			'name' in value.expression.callee &&
			value.expression.callee.name === 'token'
		) {
			// propName={token("color...."}
			return getLiteralStringValue(value.expression.arguments[0]);
		}
		return;
	};

	/**
	 * Gets the value of a boolean configuration flag
	 * @param key the key of the configuration flag
	 * @param defaultValue The default value of the configuration flag
	 * @returns defaultValue if the configuration flag is not set, the defaultValue of the configuration flag otherwise
	 */
	const getConfigFlag = (key: string, defaultValue: boolean) => {
		if (
			context.options.length > 0 &&
			context.options[0] &&
			Object.keys(context.options[0]).includes(key)
		) {
			return context.options[0][key] === !defaultValue ? !defaultValue : defaultValue;
		}
		return defaultValue;
	};

	return {
		/**
		 * Extracts the primaryColor value from a JSXAttribute
		 */
		getPrimaryColor(attr: JSXAttribute) {
			const { value } = attr;
			return getLiteralStringValue(value) ?? getTokenCallValue(value) ?? null;
		},
		getTokenCallValue,
		getConfigFlag,
	};
};

export const addToListOfRanges = (node: Node, sortedListOfRangesForErrors: RangeList) => {
	if (node.range && node.range.length >= 2) {
		sortedListOfRangesForErrors.push({ start: node.range[0], end: node.range[1] });
	}
};

const isInRangeList = (node: Node, sortedListOfRangesForErrors: RangeList): boolean => {
	const { range } = node;
	if (!range || range.length < 2) {
		return false;
	}
	const found = sortedListOfRangesForErrors.find(
		(currRange) => range[0] >= currRange.start && range[1] <= currRange.end,
	);
	return !!found;
};

/**
 *
 * @param node Icon JSXelement
 * @param newButtonImports list of new button import specifiers
 * @returns if Icon is inside a new button
 */
export const isInsideNewButton = (node: Rule.Node, newButtonImports: Set<string>): boolean => {
	let insideNewButton = false;
	if (
		node.parent &&
		isNodeOfType(node.parent, 'ArrowFunctionExpression') &&
		node.parent?.parent?.parent &&
		isNodeOfType(node.parent.parent.parent, 'JSXAttribute') &&
		isNodeOfType(node.parent.parent.parent.name, 'JSXIdentifier') &&
		node.parent?.parent?.parent?.parent &&
		isNodeOfType(node.parent.parent.parent.parent, 'JSXOpeningElement') &&
		isNodeOfType(node.parent.parent.parent.parent.name, 'JSXIdentifier') &&
		newButtonImports.has(node.parent.parent.parent.parent.name.name)
	) {
		insideNewButton = true;
	}
	return insideNewButton;
};

/**
 *
 * @param node Icon JSXelement
 * @param newButtonImports list of legacy button import specifiers
 * @returns if Icon is inside a legacy button
 */
export const isInsideLegacyButton = (
	node: Rule.Node,
	legacyButtonImports: Set<string>,
): boolean => {
	return (
		node.parent &&
		isNodeOfType(node.parent, 'JSXExpressionContainer') &&
		node.parent?.parent &&
		isNodeOfType(node.parent.parent, 'JSXAttribute') &&
		(node.parent.parent.name.name === 'iconBefore' ||
			node.parent.parent.name.name === 'iconAfter') &&
		isNodeOfType(node.parent?.parent?.parent, 'JSXOpeningElement') &&
		isNodeOfType(node.parent?.parent?.parent.name, 'JSXIdentifier') &&
		legacyButtonImports.has(node.parent?.parent?.parent.name.name)
	);
};

/**
 *
 * @param node Icon JSXelement
 * @param newButtonImports list of legacy button import specifiers
 * @returns if Icon is inside a legacy button
 */
export const isInsideIconOnlyLegacyButton = (
	node: Rule.Node,
	legacyButtonImports: Set<string>,
): boolean => {
	let insideIconOnlyLegacyButton = false;

	if (isInsideLegacyButton(node, legacyButtonImports)) {
		const legacyButtonAttributes =
			node.parent &&
			isNodeOfType(node.parent, 'JSXExpressionContainer') &&
			node.parent?.parent &&
			isNodeOfType(node.parent.parent, 'JSXAttribute') &&
			node.parent.parent.parent &&
			isNodeOfType(node.parent?.parent?.parent, 'JSXOpeningElement')
				? node.parent?.parent?.parent.attributes
						.map(
							(attribute) =>
								isNodeOfType(attribute, 'JSXAttribute') &&
								isNodeOfType(attribute.name, 'JSXIdentifier') &&
								attribute?.name?.name,
						)
						.filter(Boolean)
				: [];

		const hasIconBefore = legacyButtonAttributes.includes('iconBefore');
		const hasIconAfter = legacyButtonAttributes.includes('iconAfter');
		const hasChildren =
			node.parent?.parent?.parent?.parent &&
			isNodeOfType(node.parent?.parent?.parent?.parent, 'JSXElement') &&
			node.parent?.parent?.parent?.parent.children.length > 0;

		if (
			(hasIconBefore && !hasIconAfter && !hasChildren) ||
			(!hasIconBefore && hasIconAfter && !hasChildren) ||
			(!hasIconBefore && !hasIconAfter && hasChildren)
		) {
			insideIconOnlyLegacyButton = true;
		}
	}

	return insideIconOnlyLegacyButton;
};

const findProp = (attributes: (JSXAttribute | JSXSpreadAttribute)[], propName: string) =>
	attributes.find(
		(attr: JSXAttribute | JSXSpreadAttribute) =>
			attr.type === 'JSXAttribute' && attr.name.name === propName,
	);

const getNewIconNameForRenaming = (
	isInManualArray: boolean,
	importSource: string,
	importSpecifier?: string,
) => {
	let newIconName: string | undefined;

	if (isInManualArray) {
		newIconName = getNewIconNameAndImportPath(importSource).iconName;
		const keyToName = newIconName ? getComponentName(newIconName) : undefined;
		newIconName = keyToName;

		if (newIconName === undefined || importSpecifier === keyToName) {
			newIconName = `${keyToName}New`;
		}
	}
	return newIconName;
};

export const getComponentName = (name: string) => {
	return name
		.split(/\W/)
		.map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
		.join('')
		.concat('Icon');
};

/**
 *
 * Creates a list of fixers to update the icon import path
 * @param metadata Metadata including the import source and spacing
 * @param fixer The original fix function
 * @param legacyImportNode The import declaration node to replace
 * @param shouldUseMigrationPath The eslint rule config, whether to use migration entrypoint or not
 * @param migrationImportNode The migration import declaration node to replace, only present if shouldUseMigrationPath is false
 * @returns A list of fixers to migrate the icon
 */
const createImportFix = ({
	fixer,
	legacyImportNode,
	metadata,
	shouldUseMigrationPath,
	migrationImportNode,
	newIconName,
}: {
	fixer: Rule.RuleFixer;
	metadata: { importSource: string; spacing: string };
	legacyImportNode?: ImportDeclaration;
	shouldUseMigrationPath: boolean;
	migrationImportNode?: ImportDeclaration;
	newIconName?: string;
}) => {
	const fixes: Rule.Fix[] = [];
	const { importSource } = metadata;

	const importPath = migrationImportNode
		? importSource.replace('/migration', '').split('--')[0]
		: getNewIconNameAndImportPath(importSource, shouldUseMigrationPath).importPath;

	const useMigrationPath = legacyImportNode && importPath;
	const useFinalPath = migrationImportNode && !shouldUseMigrationPath && importPath;

	const programNode = legacyImportNode && findProgramNode(legacyImportNode);

	if (useMigrationPath) {
		if (newIconName) {
			const isExisting = programNode
				? alreadyHasImportedLocalName(programNode, newIconName, importPath)
				: false;
			if (!isExisting) {
				fixes.push(
					fixer.insertTextBefore(legacyImportNode, `import ${newIconName} from '${importPath}';\n`),
				);
			}
		} else {
			fixes.push(fixer.replaceText(legacyImportNode.source, `'${literal(importPath)}'`));
		}
	} else if (useFinalPath) {
		if (newIconName) {
			const isExisting = programNode
				? alreadyHasImportedLocalName(programNode, newIconName, importPath)
				: false;
			if (!isExisting) {
				fixes.push(
					fixer.insertTextBefore(
						migrationImportNode,
						`import ${newIconName} from '${importPath}';\n`,
					),
				);
			}
		} else {
			fixes.push(fixer.replaceText(migrationImportNode.source, `'${literal(importPath)}'`));
		}
	}
	return fixes;
};

/**
 * Creates a list of fixers to update the icon props
 * @param node The Icon element to migrate
 * @param metadata Metadata including the import source and spacing
 * @param fixer The original fix function
 * @param legacyImportNode The import declaration node to replace
 * @param shouldUseMigrationPath The eslint rule config, whether to use migration entrypoint or not
 * @param migrationImportNode The migration import declaration node to replace, only present if shouldUseMigrationPath is false
 * @returns A list of fixers to migrate the icon
 */
const createPropFixes = ({
	node,
	fixer,
	legacyImportNode,
	metadata,
	shouldUseMigrationPath,
	migrationImportNode,
	newIconName,
}: {
	node: Node;
	fixer: Rule.RuleFixer;
	metadata: { importSource: string; spacing: string; insideNewButton: string; size?: string };
	legacyImportNode?: ImportDeclaration;
	shouldUseMigrationPath: boolean;
	migrationImportNode?: ImportDeclaration;
	newIconName?: string;
}) => {
	const fixes: Rule.Fix[] = [];

	const { spacing, size, importSource } = metadata;
	if (shouldUseMigrationPath && !legacyImportNode) {
		return fixes;
	}

	if (node.type === 'JSXElement') {
		const { openingElement } = node;

		if (newIconName) {
			fixes.push(fixer.replaceText(openingElement.name, newIconName));
		}

		const { attributes } = openingElement;

		// replace primaryColor prop with color
		const primaryColor = findProp(attributes, 'primaryColor');

		if (primaryColor && primaryColor.type === 'JSXAttribute') {
			fixes.push(fixer.replaceText(primaryColor.name, 'color'));
		}

		const sizeProp = findProp(attributes, 'size');
		const spacingProp = findProp(attributes, 'spacing');

		if (sizeProp && sizeProp.type === 'JSXAttribute') {
			if (shouldUseMigrationPath) {
				// Rename existing size prop to LEGACY_size and add new size prop if applicable
				fixes.push(fixer.replaceText(sizeProp.name, 'LEGACY_size'));
				if (size) {
					fixes.push(fixer.insertTextAfter(sizeProp, ` size="${size}"`));
				}
			} else {
				if (size && sizeProp.value) {
					// update size prop with new replacement size
					fixes.push(fixer.replaceText(sizeProp.value, `"${size}"`));
				} else if (importSource.startsWith('@atlaskit/icon/glyph/')) {
					// only remove size prop for glyph entry points if no new replacement size is specified
					fixes.push(fixer.remove(sizeProp));
				} else if (
					sizeProp.value &&
					sizeProp.value.type === 'Literal' &&
					typeof sizeProp.value.value === 'string' &&
					sizeProp.value.value === 'medium'
				) {
					// if size is medium, we can remove it as it is the default size
					fixes.push(fixer.remove(sizeProp));
				}
			}
		} else if (size) {
			fixes.push(fixer.insertTextAfter(openingElement.name, ` size="${size}"`));
		}

		// Add spacing prop if no existing spacing prop and icon is not imported from migration entrypoint
		if (spacing && spacing !== 'none' && !spacingProp && !migrationImportNode) {
			fixes.push(fixer.insertTextAfter(sizeProp || openingElement.name, ` spacing="${spacing}"`));
		}

		// rename or remove secondaryColor prop based on shouldUseMigrationPath
		const secondaryColorProp = findProp(attributes, 'secondaryColor');

		if (secondaryColorProp && secondaryColorProp.type === 'JSXAttribute') {
			fixes.push(
				shouldUseMigrationPath
					? // replace secondaryColor prop with LEGACY_secondaryColor
						fixer.replaceText(secondaryColorProp.name, 'LEGACY_secondaryColor')
					: // remove secondaryColor prop if shouldUseMigrationPath is false
						fixer.remove(secondaryColorProp),
			);
		}

		// remove LEGACY props
		if (!shouldUseMigrationPath) {
			['LEGACY_size', 'LEGACY_margin', 'LEGACY_fallbackIcon', 'LEGACY_secondaryColor'].forEach(
				(propName) => {
					const legacyProp = findProp(attributes, propName);
					if (legacyProp && legacyProp.type === 'JSXAttribute') {
						fixes.push(fixer.remove(legacyProp));
					}
				},
			);
		}
	} else if (node.type === 'Identifier' && newIconName) {
		fixes.push(fixer.replaceText(node, newIconName));
	}

	return fixes;
};

/**
 * Check if the new icon exists in the migration map
 */
const checkIfNewIconExist = (error: { data?: { importSource?: string } }) => {
	if (!error.data?.importSource) {
		return false;
	}
	const iconKey = getIconKey(error.data.importSource);
	const { newIcon } = baseMigrationMap[iconKey] || {};

	return Boolean(newIcon);
};

export const throwManualErrors = ({
	errorsManual,
	errorRanges,
	guidance,
	context,
	isQuietMode,
}: {
	errorsManual: ErrorListManual;
	errorRanges: RangeList;
	guidance: GuidanceList;
	context: Rule.RuleContext;
	isQuietMode: boolean;
}) => {
	for (const [key, errorList] of Object.entries(errorsManual)) {
		const node: Node | null = 'node' in errorList.errors[0] ? errorList.errors[0].node : null;
		if (!node) {
			return;
		}
		const cantMigrateIdentifierError = errorList.errors.find(
			(x) => 'messageId' in x && x.messageId === 'cantMigrateIdentifier',
		);
		let isInRange = false;
		if (cantMigrateIdentifierError && isInRangeList(node, errorRanges)) {
			isInRange = true;
		}
		if (
			(isInRange && errorList.errors.length - 1 > 0) ||
			(!isInRange && errorList.errors.length > 0)
		) {
			const guidanceMessage = Object.keys(guidance).includes(key) ? guidance[key] : '';
			context.report({
				node,
				messageId: 'noLegacyIconsManualMigration',
				data: {
					iconName: errorList.iconName,
					importSource: errorList.importSource,
					guidance: isQuietMode
						? guidanceMessage
						: `${guidanceMessage}For more information see the below errors.\n`,
				},
			});
			if (!isQuietMode) {
				for (const error of errorList.errors) {
					if (
						'messageId' in error &&
						(error.messageId !== 'cantMigrateIdentifier' ||
							(error.messageId === 'cantMigrateIdentifier' && !isInRange))
					) {
						context.report(error);
					}
				}
			}
		}
	}
};

// Loops through automatic errors and them after adding the required suggestion/fix
export const throwAutoErrors = ({
	errorsManual,
	errorsAuto,
	iconSizesInfo,
	legacyIconImports,
	guidance,
	migrationIconImports,
	shouldUseMigrationPath,
	context,
}: {
	errorsManual: ErrorListManual;
	errorsAuto: ErrorListAuto;
	iconSizesInfo: Record<
		string,
		{
			small: string[]; // List of locations where the icon is used with small size
			usageCount: number; // Total number of usages of this icon
		}
	>;
	legacyIconImports: LegacyIconImportList;
	guidance: GuidanceList;
	migrationIconImports: MigrationIconImportList;
	shouldUseMigrationPath: boolean;
	context: Rule.RuleContext;
}) => {
	// Set of all the import sources that have manual errors (required later to check if a source has both manual and auto
	// errors in one file making it impossible to just remove the legacy import)
	const allManualErrorSources = Object.entries(errorsManual).reduce<Set<string>>(
		(result, option) => {
			const [key, errorInfo] = option;
			if (!errorsAuto.hasOwnProperty(key)) {
				result.add(errorInfo.importSource);
			}
			return result;
		},
		new Set<string>(),
	);
	// Group errors by import source and remove any unwanted errors
	const groupedErrorList = Object.entries(errorsAuto).reduce<
		Record<string, ({ key: string } & Rule.ReportDescriptor)[]>
	>((result, option) => {
		const [key, error] = option;
		// Return early if no data
		if (!error.data) {
			return result;
		}
		if (Object.keys(errorsManual).includes(key)) {
			const cantMigrateIdentifierError = errorsManual[key].errors.find(
				(x) => 'messageId' in x && x.messageId === 'cantMigrateIdentifier',
			);
			// If cantMigrateIdentifier is the only manual error found we still want to throw the auto error
			if (!(cantMigrateIdentifierError && errorsManual[key].errors.length === 1)) {
				return result;
			}
		}
		const importSource = error.data.importSource;
		if (!result.hasOwnProperty(importSource)) {
			result[importSource] = [];
		}
		result[importSource].push({
			key,
			...error,
		});
		return result;
	}, {});

	for (const [importSource, errorList] of Object.entries(groupedErrorList)) {
		const autoFixers: ((fixer: Rule.RuleFixer) => Rule.Fix[])[] = [];
		// appliedErrorsForImport will contain all the errors FOR A SINGLE IMPORT and will be merged into errorListForReport
		const appliedErrorsForImport: ({
			key: string;
		} & Rule.ReportDescriptor)[] = [];
		// Loop over auto errors for a single import source
		for (const [_, error] of errorList.entries()) {
			const { key } = error;
			const node = 'node' in error ? error.node : null;
			// Check if there is a manual error for the same import source somewhere else in the same file
			// If that is the case we'll need to provide a suggestion instead of auto-fixing as the suggestion will
			// add another import without removing the old import and this needs to be validated
			const isInManualArray = allManualErrorSources.has(importSource);

			// Check if the icon has size of small, if so it cannot be automatically migrated. Two suggestions will be provided
			// 1. Use core icon with no spacing
			// 2. Use utility icon with compact spacing
			const isSizeSmall = iconSizesInfo[importSource]?.small.includes(key);
			const isMixedSizeUsage =
				iconSizesInfo[importSource]?.small.length > 0 &&
				iconSizesInfo[importSource]?.small.length < iconSizesInfo[importSource].usageCount;

			// Icon should be renamed
			// 1. If the icon is in the manual array OR
			// 2. If there is mixed size usages of this icon with size small
			const shouldRenameIcon = isInManualArray || isMixedSizeUsage;

			// New icon name for renaming if the icon is in the manual array
			const newIconName = getNewIconNameForRenaming(
				shouldRenameIcon,
				importSource,
				errorList[0].data
					? legacyIconImports[errorList[0].data.iconName]?.importSpecifier
					: undefined,
			);
			if (!node) {
				continue;
			}

			const guidanceMessage = guidance.hasOwnProperty(key) ? guidance[key] : '';
			if (Object.keys(error).includes('data') && error.data) {
				error.data.guidance = guidanceMessage;
			}
			const shouldForceSmallIcon = error.data?.shouldForceSmallIcon === 'true';

			const fixArguments = error.data
				? {
						metadata: {
							...error.data,
							spacing: error.data.isInNewButton ? 'none' : error.data.spacing,
							size: shouldForceSmallIcon ? 'small' : error.data.size,
						} as {
							importSource: string;
							spacing: string;
							size: string;
							insideNewButton: string;
						},
						legacyImportNode: legacyIconImports[error.data.iconName]?.importNode,
						migrationImportNode: migrationIconImports[error.data.iconName]?.importNode,
						shouldUseMigrationPath,
						newIconName: shouldRenameIcon ? newIconName : undefined,
					}
				: null;

			if (!error.data || (shouldUseMigrationPath && !checkIfNewIconExist(error)) || !fixArguments) {
				continue;
			}

			const isInNewButton = fixArguments.metadata.insideNewButton === 'true';

			if (isSizeSmall && !shouldForceSmallIcon) {
				error.suggest = [
					{
						desc: isInNewButton
							? 'Replace with medium core icon (Recommended)'
							: 'Replace with medium core icon and no spacing (Recommended)',
						fix: (fixer) => {
							return [
								...createPropFixes({
									...fixArguments,
									metadata: {
										...fixArguments.metadata,
										spacing: 'none',
									},
									node,
									fixer,
								}),
								...createImportFix({
									...fixArguments,
									fixer,
								}),
							];
						},
					},
					{
						desc: isInNewButton
							? 'Replace with small core icon'
							: 'Replace with small core icon and compact spacing',
						fix: (fixer) => {
							return [
								...createPropFixes({
									...fixArguments,
									metadata: {
										...fixArguments.metadata,
										spacing: 'compact',
										size: 'small',
									},
									node,
									fixer,
								}),
								...createImportFix({
									...fixArguments,
									fixer,
								}),
							];
						},
					},
				];
			} else {
				if (isInManualArray) {
					// provide suggestion if there is a manual error for the same import source and thus the legacy import can't be removed
					error.suggest = [
						{
							desc: 'Rename icon import, import from the new package, and update props.',
							fix: (fixer) => {
								return [
									...createPropFixes({
										...fixArguments,
										node,
										fixer,
									}),
									...createImportFix({
										...fixArguments,
										fixer,
									}),
								];
							},
						},
					];
				} else {
					// Update Guidance message for auto-fixing
					if (error.data) {
						error.data.guidance =
							error.data.guidance +
							`\nTo automatically fix this icon, run the auto-fixer attached to the first use of ${importSource} in this file - either manually, or by saving this file.`;
					}
					// There should only be 1 import fix for each import source and thus only add this at the start of the list
					if (autoFixers.length === 0) {
						autoFixers.push((fixer) =>
							createImportFix({
								...fixArguments,
								fixer,
							}),
						);
					}
					// Push the prop fix regardless
					autoFixers.push((fixer) =>
						createPropFixes({
							...fixArguments,
							node,
							fixer,
						}),
					);
				}
			}
			// Add the error to the appliedErrorsForImport, ready to be thrown later
			appliedErrorsForImport.push(error);
		}
		// We want to have only 1 fix for each import source that is not in the manual array
		// NOTE: If in the manual array, suggestions have been applied above and autoFixers.length will be 0 which will mean no fix is added
		if (autoFixers.length > 0) {
			// Add the fix to only one of the errors in the list of errors from the current import source
			appliedErrorsForImport[0].fix = (fixer: Rule.RuleFixer) => {
				return autoFixers.flatMap((autoFixer) => autoFixer(fixer));
			};
		}
		// throw errors
		appliedErrorsForImport.forEach((error) => {
			context.report(error);
		});
	}
};

function findProgramNode(node: any) {
	while (node && node.parent) {
		if (node.parent.type === 'Program') {
			return node.parent;
		}
		node = node.parent;
	}
	return null;
}

function alreadyHasImportedLocalName(programNode: any, localName: string, importPath: string) {
	if (!programNode?.body) {
		return false;
	}
	return programNode.body.some((stmt: any) => {
		if (stmt.type === 'ImportDeclaration' && stmt.source.value === importPath) {
			return stmt.specifiers.some((s: any) => s.local.name === localName);
		}
		return false;
	});
}
