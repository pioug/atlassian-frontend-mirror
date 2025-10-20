import { PanelType, AnnotationTypes, type DocNode } from '@atlaskit/adf-schema';

export const layoutAndMediaAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'bodiedSyncBlock',
			attrs: {
				resourceId: 'sourceId/f80a4690-8aee-45ef-a9a0-ea910c284fab',
				localId: 'f80a4690-8aee-45ef-a9a0-ea910c284fab',
			},
			content: [
				{
					type: 'layoutSection',
					attrs: {
						localId: 'a810c209-9f2d-4ec5-b63f-3858119a41ba',
					},
					content: [
						{
							type: 'layoutColumn',
							attrs: {
								width: 33.33,
								localId: '3c5454ab-c6fe-47e9-bddf-71adfc87bc54',
							},
							content: [
								{
									type: 'panel',
									attrs: {
										panelType: PanelType.INFO,
										localId: '7aab015c-9ca7-4c33-b44f-81fe119b1e47',
									},
									content: [
										{
											type: 'paragraph',
											attrs: {
												localId: 'c472da81-bb8f-41cd-80c3-2d09206cccf9',
											},
											content: [
												{
													type: 'text',
													text: 'some ',
												},
												{
													type: 'text',
													text: 'text',
													marks: [
														{
															type: 'annotation',
															attrs: {
																id: 'inline-comment-1d58999a-f617-4ae9-99c4-ad81dc2b8be7',
																annotationType: AnnotationTypes.INLINE_COMMENT,
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
						{
							type: 'layoutColumn',
							attrs: {
								width: 33.33,
								localId: '90bfacf3-c412-4582-97d5-7aff81692926',
							},
							content: [
								{
									type: 'panel',
									attrs: {
										panelType: PanelType.CUSTOM,
										panelIcon: ':rainbow:',
										panelIconId: '1f308',
										panelIconText: '🌈',
										panelColor: '#E6FCFF',
										localId: '370b0ac9-a448-4b76-a9ef-54269b07e053',
									},
									content: [
										{
											type: 'paragraph',
											attrs: {
												localId: '97d1fc25-8e5a-44ce-822c-ecc6a71b8d82',
											},
											content: [],
										},
									],
								},
							],
						},
						{
							type: 'layoutColumn',
							attrs: {
								width: 33.33,
								localId: '2524a906-1826-4a1d-9690-13337b1f05f2',
							},
							content: [
								{
									type: 'expand',
									attrs: {
										title: '',
										localId: 'c1040c39-efb3-4a3e-a153-8b83e8a97f53',
									},
									content: [
										{
											type: 'paragraph',
											attrs: {
												localId: 'cea254de-5b2b-433f-b3ee-802ce229d82e',
											},
											content: [],
										},
									],
								},
							],
						},
					],
				},
				{
					type: 'mediaSingle',
					attrs: {
						layout: 'center',
						width: 320,
						widthType: 'pixel',
					},
					content: [
						{
							type: 'media',
							attrs: {
								type: 'file',
								localId: '7d279360-c20d-449c-bc28-c44ca16138a0',
								id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
								collection: 'MediaServicesSample',
							},
						},
					],
				},
				{
					type: 'paragraph',
					attrs: {
						localId: 'cf052efa-73b9-4ed5-bd18-4f538519df7c',
					},
					content: [],
				},
			],
		},
		{
			type: 'paragraph',
			attrs: {
				localId: '0d3ab22b-cfeb-43e2-b986-b69384e171ee',
			},
			content: [],
		},
	],
};
