import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

export const isEmptyBodiedMacro = (node: PmNode) => {
	if (node.type.name !== 'bodiedExtension') {
		return false;
	}

	const firstChildNode = node?.content?.firstChild;
	const firstGrandChildNode = firstChildNode?.firstChild;

	// If firstChildNode?.childCount > 1 means there is content along with the placeholder.
	const isEmptyWithPlacholder =
		firstGrandChildNode?.type?.name === 'placeholder' && firstChildNode?.childCount === 1;
	const isEmptyWithNoContent = !firstGrandChildNode && node.childCount === 1;

	return isEmptyWithPlacholder || isEmptyWithNoContent;
};
