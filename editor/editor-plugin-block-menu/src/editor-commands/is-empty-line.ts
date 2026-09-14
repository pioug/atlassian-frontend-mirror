import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/** True when there is one source node and it is an empty or whitespace-only paragraph or heading. */
export const isEmptyLine = (sourceNodes: readonly PMNode[]): boolean => {
	if (sourceNodes.length !== 1) {
		return false;
	}

	const source = sourceNodes[0];
	const { heading, paragraph } = source.type.schema.nodes;

	return (
		(source.type === paragraph || source.type === heading) &&
		(source.content.size === 0 || source.textContent.trim() === '')
	);
};
