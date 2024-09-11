import kebabCase from 'lodash/kebabCase';

import { table } from '@atlaskit/adf-schema';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/src/types';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { akEditorGutterPaddingDynamic } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getAlignmentStyle } from './nodeviews/table-container-styles';
import { generateColgroup } from './pm-plugins/table-resizing/utils/colgroup';

type Config = {
	allowColumnResizing: boolean;
	tableResizingEnabled: boolean;
	getEditorContainerWidth: GetEditorContainerWidth;
};
export const tableNodeSpecWithFixedToDOM = (config: Config): typeof table => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return table;
	}

	return {
		...table,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const editorWidthFromGetter = Math.min(
				config.getEditorContainerWidth().width - akEditorGutterPaddingDynamic() * 2,
				node.attrs.width,
			);
			const alignmentStyle = Object.entries(getAlignmentStyle(node.attrs.layout))
				.map(([k, v]) => `${kebabCase(k)}: ${kebabCase(v)}`)
				.join(';');

			const attrs = {
				'data-number-column': node.attrs.isNumberColumnEnabled,
				'data-layout': node.attrs.layout,
				'data-autosize': node.attrs.__autoSize,
				'data-table-local-id': node.attrs.localId,
				'data-table-width': node.attrs.width,
				style: `width: ${node.attrs.width}px;`,
			};

			let colgroup: DOMOutputSpec = '';

			if (config.allowColumnResizing) {
				colgroup = ['colgroup', {}, ...generateColgroup(node)];
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

			if (!config.tableResizingEnabled) {
				return [
					'div',
					{
						class: 'tableView-content-wrap',
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
						style: `width: ${node.attrs.width}px`,
					},
					[
						'div',
						{
							class: 'resizer-item display-handle',
							style: `position: relative; user-select: auto;  height: auto;  min-width: 145px; box-sizing: border-box; max-width: ${editorWidthFromGetter}px; width: ${editorWidthFromGetter}px;`,
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
				},
				tableResizingDiv,
			];
		},
	};
};
