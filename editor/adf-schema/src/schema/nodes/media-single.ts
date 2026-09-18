/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */

import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import type { LinkDefinition } from '../marks/link';
import type { CaptionDefinition as Caption } from './caption';
import type { MediaDefinition as Media } from './media';
import { mediaSingleSpec } from './media-single-spec';
import type { ExtendedMediaAttributes } from './types/rich-media-common';

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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { mediaSingleSpec } from './media-single-spec';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { toJSON } from './to-json';
