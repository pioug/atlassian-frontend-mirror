import type {
	ADFNode,
	ADFCommonNodeSpec,
} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { fragment } from '../marks/fragment';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import {
	tableCellContentPseudoGroup,
	tableCellContentNodes,
	tableHeaderContentPseudoGroup,
} from '../groups/tableCellContentPseudoGroup';
import { tableCellContent } from './tableCellContent';

import { nestedExpand } from './nestedExpand';
import { unsupportedBlock } from './unsupportedBlock';

// Declare early to allow for circular references within the file
const table: ADFNode<[string], ADFCommonNodeSpec> = adfNode('table');

const tableCell = adfNode('tableCell')
	.define({
		isolating: true,
		selectable: false,
		tableRole: 'cell',
		marks: [unsupportedMark, unsupportedNodeAttribute],
		attrs: {
			colspan: { type: 'number', default: 1, optional: true },
			rowspan: { type: 'number', default: 1, optional: true },
			colwidth: {
				type: 'array',
				items: { type: 'number' },
				default: null,
				optional: true,
			},
			background: { type: 'string', default: null, optional: true },
			localId: { type: 'string', default: null, optional: true },
		},
		content: [tableCellContentPseudoGroup],
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				required: {
					reason:
						'@DSLCompatibilityException - required for tableCell validator spec',
					value: ['content'],
				},
			},
		},
	})
	.variant('with_nested_table', {
		content: [$onePlus($or(...tableCellContentNodes, unsupportedBlock, table))],
		ignore: ['json-schema', 'validator-spec'],
	});

const tableHeader = adfNode('tableHeader')
	.define({
		isolating: true,
		selectable: false,
		tableRole: 'header_cell',
		marks: [unsupportedMark, unsupportedNodeAttribute],
		attrs: {
			colspan: { type: 'number', default: 1, optional: true },
			rowspan: { type: 'number', default: 1, optional: true },
			colwidth: {
				type: 'array',
				items: { type: 'number' },
				default: null,
				optional: true,
			},
			background: { type: 'string', default: null, optional: true },
			localId: { type: 'string', default: null, optional: true },
		},
		content: [tableHeaderContentPseudoGroup],
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				required: {
					reason:
						'@DSLCompatibilityException - required for tableHeader validator spec',
					value: ['content'],
				},
			},
		},
	})
	.variant('with_nested_table', {
		content: [$onePlus($or(...tableCellContentNodes, nestedExpand, table))],
		ignore: ['json-schema', 'validator-spec'],
	});

const tableRow = adfNode('tableRow')
	.define({
		selectable: false,
		marks: [unsupportedMark, unsupportedNodeAttribute],
		content: [$onePlus($or(tableCell, tableHeader, tableCellContent))],
		tableRole: 'row',
		attrs: {
			localId: { type: 'string', default: null, optional: true },
		},
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				'props.content.minItems': {
					reason:
						'@DSLCompatibilityException - required for tableRow validator spec',
					remove: true,
				},
			},
		},
	})
	.variant('with_nested_table', {
		content: [
			$onePlus(
				$or(
					tableCell.use('with_nested_table'),
					tableHeader.use('with_nested_table'),
				),
			),
		],
		ignore: ['json-schema', 'validator-spec'],
	});

table
	.define({
		isolating: true,
		selectable: true,
		tableRole: 'table',

		marks: [fragment, unsupportedMark, unsupportedNodeAttribute],

		attrs: {
			displayMode: {
				type: 'enum',
				values: ['default', 'fixed'],
				default: null,
				optional: true,
			},
			isNumberColumnEnabled: {
				type: 'boolean',
				default: false,
				optional: true,
			},
			layout: {
				type: 'enum',
				values: [
					'wide',
					'full-width',
					'center',
					'align-end',
					'align-start',
					'default',
				],
				default: 'default',
				optional: true,
			},
			localId: { type: 'string', minLength: 1, default: '', optional: true },
			width: { type: 'number', default: null, optional: true },

			__autoSize: { type: 'boolean', default: false, optional: true },
		},

		content: [$onePlus($or(tableRow))],
	})
	.variant('with_nested_table', {
		content: [$onePlus($or(tableRow.use('with_nested_table')))],
		ignore: ['json-schema', 'validator-spec'],
	});

export { table };
