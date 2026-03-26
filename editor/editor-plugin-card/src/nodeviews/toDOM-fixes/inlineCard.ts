import { inlineCard, inlineCardWithLocalId } from '@atlaskit/adf-schema';
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

// @nodeSpecException:toDOM patch
export const inlineCardSpecWithFixedToDOM = (): {
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
	const inlineCardNode = fg('platform_editor_adf_with_localid')
		? inlineCardWithLocalId
		: inlineCard;
	return {
		...inlineCardNode,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const wrapperAttrs = {
				class: 'inlineCardView-content-wrap inlineNodeView',
			};
			const cardAttrs = {
				'aria-busy': 'true',
				class: 'card',
			};
			const attrs = {
				'data-inline-card': '',
				href: node.attrs.url || '',
				'data-card-data': node.attrs.data ? JSON.stringify(node.attrs.data) : '',
				// LoadingCardLink used for Suspense in `packages/linking-platform/smart-card/src/view/CardWithUrl/loader.tsx`
				// We need to match the style of LoadingCardLink
				// Which uses frame styling `packages/linking-platform/smart-card/src/view/InlineCard/Frame/styled.ts`, with withoutBackground=true
				style: convertToInlineCss({
					padding: `${token('space.025')} 0px`,
					marginLeft: token('space.negative.025'),
					display: 'inline',
					boxDecorationBreak: 'clone',
					WebkitBoxDecorationBreak: 'clone',
					borderRadius: token('radius.small', '4px'),
					color: token('color.link'),
					lineHeight: '22px',
					WebkitTransition: '0.1s all ease-in-out',
					transition: '0.1s all ease-in-out',
					userSelect: 'text',
					WebkitUserSelect: 'text',
					msUserSelect: 'text',
					MozUserSelect: 'none', // -moz-user-select
				}),
				...(fg('platform_editor_adf_with_localid') ? { 'data-local-id': node.attrs.localId } : {}),
			};
			if (node.attrs.url) {
				return ['span', wrapperAttrs, ['span', cardAttrs, ['a', attrs, node.attrs.url]]];
			} else {
				return ['span', wrapperAttrs, ['span', cardAttrs, ['a', attrs]]];
			}
		},
	};
};
