import { ESLintUtils } from '@typescript-eslint/utils';

const rule = ESLintUtils.RuleCreator.withoutDocs<
	[],
	'onlyExportPlugin' | 'noDefaultExports' | 'exportPluginType'
>({
	defaultOptions: [],
	meta: {
		type: 'problem',
		docs: {
			description: 'Public API export rules from editor plugins.',
			recommended: 'error',
		},
		messages: {
			onlyExportPlugin:
				'Only export the plugin from the editor package (example: "mediaPlugin"). See https://product-fabric.atlassian.net/wiki/spaces/ETEMP/pages/3585379697/Editor+Lint+Rules#No-Restricted-Exports-in-Editor-Plugin-%5BELR6XXX%5D',
			exportPluginType: 'Export the plugin type from the plugin (example: "MediaPlugin").',
			noDefaultExports:
				'Export the plugin from the editor package as a named export (default are not allowed).',
		},
		schema: [
			{
				type: 'object',
				properties: {
					types: {
						type: 'array',
					},
				},
				additionalProperties: false,
			},
		],
	},
	create: function (context) {
		let pluginExportCount = 0;
		let additionalExport = 0;
		let pluginTypeExportCount = 0;

		return {
			ExportNamedDeclaration(node) {
				const isTypeExport = node.exportKind === 'type';
				if (!isTypeExport) {
					node.specifiers.forEach((specifier) => {
						// Ignored via go/ees005
						// eslint-disable-next-line require-unicode-regexp
						if (/Plugin$/.test(specifier.exported.name)) {
							pluginExportCount++;
						} else {
							additionalExport++;
						}
					});
				} else {
					node.specifiers.forEach((specifier) => {
						// Ignored via go/ees005
						// eslint-disable-next-line require-unicode-regexp
						if (/Plugin$/.test(specifier.exported.name)) {
							pluginTypeExportCount++;
						}
					});
				}

				if (pluginExportCount > 1) {
					context.report({
						node,
						messageId: 'onlyExportPlugin',
					});
				}
				if (additionalExport > 0) {
					context.report({
						node,
						messageId: 'onlyExportPlugin',
					});
				}
			},
			ExportDefaultDeclaration(node) {
				context.report({
					node,
					messageId: 'noDefaultExports',
				});
			},
			'Program:exit'() {
				if (pluginExportCount !== 1) {
					context.report({
						loc: { line: 1, column: 0 }, // Report at the top of the file
						messageId: 'onlyExportPlugin',
					});
				}
				if (pluginTypeExportCount !== 1) {
					context.report({
						loc: { line: 1, column: 0 }, // Report at the top of the file
						messageId: 'exportPluginType',
					});
				}
			},
		};
	},
});

// Ignored via go/ees005
// eslint-disable-next-line import/no-commonjs
module.exports = rule;
