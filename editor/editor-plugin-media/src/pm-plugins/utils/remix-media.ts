import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

// `remix` or `remix:<type>:<subtype>`, as written by Rovo Remix when it inserts an image.
const REMIX_SOURCE_PATTERN = /^remix(?::|$)/u;

/**
 * Whether a media node was inserted by Rovo Remix, based on the `dataConsumer` mark sources.
 */
export const isRemixGeneratedMedia = (node: PMNode): boolean => {
	const sources: unknown = node.marks.find((mark) => mark.type.name === 'dataConsumer')?.attrs
		.sources;
	return (
		Array.isArray(sources) &&
		sources.some((source) => typeof source === 'string' && REMIX_SOURCE_PATTERN.test(source))
	);
};
