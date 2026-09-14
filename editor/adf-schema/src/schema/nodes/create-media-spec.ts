import type { DOMOutputSpec, NodeSpec } from '@atlaskit/editor-prosemirror/model';

import type { MediaInlineNode, MediaNode } from '../../next-schema/generated/nodeTypes';
import {
	media as mediaFactory,
	mediaInline as mediaInlineFactory,
} from '../../next-schema/generated/nodeTypes';
import { N30 } from '../../utils/colors';
import { uuid } from '../../utils/uuid';
import { camelCaseToKebabCase } from './camel-case-to-kebab-case';
import { copyPrivateAttributes } from './copy-private-attributes';
import type { ExternalMediaAttributes, MediaAttributes, MutableMediaAttributes } from './media';

const PRIVATE_ATTR_PREFIX_REGEX = /^__/u;

export const createMediaSpec = (
	attributes: Partial<NodeSpec['attrs']>,
	inline: boolean = false,
	generateLocalId: boolean = false,
): NodeSpec => {
	const domNodeType = inline ? 'span' : 'div';
	const nodeName = inline ? 'mediaInline' : 'media';
	const parseDOM: NodeSpec['parseDOM'] = [
		{
			tag: `${domNodeType}[data-node-type="${nodeName}"]`,
			getAttrs: (dom) => {
				const attrs = {} as MutableMediaAttributes;

				if (attributes) {
					Object.keys(attributes).forEach((k) => {
						// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace -- Ignored via go/ees017 (to be fixed)
						const key = camelCaseToKebabCase(k).replace(PRIVATE_ATTR_PREFIX_REGEX, '');
						const value =
							// eslint-disable-next-line @atlaskit/editor/no-as-casting
							(dom as HTMLElement).getAttribute(`data-${key}`) || '';

						if (value) {
							attrs[k] = value;
						}
					});
				}

				// Need to do validation & type conversion manually
				if (attrs.__fileSize) {
					attrs.__fileSize = +attrs.__fileSize;
				}

				const width = Number(attrs.width);
				if (typeof width !== 'undefined' && !isNaN(width)) {
					attrs.width = width;
				}

				const height = Number(attrs.height);
				if (typeof height !== 'undefined' && !isNaN(height)) {
					attrs.height = height;
				}

				if (generateLocalId) {
					attrs.localId = uuid.generate();
				}

				return attrs as MediaAttributes;
			},
		},
		// Don't match data URI
		{
			tag: 'img[src^="data:image"]',
			ignore: true,
		},
	];

	const toDOM = (node: MediaInlineNode | MediaNode): DOMOutputSpec => {
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
			'data-local-id': node.attrs.localId || undefined,
			// toDOM is used for static rendering as well as editor rendering. This comes into play for
			// emails, copy/paste, etc, so the title and styling here *is* useful (despite a React-based
			// node view being used for editing).
			title: 'Attachment',
			// Manually kept in sync with the style of media cards. The goal is to render a plain gray
			// rectangle that provides an affordance for media.
			style: `display: inline-block; border-radius: 3px; background: ${N30}; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);`,
		};

		copyPrivateAttributes(
			node.attrs,
			attrs,
			attributes,
			(key) => `data-${camelCaseToKebabCase(key.slice(2))}`,
		);

		return [`${domNodeType}`, attrs];
	};

	if (inline) {
		return mediaInlineFactory({
			parseDOM,
			toDOM,
		});
	}
	return mediaFactory({
		parseDOM: [
			...parseDOM,
			{
				// media-inline.ts uses this same function to generate the nodespec
				// this ensures that we don't make a media inline out of a copied image
				// https://product-fabric.atlassian.net/browse/EDM-2996
				tag: 'img:not(.smart-link-icon)',
				getAttrs: (dom) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const attrs: any = {
						type: 'external',
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						url: (dom as HTMLElement).getAttribute('src') || '',
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						alt: (dom as HTMLElement).getAttribute('alt') || '',
					};

					if (generateLocalId) {
						attrs.localId = uuid.generate();
					}

					return attrs as ExternalMediaAttributes;
				},
			},
		],
		toDOM,
	});
};
