import { createProseMirrorMetadata } from '@atlaskit/editor-common/prosemirror-dom-metadata';
import type { DOMOutputSpec, Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * 🧱 Internal Helper Function: Editor FE Platform
 *
 * Adds generic metadata attributes to a DOMOutputSpec array based on the provided node or mark.
 * This function ensures that the DOMOutputSpec is annotated with ProseMirror-specific metadata.
 *
 * @param {object} params - Parameters object.
 * @param {PMNode | PMMark} params.nodeOrMark - The ProseMirror node or mark to extract metadata from.
 * @param {DOMOutputSpec} params.domSpec - The DOMOutputSpec to which attributes will be added.
 * @returns {DOMOutputSpec} The modified DOMOutputSpec with additional metadata.
 */
export const addMetadataAttributes = ({
	nodeOrMark,
	domSpec,
}: {
	domSpec: DOMOutputSpec;
	nodeOrMark: PMNode | PMMark;
}): DOMOutputSpec => {
	if (!Array.isArray(domSpec)) {
		return domSpec;
	}

	const maybeDefinedAttributes = domSpec[1];
	const metadata = createProseMirrorMetadata(nodeOrMark);
	const hasDefinedAttributes =
		typeof maybeDefinedAttributes === 'object' && !Array.isArray(maybeDefinedAttributes);

	if (hasDefinedAttributes) {
		domSpec[1] = Object.assign(maybeDefinedAttributes, metadata);
	} else {
		domSpec.splice(1, 0, metadata);
	}

	return domSpec;
};
