import type { Rule, Scope, SourceCode } from 'eslint';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { getImportSources, isCompiled } from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

type WalkNode = { type: string };
type IdentifierNode = Rule.Node & { name: string };

const isTypographyImportSpecifier = (def: Scope.Definition): boolean =>
	def.node.type === 'ImportSpecifier' &&
	def.node.imported.type === 'Identifier' &&
	def.parent?.type === 'ImportDeclaration' &&
	((def.node.imported.name === 'typography' && def.parent?.source.value === '@atlaskit/theme') ||
		def.parent?.source.value === '@atlaskit/theme/typography');

const isElevationImportSpecifier = (def: Scope.Definition): boolean =>
	def.node.type === 'ImportSpecifier' &&
	def.node.imported.type === 'Identifier' &&
	def.parent?.type === 'ImportDeclaration' &&
	((def.node.imported.name === 'elevation' && def.parent?.source.value === '@atlaskit/theme') ||
		def.parent?.source.value === '@atlaskit/theme/elevation');

const isSkeletonShimmerImportSpecifier = (def: Scope.Definition): boolean =>
	def.node.type === 'ImportSpecifier' &&
	def.node.imported.type === 'Identifier' &&
	def.parent?.type === 'ImportDeclaration' &&
	def.node.imported.name === 'skeletonShimmer' &&
	typeof def.parent?.source.value === 'string' &&
	def.parent?.source.value?.startsWith('@atlaskit/theme');

const bannedImportChecks: Array<{
	messageId: 'usingTypography' | 'usingElevation' | 'usingSkeletonShimmer';
	isBanned: (def: Scope.Definition) => boolean;
}> = [
	{ messageId: 'usingTypography', isBanned: isTypographyImportSpecifier },
	{ messageId: 'usingElevation', isBanned: isElevationImportSpecifier },
	{ messageId: 'usingSkeletonShimmer', isBanned: isSkeletonShimmerImportSpecifier },
];

function isAstNode(value: unknown): value is WalkNode {
	return (
		typeof value === 'object' && value !== null && 'type' in value && typeof value.type === 'string'
	);
}

function hasBannedThemeImport(sourceCode: SourceCode): boolean {
	for (const statement of sourceCode.ast.body) {
		if (statement.type !== 'ImportDeclaration' || typeof statement.source.value !== 'string') {
			continue;
		}

		const source = statement.source.value;
		if (!source.startsWith('@atlaskit/theme')) {
			continue;
		}

		for (const specifier of statement.specifiers) {
			if (specifier.type !== 'ImportSpecifier' || specifier.imported.type !== 'Identifier') {
				continue;
			}

			const { name } = specifier.imported;
			if (source === '@atlaskit/theme/typography' || source === '@atlaskit/theme/elevation') {
				return true;
			}

			if (source === '@atlaskit/theme' && (name === 'typography' || name === 'elevation')) {
				return true;
			}

			if (name === 'skeletonShimmer') {
				return true;
			}
		}
	}

	return false;
}

function visitIdentifiers(node: WalkNode, visit: (identifier: IdentifierNode) => void): void {
	if (node.type === 'Identifier' && 'name' in node && typeof node.name === 'string') {
		visit(node as IdentifierNode);
	}

	for (const key of Object.keys(node)) {
		if (key === 'parent') {
			continue;
		}

		const value = (node as Record<string, unknown>)[key];
		if (Array.isArray(value)) {
			for (const child of value) {
				if (isAstNode(child)) {
					visitIdentifiers(child, visit);
				}
			}
		} else if (isAstNode(value)) {
			visitIdentifiers(value, visit);
		}
	}
}

function findReferencedVariable(
	scope: Scope.Scope,
	identifier: IdentifierNode,
): Scope.Variable | undefined {
	let current: Scope.Scope | null = scope;
	while (current) {
		const variable = current.set.get(identifier.name);
		if (variable?.references.some((reference) => reference.identifier === identifier)) {
			return variable;
		}
		current = current.upper;
	}

	return undefined;
}

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'atlaskit-theme',
		docs: {
			description:
				'Ban certain usages of `@atlaskit/theme` that `@compiled/react` does not understand',
			recommended: true,
			severity: 'error',
		},
		messages: {
			usingTypography:
				'Typography does not work with Compiled. Please utilise alternatives like Heading or tokens instead and see https://atlassian.design/components/eslint-plugin-ui-styling-standard/atlaskit-theme/usage',
			usingElevation:
				'Elevation does not work with Compiled. Please use a token with a fallback instead and see https://atlassian.design/components/eslint-plugin-ui-styling-standard/atlaskit-theme/usage',
			usingSkeletonShimmer:
				'Skeleton Shimmer does not work with Compiled. Please use an SVG skeleton instead and see https://atlassian.design/components/eslint-plugin-ui-styling-standard/atlaskit-theme/usage',
		},
		schema: [],
		type: 'problem',
	},
	create(context) {
		const sourceCode = getSourceCode(context);
		if (!hasBannedThemeImport(sourceCode)) {
			return {};
		}

		const importSources = getImportSources(context);
		const reported = new WeakSet<Rule.Node>();

		const reportBannedIdentifier = (identifier: IdentifierNode, scope: Scope.Scope): void => {
			if (identifier.name === 'fontFallback' || reported.has(identifier)) {
				return;
			}

			const variable = findReferencedVariable(scope, identifier);
			if (!variable) {
				return;
			}

			let didReport = false;
			for (const { messageId, isBanned } of bannedImportChecks) {
				if (variable.defs.some(isBanned)) {
					context.report({ messageId, node: identifier });
					didReport = true;
				}
			}

			if (didReport) {
				reported.add(identifier);
			}
		};

		const lintCompiledInvocation = (node: Rule.Node): void => {
			if (node.type !== 'CallExpression' && node.type !== 'TaggedTemplateExpression') {
				return;
			}

			const calleeOrTag = node.type === 'CallExpression' ? node.callee : node.tag;
			const scope = getScope(context, node);
			if (!isCompiled(calleeOrTag, scope.references, importSources)) {
				return;
			}

			const roots = node.type === 'CallExpression' ? node.arguments : node.quasi.expressions;
			for (const root of roots) {
				if (isAstNode(root)) {
					visitIdentifiers(root, (identifier) => reportBannedIdentifier(identifier, scope));
				}
			}
		};

		return {
			CallExpression: lintCompiledInvocation,
			TaggedTemplateExpression: lintCompiledInvocation,
		};
	},
});

export default rule;
