import type { Rule } from 'eslint';
import {
	type ExportNamedDeclaration,
	type ExportSpecifier,
	type ImportDeclaration,
	type ImportDefaultSpecifier,
	type ImportNamespaceSpecifier,
	type ImportSpecifier,
	isNodeOfType,
} from 'eslint-codemod-utils';

import { getConfig } from '../utils/get-deprecated-config';
import { isDeprecatedImportConfig } from '../utils/types';

import { importNameWithCustomMessageId, pathWithCustomMessageId } from './constants';
import { getDeprecationIconHandler } from './handlers/icon';

type ReturnObject = {
	checkImportNode: (node: ImportDeclaration & Rule.NodeParentExtension) => void;
	checkExportNode: (node: ExportNamedDeclaration & Rule.NodeParentExtension) => void;
	checkJSXElement: (node: Rule.Node) => void;
	checkIdentifier: (node: Rule.Node) => void;
	throwErrors: () => void;
};

type ConfigImportSpecifier = {
	importName: string;
	message: string;
};

type checkRestrictedPathAndReportArgs =
	| {
			importSource: string;
			type: 'import';
			node: ImportDeclaration & Rule.NodeParentExtension;
			importNames: Map<string, ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>;
	  }
	| {
			importSource: string;
			type: 'export';
			node: ExportNamedDeclaration & Rule.NodeParentExtension;
			importNames: Map<string, ExportSpecifier>;
	  };

export const createChecks = (context: Rule.RuleContext): ReturnObject => {
	const deprecatedIconHandler = getDeprecationIconHandler(context);

	const throwErrors = () => {
		deprecatedIconHandler.throwErrors();
	};

	const getHandler = (importSource: string) => {
		if (importSource.startsWith('@atlaskit/icon')) {
			return deprecatedIconHandler;
		}
	};

	/**
	 * Report a restricted path.
	 * @param {string} importSource path of the import
	 * @param {string} type whether the node is an import or export
	 * @param {node} node representing the restricted path reference
	 * @param {Map<string,TSESTree.Node>} importNames Map of import names that are being imported
	 * @returns {void}
	 * @private
	 */
	function checkRestrictedPathAndReport({
		importSource,
		type,
		node,
		importNames,
	}: checkRestrictedPathAndReportArgs): void {
		const restrictedPathMessages = context.options[0]?.deprecatedConfig || getConfig('imports');

		if (!isDeprecatedImportConfig(restrictedPathMessages)) {
			throw new Error('Config is invalid for deprecated imports');
		}

		if (!Object.prototype.hasOwnProperty.call(restrictedPathMessages, importSource)) {
			return;
		}

		const config = restrictedPathMessages[importSource];

		const handler = getHandler(importSource);

		if (handler) {
			if (type === 'import') {
				handler.createImportError({
					node,
					importSource,
					config,
				});
			} else {
				handler.createExportError({
					node,
					importSource,
					config,
				});
			}
		} else {
			// Default behaviour
			// The message will only exist if the import is completely banned,
			// eg a deprecated package
			if ('message' in config) {
				context.report({
					node,
					messageId: pathWithCustomMessageId,
					data: {
						importSource,
						customMessage: config.message,
					} as any,
				});
			}

			// if there are specific named exports that are banned,
			// iterate through and check if they're being imported
			if ('importSpecifiers' in config) {
				config.importSpecifiers?.forEach((restrictedImport: ConfigImportSpecifier) => {
					if (importNames.has(restrictedImport.importName)) {
						context.report({
							node: importNames.get(restrictedImport.importName)!,
							messageId: importNameWithCustomMessageId,
							data: {
								importName: restrictedImport.importName,
								importSource: importSource,
								customMessage: restrictedImport.message,
							},
						});
					}
				});
			}
		}
	}

	/**
	 * Checks a node to see if any problems should be reported.
	 * @param {ASTNode} node The node to check.
	 * @returns {void}
	 * @private
	 */
	const checkImportNode = (node: ImportDeclaration & Rule.NodeParentExtension): void => {
		const importSource = (node as any).source.value.trim();
		const importNames = new Map<
			string,
			ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
		>();

		if ('specifiers' in node) {
			for (const specifier of node.specifiers) {
				let name;

				if (specifier.type === 'ImportDefaultSpecifier') {
					name = 'default';
				} else if (specifier.type === 'ImportNamespaceSpecifier') {
					name = '*';
				} else if (specifier.type === 'ImportSpecifier') {
					name = specifier.imported.name;
				}

				if (name) {
					importNames.set(name, specifier);
				}
			}
		}

		checkRestrictedPathAndReport({ importSource, type: 'import', node, importNames });
	};

	/**
	 * Checks a node to see if any problems should be reported.
	 * @param {ASTNode} node The node to check.
	 * @returns {void}
	 * @private
	 */
	const checkExportNode = (node: ExportNamedDeclaration & Rule.NodeParentExtension): void => {
		if (!node.source || !node.source.value) {
			return;
		}

		const importSource = (node.source.value as string).trim();
		const importNames = new Map<string, ExportSpecifier>();

		if ('specifiers' in node) {
			for (const specifier of node.specifiers) {
				let name;

				if (specifier.local) {
					name = specifier.local.name;
				}

				if (name) {
					importNames.set(name, specifier);
				}
			}
		}

		checkRestrictedPathAndReport({ importSource, type: 'export', node, importNames });
	};

	/**
	 * Create a mapping of JSX elements by their name so they can be processed later.
	 * @param node The JSX node found by ESLint
	 */
	const checkJSXElement = (node: Rule.Node): void => {
		if (!('openingElement' in node) || !isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
			return;
		}

		deprecatedIconHandler.checkJSXElement(node);
	};

	const checkIdentifier = (node: Rule.Node): void => {
		deprecatedIconHandler.checkIdentifier(node);
	};

	return {
		checkImportNode,
		checkExportNode,
		checkJSXElement,
		checkIdentifier,
		throwErrors,
	};
};
