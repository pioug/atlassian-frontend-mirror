import type { DocNode } from '@atlaskit/adf-schema';

export const blockExtensionWithParagraphAboveNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://inlineCardTestUrl',
					},
				},
			],
		},
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'block-eh',
				parameters: {},
				text: 'Block extension demo',
				layout: 'default',
				localId: '49298318-0fcf-4a64-9ca7-c6f5c90be121',
			},
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export const blockExtensionWithSmartLinkAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://inlineCardTestUrl',
					},
				},
			],
		},
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'block-eh',
				parameters: {},
				text: 'Block extension demo',
				layout: 'default',
				localId: '49298318-0fcf-4a64-9ca7-c6f5c90be121',
			},
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export const bodiedExtensionWithParagraphAboveNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello!',
				},
			],
		},
		{
			type: 'bodiedExtension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'bodied-eh',
				parameters: {},
				layout: 'default',
				localId: 'testId',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Hello world!',
						},
					],
				},
			],
		},
	],
};

export const bodiedExtensionWithSmartLinkAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://inlineCardTestUrl',
					},
				},
			],
		},
		{
			type: 'bodiedExtension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'bodied-eh',
				parameters: {},
				layout: 'default',
				localId: 'testId',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Hello world!',
						},
					],
				},
			],
		},
	],
};

export const inlineExtensionCenterAlignedAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello!',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'inline-eh',
						text: 'Inline extension demo',
						localId: 'a08ec99d-835d-4cfa-8c7f-9114ec265738',
					},
				},
			],
			marks: [
				{
					type: 'alignment',
					attrs: {
						align: 'center',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'goodbye!',
				},
			],
		},
	],
};

export const inlineExtensionRightAlignedAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello!',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'inline-eh',
						text: 'Inline extension demo',
						localId: 'a08ec99d-835d-4cfa-8c7f-9114ec265738',
					},
				},
			],
			marks: [
				{
					type: 'alignment',
					attrs: {
						align: 'end',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'goodbye!',
				},
			],
		},
	],
};

export const inlineExtensionWithParagraphAboveAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello!',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'inline-eh',
						parameters: {},
						text: 'Inline extension demo',
						localId: 'f91538c8-3ad1-4c05-8036-4159986fff7e',
					},
				},
			],
		},
	],
};

export const inlineExtensionWithSmartlinkAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://inlineCardTestUrl',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'inline-eh',
						parameters: {},
						text: 'Inline extension demo',
						localId: 'd35b4db7-5461-4c28-b591-738478b2ba8a',
					},
				},
			],
		},
	],
};

export const bodiedExtensionWithLayoutElement: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'bodiedExtension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'bodied-eh',
				parameters: {},
				layout: 'default',
				localId: 'testId',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Hello world!',
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
							type: 'paragraph',
							content: [],
						},
					],
				},
			],
		},
	],
};

export const blockExtensionWithLayoutElement: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'block-eh',
				parameters: {},
				text: 'Block extension demo',
				layout: 'default',
				localId: 'ff266732-1a05-4ce8-9056-8728b5480ca9',
			},
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
							type: 'paragraph',
							content: [],
						},
					],
				},
			],
		},
	],
};
