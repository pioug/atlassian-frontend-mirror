import { mediaSingleSpec } from '@atlaskit/adf-schema';
import type { RichMediaLayout } from '@atlaskit/adf-schema/schema';
import type { LazyNodeViewToDOMConfiguration } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { getAttrsFromNodeMediaSingle } from './toDOMAttrs';

const skeletonStyling = `background: ${token('color.background.neutral')}; outline: none;`;

export const wrappedLayouts = ['wrap-left', 'wrap-right', 'align-end', 'align-start'];

/**
 * Duplicate of method from `@atlaskit/editor-common/utils`.
 * `packages/editor/editor-common/src/utils/rich-media-utils.ts`
 *
 * WHY?
 * This will eventually move to `@atlaskit/adf-schema` and we cannot reference
 * `@atlaskit/editor-common` from here or it will cause dependency issues.
 *
 * In the long term likely `toDOM` will move back out of `adf-schema` in which
 * case we can consolidate them.
 */
export const shouldAddDefaultWrappedWidth = (
	layout: string,
	width?: number,
	lineLength?: number,
) => {
	return wrappedLayouts.indexOf(layout) > -1 && lineLength && width && width > 0.5 * lineLength;
};

const MEDIA_SINGLE_GUTTER_SIZE = 24;
const DEFAULT_EMBED_CARD_WIDTH = 680;
const akEditorMediaResizeHandlerPaddingWide = 12;

/**
 * Duplicate of method from `@atlaskit/editor-common/media-single`.
 * `packages/editor/editor-common/src/media-single/utils.ts`
 *
 * WHY?
 * This will eventually move to `@atlaskit/adf-schema` and we cannot reference
 * `@atlaskit/editor-common` from here or it will cause dependency issues.
 *
 * In the long term likely `toDOM` will move back out of `adf-schema` in which
 * case we can consolidate them.
 */
export function getMediaSinglePixelWidth(
	width: number,
	editorWidth: number,
	widthType = 'percentage',
	gutterOffset = 0,
): number {
	if (widthType === 'pixel') {
		return width;
	}
	return Math.ceil((editorWidth + gutterOffset) * (width / 100) - gutterOffset);
}

/**
 * Duplicate logic from `@atlaskit/editor-common/ui` for MediaSingle.
 * `packages/editor/editor-common/src/ui/MediaSingle/index.tsx`
 *
 * WHY?
 * This will eventually move to `@atlaskit/adf-schema` and we cannot reference
 * `@atlaskit/editor-common` from here or it will cause dependency issues.
 *
 * In the long term likely `toDOM` will move back out of `adf-schema` in which
 * case we can consolidate them.
 */
function computeMediaSingleDimensions({
	childNode,
	mediaSingleWidth,
	widthType,
	editorWidth,
}: {
	childNode: PMNode | null;
	mediaSingleWidth: number | undefined;
	widthType: string | undefined;
	editorWidth: number;
}) {
	const width = childNode?.attrs.width;
	const height = childNode?.attrs.height;

	if (
		!mediaSingleWidth &&
		shouldAddDefaultWrappedWidth(childNode?.attrs.layout, width, editorWidth)
	) {
		mediaSingleWidth = widthType === 'pixel' ? editorWidth / 2 : 50;
	}

	const isHeightOnly = width === undefined;
	if (mediaSingleWidth) {
		const pxWidth = getMediaSinglePixelWidth(
			mediaSingleWidth,
			editorWidth,
			widthType,
			MEDIA_SINGLE_GUTTER_SIZE,
		);
		if (isHeightOnly) {
			return { width: pxWidth - akEditorMediaResizeHandlerPaddingWide, height };
		} else {
			return { width: pxWidth, height: (height / width) * pxWidth };
		}
	} else if (isHeightOnly) {
		return { width: DEFAULT_EMBED_CARD_WIDTH - akEditorMediaResizeHandlerPaddingWide, height };
	}
	return { height, width };
}

function computeLayoutStyles(width: number, layout: RichMediaLayout) {
	switch (layout) {
		case 'align-end':
			return `margin-left: auto; margin-right: 0; width: ${width}px;`;
		case 'align-start':
			return `margin-left: 0; margin-right: auto; width: ${width}px;`;
		case 'center':
			return 'margin-left: auto; margin-right: auto;';
		case 'full-width':
		case 'wide':
			return 'width: 100%; margin-top: 56px; margin-bottom: 56px;';
		case 'wrap-left':
			return 'float: left;';
		case 'wrap-right':
			return 'float: right;';
	}
}

// @nodeSpecException:toDOM patch
export const mediaSingleSpecWithFixedToDOM = (mediaSingleOption: {
	withCaption?: boolean;
	withExtendedWidthTypes: boolean;
}): NodeSpec => {
	const mediaSingleNode = mediaSingleSpec(mediaSingleOption);
	if (!fg('platform_editor_lazy-node-views')) {
		return mediaSingleNode;
	}

	return {
		...mediaSingleNode,
		toDOM: (node: PMNode, lazyNodeViewOptions?: LazyNodeViewToDOMConfiguration): DOMOutputSpec => {
			const mediaSingleAttrs = node.attrs;
			const layout = mediaSingleAttrs?.layout ?? 'center';
			const mediaSingleWidth = mediaSingleAttrs?.width;
			const widthType = mediaSingleAttrs?.widthType;
			const childNode = node.firstChild;
			const dataAttrs = getAttrsFromNodeMediaSingle(mediaSingleOption.withExtendedWidthTypes, node);

			const { width, height } = computeMediaSingleDimensions({
				childNode,
				widthType,
				mediaSingleWidth,
				editorWidth: lazyNodeViewOptions?.editorLineWidth || 760,
			});

			const sizes =
				width && height ? `width: ${width}px; height: ${height}px; ${skeletonStyling}` : '';

			const layoutStyles = computeLayoutStyles(mediaSingleWidth, layout);

			const style = `display: block; margin-top: ${token('space.300', '24px')}; margin-bottom: ${token('space.300', '24px')}; ${layoutStyles}`;

			const layoutClass = `image-${layout}`;

			const centerLayout = `display: flex; justify-content: center;`;
			const endLayout = `display: flex; justify-content: end;`;
			const startLayout = `display: flex; justify-content: start;`;
			const layoutStyle =
				layout === 'align-end' ? endLayout : layout === 'align-start' ? startLayout : centerLayout;

			const content = [
				'div',
				{
					class: `rich-media-item mediaSingleView-content-wrap ${layoutClass}`,
					...dataAttrs,
				},
				[
					'div',
					{
						// Transparent image workaround to control styling
						style: `${sizes}; ${style}; max-width: 100%; border-radius: ${token('border.radius', '3px')}; ${layoutStyle}`,
					},
					[
						'figure',
						{
							class: 'media-single-node',
							style: 'margin: 0px',
						},
						['div', {}, ['div', { class: 'media-content-wrap' }, 0]],
					],
				],
			];

			return ['div', { class: 'mediaSingleView-content-wrap', layout }, content];
		},
	};
};
