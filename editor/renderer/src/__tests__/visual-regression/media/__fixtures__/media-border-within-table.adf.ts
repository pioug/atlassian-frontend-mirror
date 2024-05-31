import type { DocNode } from '@atlaskit/adf-schema';

export const borderADFWithinTable: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Without Links',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'mediaSingle',
									attrs: {
										layout: 'center',
									},
									content: [
										{
											type: 'media',
											attrs: {
												url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
												type: 'external',
											},
											marks: [
												{
													type: 'border',
													attrs: {
														color: '#BF2600',
														size: 3,
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
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'With Links',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'mediaSingle',
									attrs: {
										layout: 'center',
									},
									content: [
										{
											type: 'media',
											attrs: {
												url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
												type: 'external',
											},
											marks: [
												{
													type: 'link',
													attrs: {
														href: 'https://gnu.org',
													},
												},
												{
													type: 'border',
													attrs: {
														color: '#BF2600',
														size: 3,
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
		},
	],
};
