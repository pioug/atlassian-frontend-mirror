import type { DocNode } from '@atlaskit/adf-schema';

export const mediaSingleInBlockquoteADF: () => DocNode = () => ({
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
					type: 'mediaSingle',
					attrs: {
						layout: 'center',
					},
					content: [
						{
							type: 'media',
							attrs: {
								url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSI4MDAiIGhlaWdodD0iNjMwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDE4NmFiIi8+PHRleHQgeD0iNDAwIiB5PSIzMTUiIGZvbnQtc2l6ZT0iMjAiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+ODAweDYzMDwvdGV4dD48L3N2Zz4=',
								type: 'external',
								width: 1024,
								height: 683,
							},
						},
					],
				},
				{
					type: 'mediaSingle',
					attrs: {
						width: 33.33333333333333,
						layout: 'align-start',
					},
					content: [
						{
							type: 'media',
							attrs: {
								url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIj4gPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iZ3JleSIvPiAgPHRleHQgeD0iMCIgeT0iMjAiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJzdGFydCIgZmlsbD0id2hpdGUiPjMyMHgyNDA8L3RleHQ+IDwvc3ZnPg==',
								type: 'external',
								width: 1604,
								height: 1868,
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
					text: 'Some text after...',
				},
			],
		},
	],
});

export const mediaGroupInBlockquoteADF: () => DocNode = () => ({
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
					type: 'mediaGroup',
					content: [
						{
							type: 'media',
							attrs: {
								url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
								type: 'external',
							},
						},
						{
							type: 'media',
							attrs: {
								url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
								type: 'external',
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
					text: 'Some text after...',
				},
			],
		},
	],
});

export const mediaGroupDownloadableInBlockquoteADF: () => DocNode = () => ({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'blockquote',
			content: [
				{
					type: 'mediaGroup',
					content: [
						{
							type: 'media',
							attrs: {
								type: 'file',
								id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
								collection: 'MediaServicesSample',
							},
						},
					],
				},
			],
		},
	],
});
