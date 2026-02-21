import type {
	AttributeSpec,
	DOMOutputSpec,
	NodeSpec,
	Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { N30 } from '../../utils/colors';
import type { BorderMarkDefinition } from '../marks/border';
import type { LinkDefinition } from '../marks/link';
import type { AnnotationMarkDefinition } from '../marks/annotation';
import type { MediaInlineNode, MediaNode } from '../../next-schema/generated/nodeTypes';
import {
	media as mediaFactory,
	mediaInline as mediaInlineFactory,
} from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';

export type MediaType = 'file' | 'link' | 'external';
export type DisplayType = 'file' | 'thumbnail';

export type DefaultAttributes<T> = {
	[P in keyof T]: {
		default?: T[P] | null;
	};
};

/**
 * @name media_node
 */
export interface MediaDefinition {
	/**
	 * Minimum item: 1
	 */
	attrs: MediaADFAttrs;
	marks?: Array<LinkDefinition | BorderMarkDefinition | AnnotationMarkDefinition>;

	type: 'media';
}

export interface MediaBaseAttributes {
	// For copy & paste
	__contextId?: string | null;
	// For JIRA
	__displayType?: DisplayType | null;
	// is set to true when new external media is inserted, false for external media in existing documents
	__external?: boolean;
	__fileMimeType?: string | null;
	// For both CQ and JIRA
	__fileName?: string | null;
	// For CQ
	__fileSize?: number | null;
	// For tracing media operations
	__mediaTraceId?: string | null;
	alt?: string;
	collection: string;
	height?: number;
	/**
	 * Minimum length: 1
	 */
	id: string;
	localId?: string;

	/**
	 * Occurrence key (minimum length: 1)
	 */
	occurrenceKey?: string;
	width?: number;
}

export interface MediaAttributes extends MediaBaseAttributes {
	type: 'file' | 'link';
}

export interface ExternalMediaAttributes {
	__external?: boolean;
	alt?: string;
	height?: number;
	localId?: string;
	type: 'external';
	url: string;
	width?: number;
}

export type MediaADFAttrs = MediaAttributes | ExternalMediaAttributes;

export const defaultAttrs:
	| {
			[name: string]: AttributeSpec;
	  }
	| undefined = mediaFactory({}).attrs;

export interface MutableMediaAttributes extends MediaAttributes {
	[key: string]: string | number | undefined | null | boolean;
}

export const camelCaseToKebabCase = (str: string): string =>
	// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
	str.replace(/([^A-Z]+)([A-Z])/gu, (_, x, y) => `${x}-${y.toLowerCase()}`);

export const copyPrivateAttributes = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	from: Record<string, any>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	to: Record<string, any>,
	attributes?: Partial<NodeSpec['attrs']>,
	map?: ((str: string) => string) | undefined,
): void => {
	const attrs: Partial<NodeSpec['attrs']> = attributes || {};
	Object.keys(attrs).forEach((key) => {
		if (key[0] === '_' && key[1] === '_' && from[key]) {
			to[map ? map(key) : key] = from[key];
		}
	});
};

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
						// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
						const key = camelCaseToKebabCase(k).replace(/^__/u, '');
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						const value = (dom as HTMLElement).getAttribute(`data-${key}`) || '';

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

export const media: NodeSpec = createMediaSpec(defaultAttrs, false, false);

export const mediaWithLocalId: NodeSpec = createMediaSpec(
	{ ...defaultAttrs, localId: { default: uuid.generate() } },
	false,
	true,
);

/**
 * There's no concept of optional property in ProseMirror. It sets value as `null`
 * when there's no use of any property. We are filtering out all private & optional attrs here.
 */
const optionalAttributes = ['occurrenceKey', 'width', 'height', 'url', 'alt', 'localId'];
const externalOnlyAttributes = ['type', 'url', 'width', 'height', 'alt', 'localId'];

export const toJSON = (
	node: PMNode,
): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: Record<string, any>;
} => ({
	attrs: Object.keys(node.attrs)
		// Strip private attributes e.g. __fileName, __fileSize, __fileMimeType, etc.
		.filter((key) => !(key[0] === '_' && key[1] === '_'))
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.reduce<Record<string, any>>((obj, key) => {
			if (node.attrs.type === 'external' && externalOnlyAttributes.indexOf(key) === -1) {
				return obj;
			}
			if (
				optionalAttributes.indexOf(key) > -1 &&
				(node.attrs[key] === null || node.attrs[key] === '')
			) {
				return obj;
			}
			if (['width', 'height'].indexOf(key) !== -1) {
				obj[key] = Number(node.attrs[key]);
				return obj;
			}
			obj[key] = node.attrs[key];
			return obj;
		}, {}),
});
