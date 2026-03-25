import { traverse } from '../traverse/traverse';
import type { ADFEntity } from '../types';
import { validator } from '../validator/validator';

const NATIVE_EMBED_EXTENSION_KEY = 'native-embed';

/**
 * Replaces any `extension` nodes whose `extensionKey` is
 * `native-embed` with a paragraph containing an `inlineCard`
 * node pointing at the same URL.
 * If a native-embed node has no URL it is dropped from the document.
 *
 * The transformed ADF is validated against the ADF spec.
 * If validation fails the original (untransformed) ADF is returned
 * to avoid rendering broken content.
 */
export const nativeEmbedsFallbackTransform = (
	adf: ADFEntity,
): {
	hasValidTransform: boolean;
	transformedAdf: false | ADFEntity;
} => {
	let didTransform = false;
	const transformedAdf = traverse(adf, {
		extension: (node) => {
			if (node.attrs?.['extensionKey'].split(':')[0] !== NATIVE_EMBED_EXTENSION_KEY) {
				return node;
			}

			const url: string | undefined = node.attrs?.['parameters']?.macroParams?.url?.value;

			if (!url) {
				didTransform = true;
				return false;
			}

			didTransform = true;

			return {
				type: 'paragraph',
				content: [{ type: 'inlineCard', attrs: { url } }],
			};
		},
	});

	if (didTransform && transformedAdf) {
		try {
			const validate = validator();
			const { valid } = validate(transformedAdf);
			if (!valid) {
				// Transformed ADF is invalid – fall back to the original document
				return { transformedAdf: adf, hasValidTransform: false };
			}
		} catch {
			// Validation threw – fall back to the original document
			return { transformedAdf: adf, hasValidTransform: false };
		}
	}

	return { transformedAdf, hasValidTransform: didTransform };
};
