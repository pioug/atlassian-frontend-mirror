import {
	NATIVE_EMBED_EXTENSION_KEY,
	NATIVE_EMBED_EXTENSION_TYPE,
} from '@atlaskit/editor-common/extensions/manifest-helpers';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export type NativeEmbedCommentSupport = (node: PMNode) => boolean;

export const noNativeEmbedCommentSupport: NativeEmbedCommentSupport = () => false;

/** A snapshot of manifest capability, evaluated against the current node identity. */
export const createNativeEmbedCommentSupport = (
	capabilities: ReadonlyMap<string, boolean>,
): NativeEmbedCommentSupport => {
	// Own the map so neither later registration nor caller mutation changes this snapshot.
	const snapshot = new Map(capabilities);
	return (node) => {
		const { extensionType, extensionKey } = node.attrs;
		return (
			node.type.name === 'extension' &&
			extensionType === NATIVE_EMBED_EXTENSION_TYPE &&
			typeof extensionKey === 'string' &&
			extensionKey.startsWith(`${NATIVE_EMBED_EXTENSION_KEY}:`) &&
			snapshot.get(extensionKey.slice(NATIVE_EMBED_EXTENSION_KEY.length + 1)) === true
		);
	};
};
