import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { N30 } from '@atlaskit/theme/colors';

/**
 * Copied from `packages/adf-schema/src/schema/nodes/media.ts`
 *
 * When we patch adf-schema with media `toDOM` fixes we can remove this.
 */
export const getMediaAttrs = (nodeName: string, node: PMNode) => {
	const copyPrivateAttributes: (
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		from: Record<string, any>,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		to: Record<string, any>,
		map?: ((str: string) => string) | undefined,
	) => void = (
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		from: Record<string, any>,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		to: Record<string, any>,
		map?: (str: string) => string,
	) => {
		if (node.attrs) {
			Object.keys(node.attrs).forEach((key) => {
				if (key[0] === '_' && key[1] === '_' && from[key]) {
					to[map ? map(key) : key] = from[key];
				}
			});
		}
	};

	const attrs = {
		'data-id': node.attrs.id,
		'data-node-type': `${nodeName}`,
		'data-type': node.attrs.type,
		'data-collection': node.attrs.collection,
		'data-occurrence-key': node.attrs.occurrenceKey,
		'data-width': node.attrs.width,
		'data-height': node.attrs.height,
		'data-url': node.attrs.url,
		'data-alt': node.attrs.alt,
		// toDOM is used for static rendering as well as editor rendering. This comes into play for
		// emails, copy/paste, etc, so the title and styling here *is* useful (despite a React-based
		// node view being used for editing).
		title: 'Attachment',
		// Manually kept in sync with the style of media cards. The goal is to render a plain gray
		// rectangle that provides an affordance for media.
		style: `display: inline-block; border-radius: 3px; background: ${N30}; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);`,
	};

	copyPrivateAttributes(node.attrs, attrs, (key) => `data-${camelCaseToKebabCase(key.slice(2))}`);
	return attrs;
};

export const camelCaseToKebabCase = (str: string) =>
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	str.replace(/([^A-Z]+)([A-Z])/g, (_, x, y) => `${x}-${y.toLowerCase()}`);

/**
 * Copied from `packages/adf-schema/src/schema/nodes/media-single.ts`
 *
 * When we patch adf-schema with media `toDOM` fixes we can remove this.
 */
export const getAttrsFromNodeMediaSingle = (withExtendedWidthTypes: boolean, node: PMNode) => {
	const { layout, width } = node.attrs;
	const attrs: Record<string, string> = {
		'data-node-type': 'mediaSingle',
		'data-layout': layout,
	};

	if (width) {
		attrs['data-width'] = isFinite(width) && Math.floor(width) === width ? width : width.toFixed(2);
	}

	const { widthType } = node.attrs;
	return {
		...attrs,
		'data-width-type': widthType || 'percentage',
	};
};
