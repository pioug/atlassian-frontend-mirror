import { FEATURE_API_IMPORT_SOURCES } from '../constants';
import type { Rule, Scope } from 'eslint';
import type { Node as EstreeNode } from 'estree';
import { getScope } from '../util/context-compat';

export function isIdentifierImportedFrom(
	identifierName: string,
	sources: Set<string>,
	context: Rule.RuleContext,
	node: EstreeNode,
) {
	if (sources.size > 0) {
		return (
			getScope(context, node)
				.references.find((ref) => ref.identifier.name === identifierName)
				?.resolved?.defs.some(
					(def) =>
						def.parent?.type === 'ImportDeclaration' && sources.has(def.parent.source.value + ''),
				) ?? false
		);
	}

	return false;
}

export function isAPIimport(functionName: string, context: Rule.RuleContext, node: EstreeNode) {
	return isIdentifierImportedFrom(functionName, FEATURE_API_IMPORT_SOURCES, context, node);
}

// returns the definition node of a variable if it's declared within the scope of the file
export function getDef(name: string, context: Rule.RuleContext, node: EstreeNode) {
	let scope: Scope.Scope | null = getScope(context, node);

	while (scope && scope.type !== 'global') {
		for (const variable of scope.variables) {
			if (variable.name === name) {
				const definition = variable.defs.find(
					(def) => def.node && def.node.type === 'VariableDeclarator',
				);
				return definition;
			}
		}
		scope = scope.upper;
	}
	return null;
}

export type Node<T extends Rule.Node['type']> = Extract<Rule.Node, { type: T }>;
