import kebabCase from 'lodash/kebabCase';

import { table, tableWithNestedTable } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import type { DOMOutputSpec, NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	generateColgroupFromNode,
	getResizerMinWidth,
} from '../pm-plugins/table-resizing/utils/colgroup';
import { TABLE_MAX_WIDTH, TABLE_FULL_WIDTH } from '../pm-plugins/table-resizing/utils/consts';
import {
	getTableResizerContainerMaxWidthInCSS,
	getTableResizerContainerForFullPageWidthInCSS,
	getTableResizerItemWidthInCSS,
} from '../pm-plugins/table-resizing/utils/misc';

import { getAlignmentStyle } from './table-container-styles';

type Config = {
	allowColumnResizing: boolean;
	getEditorContainerWidth: GetEditorContainerWidth;
	isChromelessEditor?: boolean;
	isCommentEditor?: boolean;
	isNested?: boolean;
	isNestingSupported?: boolean;
	isTableScalingEnabled?: boolean;
	shouldUseIncreasedScalingPercent?: boolean;
	tableResizingEnabled: boolean;
};
export const tableNodeSpecWithFixedToDOM = (
	config: Config,
): NodeSpec & { toDOM: (node: PMNode) => DOMOutputSpec } => {
	const tableNode = config.isNestingSupported ? tableWithNestedTable : table;

	return {
		...tableNode,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const alignmentStyle = Object.entries(getAlignmentStyle(node.attrs.layout))
				.map(([k, v]) => `${kebabCase(k)}: ${kebabCase(v)}`)
				.join(';');

			const tableMinWidth = getResizerMinWidth(node);

			const isFullPageEditor = !config.isChromelessEditor && !config.isCommentEditor;

			const attrs = {
				'data-number-column': node.attrs.isNumberColumnEnabled,
				'data-layout': node.attrs.layout,
				'data-autosize': node.attrs.__autoSize,
				'data-table-local-id': node.attrs.localId,
				'data-table-width': node.attrs.width,
				'data-ssr-placeholder': `table-${node.attrs.localId}`,
				'data-ssr-placeholder-replace': `table-${node.attrs.localId}`,
			};

			// This would be used for table scaling in colgroup CSS
			// cqw, or px is well supported
			const resizableTableWidth = isFullPageEditor
				? getTableResizerContainerForFullPageWidthInCSS(node, config.isTableScalingEnabled)
				: `calc(100cqw - calc(var(--ak-editor--large-gutter-padding) * 2))`;

			let colgroup: DOMOutputSpec = '';

			if (config.allowColumnResizing) {
				colgroup = [
					'colgroup',
					{},
					...generateColgroupFromNode(
						node,
						config.isCommentEditor,
						config.isChromelessEditor,
						config.isNested,
						config.isTableScalingEnabled,
						config.shouldUseIncreasedScalingPercent,
					),
				];
			}

			const tableContainerDiv = [
				'div',
				{
					class: 'pm-table-container',
					'data-number-column': node.attrs.isNumberColumnEnabled,
					'data-layout': node.attrs.layout,
					'data-testid': 'table-container',
				},
				[
					'div',
					{
						class: 'pm-table-sticky-sentinel-top',
						'data-testid': 'sticky-sentinel-top',
					},
				],
				[
					'div',
					{
						class: 'pm-table-row-controls-wrapper',
					},
					['div'],
				],
				[
					'div',
					{
						class: 'pm-table-wrapper',
					},
					['table', attrs, colgroup, ['tbody', 0]],
				],
				[
					'div',
					{
						class: 'pm-table-sticky-sentinel-bottom',
						'data-testid': 'sticky-sentinel-bottom',
					},
				],
			];

			if (!config.tableResizingEnabled || config.isNested) {
				return [
					'div',
					{
						class: 'tableView-content-wrap',
						'data-prosemirror-initial-toDOM-render': 'true',
						style: convertToInlineCss({
							'--ak-editor-table-width': resizableTableWidth,
						}),
					},
					tableContainerDiv,
				];
			}

			const tableResizingDiv = [
				'div',
				{
					'data-testid': 'table-alignment-container',
					style: alignmentStyle,
				},
				[
					'div',
					{
						class: 'pm-table-resizer-container',
						style: convertToInlineCss({
							'--ak-editor-table-gutter-padding': config.isTableScalingEnabled
								? 'calc(var(--ak-editor--large-gutter-padding) * 2)'
								: 'calc(var(--ak-editor--large-gutter-padding) * 2 - var(--ak-editor-resizer-handle-spacing))',
							'--ak-editor-table-width': resizableTableWidth,
							width: `var(--ak-editor-table-width)`,
						}),
					},
					[
						'div',
						{
							class: 'resizer-item display-handle',
							style: convertToInlineCss({
								position: 'relative',
								userSelect: 'auto',
								boxSizing: 'border-box',
								'--ak-editor-table-max-width': `${expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) || expValEquals('confluence_max_width_content_appearance', 'isEnabled', true) ? TABLE_MAX_WIDTH : TABLE_FULL_WIDTH}px`,
								'--ak-editor-table-min-width': `${tableMinWidth}px`,
								minWidth: 'var(--ak-editor-table-min-width)',
								maxWidth: getTableResizerContainerMaxWidthInCSS(
									config.isCommentEditor,
									config.isChromelessEditor,
									config.isTableScalingEnabled,
								),
								width: getTableResizerItemWidthInCSS(
									node,
									config.isCommentEditor,
									config.isChromelessEditor,
								),
							}),
						},
						[
							'span',
							{
								class: 'resizer-hover-zone',
							},
							tableContainerDiv,
						],
					],
				],
			];

			return [
				'div',
				{
					class: 'tableView-content-wrap',
					'data-prosemirror-initial-toDOM-render': 'true',
				},
				tableResizingDiv,
			];
		},
	};
};
