import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { traverse } from '../traverse/traverse';
import type { ADFEntity, EntityParent } from '../types';
import { validator } from '../validator/validator';

const NATIVE_EMBED_EXTENSION_KEY = 'native-embed';

/**
 * Returns the set of parent node names whose content expression in the
 * supplied schema allows an `embedCard` child. Returns an empty set if the
 * schema does not declare an `embedCard` node.
 */
const getEmbedCardAllowedParentTypes = (schema: Schema): Set<string> => {
	const embedCardType = schema.nodes.embedCard;
	if (!embedCardType) {
		return new Set();
	}

	const allowed = new Set<string>();
	for (const nodeType of Object.values(schema.nodes)) {
		if (nodeType.contentMatch?.matchType(embedCardType)) {
			allowed.add(nodeType.name);
		}
	}
	return allowed;
};

/**
 * Replaces `extension` nodes whose `extensionKey` starts with `native-embed`
 * with an `embedCard` when the parent context allows it (per the supplied
 * schema), otherwise a `paragraph` containing an `inlineCard`. Native-embed
 * nodes with no URL are dropped. If the transformed ADF fails schema
 * validation the original ADF is returned.
 */
export const nativeEmbedsFallbackTransform = (
	adf: ADFEntity,
	schema: Schema,
): {
	hasValidTransform: boolean;
	transformedAdf: false | ADFEntity;
} => {
	const embedCardAllowedParentTypes = getEmbedCardAllowedParentTypes(schema);

	const isEmbedCardAllowedInParent = (parent: EntityParent): boolean => {
		const parentType = parent?.node?.type;
		return parentType ? embedCardAllowedParentTypes.has(parentType) : false;
	};

	let didTransform = false;
	const transformedAdf = traverse(adf, {
		extension: (node, parent) => {
			if (node.attrs?.['extensionKey'].split(':')[0] !== NATIVE_EMBED_EXTENSION_KEY) {
				return node;
			}

			const url: string | undefined = node.attrs?.['parameters']?.macroParams?.url?.value;

			if (!url) {
				didTransform = true;
				return false;
			}

			didTransform = true;

			if (isEmbedCardAllowedInParent(parent)) {
				return {
					type: 'embedCard',
					attrs: { url, layout: 'center' },
				};
			}

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
