export const connectedExtensionADF = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: "Trying to delete the below extension will result in a confirmation dialog, because it's being used as a data source for the extension at the bottom",
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'localId: a, b',
				},
			],
		},
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.forge',
				extensionKey: 'awesome:question',
				parameters: {},
				layout: 'default',
				localId: 'b3722e23-c05f-4ff6-9df5-10f6cd934741',
			},
			marks: [
				{
					type: 'fragment',
					attrs: {
						localId: 'b',
						name: 'Test Name 1',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'The below extension ⌄⌄⌄ contains a dataConsumer and is linked to the above extension ^b^ ',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'localId: c, d ',
				},
			],
		},
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.forge',
				extensionKey: 'awesome:question',
				parameters: {},
				layout: 'default',
				localId: 'ac2fe29f-7a2e-4f6c-9a92-f062c1ab9de4',
			},
			marks: [
				{
					type: 'fragment',
					attrs: {
						localId: 'd',
						name: 'Test Name 2',
					},
				},
				{
					type: 'dataConsumer',
					attrs: {
						sources: ['b'],
					},
				},
			],
		},
	],
};
export const infoPanelADF = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'panel',
			attrs: {
				panelType: 'info',
			},
			content: [
				{
					type: 'paragraph',
					content: [],
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};
export const listWithCodeBlockADF = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'codeBlock',
							attrs: {
								language: 'javascript',
							},
						},
					],
				},
			],
		},
	],
};
