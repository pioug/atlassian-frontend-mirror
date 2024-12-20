import { DocNode, PanelType } from '@atlaskit/adf-schema';

export const statusInPanelAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.INFO,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'status',
							attrs: {
								text: 'hello',
								color: 'blue',
								localId: 'a1ac68d1-5cca-423f-9887-b0977d73772c',
								style: '',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.SUCCESS,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'status',
							attrs: {
								text: 'hello',
								color: 'green',
								localId: '9c86b5db-42a1-41d3-9183-3ee1f337dd73',
								style: '',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.NOTE,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'status',
							attrs: {
								text: 'hello',
								color: 'purple',
								localId: '3d7ede38-7719-40c5-a66e-a4bd0154582e',
								style: '',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.WARNING,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'status',
							attrs: {
								text: 'hello',
								color: 'yellow',
								localId: 'd44f4b9e-820a-413b-8ab4-1694c98b85cf',
								style: '',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.ERROR,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'status',
							attrs: {
								text: 'hello',
								color: 'red',
								localId: '0811eaac-a01b-4803-8ca4-e685dfc5ce28',
								style: '',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.CUSTOM,
				panelColor: '#F4F5F7',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'status',
							attrs: {
								text: 'hello',
								color: 'neutral',
								localId: 'e25041cf-eda9-48b8-8abf-52a752a05390',
								style: '',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
			],
		},
	],
};
