import { createExample } from '../example-helpers/createExample';

const AllNodesExample = createExample({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: {
				level: 1,
				localId: 'b4f3e2e3-5f4a-4f6d-8f4e-1c2e5d6a7b8c',
			},
			content: [
				{
					type: 'text',
					text: 'Hydrate ADF Example',
				},
			],
		},
		{
			type: 'taskList',
			attrs: {
				localId: '71f8c24d-4b69-48c4-9fa9-be30a8050158',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: '8a0fe9b4-f087-4079-90be-230c89902a30',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'items 1',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: 'dfbd3b3f-915e-45cc-8fdb-4dcf57a3bcbe',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'item 2',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: '543abf63-1883-4bbc-8a15-3dfeed52325d',
						state: 'TODO',
					},
					content: [
						{
							type: 'date',
							attrs: {
								timestamp: '1650499200000',
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
			type: 'bulletList',
			attrs: {
				localId: '12c103f9-b76d-4f1e-b961-a3936b2702de',
			},
			content: [
				{
					type: 'listItem',
					attrs: {
						localId: 'b1b3abf6-1db5-4a9a-bfaa-b6764c9f9112',
					},
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: '151acfae-ae82-4ef9-beeb-f88ec1c9894b',
							},
							content: [
								{
									type: 'text',
									text: 'Hello ',
								},
								{
									type: 'date',
									attrs: {
										timestamp: '1757635200000',
										localId: '55acf137-5d94-45d9-90b4-b723fa28c985',
									},
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					attrs: {
						localId: 'b1b3abf6-1db5-4a9a-bfaa-b6764c9f9112',
					},
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: '50501685-2dc4-4392-91bd-b128efcf9895',
							},
							content: [
								{
									type: 'mention',
									attrs: {
										id: '0',
										localId: '46c3bfd5-beea-4b0c-995c-046c1acc9d30',
										text: '',
										accessLevel: '',
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
		},
		{
			type: 'blockCard',
			attrs: {
				localId: 'c7f5005a-fea1-45ea-8f8d-c5b343c97b9e',
				url: 'https://google.com',
			},
		},
		{
			type: 'paragraph',
			attrs: {
				localId: '9fc1c384-5431-429e-80f8-c874e24f6533',
			},
			content: [
				{
					type: 'text',
					text: 'Elit duis quis minim. Et incididunt quis elit dolor cupidatat occaecat sunt ut quis aute. Enim esse non proident adipisicing et. Sit deserunt deserunt veniam commodo cupidatat labore tempor et non. Elit tempor ut voluptate et. Qui nostrud consectetur magna velit elit aliquip laboris magna ex qui sunt id. Ad Lorem ex ipsum officia incididunt aliqua fugiat enim elit in incididunt irure proident id nostrud. Incididunt fugiat proident pariatur dolor cupidatat sit. ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':trident:',
						id: '1f531',
						text: '🔱',
						localId: 'fdb75b26-aae0-4be8-9b2b-a4e778e0a2cd',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
			],
		},
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: 'd7a03990-a862-4bfd-ad17-b2e9f6a4ff2e',
				width: 760,
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								localId: '1e6b8676-4f0e-426b-a9a4-423d72123d24',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: '6b4e9510-f922-4ba7-bf81-f33465b7d367',
									},
									content: [
										{
											type: 'text',
											text: 'Col 1',
											marks: [
												{
													type: 'strong',
												},
											],
										},
									],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								localId: 'e10f2258-1d22-4f6d-b98a-b3880a1747e8',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: '3dc0dc33-e9ca-4638-ad47-338ca67895ae',
									},
									content: [
										{
											type: 'text',
											text: 'Col 2',
											marks: [
												{
													type: 'strong',
												},
											],
										},
									],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								localId: 'aa660cd1-e1d7-48e1-96cc-65e505c17cd5',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: 'a77ae3e3-240a-4a7a-a945-bd8b28adedbd',
									},
									content: [
										{
											type: 'text',
											text: 'Col 3',
											marks: [
												{
													type: 'strong',
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
							type: 'tableCell',
							attrs: {
								localId: '8f95d973-3224-48e9-988f-ad4505177f66',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: 'c2f4f7ff-f648-4a9a-839a-8453565fdd34',
									},
									content: [
										{
											type: 'text',
											text: '1',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								localId: 'a131fc8c-a5a7-45e1-8097-f6a9187e3b08',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: '03c17a33-b317-443d-ae7b-ae3198a5a396',
									},
									content: [
										{
											type: 'text',
											text: '3',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								localId: 'c3e4e6cb-ec68-4789-a172-f79e06fdec4a',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: '233cbe23-3a97-4fb2-adf6-a38ca8916b3a',
									},
									content: [
										{
											type: 'text',
											text: '3',
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
							type: 'tableCell',
							attrs: {
								localId: 'e0530369-06f8-4984-932d-2fb257bf9d8b',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: '108448ca-1b20-449e-bcb6-1919cf5b7153',
									},
									content: [
										{
											type: 'text',
											text: '4',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								localId: 'ffebed1c-357e-4432-be6b-3b7f79efc562',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: '54c11e58-63b2-4dc6-823a-96819e45293a',
									},
									content: [
										{
											type: 'text',
											text: '5',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								localId: '7f1ab7c1-f241-4788-a6c6-eddfb91a0fb3',
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										localId: '5ba7b61d-49e7-464a-a468-b57fb628815a',
									},
									content: [
										{
											type: 'text',
											text: '6',
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
			type: 'paragraph',
			attrs: {
				localId: 'e89b40f3-a58d-4b41-a4f3-38ff275aaeee',
			},
			content: [
				{
					type: 'text',
					text: 'Exercitation culpa dolore laboris est esse excepteur nisi cupidatat. Consectetur culpa occaecat qui proident laboris veniam do ex incididunt labore ut enim. Pariatur mollit sit eu laboris laboris reprehenderit anim labore dolore nostrud qui id quis eu et. Esse deserunt laborum laborum ut. Officia adipisicing qui proident commodo ex. Nulla cillum ea minim officia cillum voluptate sint consectetur culpa nostrud eu aliquip pariatur dolore nulla.',
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						localId: 'ded80750-25e1-4ecd-9aaa-65074b845afb',
						id: 'a47d3e72-58e9-43fa-b8bc-29613d2a17ff',
						alt: 'GiBxSz9bcAAJ0qF.jpeg',
						collection: 'MediaServicesSample',
						height: 2059,
						width: 1536,
					},
				},
			],
		},
		{
			type: 'paragraph',
			attrs: {
				localId: 'f9c037cf-0e43-410a-a486-b8853b02c5c1',
			},
			content: [
				{
					type: 'text',
					text: 'Sunt magna sit labore ea. Nulla aliquip dolor occaecat minim ex amet in officia exercitation. Occaecat enim ea Lorem amet laboris laboris aute dolor cillum sit excepteur ipsum. Ad dolore et ipsum non. Sint adipisicing consequat ea aliqua exercitation aliquip quis commodo adipisicing. Excepteur tempor excepteur ea nostrud exercitation laborum incididunt duis reprehenderit pariatur culpa proident.',
				},
			],
		},
		{
			type: 'expand',
			attrs: {
				title: '',
				localId: '68b6b5f5-4979-41fa-aa00-e07ff7653f60',
			},
			content: [
				{
					type: 'paragraph',
					attrs: {
						localId: '0c39b970-4eb6-4c7f-ad64-dc7eeb37260d',
					},
					content: [
						{
							type: 'text',
							text: 'Sunt magna sit labore ea. Nulla aliquip dolor occaecat minim ex amet in officia exercitation. Occaecat enim ea Lorem amet laboris laboris aute dolor cillum sit excepteur ipsum. Ad dolore et ipsum non. Sint adipisicing consequat ea aliqua exercitation aliquip quis commodo adipisicing. Excepteur tempor excepteur ea nostrud exercitation laborum incididunt duis reprehenderit pariatur culpa proident.',
						},
					],
				},
			],
			marks: [
				{
					type: 'breakout',
					attrs: {
						mode: 'wide',
						width: null,
					},
				},
			],
		},
		{
			type: 'codeBlock',
			attrs: {
				language: 'typescript',
				localId: 'bc950717-bb4f-4edb-9895-9025f8708ce6',
			},
			content: [
				{
					type: 'text',
					text: 'var a = 1;',
				},
			],
		},
		{
			type: 'embedCard',
			attrs: {
				url: 'https://www.loom.com/share/f884ee7e062843a3bb7acb8ad6cd9234',
				layout: 'align-end',
			},
		},
	],
});

export default AllNodesExample;
