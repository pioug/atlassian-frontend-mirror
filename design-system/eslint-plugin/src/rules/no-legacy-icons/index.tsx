import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const rule = createLintRule({
	meta: {
		name: 'no-legacy-icons',
		type: 'problem',
		docs: {
			description: 'Enforces no legacy icons are used.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			noLegacyIcons: `Legacy icon '{{iconName}}', is being rendered from import '{{importSource}}'. Migrate to an icon from '@atlaskit/icon/(core|utility)', or '@atlaskit/icon-labs/(core|utility)'.
Learn more in our [code migration guide](https://hello.atlassian.net/wiki/spaces/DST/pages/3748692796/New+ADS+iconography+-+Code+migration+guide).`,
		},
	},

	create(context) {
		const legacyIconImports: { [key: string]: string } = {};

		return {
			ImportDeclaration(node) {
				const moduleSource = node.source.value;
				if (
					typeof moduleSource === 'string' &&
					['@atlaskit/icon/glyph/', '@atlaskit/icon-object/glyph/'].find((val) =>
						moduleSource.startsWith(val),
					) &&
					node.specifiers.length
				) {
					const defaultImport = node.specifiers.find(
						(spec) => spec.type === 'ImportDefaultSpecifier',
					);
					if (!defaultImport) {
						return;
					}

					const defaultImportName = defaultImport.local.name;

					legacyIconImports[defaultImportName] = moduleSource;
				}
			},

			VariableDeclaration(node) {
				if (isNodeOfType(node, 'VariableDeclaration')) {
					for (const decl of node.declarations) {
						if (
							isNodeOfType(decl, 'VariableDeclarator') &&
							'init' in decl &&
							'id' in decl &&
							decl.init &&
							decl.id &&
							'name' in decl.id &&
							decl.id.name &&
							isNodeOfType(decl.init, 'Identifier') &&
							decl.init.name in legacyIconImports
						) {
							legacyIconImports[decl.id.name] = legacyIconImports[decl.init.name];
						}
					}
				}
			},
			ExportDefaultDeclaration(node) {
				if (
					'declaration' in node &&
					node.declaration &&
					isNodeOfType(node.declaration, 'Identifier') &&
					node.declaration.name in legacyIconImports
				) {
					context.report({
						node,
						messageId: 'noLegacyIcons',
						data: {
							importSource: legacyIconImports[node.declaration.name],
							iconName: node.declaration.name,
						},
					});
				}
			},
			ExportNamedDeclaration(node) {
				if (
					'source' in node &&
					node.source &&
					isNodeOfType(node.source, 'Literal') &&
					'value' in node.source
				) {
					const moduleSource = node.source.value;
					if (
						typeof moduleSource === 'string' &&
						['@atlaskit/icon/glyph/', '@atlaskit/icon-object/glyph/'].find((val) =>
							moduleSource.startsWith(val),
						) &&
						node.specifiers.length
					) {
						context.report({
							node,
							messageId: 'noLegacyIcons',
							data: {
								importSource: moduleSource,
								iconName: node.specifiers[0].exported.name,
							},
						});
					}
				} else if (
					'declaration' in node &&
					node.declaration &&
					isNodeOfType(node.declaration, 'VariableDeclaration')
				) {
					for (const decl of node.declaration.declarations) {
						if (
							isNodeOfType(decl, 'VariableDeclarator') &&
							'init' in decl &&
							decl.init &&
							isNodeOfType(decl.init, 'Identifier') &&
							decl.init.name in legacyIconImports
						) {
							context.report({
								node,
								messageId: 'noLegacyIcons',
								data: {
									importSource: legacyIconImports[decl.init.name],
									iconName: decl.init.name,
								},
							});
						}
					}
				}
			},
			JSXAttribute(node: any) {
				if (!isNodeOfType(node.value, 'JSXExpressionContainer')) {
					return;
				}
				if (
					isNodeOfType(node.value.expression, 'Identifier') &&
					node.value.expression.name in legacyIconImports &&
					isNodeOfType(node.name, 'JSXIdentifier') &&
					!node.name.name.startsWith('LEGACY_')
				) {
					context.report({
						node,
						messageId: 'noLegacyIcons',
						data: {
							importSource: legacyIconImports[node.value.expression.name],
							iconName: node.value.expression.name,
						},
					});
				}
			},
			JSXElement(node: any) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}
				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const name = node.openingElement.name.name;

				if (name in legacyIconImports) {
					context.report({
						node,
						messageId: 'noLegacyIcons',
						data: {
							importSource: legacyIconImports[name],
							iconName: name,
						},
					});
				}
			},
			CallExpression(node) {
				if ('arguments' in node && node.arguments.length) {
					for (const arg of node.arguments) {
						if (isNodeOfType(arg, 'Identifier') && arg.name in legacyIconImports) {
							context.report({
								node: arg,
								messageId: 'noLegacyIcons',
								data: {
									importSource: legacyIconImports[arg.name],
									iconName: arg.name,
								},
							});
						}
					}
				}
			},
		};
	},
});

export default rule;
