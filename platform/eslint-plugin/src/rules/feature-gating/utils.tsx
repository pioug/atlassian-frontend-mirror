import { FEATURE_API_IMPORT_SOURCES } from '../constants';
import type { Rule, Scope } from 'eslint';

export function isIdentifierImportedFrom(
	identifierName: string,
	sources: Set<string>,
	context: Rule.RuleContext,
) {
	if (sources.size > 0) {
		return (
			context
				.getScope()
				.references.find((ref) => ref.identifier.name === identifierName)
				?.resolved?.defs.some(
					(def) =>
						def.parent?.type === 'ImportDeclaration' && sources.has(def.parent.source.value + ''),
				) ?? false
		);
	}

	return false;
}

export function isAPIimport(functionName: string, context: Rule.RuleContext) {
	return isIdentifierImportedFrom(functionName, FEATURE_API_IMPORT_SOURCES, context);
}

// returns the definition node of a variable if it's declared within the scope of the file
export function getDef(name: string, context: Rule.RuleContext) {
	let scope: Scope.Scope | null = context.getScope();

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
