import type { Mark as PMMark } from '@atlaskit/editor-prosemirror/model';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

const isPMNode = (nodeOrMark: PMNode | PMMark): nodeOrMark is PMNode => {
	return nodeOrMark instanceof PMNode || Array.isArray((nodeOrMark as unknown as PMNode).marks);
};

/**
 * 🧱 Internal Helper Function: Editor FE Platform
 *
 * Creates a set of generic metadata attributes for a ProseMirror node or mark.
 * These attributes are used to annotate the DOM representation with information
 * about the node or mark type.
 *
 * @param {PMNode | PMMark} nodeOrMark - The ProseMirror node or mark to create metadata for.
 * @returns {Record<string, string>} An object containing metadata attributes.
 *  - `data-prosemirror-content-type`: Specifies if the content is a node or mark.
 *  - `data-prosemirror-node-name` (if applicable): The name of the node.
 *  - `data-prosemirror-node-block` (if applicable): Indicates if the node is a block.
 *  - `data-prosemirror-node-inline` (if applicable): Indicates if the node is inline.
 *  - `data-prosemirror-mark-name` (if applicable): The name of the mark.
 */
export const createProseMirrorMetadata = (nodeOrMark: PMNode | PMMark) => {
	const name = nodeOrMark.type.name;
	const isNode = isPMNode(nodeOrMark);
	const commonAttributes: Record<string, string> = {
		'data-prosemirror-content-type': isNode ? 'node' : 'mark',
	};

	if (!isNode) {
		return {
			...commonAttributes,
			['data-prosemirror-mark-name']: name,
		};
	}

	commonAttributes['data-prosemirror-node-name'] = name;

	if (nodeOrMark.type.isBlock) {
		commonAttributes['data-prosemirror-node-block'] = 'true';
	}

	if (nodeOrMark.type.isInline) {
		commonAttributes['data-prosemirror-node-inline'] = 'true';
	}

	return commonAttributes;
};
