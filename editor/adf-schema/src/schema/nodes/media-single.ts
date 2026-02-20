import type { NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { MediaDefinition as Media } from './media';
import type { LinkDefinition } from '../marks/link';

import type { ExtendedMediaAttributes } from './types/rich-media-common';
import { WidthType } from './types/rich-media-common';
import type { CaptionDefinition as Caption } from './caption';
import { isDOMElement } from '../../utils/parseDOM';
import {
	mediaSingle as mediaSingleFactory,
	mediaSingleCaption as mediaSingleCaptionFactory,
	mediaSingleFull as mediaSingleFullFactory,
	mediaSingleWidthType as mediaSingleWidthTypeFactory,
} from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';

export type MediaSingleDefinition = MediaSingleFullDefinition | MediaSingleWithCaptionDefinition;

/**
 * @name mediaSingle_node
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @additionalProperties true
 */
export interface MediaSingleBaseDefinition {
	attrs?: ExtendedMediaAttributes;
	marks?: Array<LinkDefinition>;
	type: 'mediaSingle';
}

/**
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @additionalProperties true
 */
export interface MediaCaptionContent {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @maxItems 2
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: [Media, Caption?];
}
/**
 * @name mediaSingle_caption_node
 */
export type MediaSingleWithCaptionDefinition = MediaSingleBaseDefinition & MediaCaptionContent;

/**
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @additionalProperties true
 */
export interface MediaSingleFullContent {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @maxItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<Media>;
}

/**
 * @name mediaSingle_full_node
 */
export type MediaSingleFullDefinition = MediaSingleBaseDefinition & MediaSingleFullContent;

export const defaultAttrs: {
	layout: {
		default: string;
	};
	width: {
		default: null;
	};
} = {
	width: { default: null }, // null makes small images to have original size by default
	layout: { default: 'center' },
};

export const mediaSingleSpec = ({
	withCaption = false,
	withExtendedWidthTypes = false,
	generateLocalId = false,
}: {
	generateLocalId?: boolean | undefined;
	withCaption?: boolean | undefined;
	withExtendedWidthTypes?: boolean | undefined;
}): NodeSpec => {
	const getAttrs = (dom: string | Node) => {
		if (!isDOMElement(dom)) {
			// this should never happen
			return { layout: 'center' };
		}

		const layout = dom.getAttribute('data-layout') || 'center';
		const width = Number(dom.getAttribute('data-width')) || null;
		const widthType = dom.getAttribute('data-width-type');

		if (generateLocalId) {
			return { layout, width, widthType, localId: uuid.generate() };
		}

		if (withExtendedWidthTypes) {
			return { layout, width, widthType };
		} else if (widthType === WidthType.PIXEL) {
			// if editor does not support widthType attribute.
			// We ignore width and widthType together.
			return { layout };
		} else {
			return { layout, width };
		}
	};

	const getAttrsFromNode = (node: PMNode) => {
		const { layout, width } = node.attrs;
		const attrs: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			'data-layout': any;
			'data-local-id'?: string;
			'data-node-type': string;
			'data-width': string;
		} = {
			'data-node-type': 'mediaSingle',
			'data-layout': layout,
			'data-width': '',
		};

		if (generateLocalId) {
			attrs['data-local-id'] = node?.attrs?.localId || undefined;
		}

		if (width) {
			attrs['data-width'] =
				isFinite(width) && Math.floor(width) === width ? width : width.toFixed(2);
		}

		if (withExtendedWidthTypes && node.attrs.widthType) {
			const { widthType } = node.attrs;
			return {
				...attrs,
				'data-width-type': widthType || WidthType.PERCENTAGE,
			};
		}

		return attrs;
	};

	if (withExtendedWidthTypes && withCaption) {
		return mediaSingleFullFactory({
			parseDOM: [
				{
					tag: 'div[data-node-type="mediaSingle"]',
					getAttrs,
				},
			],
			toDOM(node) {
				return ['div', getAttrsFromNode(node), 0];
			},
		});
	}
	if (withExtendedWidthTypes && !withCaption) {
		return mediaSingleWidthTypeFactory({
			parseDOM: [
				{
					tag: 'div[data-node-type="mediaSingle"]',
					getAttrs,
				},
			],
			toDOM(node) {
				return ['div', getAttrsFromNode(node), 0];
			},
		});
	}
	if (!withExtendedWidthTypes && withCaption) {
		return mediaSingleCaptionFactory({
			parseDOM: [
				{
					tag: 'div[data-node-type="mediaSingle"]',
					getAttrs,
				},
			],
			toDOM(node) {
				return ['div', getAttrsFromNode(node), 0];
			},
		});
	}

	return mediaSingleFactory({
		parseDOM: [
			{
				tag: 'div[data-node-type="mediaSingle"]',
				getAttrs,
			},
		],
		toDOM(node: PMNode) {
			return ['div', getAttrsFromNode(node), 0];
		},
	});
};

export const mediaSingle: NodeSpec = mediaSingleSpec({
	withCaption: false,
	withExtendedWidthTypes: false,
});

export const mediaSingleWithCaption: NodeSpec = mediaSingleSpec({
	withCaption: true,
	withExtendedWidthTypes: false,
});

export const mediaSingleWithWidthType: NodeSpec = mediaSingleSpec({
	withCaption: false,
	withExtendedWidthTypes: true,
});

export const mediaSingleFull: NodeSpec = mediaSingleSpec({
	withCaption: true,
	withExtendedWidthTypes: true,
});

export const mediaSingleFullWithLocalId: NodeSpec = mediaSingleSpec({
	withCaption: true,
	withExtendedWidthTypes: true,
	generateLocalId: true,
});

export const toJSON = (node: PMNode): {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attrs: any;
} => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: Object.keys(node.attrs).reduce<any>((obj, key) => {
		if (node.attrs[key] !== null) {
			obj[key] = node.attrs[key];
		}
		return obj;
	}, {}),
});
