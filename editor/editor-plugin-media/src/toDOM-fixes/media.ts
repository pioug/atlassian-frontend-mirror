import { media } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { getMediaAttrs } from './toDOMAttrs';

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
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return media;
	}
	return {
		...media,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const attrs = getMediaAttrs('media', node);

			if (node.attrs.type === 'external') {
				return [
					'img',
					{
						...attrs,
						src: node.attrs.url,
						style: convertToInlineCss({
							backgroundColor: `${token('color.background.neutral')}`,
							outline: 'none',

							width: `var(--ak-editor-media-card-width, 100%)`,
							height: `var(--ak-editor-media-card-height, 100%)`,
						}),
					},
				];
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

						style: convertToInlineCss({
							display: 'var(--ak-editor-media-card-display, inline-block)',
							backgroundImage: `url("${dataUrl}")`,
							marginLeft: '0',
							marginRight: 'var(--ak-editor-media-margin-right, 4px)',
							borderRadius: '3px',
							outline: 'none',
							flexBasis: `${defaultImageCardDimensions.width}px`,
							backgroundColor: 'var(--ak-editor-media-card-background-color)',
							width: `var(--ak-editor-media-card-width, 100%)`,
							height: `var(--ak-editor-media-card-height, 0)`,
							paddingBottom: `var(--ak-editor-media-padding-bottom, 0)`,
						}),
					},
				];
			}

			return [
				'div',
				{
					...attrs,
					styles: convertToInlineCss({
						backgroundColor: `var(--ak-editor-media-card-background-color, ${token('color.background.neutral')})`,
						outline: 'none',
					}),
				},
			];
		},
	};
};
