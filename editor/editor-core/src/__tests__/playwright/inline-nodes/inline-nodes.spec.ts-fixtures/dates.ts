import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const trailingSpacesWithDates: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'text', text: ' ' },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'text', text: ' ' },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'text', text: ' ' },
			],
		},
	],
};

export const noTrailingSpacesWithDates: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
			],
		},
	],
};

export const multipleNodesAcrossLinesWithDates: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
				{ type: 'date', attrs: { timestamp: '1577836800000' } },
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export const multilineWithDates: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: '704b4aa7-f9a6-49e0-9b14-3c2e010bd4ca',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [56],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{ type: 'date', attrs: { timestamp: '1577836800000' } },
										{ type: 'date', attrs: { timestamp: '1577836800000' } },
										{ type: 'date', attrs: { timestamp: '1577836800000' } },
									],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [346],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [276],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
					],
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {
								colwidth: [56],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [346],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [276],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
					],
				},
			],
		},
	],
};
