import { blockCard, blockCardWithLocalId } from '@atlaskit/adf-schema';
import type { DatasourceAttributes, DataType, UrlType } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// @nodeSpecException:toDOM patch
export const blockCardSpecWithFixedToDOM = () => {
	const blockCardNode = fg('platform_editor_adf_with_localid') ? blockCardWithLocalId : blockCard;
	return {
		...blockCardNode,
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
				...(fg('platform_editor_adf_with_localid')
					? { 'data-local-id': (node.attrs as UrlType | DataType).localId }
					: {}),
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
						href: url || '',
					},
					node?.attrs?.url || ' ',
				],
			];
		},
	};
};
