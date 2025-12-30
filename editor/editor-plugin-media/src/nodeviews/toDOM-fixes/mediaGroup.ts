import { mediaGroup } from '@atlaskit/adf-schema';
import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';

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
	return {
		...mediaGroup,
		toDOM: (): DOMOutputSpec => {
			// Margin margin that consolidates the margin in the
			return [
				'div',
				{
					style: `
						margin: 3px 5px;
						display: flex;
						gap: 8px;
						--ak-editor-media-card-background-color: #EBECF0;
						--ak-editor-media-card-width: ${defaultImageCardDimensions.width}px;
						--ak-editor-media-card-height: ${defaultImageCardDimensions.height}px;
					`,
					'data-node-type': 'mediaGroup',
				},
				0,
			];
		},
	};
};
