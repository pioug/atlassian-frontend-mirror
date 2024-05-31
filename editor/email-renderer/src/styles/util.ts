import { headingSizes } from '@atlaskit/theme/typography';
import type { NodeSerializerOpts } from '../interfaces';

export const CS_CONTENT_PREFIX = 'csg';
export const createClassName = (name: string) => {
	return `${CS_CONTENT_PREFIX}-${name}`;
};
export const MEDIA_PREVIEW_IMAGE_WIDTH = 162;
export const MEDIA_PREVIEW_IMAGE_HEIGHT = 108;

const DEFAULT_PARAGRAPH_SIZE = { size: headingSizes.h600.size, shift: 5 };

/**
 * Reference Heights
 *
 * These heights enforce consistent sizes with media inline nodes due to
 * inconsistencies with center aligned inline nodes and text.
 *
 * */

const headerMap = new Map<number | undefined, { size: number; shift: number }>([
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
