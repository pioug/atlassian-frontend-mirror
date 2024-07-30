import { mediaGroup } from '@atlaskit/adf-schema';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const skeletonStyling = `background: ${token('color.background.neutral')};`;

/**
 * Duplicate consts from `media-card`.
 * `packages/media/media-card/src/utils/cardDimensions.ts`
 *
 * WHY?
 * This will eventually move to `@atlaskit/adf-schema` and we cannot reference
 * `media-card` from here or it will cause dependency issues.
 *
 * In the long term likely `toDOM` will move back out of `adf-schema` in which
 * case we can consolidate them.
 */
export const defaultImageCardDimensions = {
	width: 156,
	height: 125,
};

export const defaultHorizontalCardDimensions = {
	width: 435,
	height: 125,
};

export const defaultSquareCardDimensions = {
	width: 300,
	height: 300,
};

/**
 * Duplicate logic from `@atlaskit/media-card` for computing the dimensions of a media group card.
 * From: `packages/media/media-card/src/utils/cardDimensions.ts`
 *
 * WHY?
 * This will eventually move to `@atlaskit/adf-schema` and we cannot reference
 * `@atlaskit/media-card` from here or it will cause dependency issues.
 *
 * In the long term likely `toDOM` will move back out of `adf-schema` in which
 * case we can consolidate them.
 */
export const getDefaultCardDimensions = (
	appearance: 'image' | 'square' | 'horizontal' | 'auto' = 'auto',
): Required<typeof defaultImageCardDimensions> => {
	if (appearance === 'image') {
		return defaultImageCardDimensions;
	}

	if (appearance === 'square') {
		return defaultSquareCardDimensions;
	}

	if (appearance === 'horizontal') {
		return defaultHorizontalCardDimensions;
	}

	return defaultImageCardDimensions;
};

// @nodeSpecException:toDOM patch
export const mediaGroupSpecWithFixedToDOM = () => {
	if (!fg('platform_editor_lazy-node-views')) {
		return mediaGroup;
	}
	return {
		...mediaGroup,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const childNodes: (string | object)[] = [];
			for (let i = 0; i < node.childCount; i++) {
				const { width, height } = getDefaultCardDimensions();
				const nodeHolder = [
					'img',
					{
						width,
						height,
						// Transparent image workaround to control styling
						src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
						style: `margin-left: ${i !== 0 ? `4px` : '0'}; margin-right: 4px; border-radius: ${token('border.radius', '3px')}; ${skeletonStyling}`,
					},
				];
				childNodes.push(nodeHolder);
			}

			// Margin margin that consolidates the margin in the
			return [
				'div',
				{
					style: 'margin: "3px 5px";',
					// From adf-schema
					'data-node-type': 'mediaGroup',
				},
				...childNodes,
			];
		},
	};
};
