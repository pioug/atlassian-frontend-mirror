import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import {
	NATIVE_EMBED_EXTENSION_KEY,
	NATIVE_EMBED_EXTENSION_TYPE,
} from '../extensions/manifest-helpers';

/**
 * Whether a node is a native embed: the block `extension` that `editor-plugin-native-embeds` renders
 * as an iframe. Bodied, multi-bodied and inline extensions do not qualify.
 *
 * The key can carry leading segments (`…:native-embed:database`), so it is matched with `includes`.
 * `editor-plugin-native-embeds` and `editor-plugin-card` hold equivalent predicates; neither can be
 * imported here, as both depend on this package.
 */
export const isNativeEmbedExtension = (node: PMNode): boolean =>
	node.type.name === 'extension' &&
	node.attrs?.extensionType === NATIVE_EMBED_EXTENSION_TYPE &&
	typeof node.attrs?.extensionKey === 'string' &&
	node.attrs.extensionKey.includes(NATIVE_EMBED_EXTENSION_KEY);
