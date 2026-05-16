import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/utils';

type Options = [{ allowPrimitiveExports?: boolean }?];

interface ValueExport {
	name: string;
	loc: {
		start: {
			line: number;
			column: number;
		};
		end: {
			line: number;
			column: number;
		};
	};
}

function getPropertyName(node: TSESTree.Node | null | undefined): string | null {
	if (!node) {
		return null;
	}

	if (node.type === 'Identifier') {
		return node.name;
	}

	if (node.type === 'Literal') {
		return String(node.value);
	}

	return null;
}

function isPrimitiveLiteral(declarator: TSESTree.VariableDeclarator): boolean {
	function isPrimitiveExpression(node: TSESTree.Node | null | undefined): boolean {
		if (!node) {
			return false;
		}

		switch (node.type) {
			case 'Literal':
				return (
					typeof node.value === 'string' ||
					typeof node.value === 'number' ||
					typeof node.value === 'boolean' ||
					node.value === null
				);
			case 'TemplateLiteral':
				return node.expressions.length === 0;
			case 'Identifier':
				return node.name === 'undefined';
			case 'UnaryExpression':
				return ['+', '-', '~', '!'].includes(node.operator) && isPrimitiveExpression(node.argument);
			case 'BinaryExpression':
				return isPrimitiveExpression(node.left) && isPrimitiveExpression(node.right);
			case 'TSAsExpression':
			case 'TSTypeAssertion':
			case 'TSNonNullExpression':
				return isPrimitiveExpression(node.expression);
			default:
				return false;
		}
	}

	return isPrimitiveExpression(declarator.init);
}

function collectBindingExports(node: TSESTree.Node | null | undefined): ValueExport[] {
	if (!node) {
		return [];
	}

	switch (node.type) {
		case 'Identifier':
			return [{ name: node.name, loc: node.loc }];
		case 'ObjectPattern':
			return node.properties.flatMap((property) => {
				if (property.type === 'RestElement') {
					return collectBindingExports(property.argument);
				}

				return collectBindingExports(property.value);
			});
		case 'ArrayPattern':
			return node.elements.flatMap((element) => collectBindingExports(element));
		case 'AssignmentPattern':
			return collectBindingExports(node.left);
		case 'RestElement':
			return collectBindingExports(node.argument);
		default:
			return [];
	}
}

function getDefaultExportName(node: TSESTree.ExportDefaultDeclaration): string {
	const declaration = node.declaration;

	if (
		(declaration.type === 'FunctionDeclaration' || declaration.type === 'ClassDeclaration') &&
		declaration.id
	) {
		return declaration.id.name;
	}

	return 'default';
}

function getDefaultExportLoc(node: TSESTree.ExportDefaultDeclaration): ValueExport['loc'] {
	const declaration = node.declaration;

	if (
		(declaration.type === 'FunctionDeclaration' || declaration.type === 'ClassDeclaration') &&
		declaration.id
	) {
		return declaration.id.loc;
	}

	return node.loc;
}

function collectDeclarationExports(
	declaration: TSESTree.ExportNamedDeclaration['declaration'],
	allowPrimitiveExports: boolean,
): ValueExport[] {
	if (!declaration) {
		return [];
	}

	switch (declaration.type) {
		case 'VariableDeclaration':
			return declaration.declarations.flatMap((declarator) => {
				if (allowPrimitiveExports && isPrimitiveLiteral(declarator)) {
					return [];
				}

				return collectBindingExports(declarator.id);
			});
		case 'FunctionDeclaration':
		case 'ClassDeclaration':
			return declaration.id ? [{ name: declaration.id.name, loc: declaration.id.loc }] : [];
		case 'TSEnumDeclaration':
			return [{ name: declaration.id.name, loc: declaration.id.loc }];
		case 'TSInterfaceDeclaration':
		case 'TSTypeAliasDeclaration':
			return [];
		default:
			return [];
	}
}

function collectNamedSpecifierExports(node: TSESTree.ExportNamedDeclaration): ValueExport[] {
	if (node.exportKind === 'type') {
		return [];
	}

	return node.specifiers.flatMap((specifier) => {
		if (specifier.type !== 'ExportSpecifier' || specifier.exportKind === 'type') {
			return [];
		}

		const exportedName = getPropertyName(specifier.exported);
		return exportedName ? [{ name: exportedName, loc: specifier.exported.loc }] : [];
	});
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow more than one local value export per file.',
			category: 'Best Practices',
			recommended: false,
		},
		schema: [
			{
				type: 'object',
				properties: {
					allowPrimitiveExports: {
						type: 'boolean',
						description:
							'When true, primitive value exports (strings, numbers, booleans, null, undefined, and template literals) are ignored when counting local value exports.',
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			multipleValueExports:
				'This file exports {{count}} local values ({{names}}). Keep one value export per file https://hello.atlassian.net/wiki/spaces/DevInfra/pages/6809881812/One+Export+Per+File',
		},
	},
	create(context) {
		const options = (context.options as Options)[0] ?? {};
		const allowPrimitiveExports = options.allowPrimitiveExports ?? false;
		const valueExports: ValueExport[] = [];

		return {
			ExportDefaultDeclaration(node: Rule.Node) {
				const exportNode = node as TSESTree.ExportDefaultDeclaration;
				valueExports.push({
					name: getDefaultExportName(exportNode),
					loc: getDefaultExportLoc(exportNode),
				});
			},
			ExportNamedDeclaration(node: Rule.Node) {
				const exportNode = node as TSESTree.ExportNamedDeclaration;

				// Re-export-only barrel syntax is intentionally ignored.
				if (exportNode.source) {
					return;
				}

				valueExports.push(
					...collectDeclarationExports(exportNode.declaration, allowPrimitiveExports),
				);
				valueExports.push(...collectNamedSpecifierExports(exportNode));
			},
			'Program:exit'(node) {
				if (valueExports.length <= 1) {
					return;
				}

				const sampleNames = valueExports
					.slice(0, 5)
					.map((valueExport) => valueExport.name)
					.join(', ');
				const names =
					valueExports.length > 5
						? `${sampleNames}, and ${valueExports.length - 5} more`
						: sampleNames;

				valueExports.forEach((valueExport) => {
					context.report({
						node,
						loc: valueExport.loc,
						messageId: 'multipleValueExports',
						data: {
							count: String(valueExports.length),
							names,
						},
					});
				});
			},
		};
	},
};

export default rule;
