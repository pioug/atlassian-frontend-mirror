import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Checks if the passed in node is a media node
 * Includes media, mediaInline, mediaGroup, mediaSingle
 * @param node The PM node to be checked
 */
export const isMediaNode = (node: PMNode): boolean => {
	return ['media', 'mediaInline', 'mediaGroup', 'mediaSingle'].includes(node.type.name);
};
