export const exampleHubDoc = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			attrs: {
				localId: null,
			},
		},
		{
			type: 'multiBodiedExtension',
			attrs: {
				extensionKey: 'mbe-section',
				extensionType: 'com.atlassian.mbe.section',
				parameters: {
					extensionTitle: 'MBE Section',
					backgroundColor: 'lightblue',
				},
				text: null,
				layout: 'full-width',
				localId: 'a8c460db-d287-4903-a4cf-de7231f4b62d',
			},
			content: [
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: null,
							},
							content: [
								{
									type: 'text',
									text: 'This is the MBE Section macro, a multiBodiedExtension with a bodied override that allows for the Editor to be accessible within the bodied frame without the navigation component. Try editing the Section body and add other extensions.',
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
				localId: null,
			},
		},
		{
			type: 'paragraph',
			attrs: {
				localId: null,
			},
		},
		{
			type: 'multiBodiedExtension',
			attrs: {
				extensionKey: 'fake_tabs.com:fakeTabNode',
				extensionType: 'com.atlassian.confluence.',
				parameters: {
					activeTabIndex: 0,
					backgroundColor: 'white',
					extensionTitle: 'Fake Tabs',
					macroMetadata: {
						placeholder: [
							{
								data: {
									url: '',
								},
								type: 'icon',
							},
						],
					},
					macroParams: {},
				},
				text: null,
				layout: 'full-width',
				localId: '0cddabbc-d641-4b90-8253-77b54f307b9a',
			},
			content: [
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: null,
							},
							content: [
								{
									type: 'text',
									text: 'This is a Fake Tabs macro, a multiBodiedExtension without bodied override. Try adding more tabs and corresponding bodies will appear so you can add even more content.',
								},
							],
						},
						{
							type: 'extension',
							attrs: {
								extensionKey: 'jql-table',
								extensionType: 'com.atlassian.confluence.macro.core',
								parameters: {
									macroMetadata: {
										placeholder: [
											{
												data: {
													url: '',
												},
												type: 'icon',
											},
										],
									},
									macroParams: {},
								},
								text: 'JQL table block extension demo',
								layout: 'default',
								localId: 'b1e1b5b4-62b3-47f5-accf-728cc97b5c91',
							},
						},
					],
				},
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: null,
							},
						},
					],
				},
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: null,
							},
						},
					],
				},
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: null,
							},
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			attrs: {
				localId: null,
			},
		},
		{
			type: 'paragraph',
			attrs: {
				localId: null,
			},
		},
	],
};
