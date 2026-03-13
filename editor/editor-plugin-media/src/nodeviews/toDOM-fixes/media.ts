import { media } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type {
	AttributeSpec,
	DOMOutputSpec,
	Node as PMNode,
	TagParseRule,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
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
export const mediaSpecWithFixedToDOM = (): {
	atom?: boolean;
	attrs?: {
		[name: string]: AttributeSpec;
	};
	code?: boolean;
	content?: string;
	defining?: boolean;
	definingAsContext?: boolean;
	definingForContent?: boolean;
	disableDropCursor?:
		| boolean
		| ((
				view: EditorView,
				pos: {
					inside: number;
					pos: number;
				},
				event: DragEvent,
		  ) => boolean);
	draggable?: boolean;
	group?: string;
	inline?: boolean;
	isolating?: boolean;
	leafText?: (node: PMNode) => string;
	linebreakReplacement?: boolean;
	marks?: string;
	parseDOM?: readonly TagParseRule[];
	selectable?: boolean;
	toDebugString?: (node: PMNode) => string;
	toDOM: (node: PMNode) => DOMOutputSpec;
	whitespace?: 'pre' | 'normal';
} => {
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
				const sharedAttrs = {
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
						// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
						borderRadius: token('radius.small', '3px'),
						outline: 'none',
						flexBasis: `${defaultImageCardDimensions.width}px`,
						backgroundColor: 'var(--ak-editor-media-card-background-color)',
						width: `var(--ak-editor-media-card-width, 100%)`,
						height: `var(--ak-editor-media-card-height, 0)`,
						paddingBottom: `var(--ak-editor-media-padding-bottom, 0)`,
					}),
				};

				// Safari is stripping the dom if a child does not exist for the media nodes on safari.
				// Creating an empty child allows safari to pick up the media node within the clipboard.
				// https://product-fabric.atlassian.net/browse/ED-25841
				return fg('platform_editor_safari_media_clipboard_fix')
					? ['div', sharedAttrs, ['div', {}]]
					: ['div', sharedAttrs];
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
