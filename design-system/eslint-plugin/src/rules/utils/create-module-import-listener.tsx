import type { Rule } from 'eslint';
import type * as ESTree from 'estree';

type TModuleImport = {
	/**
	 * The whole import, export or call. A report on it starts on its first line, so an
	 * `eslint-disable-next-line` comment goes directly above the statement.
	 */
	node: ESTree.Node;
	/**
	 * The module specifier as written, such as `'react-popper'` or `'@floating-ui/dom'`.
	 */
	specifier: string;
};

function getStaticString(node: ESTree.Node | null | undefined): string | null {
	if (!node) {
		return null;
	}
	if (node.type === 'Literal' && typeof node.value === 'string') {
		return node.value;
	}
	if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
		return node.quasis[0].value.cooked ?? null;
	}
	return null;
}

/**
 * Calls `onModuleImport` for each module that a file loads with a static specifier:
 *
 * - `import … from 'module'` and `import 'module'`
 * - `export … from 'module'`
 * - `import('module')`
 * - `require('module')`
 */
export function createModuleImportListener({
	onModuleImport,
}: {
	onModuleImport: (moduleImport: TModuleImport) => void;
}): Rule.RuleListener {
	function check({ node, source }: { node: ESTree.Node; source: ESTree.Node | null | undefined }) {
		const specifier = getStaticString(source);
		if (specifier !== null) {
			onModuleImport({ node, specifier });
		}
	}

	return {
		ImportDeclaration(node) {
			check({ node, source: node.source });
		},
		ExportNamedDeclaration(node) {
			check({ node, source: node.source });
		},
		ExportAllDeclaration(node) {
			check({ node, source: node.source });
		},
		ImportExpression(node) {
			check({ node, source: node.source });
		},
		CallExpression(node) {
			if (node.callee.type !== 'Identifier' || node.callee.name !== 'require') {
				return;
			}
			check({ node, source: node.arguments[0] });
		},
	};
}
