import { media } from '@atlaskit/adf-schema';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { getMediaAttrs } from './toDOMAttrs';

const skeletonStyling = `background: ${token('color.background.neutral')}; outline: none;`;

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

// @nodeSpecException:toDOM patch
export const mediaSpecWithFixedToDOM = () => {
	if (!fg('platform_editor_lazy-node-views')) {
		return media;
	}
	return {
		...media,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const attrs = getMediaAttrs('media', node);
			const styles = skeletonStyling;

			if (node.attrs.type === 'external') {
				return ['img', { ...attrs, src: node.attrs.url, styles }];
			}

			if (node.attrs.type === 'file') {
				const dataUrl =
					'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
				const width = defaultImageCardDimensions.width;
				const height = defaultImageCardDimensions.height;
				return [
					'div',
					{
						width,
						height,
						...attrs,
						// Manually kept in sync with the style of media cards. The goal is to render a plain gray
						// rectangle that provides an affordance for media.
						style: `
						display: inline-block;
						background-image: url("${dataUrl}");
						margin-left: 0;
						margin-right: 4px;
						border-radius: ${skeletonStyling};

						flex-basis: ${defaultImageCardDimensions.width}px;
						background-color: var(--media-card-background-color, unset);
						width: var(--media-card-width, 0);
						height: var(--media-card-height, 0);
						`,
					},
				];
			}

			return ['div', { ...attrs, styles }];
		},
	};
};
