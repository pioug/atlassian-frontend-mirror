import type { DocNode } from '@atlaskit/adf-schema';

export const emojiADF: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: {
				level: 1,
			},
			content: [
				{
					type: 'text',
					text: 'heading 1 ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 2,
			},
			content: [
				{
					type: 'text',
					text: 'heading 2 ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 3,
			},
			content: [
				{
					type: 'text',
					text: 'heading 3 ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 4,
			},
			content: [
				{
					type: 'text',
					text: 'heading 4 ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 5,
			},
			content: [
				{
					type: 'text',
					text: 'heading 5 ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 6,
			},
			content: [
				{
					type: 'text',
					text: 'heading 6 ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
		{
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'blockquote ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':grinning:',
								id: '1f600',
								text: '😀',
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
					text: 'paragraph ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
			],
		},
	],
};
