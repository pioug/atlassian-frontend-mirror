/* eslint-disable @repo/internal/react/require-jsdoc */

import type { Rule } from 'eslint';
import {
	type ImportDeclaration as ImportDeclarationNode,
	isNodeOfType,
} from 'eslint-codemod-utils';

const messageId = 'use-spotlight-package';
const ONBOARDING_PACKAGE = '@atlaskit/onboarding';
const BANNED_IMPORT_SOURCES = new Set([
	'@atlaskit/onboarding/spotlight',
	'@atlaskit/onboarding/spotlight-card',
	'@atlaskit/onboarding/spotlight-manager',
	'@atlaskit/onboarding/spotlight-target',
	'@atlaskit/onboarding/spotlight-transition',
	'@atlaskit/onboarding/theme',
	'@atlaskit/onboarding/use-spotlight',
]);

const BANNED_IMPORTS = [
	// 'Modal',
	'Spotlight',
	'SpotlightCard',
	'SpotlightManager',
	'SpotlightTarget',
	'SpotlightTransition',
	// 'modalButtonTheme',
	'spotlightButtonTheme',
	'useSpotlight',
	// 'ModalTransition',
	'SpotlightPulse',
];

type Check =
	| {
			success: false;
			ref: undefined;
	  }
	| {
			success: true;
			ref: ImportDeclarationNode;
	  };

export const ImportDeclaration = {
	lint(node: Rule.Node, { context }: { context: Rule.RuleContext }): void {
		// Check whether all criteria needed to make a transformation are met
		const { success, ref } = ImportDeclaration._check(node);

		if (!success) {
			return;
		}

		context.report({
			node: ref,
			messageId,
		});
	},

	_check(node: Rule.Node): Check {
		if (!isNodeOfType(node, 'ImportDeclaration')) {
			return { success: false, ref: undefined };
		}

		if (!node.specifiers) {
			return { success: false, ref: undefined };
		}

		if (BANNED_IMPORT_SOURCES.has(String(node.source.value))) {
			const hasValueImport = node.specifiers.some(
				(specifier) =>
					isNodeOfType(specifier, 'ImportDefaultSpecifier') ||
					isNodeOfType(specifier, 'ImportNamespaceSpecifier') ||
					isNodeOfType(specifier, 'ImportSpecifier'),
			);

			if (!hasValueImport) {
				return { success: false, ref: undefined };
			}

			return { success: true, ref: node };
		}

		if (node.source.value !== ONBOARDING_PACKAGE) {
			return { success: false, ref: undefined };
		}

		const isViolation = node.specifiers.some((specifier) => {
			if (!isNodeOfType(specifier, 'ImportSpecifier')) {
				return false;
			}

			return BANNED_IMPORTS.includes(specifier.imported.name);
		});

		if (!isViolation) {
			return { success: false, ref: undefined };
		}

		return { success: true, ref: node };
	},
};
