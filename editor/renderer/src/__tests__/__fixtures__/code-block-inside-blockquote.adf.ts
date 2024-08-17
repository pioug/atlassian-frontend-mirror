import type { DocNode } from '@atlaskit/adf-schema';

export const codeBlockInBlockquoteADF: () => DocNode = () => ({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Some text before...',
				},
			],
		},
		{
			type: 'blockquote',
			content: [
				{
					type: 'codeBlock',
					attrs: {
						language: 'typescript',
					},
					content: [
						{
							type: 'text',
							text: 'console.log("Hello World");\n\nreturn;',
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
					text: 'Some text after...',
				},
			],
		},
	],
});

export const codeBlockOverflowInBlockquoteADF: () => DocNode = () => ({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Some text before...',
				},
			],
		},
		{
			type: 'blockquote',
			content: [
				{
					type: 'codeBlock',
					attrs: {
						language: 'typescript',
					},
					content: [
						{
							type: 'text',
							text: 'console.log("Hello World");\n\nif (something) {\n  console.log("Lorem ipsum odor amet, consectetuer adipiscing elit. Nisl elementum curae semper pulvinar fermentum scelerisque. Pharetra praesent ornare dolor dis, facilisi eleifend tempus.")\n  return false;\n}',
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
					text: 'Some text after...',
				},
			],
		},
	],
});
