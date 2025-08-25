import type { NodeSerializerOpts } from '../interfaces';

export const CS_CONTENT_PREFIX = 'csg';
export const createClassName = (name: string) => {
	return `${CS_CONTENT_PREFIX}-${name}`;
};
export const MEDIA_PREVIEW_IMAGE_WIDTH = 162;
export const MEDIA_PREVIEW_IMAGE_HEIGHT = 108;

/**
 * **DEPRECATED**
 *
 * Originally defined in `@atlaskit/theme/typography`, but moved here as it has since been deleted in favor of typography tokens.
 * This should be removed as part of editor token work. More info:
 * https://atlassian.slack.com/archives/C075G5D7ZP1/p1733449725865539?thread_ts=1732159801.409789&cid=C075G5D7ZP1
 * */
export const headingSizes = {
	h900: { size: 35, lineHeight: 40 },
	h800: { size: 29, lineHeight: 32 },
	h700: { size: 24, lineHeight: 28 },
	h600: { size: 20, lineHeight: 24 },
	h500: { size: 16, lineHeight: 20 },
	h400: { size: 14, lineHeight: 16 },
	h300: { size: 12, lineHeight: 16 },
	h200: { size: 12, lineHeight: 16 },
	h100: { size: 11, lineHeight: 16 },
};

const DEFAULT_PARAGRAPH_SIZE = { size: headingSizes.h600.size, shift: 5 };

/**
 * Reference Heights
 *
 * These heights enforce consistent sizes with media inline nodes due to
 * inconsistencies with center aligned inline nodes and text.
 *
 * */

const headerMap = new Map<number | undefined, { shift: number; size: number }>([
	[1, { size: headingSizes.h800.size, shift: 4 }],
	[2, { size: headingSizes.h700.size, shift: 4 }],
	[3, { size: headingSizes.h600.size, shift: 4 }],
	[4, { size: headingSizes.h500.size, shift: 3 }],
	[5, { size: headingSizes.h400.size, shift: 2 }],
	[6, { size: headingSizes.h300.size, shift: 2 }],
]);

export const getInlineImageSizeFromParentNode = (node: NodeSerializerOpts) => {
	if (node.parent?.type.name === 'heading') {
		return headerMap.get(node.parent?.attrs.level) || DEFAULT_PARAGRAPH_SIZE;
	}
	return DEFAULT_PARAGRAPH_SIZE;
};
