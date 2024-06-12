import type { Identifier, Node } from 'estree-jsx';

/**
 * Searches for the left-most identifier node.
 */
export function findIdentifierNode(node: Node): Identifier | null {
	if (node.type === 'Identifier') {
		return node;
	}

	if (node.type === 'MemberExpression') {
		if (node.object.type === 'Identifier') {
			return node.object;
		}

		if (node.object.type === 'MemberExpression') {
			return findIdentifierNode(node.object);
		}
	}

	if (node.type === 'CallExpression') {
		if (node.callee.type === 'Identifier') {
			return node.callee;
		}

		if (node.callee.type === 'MemberExpression') {
			return findIdentifierNode(node.callee);
		}
	}

	if (node.type === 'TaggedTemplateExpression' && node.tag.type === 'Identifier') {
		return node.tag;
	}

	return null;
}
