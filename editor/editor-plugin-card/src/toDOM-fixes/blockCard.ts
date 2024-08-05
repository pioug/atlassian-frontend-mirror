import { blockCard } from '@atlaskit/adf-schema';
import type { DatasourceAttributes, DataType, UrlType } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

// @nodeSpecException:toDOM patch
export const blockCardSpecWithFixedToDOM = () => {
	if (!fg('platform_editor_lazy-node-views')) {
		return blockCard;
	}

	return {
		...blockCard,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const { url } = node.attrs as UrlType;
			const { data } = node.attrs as DataType;
			const { layout, width, datasource } = node.attrs as DatasourceAttributes;
			const attrs = {
				'data-block-card': '',
				'data-card-url': url || '',
				'data-card-data': data ? JSON.stringify(data) : '',
				'data-datasource': datasource ? JSON.stringify(datasource) : '',
				'data-layout': layout,
				'data-width': `${width}`,
				class: 'blockCardView-content-wrap',
			};
			return [
				'div',
				attrs,
				[
					'a',
					{
						// To match `packages/linking-platform/smart-card/src/view/CardWithUrl/component-lazy/LoadingCardLink.tsx`
						// Which uses frame styling `packages/linking-platform/smart-card/src/view/InlineCard/Frame/styled.ts`
						style: convertToInlineCss({
							marginLeft: token('space.negative.025', '-2px'),
							boxDecorationBreak: 'clone',
							WebkitBoxDecorationBreak: 'clone',
							padding: `${token('space.025', '2px')} 0px`,
							lineHeight: '22px',
						}),
						href: url || '',
					},
					node?.attrs?.url || ' ',
				],
			];
		},
	};
};
