import type { BlockContent } from './types/block-content';
import { layoutColumn as layoutColumnFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';

/**
 * @name layoutColumn_node
 */
export interface LayoutColumnDefinition {
	attrs: {
		localId?: string;
		/**
		 * @minimum 0
		 * @maximum 100
		 */
		width: number;
	};
	/**
	 * @minItems 1
	 * @allowUnsupportedBlock true
	 */
	content: Array<BlockContent>;
	type: 'layoutColumn';
}

export const layoutColumn = layoutColumnFactory({
	parseDOM: [
		{
			context: 'layoutColumn//',
			tag: 'div[data-layout-column]',
			skip: true,
		},
		{
			tag: 'div[data-layout-column]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					width: Number(dom.getAttribute('data-column-width')) || undefined,
				};
			},
		},
	],
	toDOM(node) {
		const attrs: Record<string, string> = {
			'data-layout-column': 'true',
		};
		const { width } = node.attrs;
		if (width) {
			attrs['style'] = `flex-basis: ${width}%`;
			attrs['data-column-width'] = `${width}`;
		}

		// We need to apply a attribute to the inner most child to help
		// ProseMirror identify its boundaries better.
		const contentAttrs: Record<string, string> = {
			'data-layout-content': 'true',
		};

		return ['div', attrs, ['div', contentAttrs, 0]];
	},
});

export const layoutColumnWithLocalId = layoutColumnFactory({
	parseDOM: [
		{
			context: 'layoutColumn//',
			tag: 'div[data-layout-column]',
			skip: true,
		},
		{
			tag: 'div[data-layout-column]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					width: Number(dom.getAttribute('data-column-width')) || undefined,
					localId: uuid.generate(),
				};
			},
		},
	],
	toDOM(node) {
		const attrs: Record<string, string> = {
			'data-layout-column': 'true',
		};
		if (node?.attrs?.localId !== undefined) {
			attrs['data-local-id'] = node.attrs.localId;
		}
		const { width } = node.attrs;
		if (width) {
			attrs['style'] = `flex-basis: ${width}%`;
			attrs['data-column-width'] = `${width}`;
		}

		// We need to apply a attribute to the inner most child to help
		// ProseMirror identify its boundaries better.
		const contentAttrs: Record<string, string> = {
			'data-layout-content': 'true',
		};

		return ['div', attrs, ['div', contentAttrs, 0]];
	},
});
