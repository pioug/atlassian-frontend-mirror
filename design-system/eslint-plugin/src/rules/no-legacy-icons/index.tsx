import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { createChecks } from './checks';
import { createHelpers } from './helpers';

const rule = createLintRule({
	meta: {
		name: 'no-legacy-icons',
		type: 'problem',
		docs: {
			description: 'Enforces no legacy icons are used.',
			recommended: false,
			severity: 'warn',
		},
		schema: [
			{
				type: 'object',
				properties: {
					shouldErrorForManualMigration: {
						type: 'boolean',
					},
					shouldErrorForAutoMigration: {
						type: 'boolean',
					},
					quiet: {
						type: 'boolean',
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			noLegacyIconsAutoMigration: `Auto Migration:\nLegacy icon '{{iconName}}' from '{{importSource}}' detected.\nAutomatic migration is possible to '{{newIcon}}' from '{{newPackage}}.\nAtlassians: See https://go.atlassian.com/icon-migration-guide for details.'`,
			noLegacyIconsManualMigration: `Manual Migration:\nLegacy icon '{{iconName}}' from '{{importSource}}' detected.\nAutomatic migration not possible.{{quietModeGuidance}}.\nAtlassians: See https://go.atlassian.com/icon-migration-guide for details.`,
			cantFindSuitableReplacement: `No suitable replacement found for '{{iconName}}' from '{{importSource}}' at the size listed. Please manually migrate this icon.`,
			cantMigrateReExport: `'{{exportName}}' is a re-export of icon from '{{packageName}}' and cannot be automatically migrated. Please utilize the export from icons directly.`,
			cantMigrateColor: `Primary Color prop has {{colorValue}} which cannot be automatically migrated to color prop in the new Icon API. Please use either an appropriate color.icon, color.link token, or currentColor (as a last resort).`,
			cantMigrateSpreadProps: `This usage of Icon uses spread props in a way that can't be automatically migrated. Please explicitly define the following props after spread: '{{missingProps}}' `,
			cantMigrateSizeUnknown: `This usage of Icon sets the size via a variable or function that can't be determined.`,
			cantMigrateFunctionUnknown: `'{{iconName}}' from legacy '{{importSource}}' is used in unknown function/component. Please manually migrate this icon.`,
			cantMigrateIdentifier: `This icon is passed to other components via a map or array, in a way that can't be automatically migrated. Please manually migrate wherever this expression is used and use the icon components directly.`,
			cantMigrateUnsafeProp: `Property '{{propName}}' with value of '{{value}}' is unable to be auto-migrated to the new button. Please manually migrate this icon.`,
			guidance: `Guidance:\n'{{guidance}}'`,
		},
	},

	create(context) {
		const { getConfigFlag } = createHelpers(context);
		const failSilently = getConfigFlag('failSilently', false);
		const {
			checkImportDeclarations,
			checkVariableDeclarations,
			checkExportDefaultDeclaration,
			checkExportNamedVariables,
			checkArrayOrMap,
			checkIconAsProp,
			checkJSXElement,
			checkCallExpression,
			throwErrors,
		} = createChecks(context);

		return errorBoundary(
			{
				// Track imports of relevant components
				ImportDeclaration: checkImportDeclarations,

				// Keep track of the relevant variable declarations and renames
				VariableDeclaration: checkVariableDeclarations,

				// Case: default re-exports. Can't be auto-migrated
				ExportDefaultDeclaration: checkExportDefaultDeclaration,

				ExportNamedDeclaration: checkExportNamedVariables,

				// Legacy icons found in arrays/objects
				'ObjectExpression > Property > Identifier, ArrayExpression > Identifier ': checkArrayOrMap,

				// Legacy icons passed in via props, as JSX identifier (i.e. icon={AddIcon})
				'JSXOpeningElement > JSXAttribute > JSXExpressionContainer > Identifier': checkIconAsProp,

				JSXElement: checkJSXElement,

				// Icons called as an argument of a function (i.e. icon={DefaultIcon(AddIcon)})
				CallExpression: checkCallExpression,

				'Program:exit': throwErrors,
			},
			failSilently,
		);
	},
});

export default rule;
