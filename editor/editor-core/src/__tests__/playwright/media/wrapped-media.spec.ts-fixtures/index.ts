export const adfMediaSingle = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: {
				width: null,
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
						occurrenceKey: null,
						alt: 'test',
						width: 500,
						height: 374,
					},
				},
			],
		},
	],
};

export const wrappedMediaInsideTable = {
	version: 1,
	type: 'doc',
	content: [
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
							type: 'tableHeader',
							attrs: {
								colwidth: [382],
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
								colwidth: [122],
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
								colwidth: [253],
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
								colwidth: [382],
							},
							content: [
								{
									type: 'mediaSingle',
									attrs: {
										width: 15,
										layout: 'wrap-left',
									},
									content: [
										{
											type: 'media',
											attrs: {
												id: 'a559980d-cd47-43e2-8377-27359fcb905f',
												type: 'file',
												collection: 'MediaServicesSample',
												width: 840,
												height: 980,
											},
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
												id: 'a559980d-cd47-43e2-8377-27359fcb905f',
												type: 'file',
												collection: 'MediaServicesSample',
												width: 1024,
												height: 683,
											},
										},
									],
								},
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [122],
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
								colwidth: [253],
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
								colwidth: [382],
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
								colwidth: [122],
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
								colwidth: [253],
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
