import { table } from '@atlaskit/adf-schema';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import { generateColgroup } from './pm-plugins/table-resizing/utils/colgroup';

type Config = {
	allowColumnResizing: boolean;
	tableResizingEnabled: boolean;
};
export const tableNodeSpecWithFixedToDOM = (config: Config): typeof table => {
	if (!fg('platform_editor_lazy-node-views')) {
		return table;
	}

	return {
		...table,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const attrs = {
				'data-number-column': node.attrs.isNumberColumnEnabled,
				'data-layout': node.attrs.layout,
				'data-autosize': node.attrs.__autoSize,
				'data-table-local-id': node.attrs.localId,
				'data-table-width': node.attrs.width,
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
				},
				[
					'div',
					{
						class: 'pm-table-resizer-container',
					},
					[
						'div',
						{
							class: 'resizer-item display-handle',
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
