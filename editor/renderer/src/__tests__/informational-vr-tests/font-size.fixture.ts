import type { DocNode } from '@atlaskit/adf-schema';
import { PanelType } from '@atlaskit/adf-schema/schema';

import { generateRendererComponent } from '../__helpers/rendererComponents';

const smallTextInNestedBlocksAdf: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Small text inside panel',
				},
			],
		},
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
							type: 'text',
							text: 'Small text inside panel should not have extra top margin',
						},
					],
					marks: [
						{
							type: 'fontSize',
							attrs: {
								fontSize: 'small',
							},
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Small text inside list item',
				},
			],
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Small text inside list item should not have extra top margin',
								},
							],
							marks: [
								{
									type: 'fontSize',
									attrs: {
										fontSize: 'small',
									},
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Small text inside table cell',
				},
			],
		},
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Small text inside table cell should not have extra top margin',
										},
									],
									marks: [
										{
											type: 'fontSize',
											attrs: {
												fontSize: 'small',
											},
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};

export const SmallTextInNestedBlocksRenderer = generateRendererComponent({
	document: smallTextInNestedBlocksAdf,
	appearance: 'full-page',
});
