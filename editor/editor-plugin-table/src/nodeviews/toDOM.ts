import kebabCase from 'lodash/kebabCase';

import { table, tableWithNestedTable } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import type { DOMOutputSpec, NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { akEditorGutterPaddingDynamic } from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	generateColgroup,
	generateColgroupFromNode,
	getResizerMinWidth,
} from '../pm-plugins/table-resizing/utils/colgroup';
import { TABLE_MAX_WIDTH } from '../pm-plugins/table-resizing/utils/consts';
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
			const gutterPadding = () => {
				if (expValEquals('platform_editor_preview_panel_responsiveness', 'isEnabled', true)) {
					return 'calc(var(--ak-editor--large-gutter-padding) * 2)';
				} else {
					return `${akEditorGutterPaddingDynamic() * 2}px`;
				}
			};

			const alignmentStyle = Object.entries(getAlignmentStyle(node.attrs.layout))
				.map(([k, v]) => `${kebabCase(k)}: ${kebabCase(v)}`)
				.join(';');

			const tableMinWidth = getResizerMinWidth(node);

			const tableWidthAttribute = node.attrs.width ? `${node.attrs.width}px` : `100%`;

			const isFullPageEditor = !config.isChromelessEditor && !config.isCommentEditor;

			const attrs = {
				'data-number-column': node.attrs.isNumberColumnEnabled,
				'data-layout': node.attrs.layout,
				'data-autosize': node.attrs.__autoSize,
				'data-table-local-id': node.attrs.localId,
				'data-table-width': node.attrs.width,
				...(expValEquals('platform_editor_tables_scaling_css', 'isEnabled', true) && {
					'data-ssr-placeholder': `table-${node.attrs.localId}`,
					'data-ssr-placeholder-replace': `table-${node.attrs.localId}`,
				}),
			};

			// This would be used for table scaling in colgroup CSS
			// cqw, or px is well supported
			const resizableTableWidth = expValEquals(
				'platform_editor_tables_scaling_css',
				'isEnabled',
				true,
			)
				? isFullPageEditor
					? getTableResizerContainerForFullPageWidthInCSS(node, config.isTableScalingEnabled)
					: `calc(100cqw - calc(var(--ak-editor--large-gutter-padding) * 2))`
				: `min(calc(100cqw - calc(var(--ak-editor--large-gutter-padding) * 2)), ${node.attrs.width ?? '100%'})`;

			let colgroup: DOMOutputSpec = '';

			if (config.allowColumnResizing) {
				if (expValEquals('platform_editor_tables_scaling_css', 'isEnabled', true)) {
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
				} else {
					colgroup = ['colgroup', {}, ...generateColgroup(node)];
				}
			}

			// For Chromeless editor, and nested tables in full page editor
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
						class: 'pm-table-with-left-shadow',
						style: 'visibility: hidden',
					},
				],
				[
					'div',
					{
						class: 'pm-table-wrapper',
					},
					[
						'table',
						attrs,
						['span', { class: 'pm-table-shadow-sentinel-right' }],
						['span', { class: 'pm-table-shadow-sentinel-left' }],
						colgroup,
						['tbody', 0],
					],
				],
				[
					'div',
					{
						class: 'pm-table-with-right-shadow',
						style: 'visibility: hidden',
					},
				],
				[
					'div',
					{
						class: 'pm-table-sticky-sentinel-bottom',
						'data-testid': 'sticky-sentinel-bottom',
					},
				],
			];

			if (
				!config.tableResizingEnabled ||
				(expValEquals('platform_editor_tables_scaling_css', 'isEnabled', true) && config.isNested)
			) {
				return [
					'div',
					{
						class: 'tableView-content-wrap',
						'data-prosemirror-initial-toDOM-render': 'true',
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
							width: expValEquals('platform_editor_tables_scaling_css', 'isEnabled', true)
								? `var(--ak-editor-table-width)`
								: `min(calc(100cqw - ${gutterPadding()}), ${tableWidthAttribute})`,
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
								'--ak-editor-table-max-width': `${TABLE_MAX_WIDTH}px`,
								'--ak-editor-table-min-width': `${tableMinWidth}px`,
								minWidth: 'var(--ak-editor-table-min-width)',
								maxWidth: expValEquals('platform_editor_tables_scaling_css', 'isEnabled', true)
									? getTableResizerContainerMaxWidthInCSS(
											config.isCommentEditor,
											config.isChromelessEditor,
											config.isTableScalingEnabled,
										)
									: `min(calc(100cqw - var(--ak-editor-table-gutter-padding)), var(--ak-editor-table-max-width))`,
								width: expValEquals('platform_editor_tables_scaling_css', 'isEnabled', true)
									? getTableResizerItemWidthInCSS(
											node,
											config.isCommentEditor,
											config.isChromelessEditor,
										)
									: `min(calc(100cqw - var(--ak-editor-table-gutter-padding)), ${tableWidthAttribute})`,
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
