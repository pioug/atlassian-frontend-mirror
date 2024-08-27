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
} from '@atlaskit/icon/UNSAFE_migration-map';

export type IconMigrationError = Rule.ReportDescriptor;
import { upcomingIcons } from './upcoming-icons';

export type RangeList = {
	start: number;
	end: number;
}[];

export type ErrorListManual = {
	[loc: string]: { errors: IconMigrationError[]; iconName: string; importSource: string };
};
export type ErrorListAuto = { [loc: string]: IconMigrationError };
export type GuidanceList = { [loc: string]: string };

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
export const canAutoMigrateNewIconBasedOnSize = (guidance?: string) => {
	return [
		'swap',
		'swap-slight-visual-change',
		'swap-visual-change',
		'swap-size-shift-utility',
	].includes(guidance || '');
};

/**
 *
 * @param iconPackage string
 * @returns object of new icon name and import path
 */
export const getNewIconNameAndImportPath = (
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
			? `${newIcon.package}/${newIcon.type}/migration/${newIcon.name}`
			: `${newIcon.package}/${newIcon.type}/migration/${newIcon.name}--${legacyIconName.replaceAll('/', '-')}`;
	return {
		iconName: newIcon.name,
		importPath: shouldUseMigrationPath
			? migrationPath
			: `${newIcon.package}/${newIcon.type}/${newIcon.name}`,
	};
};

/**
 * Creates the written guidance for migrating a legacy icon to a new icon
 */
export const createGuidance = ({
	iconPackage,
	insideNewButton,
	size,
	shouldUseMigrationPath,
}: {
	iconPackage: string;
	insideNewButton?: boolean;
	size?: Size;
	shouldUseMigrationPath?: boolean;
}) => {
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
		} else if (size && size === 'medium') {
			guidance +=
				"Setting the spacing property to 'spacious' will maintain the icon's box dimensions - but consider setting spacing='none' as it allows for easier control of spacing by parent elements.\n";
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
	shouldAddSpaciousSpacing,
	insideNewButton,
}: {
	node: Node;
	importSource: string;
	iconName: string;
	errors: ErrorListAuto;
	shouldAddSpaciousSpacing?: boolean;
	insideNewButton?: boolean;
}) => {
	const myError: IconMigrationError = {
		node,
		messageId: 'noLegacyIconsAutoMigration',
		data: {
			importSource,
			iconName,
			spacing: shouldAddSpaciousSpacing ? 'spacious' : '',
			// value type need to be a string in Rule.ReportDescriptor
			insideNewButton: String(insideNewButton),
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

export const getLiteralStringValue = (value: any): string | undefined => {
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

export const createHelpers = (context: Rule.RuleContext) => {
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

export const isInRangeList = (node: Node, sortedListOfRangesForErrors: RangeList): boolean => {
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
	let insideLegacyButton = false;
	if (
		node.parent &&
		isNodeOfType(node.parent, 'JSXExpressionContainer') &&
		node.parent?.parent &&
		isNodeOfType(node.parent.parent, 'JSXAttribute') &&
		(node.parent.parent.name.name === 'iconBefore' ||
			node.parent.parent.name.name === 'iconAfter') &&
		isNodeOfType(node.parent?.parent?.parent, 'JSXOpeningElement') &&
		isNodeOfType(node.parent?.parent?.parent.name, 'JSXIdentifier') &&
		legacyButtonImports.has(node.parent?.parent?.parent.name.name)
	) {
		insideLegacyButton = true;
	}
	return insideLegacyButton;
};

const findProp = (attributes: (JSXAttribute | JSXSpreadAttribute)[], propName: string) =>
	attributes.find(
		(attr: JSXAttribute | JSXSpreadAttribute) =>
			attr.type === 'JSXAttribute' && attr.name.name === propName,
	);

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
export const createImportFix = ({
	fixer,
	legacyImportNode,
	metadata,
	shouldUseMigrationPath,
	migrationImportNode,
}: {
	fixer: Rule.RuleFixer;
	metadata: { importSource: string; spacing: string };
	legacyImportNode?: ImportDeclaration;
	shouldUseMigrationPath: boolean;
	migrationImportNode?: ImportDeclaration;
}) => {
	const fixes: Rule.Fix[] = [];
	const { importSource } = metadata;

	const importPath = migrationImportNode
		? importSource.replace('/migration', '').split('--')[0]
		: getNewIconNameAndImportPath(importSource, shouldUseMigrationPath).importPath;

	// replace old icon import with icon import
	if (legacyImportNode && importPath) {
		fixes.push(fixer.replaceText(legacyImportNode.source, `'${literal(importPath)}'`));
	}

	if (migrationImportNode && !shouldUseMigrationPath && importPath) {
		fixes.push(fixer.replaceText(migrationImportNode.source, `'${literal(importPath)}'`));
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
export const createPropFixes = ({
	node,
	fixer,
	legacyImportNode,
	metadata,
	shouldUseMigrationPath,
	migrationImportNode,
}: {
	node: Node;
	fixer: Rule.RuleFixer;
	metadata: { importSource: string; spacing: string; insideNewButton: string };
	legacyImportNode?: ImportDeclaration;
	shouldUseMigrationPath: boolean;
	migrationImportNode?: ImportDeclaration;
}) => {
	const fixes: Rule.Fix[] = [];

	const { importSource, spacing, insideNewButton } = metadata;

	if (shouldUseMigrationPath && !legacyImportNode) {
		return fixes;
	}

	const importPath = migrationImportNode
		? importSource.replace('/migration', '').split('--')[0]
		: getNewIconNameAndImportPath(importSource, shouldUseMigrationPath).importPath;

	const iconType = importPath?.startsWith('@atlaskit/icon/core') ? 'core' : 'utility';

	if (node.type === 'JSXElement') {
		const { openingElement } = node;
		const { attributes } = openingElement;

		// replace primaryColor prop with color
		const primaryColor = findProp(attributes, 'primaryColor');

		if (primaryColor && primaryColor.type === 'JSXAttribute') {
			fixes.push(fixer.replaceText(primaryColor.name, 'color'));
		}

		// add color="currentColor" if
		// 1. primaryColor prop is not set
		// 2. icon is not imported from migration entrypoint
		// 3. icon element is not inside a new button
		if (
			legacyImportNode &&
			!primaryColor &&
			!migrationImportNode &&
			// value type need to be a string in Rule.ReportDescriptor
			insideNewButton !== 'true'
		) {
			fixes.push(fixer.insertTextAfter(openingElement.name, ` color="currentColor"`));
		}

		// rename or remove size prop based on shouldUseMigrationPath,
		// add spacing="spacious" if
		// 1. it's in error metadata, which means size is medium
		// 2. no existing spacing prop
		// 3. iconType is "core"
		// 4. icon is not imported from migration entrypoint
		const sizeProp = findProp(attributes, 'size');
		const spacingProp = findProp(attributes, 'spacing');

		if (spacing && !spacingProp && iconType === 'core' && !migrationImportNode) {
			fixes.push(fixer.insertTextAfter(sizeProp || openingElement.name, ` spacing="${spacing}"`));
		}

		if (sizeProp && sizeProp.type === 'JSXAttribute') {
			fixes.push(
				shouldUseMigrationPath
					? // replace size prop with LEGACY_size,
						fixer.replaceText(sizeProp.name, 'LEGACY_size')
					: // remove size prop if shouldUseMigrationPath is false
						fixer.remove(sizeProp),
			);
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
	}

	return fixes;
};

/**
 * Check if the new icon exists in the migration map
 */
export const checkIfNewIconExist = (error: { data?: { importSource?: string } }) => {
	if (!error.data?.importSource) {
		return false;
	}
	const iconKey = getIconKey(error.data.importSource);
	const { newIcon } = baseMigrationMap[iconKey] || {};

	return Boolean(newIcon);
};
