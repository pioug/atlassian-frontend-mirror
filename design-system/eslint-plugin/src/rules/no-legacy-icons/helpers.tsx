import type { Rule } from 'eslint';
import {
	isNodeOfType,
	type JSXAttribute,
	type JSXOpeningElement,
	type Node,
} from 'eslint-codemod-utils';

import { getImportName } from '../utils/get-import-name';

import migrationMap, { outcomeDescriptionMap, type Size } from './migration-map-temp';

export type iconMigrationError = Rule.ReportDescriptor;

export type errorsListManual = {
	[loc: string]: { errors: iconMigrationError[]; iconName: string; importSource: string };
};
export type errorsListAuto = { [loc: string]: iconMigrationError };
export type guidanceList = { [loc: string]: string };

/**
 * Returns the migration map object for a legacy icon or null if not found
 * @param iconPackage The name of the legacy icon package
 * @returns The migration map object for the legacy icon or null if not found
 */
export const getMigrationMapObject = (iconPackage: string) => {
	const key = getIconKey(iconPackage);
	if (key in migrationMap) {
		return migrationMap[key];
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
	if (migrationMapObject) {
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
				guidance += `Fix: Use ${newIcon.name} from @atlaskit/${newIcon.library}/${newIcon.type}/${newIcon.name} instead.`;
			} else {
				guidance += `No equivalent icon for this size, ${size}, in new set.`;
			}
			guidance += `${migrationMapObject.sizeGuidance[size] in outcomeDescriptionMap ? ` Please: ${outcomeDescriptionMap[migrationMapObject.sizeGuidance[size]]}` : ' No migration size advice given.'}\n`;
		} else {
			guidance = `Use ${newIcon.name} from @atlaskit/${newIcon.library}/${newIcon.type}/${newIcon.name} instead.\nMigration suggestions, depending on the legacy icon size:\n`;
			for (const [size, value] of Object.entries(migrationMapObject.sizeGuidance)) {
				guidance += `\t- ${size}: `;
				if (!(value in outcomeDescriptionMap)) {
					guidance += 'No migration advice given.\n';
				} else {
					guidance += `${outcomeDescriptionMap[value]}.\n`;
				}
			}
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
export const findUNSAFEProp = (iconAttr: JSXAttribute, button: JSXOpeningElement) => {
	let UNSAFE_size: 'small' | 'large' | 'xlarge' | null = null;
	const propName: 'iconAfter' | 'iconBefore' | 'icon' | null =
		iconAttr.name.name === 'iconAfter' ||
		iconAttr.name.name === 'iconBefore' ||
		iconAttr.name.name === 'icon'
			? iconAttr.name.name
			: null;
	const buttonAttributes = button.attributes;
	const UNSAFE_propName: 'UNSAFE_iconAfter_size' | 'UNSAFE_iconBefore_size' | 'UNSAFE_size' | null =
		propName === 'icon' ? `UNSAFE_size` : propName ? `UNSAFE_${propName}_size` : null;
	const UNSAFE_size_index = buttonAttributes.findIndex(
		(x) => UNSAFE_propName && 'name' in x && x.name && x.name.name === UNSAFE_propName,
	);
	let unsafeAttribute = UNSAFE_size_index !== -1 ? buttonAttributes[UNSAFE_size_index] : null;
	if (
		unsafeAttribute &&
		isNodeOfType(unsafeAttribute, 'JSXAttribute') &&
		unsafeAttribute.value &&
		isNodeOfType(unsafeAttribute.value, 'Literal') &&
		unsafeAttribute.value.value &&
		['small', 'large', 'xlarge'].includes(unsafeAttribute.value.value as string)
	) {
		UNSAFE_size = unsafeAttribute.value.value as 'small' | 'large' | 'xlarge';
	} else if (
		unsafeAttribute &&
		isNodeOfType(unsafeAttribute, 'JSXAttribute') &&
		unsafeAttribute.value &&
		isNodeOfType(unsafeAttribute.value, 'JSXExpressionContainer') &&
		isNodeOfType(unsafeAttribute.value.expression, 'Literal') &&
		['small', 'large', 'xlarge'].includes(unsafeAttribute.value.expression.value as string)
	) {
		UNSAFE_size = unsafeAttribute.value.expression.value as 'small' | 'large' | 'xlarge';
	}
	return { UNSAFE_size, UNSAFE_propName };
};

export const createCantMigrateUnsafeProp = (
	node: Node,
	propName: string,
	value: string,
	packageName: string,
	iconName: string,
	errors: errorsListManual,
) => {
	const myError: iconMigrationError = {
		node,
		messageId: 'cantMigrateUnsafeProp',
		data: {
			propName,
			value,
		},
	};
	pushManualError(locToString(node), errors, myError, packageName, iconName);
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
