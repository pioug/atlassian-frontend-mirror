import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { createChecks } from './checks';
import { createHelpers } from './helpers';

const rule = createLintRule({
	meta: {
		name: 'no-legacy-icons',
		fixable: 'code',
		hasSuggestions: true,
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
					shouldUseSafeMigrationMode: {
						type: 'boolean',
					},
					quiet: {
						type: 'boolean',
					},
					shouldUseMigrationPath: {
						type: 'boolean',
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			noLegacyIconsAutoMigration: `Auto Migration:\nLegacy icon '{{iconName}}' from '{{importSource}}' detected.\nAutomatic migration is possible.\n\n{{guidance}}\nAtlassians: See https://go.atlassian.com/icon-migration-guide for details.'`,
			noLegacyIconsManualMigration: `Manual Migration:\nLegacy icon '{{iconName}}' from '{{importSource}}' detected.\nAutomatic migration not possible.\n\n{{guidance}}\nAtlassians: See https://go.atlassian.com/icon-migration-guide for details.`,
			cantFindSuitableReplacement: `No suitable replacement found for '{{iconName}}' from '{{importSource}}'{{sizeGuidance}}. Please manually migrate this icon.`,
			cantMigrateReExport: `'{{exportName}}' is a re-export of icon from '{{packageName}}' and cannot be automatically migrated. Please remove this re-export, and migrate any usages to the new icon APIs.`,
			cantMigrateColor: `This icon's \`primaryColor\` prop is set to {{colorValue}}, which isn't a design token supported in the new Icon API. Please switch to an appropriate \`color.icon\`, \`color.link\` or \`color.text\` token, or currentColor in buttons and menus.`,
			cantMigrateSpreadProps: `This usage of Icon uses spread props in a way that can't be automatically migrated. Please explicitly define the following props after spread in order to auto-migrate: '{{missingProps}}' `,
			cantMigrateSizeUnknown: `This usage of Icon sets the size via a variable or function that can't be automatically migrated. Please migrate manually to the correct \`LEGACY_size\` and \`spacing\` props.`,
			cantMigrateFunctionUnknown: `Icon '{{iconName}}', from entrypoint '{{importSource}}', is passed into a function/component and can't be migrated automatically. Please manually migrate this icon.`,
			cantMigrateIdentifierMapOrArray: `This icon is passed to other components via a map or array, and can't be migrated automatically. Please manually migrate wherever this expression is used to the new API, or use the icon components directly.`,
			cantMigrateIdentifier: `This reference to {{iconName}} from {{iconSource}} can't be migrated automatically to the new components and API. Please manually migrate this and any other references.`,
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
			checkIconReference,
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

				Identifier: checkIconReference,

				'Program:exit': throwErrors,
			},
			failSilently,
		);
	},
});

export default rule;
