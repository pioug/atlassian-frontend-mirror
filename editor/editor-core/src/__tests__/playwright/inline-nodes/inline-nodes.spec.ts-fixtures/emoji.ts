import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const trailingSpacesWithEmoji: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{ type: 'text', text: ' ' },
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{ type: 'text', text: ' ' },
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{ type: 'text', text: ' ' },
			],
		},
	],
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const noTrailingSpacesWithEmoji: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
	],
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const multipleNodesAcrossLinesWithEmoji: ADFEntity = {
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
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const multilineWithEmoji: ADFEntity = {
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
											type: 'emoji',
											attrs: {
												shortName: ':grinning:',
												id: '1f600',
												text: '😀',
											},
										},
										{
											type: 'emoji',
											attrs: {
												shortName: ':grinning:',
												id: '1f600',
												text: '😀',
											},
										},
										{
											type: 'emoji',
											attrs: {
												shortName: ':grinning:',
												id: '1f600',
												text: '😀',
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
