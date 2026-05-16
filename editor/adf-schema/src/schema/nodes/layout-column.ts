import type { BlockContent } from './types/block-content';
import {
	layoutColumn as layoutColumnFactory,
	layoutColumnStage0 as layoutColumnStage0Factory,
} from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { parseValign } from './types/valign';
import type { Valign } from './types/valign';

interface ColumnOptions {
	withLocalId?: boolean;
	withValign?: boolean;
}

const setColumnAttributes = (
	node: Parameters<NonNullable<NodeSpec['toDOM']>>[0],
	{ withLocalId = false, withValign = false }: ColumnOptions = {},
) => {
	const attrs: Record<string, string> = {
		'data-layout-column': 'true',
	};
	const { width, valign, localId } = node.attrs;
	if (width) {
		const baseStyle = `flex-basis: ${width}%`;
		const columnWidthVar = editorExperiment('platform_editor_layout_column_resize_handle', true)
			? `; --column-width: ${width}%`
			: '';
		attrs['style'] = baseStyle + columnWidthVar;
		attrs['data-column-width'] = `${width}`;
	}
	if (withValign && valign) {
		attrs['data-valign'] = valign;
	}
	if (withLocalId && localId) {
		attrs['data-local-id'] = localId;
	}
	return attrs;
};

const getColumnAttrs =
	({ withLocalId = false, withValign = false }: ColumnOptions = {}) =>
	(domNode: Node | string) => {
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const dom = domNode as HTMLElement;
		const base = {
			width: Number(dom.getAttribute('data-column-width')) || undefined,
			...(withLocalId && { localId: uuid.generate() }),
		};
		const valign = parseValign(dom.getAttribute('data-valign'));
		return withValign && valign ? { ...base, valign } : base;
	};

// We need to apply an attribute to the innermost child to help ProseMirror
// identify its boundaries better.
const LAYOUT_CONTENT_ATTRS = { 'data-layout-content': 'true' } as const;

/**
 * @name layoutColumn_node
 */
export interface LayoutColumnDefinition {
	attrs: {
		localId?: string;
		/**
		 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
		 * @stage 0
		 */
		valign?: Valign;
		/**
		 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
		 * @minimum 0
		 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
		 * @maximum 100
		 */
		width: number;
	};
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<BlockContent>;
	type: 'layoutColumn';
}

export const layoutColumn: NodeSpec = layoutColumnFactory({
	parseDOM: [
		{
			context: 'layoutColumn//',
			tag: 'div[data-layout-column]',
			skip: true,
		},
		{ tag: 'div[data-layout-column]', getAttrs: getColumnAttrs() },
	],
	toDOM(node) {
		return ['div', setColumnAttributes(node), ['div', LAYOUT_CONTENT_ATTRS, 0]];
	},
});

export const layoutColumnStage0: NodeSpec = layoutColumnStage0Factory({
	parseDOM: [
		{
			context: 'layoutColumn//',
			tag: 'div[data-layout-column]',
			skip: true,
		},
		{
			tag: 'div[data-layout-column]',
			getAttrs: getColumnAttrs({ withLocalId: true, withValign: true }),
		},
	],
	toDOM(node) {
		return [
			'div',
			setColumnAttributes(node, { withLocalId: true, withValign: true }),
			['div', LAYOUT_CONTENT_ATTRS, 0],
		];
	},
});

export const layoutColumnWithLocalId: NodeSpec = layoutColumnFactory({
	parseDOM: [
		{
			context: 'layoutColumn//',
			tag: 'div[data-layout-column]',
			skip: true,
		},
		{
			tag: 'div[data-layout-column]',
			getAttrs: getColumnAttrs({ withLocalId: true }),
		},
	],
	toDOM(node) {
		return [
			'div',
			setColumnAttributes(node, { withLocalId: true }),
			['div', LAYOUT_CONTENT_ATTRS, 0],
		];
	},
});
