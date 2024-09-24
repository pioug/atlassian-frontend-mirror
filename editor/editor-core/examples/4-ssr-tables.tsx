import React from 'react';

import { SSRSimulator } from '../example-helpers/ssr-simulator';

const adfDocument = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: '1e951ee0-dd20-40db-b7e4-83606224c63a',
				width: 1800,
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [1767],
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
								colwidth: [69],
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
								colwidth: [69],
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
								colwidth: [1767],
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
								colwidth: [69],
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
								colwidth: [69],
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
								colwidth: [1767],
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
								colwidth: [69],
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
								colwidth: [69],
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
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: '99f50f46-c7b6-466c-aa8f-5483e215997a',
				width: 760,
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
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
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
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
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
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
		{
			type: 'layoutSection',
			content: [
				{
					type: 'layoutColumn',
					attrs: {
						width: 50,
					},
					content: [
						{
							type: 'paragraph',
							content: [],
						},
					],
				},
				{
					type: 'layoutColumn',
					attrs: {
						width: 50,
					},
					content: [
						{
							type: 'table',
							attrs: {
								isNumberColumnEnabled: false,
								layout: 'default',
								localId: '160e0e64-2d41-4bf2-92e8-b35e8e946b4a',
								width: 760,
							},
							content: [
								{
									type: 'tableRow',
									content: [
										{
											type: 'tableHeader',
											attrs: {},
											content: [
												{
													type: 'paragraph',
													content: [],
												},
											],
										},
										{
											type: 'tableHeader',
											attrs: {},
											content: [
												{
													type: 'paragraph',
													content: [],
												},
											],
										},
										{
											type: 'tableHeader',
											attrs: {},
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
											attrs: {},
											content: [
												{
													type: 'paragraph',
													content: [],
												},
											],
										},
										{
											type: 'tableCell',
											attrs: {},
											content: [
												{
													type: 'paragraph',
													content: [],
												},
											],
										},
										{
											type: 'tableCell',
											attrs: {},
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
											attrs: {},
											content: [
												{
													type: 'paragraph',
													content: [],
												},
											],
										},
										{
											type: 'tableCell',
											attrs: {},
											content: [
												{
													type: 'paragraph',
													content: [],
												},
											],
										},
										{
											type: 'tableCell',
											attrs: {},
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
				},
			],
		},
	],
};

export default function SSRTableBasic() {
	return (
		<SSRSimulator
			name="SSR: Basic Tables Example"
			appearance="full-page"
			adf={adfDocument}
			props={{
				allowTables: {
					advanced: true,
					allowColumnResizing: true,
				},
				allowExpand: true,
				allowLayouts: true,
				allowBreakout: true,
			}}
			initialPluginConfiguration={{
				tablesPlugin: {
					tableResizingEnabled: true,
					// isTableScalingEnabled: true, // TODO: not sure why drigo had this
				},
			}}
			featureFlags={{
				platform_editor_breakout_use_css: true,
			}}
			experiments={{
				platform_editor_exp_lazy_node_views: true,
			}}
		/>
	);
}
