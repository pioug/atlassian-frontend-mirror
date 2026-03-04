import { traverse } from '../traverse/traverse';
import { type ADFEntity } from '../types';

const NATIVE_EMBED_EXTENSION_KEY = 'native-embed';

/**
 * Replaces any `extension` nodes whose `extensionKey` is
 * `native-embed` with a paragraph containing an `inlineCard`
 * node pointing at the same URL.
 * If a native-embed node has no URL it is dropped from the document.
 */
export const nativeEmbedsFallbackTransform = (
	adf: ADFEntity,
): {
	isTransformed: boolean;
	transformedAdf: false | ADFEntity;
} => {
	let isTransformed = false;
	const transformedAdf = traverse(adf, {
		extension: (node) => {
			if (node.attrs?.['extensionKey'].split(':')[0] !== NATIVE_EMBED_EXTENSION_KEY) {
				return node;
			}

			const url: string | undefined = node.attrs?.['parameters']?.url;

			if (!url) {
				isTransformed = true;
				return false;
			}

			isTransformed = true;
			return {
				type: 'paragraph',
				content: [{ type: 'inlineCard', attrs: { url } }],
			};
		},
	});
	return { transformedAdf, isTransformed };
};
