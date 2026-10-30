import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const trailingSpacesWithStatus: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{ type: 'text', text: ' ' },
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{ type: 'text', text: ' ' },
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{ type: 'text', text: ' ' },
			],
		},
	],
};

export const noTrailingSpacesWithStatus: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
			],
		},
	],
};

export const multipleNodesAcrossLinesWithStatus: ADFEntity = {
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
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
				{
					type: 'status',
					attrs: {
						text: 'test',
						color: 'neutral',
						localId: '756a705c-d938-4636-b417-7664d6d2da30',
						style: '',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export const multilineWithStatus: ADFEntity = {
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
										{
											type: 'status',
											attrs: {
												text: 'test',
												color: 'neutral',
												localId: '756a705c-d938-4636-b417-7664d6d2da30',
												style: '',
											},
										},
										{
											type: 'status',
											attrs: {
												text: 'test',
												color: 'neutral',
												localId: '756a705c-d938-4636-b417-7664d6d2da30',
												style: '',
											},
										},
										{
											type: 'status',
											attrs: {
												text: 'test',
												color: 'neutral',
												localId: '756a705c-d938-4636-b417-7664d6d2da30',
												style: '',
											},
										},
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
