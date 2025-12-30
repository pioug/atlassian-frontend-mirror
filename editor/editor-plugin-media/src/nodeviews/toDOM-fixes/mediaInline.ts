import { mediaInline } from '@atlaskit/adf-schema';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { token } from '@atlaskit/tokens';

import { getMediaAttrs } from './toDOMAttrs';

const skeletonStyling = `background: ${token('color.background.neutral')};`;
// Matches media
const fallbackAspectRatio = 1.25;

// @nodeSpecException:toDOM patch
export const mediaInlineSpecWithFixedToDOM = () => {
	return {
		...mediaInline,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const dataAttrs = getMediaAttrs('mediaInline', node);
			if (node.attrs.type === 'image') {
				const aspectRatio =
					node.attrs.width && node.attrs.height
						? node.attrs.width / node.attrs.height
						: fallbackAspectRatio;
				return [
					'span',
					{
						...dataAttrs,
						style: 'display: inline-block; transform: translateY(6px)',
						class: 'media-inline-image-wrapper',
					},
					[
						'span',
						{
							height: '100%',
							width: '100%',
							// Transparent image workaround to control styling
							src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
							style: `display: inline-block; aspect-ratio: ${aspectRatio}; height: 100%; width: 100%; border-radius: ${token('radius.small', '3px')}; ${skeletonStyling}`,
						},
					],
				];
			} else {
				return [
					'span',
					{
						...dataAttrs,
						style: `display: inline-block; transform: translateY(6px); ${skeletonStyling}`,
						class: 'media-inline-image-wrapper',
					},
					[
						'span',
						{
							style: `display: inline-block; height: 100%; width: 100%; aspect-ratio: ${fallbackAspectRatio};`,
						},
					],
				];
			}
		},
	};
};
