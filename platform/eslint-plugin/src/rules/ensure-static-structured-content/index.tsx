import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';

const DYNAMIC_NODE_SELECTOR = [
	'FunctionDeclaration',
	'FunctionExpression',
	'ArrowFunctionExpression',
	'ClassDeclaration',
	'ClassExpression',
	'NewExpression',
	'AwaitExpression',
	'YieldExpression',
	'ConditionalExpression',
	'LogicalExpression',
	'AssignmentExpression',
	'UpdateExpression',
	'SequenceExpression',
	'ImportExpression',
	'ForStatement',
	'ForInStatement',
	'ForOfStatement',
	'WhileStatement',
	'DoWhileStatement',
	'IfStatement',
	'SwitchStatement',
	'TryStatement',
	'ThrowStatement',
	'WithStatement',
].join(', ');

const isPackageJson = (value: unknown): boolean =>
	typeof value === 'string' && (value === './package.json' || value.endsWith('/package.json'));

const isAllowedImport = (node: TSESTree.ImportDeclaration): boolean => {
	const source = node.source.value;
	const isTypeOnlyImport =
		node.importKind === 'type' ||
		(node.specifiers.length > 0 &&
			node.specifiers.every(
				(specifier) => specifier.type === 'ImportSpecifier' && specifier.importKind === 'type',
			));
	return isTypeOnlyImport || isPackageJson(source);
};

const isAllowedPackageJsonRequire = (node: TSESTree.CallExpression): boolean =>
	node.callee.type === 'Identifier' &&
	node.callee.name === 'require' &&
	node.arguments.length === 1 &&
	node.arguments[0]?.type === 'Literal' &&
	isPackageJson(node.arguments[0].value);

const isPathResolveCall = (node: TSESTree.CallExpression): boolean => {
	if (node.callee.type !== 'MemberExpression' || node.callee.object.type !== 'Identifier') {
		return false;
	}

	const property = node.callee.property;
	const propertyName =
		!node.callee.computed && property.type === 'Identifier'
			? property.name
			: node.callee.computed && property.type === 'Literal'
				? property.value
				: null;

	return node.callee.object.name === 'path' && propertyName === 'resolve';
};

const isAllowedLiteralArrayJoin = (node: TSESTree.CallExpression): boolean =>
	node.callee.type === 'MemberExpression' &&
	node.callee.object.type === 'ArrayExpression' &&
	!node.callee.computed &&
	node.callee.property.type === 'Identifier' &&
	node.callee.property.name === 'join';

const reportMessage = (context: Rule.RuleContext, node: TSESTree.Node): void => {
	context.report({
		node: node as Rule.Node,
		messageId: 'dynamicStructuredContent',
		data: { nodeType: node.type },
	});
};

const reportNodeBuiltin = (context: Rule.RuleContext, node: TSESTree.Node): void => {
	context.report({
		node: node as Rule.Node,
		messageId: 'nodeBuiltin',
	});
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require structured content files to contain only statically declared data',
			recommended: false,
		},
		hasSuggestions: false,
		schema: [],
		messages: {
			dynamicStructuredContent:
				'Structured content files may only contain static declarations. Remove this dynamic {{nodeType}} or use an allowlisted package.json import or array literal join.',
			nodeBuiltin:
				'Browser-loaded structured content must not import Node-only builtins. Use __dirname and static paths instead.',
		},
	},
	create(context) {
		const filename = context.getPhysicalFilename?.() || context.getFilename();
		if (!filename.endsWith('.docs.tsx')) {
			return {};
		}
		const listeners: Rule.RuleListener = {
			ImportDeclaration(node) {
				const importDeclaration = node as unknown as TSESTree.ImportDeclaration;
				if (!isAllowedImport(importDeclaration)) {
					if (
						importDeclaration.source.value === 'path' ||
						importDeclaration.source.value === 'node:path'
					) {
						reportNodeBuiltin(context, importDeclaration);
						return;
					}
					reportMessage(context, importDeclaration);
				}
			},
			VariableDeclaration(node) {
				const variableDeclaration = node as unknown as TSESTree.VariableDeclaration;
				if (variableDeclaration.kind !== 'const') {
					reportMessage(context, variableDeclaration);
				}
			},
			CallExpression(node) {
				const call = node as unknown as TSESTree.CallExpression;
				if (!isAllowedPackageJsonRequire(call) && !isAllowedLiteralArrayJoin(call)) {
					if (isPathResolveCall(call)) {
						reportNodeBuiltin(context, call);
						return;
					}
					reportMessage(context, call);
				}
			},
			ExportNamedDeclaration(node) {
				const exportDeclaration = node as unknown as TSESTree.ExportNamedDeclaration;
				if (exportDeclaration.source) {
					reportMessage(context, exportDeclaration);
				}
			},
			ExportAllDeclaration(node) {
				reportMessage(context, node as unknown as TSESTree.ExportAllDeclaration);
			},
			[DYNAMIC_NODE_SELECTOR](node: unknown) {
				reportMessage(context, node as TSESTree.Node);
			},
		};

		return listeners;
	},
};

export default rule;
