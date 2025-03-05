import { inlineCard } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { B400 } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

// @nodeSpecException:toDOM patch
export const inlineCardSpecWithFixedToDOM = () => {
	if (
		editorExperiment('platform_editor_exp_lazy_node_views', false) ||
		!fg('platform_editor_ssr_fix_smartlinks')
	) {
		return inlineCard;
	}

	return {
		...inlineCard,
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
					padding: `${token('space.025', '2px')} 0px`,
					marginLeft: token('space.negative.025', '-2px'),
					display: 'inline',
					boxDecorationBreak: 'clone',
					WebkitBoxDecorationBreak: 'clone',
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
			};
			if (node.attrs.url) {
				return ['span', wrapperAttrs, ['span', cardAttrs, ['a', attrs, node.attrs.url]]];
			} else {
				return ['span', wrapperAttrs, ['span', cardAttrs, ['a', attrs]]];
			}
		},
	};
};
