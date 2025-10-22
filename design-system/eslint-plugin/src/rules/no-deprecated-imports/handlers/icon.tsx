import type { Rule } from 'eslint';
import {
	type ExportNamedDeclaration,
	type Identifier,
	type ImportDeclaration,
	isNodeOfType,
	type JSXElement,
	literal,
} from 'eslint-codemod-utils';

import coreIconLabMetadata from '@atlaskit/icon-lab/metadata';
import { coreIconMetadata, utilityIconMetadata } from '@atlaskit/icon/metadata';

import { type DeprecatedImportConfigEntry } from '../../utils/types';
import { pathWithCustomMessageId } from '../constants';

export type ImportIconDeprecationError = Rule.ReportDescriptor & { node: ImportDeclaration };
export type ExportIconDeprecationError = Rule.ReportDescriptor & { node: ExportNamedDeclaration };

export type ImportIconDeprecationErrorListAuto = {
	[key: string]: ImportIconDeprecationError;
};

export type ExportIconDeprecationErrorListAuto = {
	[key: string]: ExportIconDeprecationError;
};

type DeprecationIconHandler = (context: Rule.RuleContext) => {
	createImportError: (args: {
		node: ImportDeclaration;
		importSource: string;
		config: DeprecatedImportConfigEntry;
	}) => void;
	createExportError: (args: {
		node: ExportNamedDeclaration;
		importSource: string;
		config: DeprecatedImportConfigEntry;
	}) => void;
	checkJSXElement: (node: JSXElement) => void;
	checkIdentifier: (node: Rule.Node) => void;
	throwErrors: () => void;
};

/**
 * __Deprecation icon handler__
 *
 * A deprecation icon handler which is responsible for displaying an error for deprecated icons.
 * It also includes a fixer to replace the deprecated icon with the new icon if a replacement exists.
 */
export const getDeprecationIconHandler: DeprecationIconHandler = (context: Rule.RuleContext) => {
	const jsxElements: Map<string, JSXElement[]> = new Map();
	const identifiers: Map<string, (Identifier & Rule.NodeParentExtension)[]> = new Map();
	const importErrors: ImportIconDeprecationErrorListAuto = {};
	const exportErrors: ExportIconDeprecationErrorListAuto = {};

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

	const getIconComponentName = (name: string) => {
		return name
			.split(/\W/)
			.map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
			.join('')
			.concat('Icon');
	};

	const createImportError = ({
		node,
		importSource,
		config,
	}: {
		node: ImportDeclaration;
		importSource: string;
		config: DeprecatedImportConfigEntry;
	}) => {
		if (config.message) {
			const myError: ImportIconDeprecationError = {
				node,
				messageId: pathWithCustomMessageId,
				data: {
					importSource,
					customMessage: config.message,
					unfixable: config.unfixable ? 'true' : 'false',
				},
			};
			importErrors[node.source.value as string] = myError;
		}
	};

	const createExportError = ({
		node,
		importSource,
		config,
	}: {
		node: ExportNamedDeclaration;
		importSource: string;
		config: DeprecatedImportConfigEntry;
	}) => {
		if (config.message) {
			const myError: ExportIconDeprecationError = {
				node,
				messageId: pathWithCustomMessageId,
				data: {
					importSource,
					customMessage: config.message,
				},
			};
			exportErrors[importSource] = myError;
		}
	};

	const throwErrors = () => {
		const shouldTurnOffAutoFixer = getConfigFlag('turnOffAutoFixer', false);
		for (const [importSource, error] of Object.entries(importErrors)) {
			if (importSource.includes('/migration/')) {
				const [_location, type, _migration, name] = importSource.split('/').slice(1);
				const metadata = type === 'core' ? coreIconMetadata : utilityIconMetadata;
				const [deprecatedIconName, legacyIconName] = name.split('--');

				const replacement = metadata?.[deprecatedIconName]?.replacement;
				if (replacement && error.data?.unfixable === 'false') {
					const newIconName = getIconComponentName(replacement.name);
					if (!shouldTurnOffAutoFixer) {
						addAutoFix(
							error,
							importSource,
							`${replacement.location}/${replacement.type}/migration/${replacement.name}--${legacyIconName}`,
							newIconName,
						);
					}
				}
			} else {
				const [location, type, name] = importSource.split('/').slice(1);

				let metadata;
				if (location === 'icon') {
					metadata = type === 'core' ? coreIconMetadata : utilityIconMetadata;
				} else if (location === 'icon-lab') {
					metadata = coreIconLabMetadata;
				}

				const replacement = metadata?.[name]?.replacement;
				if (replacement) {
					const newIconName = getIconComponentName(replacement.name);
					if (!shouldTurnOffAutoFixer) {
						addAutoFix(
							error,
							importSource,
							`${replacement.location}/${replacement.type}/${replacement.name}`,
							newIconName,
						);
					}
				}
			}
			context.report(error);
		}

		for (const error of Object.values(exportErrors)) {
			context.report(error);
		}
	};

	const addAutoFix = (
		error: ImportIconDeprecationError,
		importSource: string,
		newImportSource: string,
		newIconName: string,
	) => {
		error.fix = (fixer) => {
			const fixes: Rule.Fix[] = [];

			//Find and update all usages of this icon in JSX with the replacement icon
			const jsxUsageNodes = jsxElements.get(importSource);
			if (jsxUsageNodes) {
				for (const usageNode of jsxUsageNodes) {
					fixes.push(fixer.replaceText(usageNode.openingElement.name, newIconName));
				}
			}

			//Find and update all usages of this icon in identifiers with the replacement icon
			const usageNodes = identifiers.get(importSource);
			if (usageNodes) {
				for (const usageNode of usageNodes) {
					fixes.push(fixer.replaceText(usageNode.parent, `{${newIconName}}`));
				}
			}

			fixes.push(
				fixer.replaceText(
					error.node,
					`${literal(`import ${newIconName} from '${newImportSource}'`)};`,
				),
			);

			return fixes;
		};
	};

	const checkJSXElement = (node: JSXElement) => {
		if (!('openingElement' in node) || !isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
			return;
		}

		for (const [importSource, error] of Object.entries(importErrors)) {
			let importIconName: string = error.node.specifiers[0].local.name;
			const iconName = node.openingElement.name.name;

			if (iconName === importIconName) {
				if (jsxElements.has(importSource)) {
					jsxElements.get(importSource)?.push(node);
				} else {
					jsxElements.set(importSource, [node]);
				}
				break;
			}
		}
	};

	const checkIdentifier = (node: Rule.Node) => {
		if (node.type !== 'Identifier' || node.parent.type !== 'JSXExpressionContainer') {
			return;
		}

		for (const [importSource, error] of Object.entries(importErrors)) {
			let importIconName: string = error.node.specifiers[0].local.name;
			const iconName = node.name;

			if (iconName === importIconName) {
				if (identifiers.has(importSource)) {
					identifiers.get(importSource)?.push(node);
				} else {
					identifiers.set(importSource, [node]);
				}
				break;
			}
		}
	};

	return {
		createImportError,
		createExportError,
		checkJSXElement,
		checkIdentifier,
		throwErrors,
	};
};
