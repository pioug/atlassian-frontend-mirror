import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute, type Node } from 'eslint-codemod-utils';

import baseMigrationMap, {
	type IconMigrationSizeGuidance,
	migrationOutcomeDescriptionMap,
} from '@atlaskit/icon/UNSAFE_migration-map';

import { getImportName } from '../utils/get-import-name';

import { upcomingIcons } from './upcoming-icons';

export type iconMigrationError = Rule.ReportDescriptor;

export type errorsListManual = {
	[loc: string]: { errors: iconMigrationError[]; iconName: string; importSource: string };
};
export type errorsListAuto = { [loc: string]: iconMigrationError };
export type guidanceList = { [loc: string]: string };

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
 * Creates the written guidance for migrating a legacy icon to a new icon
 */
export const createGuidance = (
	iconPackage: string,
	insideNewButton: boolean = false,
	size?: Size,
) => {
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
		const buttonGuidanceStr =
			"Please set 'spacing' property of the new icon to 'none', to ensure appropriate spacing inside `@atlaskit/button`.\n";
		let guidance = '';
		if (size) {
			if (
				migrationMapObject.sizeGuidance[size] &&
				canAutoMigrateNewIconBasedOnSize(migrationMapObject.sizeGuidance[size])
			) {
				guidance += `Fix: Use ${newIcon.name} from ${newIcon.package}/${newIcon.type}/${newIcon.name} instead.`;
			} else {
				guidance += `No equivalent icon for this size, ${size}, in new set.`;
			}
			guidance += `${migrationMapObject.sizeGuidance[size] in migrationOutcomeDescriptionMap ? ` Please: ${migrationOutcomeDescriptionMap[migrationMapObject.sizeGuidance[size]]}` : ' No migration size advice given.'}\n`;
		} else {
			guidance = `Use ${newIcon.name} from ${newIcon.package}/${newIcon.type}/${newIcon.name} instead.\nMigration suggestions, depending on the legacy icon size:\n`;
			Object.entries(migrationMapObject.sizeGuidance).forEach(
				([size, value]: [string, unknown]) => {
					guidance += `\t- ${size}: `;
					if (!((value as IconMigrationSizeGuidance) in migrationOutcomeDescriptionMap)) {
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
	if (color.match(/^color\.text$/)) {
		return true;
	} else if (color.match(/^color\.icon/)) {
		return true;
	} else if (color.match(/^color\.link/)) {
		return true;
	} else if (color === 'currentColor') {
		return true;
	} else {
		return false;
	}
};

export const locToString = (node: Node) => {
	return `${node.loc?.start.line}:${node.loc?.start.column}:${node.loc?.end.line}:${node.loc?.end.column}`;
};

export const createCantMigrateReExportError = (
	node: Node,
	packageName: string,
	exportName: string,
	errors: errorsListManual,
) => {
	const myError: iconMigrationError = {
		node,
		messageId: 'cantMigrateReExport',
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
	errors: errorsListManual,
) => {
	const myError: iconMigrationError = {
		node,
		messageId: 'cantMigrateIdentifier',
		data: {
			packageName,
			exportName,
		},
	};
	pushManualError(locToString(node), errors, myError, packageName, exportName);
};

export const createCantFindSuitableReplacementError = (
	node: Node,
	importSource: string,
	iconName: string,
	errors: errorsListManual,
	sizeIssue?: boolean,
) => {
	const myError: iconMigrationError = {
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
	errors: errorsListManual,
) => {
	const myError: iconMigrationError = {
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
	errors: errorsListManual,
	importSource: string,
	iconName: string,
) => {
	const myError: iconMigrationError = {
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
	errors: errorsListManual,
	importSource: string,
	iconName: string,
) => {
	const myError: iconMigrationError = {
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
	errors: errorsListManual,
	importSource: string,
	iconName: string,
) => {
	const myError: iconMigrationError = { node, messageId: 'cantMigrateSizeUnknown' };
	pushManualError(locToString(node), errors, myError, importSource, iconName);
};

export const createAutoMigrationError = (
	node: Node,
	importSource: string,
	iconName: string,
	errors: errorsListAuto,
) => {
	const myError: iconMigrationError = {
		node,
		messageId: 'noLegacyIconsAutoMigration',
		data: {
			importSource,
			iconName,
		},
	};
	errors[locToString(node)] = myError;
};

const pushManualError = (
	key: string,
	errors: errorsListManual,
	myError: iconMigrationError,
	importSource: string,
	iconName: string,
) => {
	if (key in errors) {
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
		const tokenName = getImportName(
			context.sourceCode.getScope(value),
			'@atlaskit/tokens',
			'token',
		);

		if (
			tokenName &&
			isNodeOfType(value, 'JSXExpressionContainer') &&
			isNodeOfType(value.expression, 'CallExpression') &&
			'name' in value.expression.callee &&
			value.expression.callee.name === tokenName
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
		if (context.options.length > 0 && context.options[0] && key in context.options[0]) {
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
