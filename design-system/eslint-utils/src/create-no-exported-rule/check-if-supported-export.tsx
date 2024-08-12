import type { Rule, Scope as ScopeNamespace } from 'eslint';

import { type ImportSource } from '../is-supported-import';

import { isStyledComponent } from './is-styled-component';

type Node = Rule.Node;
type RuleContext = Rule.RuleContext;
type Scope = ScopeNamespace.Scope;

type Stack = {
	nodes: Node[];
	root: Node;
	scope: Scope;
};

const getStack = (context: RuleContext, node: Node) => {
	const { scopeManager } = context.getSourceCode();
	const stack: Omit<Stack, 'scope'> = {
		nodes: [],
		root: node,
	};

	let scope: Scope | undefined;

	for (let current = node; current.type !== 'Program'; current = current.parent) {
		if (!scope) {
			const currentScope = scopeManager.acquire(current);
			if (currentScope) {
				scope = currentScope;
			}
		}

		switch (current.type) {
			case 'ExportDefaultDeclaration':
			case 'ExportNamedDeclaration':
				stack.root = current;
				break;

			case 'VariableDeclarator':
				stack.root = current;
				break;

			case 'ExportSpecifier':
			case 'ObjectExpression':
			case 'VariableDeclaration':
				break;

			default:
				stack.nodes.unshift(current);
		}
	}

	return {
		...stack,
		scope: scope ?? context.getScope(),
	};
};

const matches = (defs: Node[], refs: Node[]) => {
	// When there are no defs, the definition is inlined. This must be a match as we know the refs contain the initial
	// definition.
	if (!defs.length) {
		return true;
	}

	// When there are no refs, the reference refers to the entire definition and therefore must be a match.
	if (!refs.length) {
		return true;
	}

	// When both the references and definitions exist, they should match in length
	if (defs.length !== refs.length) {
		return false;
	}

	return defs.every((def, i) => {
		const ref = refs[i];

		if (def.type === 'Property') {
			// There is a match between the def and the ref when both names match:
			//
			// const fooDef = { bar: '' };
			// const barRef = fooDef.bar
			//
			// There is no match when the ref property does not match the definition key name:
			//
			// const barRef = fooDef.notFound
			return (
				def.key.type === 'Identifier' &&
				ref.type === 'MemberExpression' &&
				ref.property.type === 'Identifier' &&
				ref.property.name === def.key.name
			);
		}

		// Anything here is either unsupported or should not match...
		return false;
	});
};

type Yes = {
	isExport: true;
	node: Node;
};

type No = {
	isExport: false;
};

type IsSupportedExport = Yes | No;

export const checkIfSupportedExport = (
	context: RuleContext,
	node: Node,
	importSources: ImportSource[],
	scope: Scope = context.getScope(),
): IsSupportedExport => {
	// Ignore any expression defined outside of the global or module scope as we have no way of statically analysing them
	if (scope.type !== 'global' && scope.type !== 'module') {
		return {
			isExport: false,
		};
	}

	const { root, nodes } = getStack(context, node.parent);
	// Exporting a component with a css reference should be allowed
	if (isStyledComponent(nodes, context, importSources)) {
		return {
			isExport: false,
		};
	}

	if (root.type === 'ExportDefaultDeclaration' || root.type === 'ExportNamedDeclaration') {
		return {
			isExport: true,
			node: root,
		};
	}

	if (root.type !== 'VariableDeclarator') {
		return {
			isExport: false,
		};
	}

	// Find the reference to the variable declarator
	const reference = scope.references.find(({ identifier }) => identifier === root.id);
	if (!reference) {
		return { isExport: false };
	}

	// Iterate through all of the references to collect all identifiers and find the variable declarator node
	const identifiers = reference?.resolved?.references?.map(({ identifier }) => identifier) ?? [];

	// If we have multiple variable declarations, eg. `const styles = css(…); const styles = css(…);` from bade code or overlapping rules, just exit…
	const uniqueVariableDeclarations = identifiers.filter((identifier) => {
		const i = identifier as Rule.Node;
		// Basically in `const styles = …;`, `parent.id` points to itself, while `styles2` in `const styles1 = styles2` will point to `styles1`…
		// Surely there's a better way to detect this, but this scenario is a bit nonsensical.
		return i.parent.type === 'VariableDeclarator' && i === i.parent.id;
	});

	if (uniqueVariableDeclarations.length > 1) {
		// It could be…it might not be.  I think we have to give up, this code isn't valid.
		return { isExport: false };
	}

	for (const identifier of identifiers) {
		// Skip references to the root, since it has already been processed above
		if (identifier === root.id) {
			continue;
		}

		const { nodes: refs, scope: nextScope } = getStack(context, (identifier as Rule.Node).parent);

		// Only validate the resolved reference if it accesses the definition node
		// We avoid bad code where AST blows up due to `nodes=[]` === `refs=[]`
		if (matches(nodes, refs.reverse())) {
			// Now validate the identifier reference as a definition
			const validity = checkIfSupportedExport(
				context,
				identifier as Rule.Node,
				importSources,
				nextScope,
			);

			if (validity.isExport) {
				return validity;
			}
		}
	}

	return {
		isExport: false,
	};
};
