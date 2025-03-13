/**
 * Some of these functions and styling are duplicated from their custom node view equivalents
 *
 * WHY?
 * This will eventually move to `@atlaskit/adf-schema` and we cannot reference
 * `@atlaskit/editor-common` from here or it will cause dependency issues.
 *
 * In the long term likely `toDOM` will move back out of `adf-schema` in which
 * case we can consolidate them.
 */
import { embedCard } from '@atlaskit/adf-schema';
import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	DEFAULT_EMBED_CARD_HEIGHT,
	DEFAULT_EMBED_CARD_WIDTH,
} from '@atlaskit/editor-shared-styles';
import { B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// From `packages/editor/editor-common/src/ui/MediaSingle/styled.tsx`
function calcMargin(layout: MediaSingleLayout): string {
	switch (layout) {
		case 'wrap-right':
			return '12px auto 12px 12px';
		case 'wrap-left':
			return '12px 12px 12px auto';
		default:
			return '24px auto';
	}
}

// From `packages/editor/editor-common/src/ui/MediaSingle/styled.tsx`
function float(layout: MediaSingleLayout): 'left' | 'right' | 'none' {
	switch (layout) {
		case 'wrap-right':
			return 'right';
		case 'wrap-left':
			return 'left';
		default:
			return 'none';
	}
}

// From `packages/editor/editor-common/src/media-single/constants.ts`
const MEDIA_SINGLE_GUTTER_SIZE = 24;

// From `packages/editor/editor-common/src/ui/MediaSingle/styled.tsx`
function calcPxFromPct(pct: number, lineLength: number): number {
	const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
	return maxWidth * pct - MEDIA_SINGLE_GUTTER_SIZE;
}

// ED-24488: We can't retrieve the editor width from here easily.
// For now we're using the default line length here, but this will be
// incorrect on smaller devices.
const LINE_LENGTH = 760;

// @nodeSpecException:toDOM patch
export const embedCardSpecWithFixedToDOM = () => {
	return {
		...embedCard,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const { url, layout, width, originalWidth, originalHeight } = node.attrs;

			const aspectRatio =
				originalWidth && originalHeight
					? originalWidth / originalHeight
					: DEFAULT_EMBED_CARD_WIDTH / DEFAULT_EMBED_CARD_HEIGHT;

			const attrs = {
				'data-embed-card': '',
				'data-card-url': url,
				'data-layout': layout,
				'data-width': width,
				'data-original-width': originalWidth,
				'data-original-height': originalHeight,
				class: 'embedCardView-content-wrap',
				// From `packages/editor/editor-plugin-card/src/ui/ResizableEmbedCard.tsx`
				style: convertToInlineCss({
					margin: calcMargin(layout),
					width: `${Math.ceil(calcPxFromPct(width / 100, LINE_LENGTH))}px`,
					marginRight: layout === 'align-end' ? '0' : '',
					marginLeft: layout === 'align-start' ? '0' : '',
					float: float(layout),
				}),
			};
			return [
				'div',
				attrs,
				// This is the only modification to the embed card `toDOM`
				// This is to match the behaviour of Card which lazy loads
				// and uses just a URL as a fallback
				//
				// To match: `packages/linking-platform/smart-card/src/view/CardWithUrl/component-lazy/LoadingCardLink.tsx`
				[
					'a',
					{
						style: convertToInlineCss({
							padding: `${token('space.025', '2px')} 0px`,
							marginLeft: token('space.negative.025', '-2px'),
							display: 'inline',
							boxDecorationBreak: 'clone',
							borderRadius: token('border.radius.100', '4px'),
							color: token('color.link', B400),
							lineHeight: '22px',
							WebkitTransition: '0.1s all ease-in-out',
							transition: '0.1s all ease-in-out',
							userSelect: 'text',
							WebkitUserSelect: 'text',
							msUserSelect: 'text',
							MozUserSelect: 'none', // -moz-user-select
						}),
					},
					url ?? '',
				],
				// From `packages/editor/editor-plugin-card/src/ui/ResizableEmbedCard.tsx`
				// The `getHeightDefiningComponent` that defines the height of the element
				[
					'span',
					{
						style: convertToInlineCss({
							display: 'block',
							paddingBottom: `calc(${((1 / aspectRatio) * 100).toFixed(3)}% + ${token('space.400')})`,
						}),
					},
				],
			];
		},
	};
};
