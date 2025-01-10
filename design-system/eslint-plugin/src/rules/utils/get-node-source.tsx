import type { SourceCode } from 'eslint';
import type { Node } from 'estree';

// Get raw source code string for a given node
export function getNodeSource(fileContents: SourceCode, node: Node): string {
	if (node.loc?.source) {
		return node.loc?.source;
	}

	if (node.range) {
		return fileContents.text.slice(node.range[0], node.range[1]);
	}

	return '';
}
