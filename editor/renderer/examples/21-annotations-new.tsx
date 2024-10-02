import React from 'react';
import { AnnotationMarkStates, type DocNode } from '@atlaskit/adf-schema';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

import { RendererWithAnnotationsAndBodiedExtensions } from './reference-renderer-annotation-provider/RendererWithAnnotationsAndBodiedExtensions';

export default function Example() {
	return (
		<SmartCardProvider client={new CardClient('stg')}>
			<RendererWithAnnotationsAndBodiedExtensions
				initialDoc={exampleDocumentWithComments as DocNode}
				initialData={initialData}
			/>
		</SmartCardProvider>
	);
}

const initialData = {
	'12e213d7-badd-4c2a-881e-f5d6b9af3752': {
		state: AnnotationMarkStates.ACTIVE,
		comments: ['demo comment 1'],
	},
	'13272b41-b9a9-427a-bd58-c00766999638': {
		state: AnnotationMarkStates.RESOLVED,
		comments: ['demo comment 2'],
	},
	'7053c566-db75-4605-b6b2-eca6a0cedff1': {
		state: AnnotationMarkStates.RESOLVED,
		comments: ['demo comment 3'],
	},
	'7053c566-db75-4605-b6b2-eca6a0cedff2': {
		state: AnnotationMarkStates.RESOLVED,
		comments: ['demo comment 4'],
	},
	'965e2ef6-722b-479d-995a-e63fb5511dd3': {
		state: AnnotationMarkStates.RESOLVED,
		comments: ['demo comment 5'],
	},
	'53500c44-4f1e-41eb-b215-9ccfaaa79397': {
		state: AnnotationMarkStates.ACTIVE,
		comments: ['demo comment 6'],
	},
};

const exampleDocumentWithComments = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'It has UNRESOLVED annonations ' },
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://pug.jira-dev.com/wiki/spaces/CE/blog/2017/08/18/3105751050/A+better+REST+API+for+Confluence+Cloud+via+Swagger',
					},
				},
				{ type: 'text', text: ' across ranges' },
			],
		},
		{
			type: 'bodiedExtension',
			attrs: {
				extensionKey: 'bodied-eh',
				extensionType: 'com.atlassian.confluence.macro.core',
				parameters: {
					macroParams: {},
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
				},
				layout: 'default',
				localId: 'testId',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'this is an example bodied extension',
						},
					],
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Second line with ',
						},
						{
							type: 'text',
							text: 'annotation',
							marks: [
								{
									type: 'annotation',
									attrs: {
										annotationType: 'inlineComment',
										id: '53500c44-4f1e-41eb-b215-9ccfaaa79397',
									},
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'this ' },
				{
					type: 'emoji',
					attrs: { shortName: ':blue_star:', id: 'atlassian-blue_star', text: ':blue_star:' },
				},
				{ type: 'text', text: ' ' },
				{
					type: 'emoji',
					attrs: { shortName: ':green_star:', id: 'atlassian-green_star', text: ':green_star:' },
				},
				{ type: 'text', text: ' is a test ' },
				{
					type: 'date',
					attrs: { timestamp: '1717632000000' },
				},
				{ type: 'text', text: ' document' },
				{ type: 'date', attrs: { timestamp: '1717632000000' } },
				{ type: 'date', attrs: { timestamp: '1717632000000' } },
				{ type: 'text', text: '.' },
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'this ' },
				{
					type: 'status',
					attrs: { text: 'demo', color: 'neutral', localId: 'fake', style: '' },
				},
				{
					type: 'status',
					attrs: { text: 'demo', color: 'neutral', localId: 'fake1', style: '' },
				},
				{
					type: 'text',
					text: ' is a test ',
				},
				{
					type: 'status',
					attrs: { text: 'demo', color: 'neutral', localId: 'fake2', style: '' },
				},
				{
					type: 'text',
					text: ' document',
				},
				{
					type: 'status',
					attrs: { text: 'demo', color: 'neutral', localId: 'faker', style: '' },
				},
				{ type: 'date', attrs: { timestamp: '1717632000000' } },
				{ type: 'text', text: '.' },
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'this ' },
				{
					type: 'mention',
					attrs: { id: '11', text: '@Elaine Mattia', accessLevel: '', localId: 'menid' },
				},
				{
					type: 'mention',
					attrs: { id: '11', text: '@Elaine Mattia', accessLevel: '', localId: 'menid1' },
				},
				{
					type: 'text',
					text: '  is a test ',
				},
				{
					type: 'mention',
					attrs: { id: '11', text: '@Elaine Mattia', accessLevel: '', localId: 'menid2' },
				},
				{ type: 'text', text: ' document' },
				{
					type: 'status',
					attrs: { text: 'demo', color: 'neutral', localId: 'menid3', style: '' },
				},
				{ type: 'date', attrs: { timestamp: '1717632000000' } },
				{
					type: 'mention',
					attrs: { id: '11', text: '@Elaine Mattia', accessLevel: '', localId: 'menid5' },
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'It has UNRESOLVED annonations ',
					marks: [
						{
							type: 'strong',
						},
						{
							type: 'annotation',
							attrs: {
								id: '12e213d7-badd-4c2a-881e-f5d6b9af3752',
								annotationType: 'inlineComment',
							},
						},
					],
				},
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://pug.jira-dev.com/wiki/spaces/CE/blog/2017/08/18/3105751050/A+better+REST+API+for+Confluence+Cloud+via+Swagger',
					},
					marks: [
						// {
						// 	type: 'annotation',
						// 	attrs: {
						// 		id: '12e213d7-badd-4c2a-881e-f5d6b9af3752',
						// 		annotationType: 'inlineComment',
						// 	},
						// },
					],
				},
				{
					type: 'text',
					text: ' across ranges',
					marks: [
						{
							type: 'strong',
						},
						// {
						// 	type: 'annotation',
						// 	attrs: {
						// 		id: '12e213d7-badd-4c2a-881e-f5d6b9af3752',
						// 		annotationType: 'inlineComment',
						// 	},
						// },
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'It doesn’t has annotations',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hello ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				},
				{
					type: 'text',
					text: ' emojis ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':smiley:',
						id: '1f603',
						text: '😃',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'World ',
				},
				{
					type: 'text',
					text: 'inline code',
					marks: [
						{
							type: 'code',
						},
					],
				},
			],
		},
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: 'c70d5afe-5df0-43ff-83e8-aa8cf49f0de4',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Inside a table',
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
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
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
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
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
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
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
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Text on Doc',
				},
			],
		},
		{
			type: 'codeBlock',
			attrs: {},
			content: [
				{
					type: 'text',
					text: 'text inside a code block',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'The below Media contains an annotation mark on the media node',
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {
				layout: 'center',
				width: 760,
				widthType: 'pixel',
			},
			content: [
				{
					type: 'media',
					marks: [
						// {
						// 	type: 'annotation',
						// 	attrs: {
						// 		annotationType: 'inlineComment',
						// 		id: '7053c566-db75-4605-b6b2-eca6a0cedff1',
						// 	},
						// },
						{
							type: 'border',
							attrs: {
								size: 2,
								color: '#172b4d',
							},
						},
					],
					attrs: {
						url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
						type: 'external',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'The below Media contains an annotation mark on the mediaSingle node',
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {
				layout: 'center',
				width: 760,
				widthType: 'pixel',
			},
			marks: [
				// {
				// 	type: 'annotation',
				// 	attrs: {
				// 		annotationType: 'inlineComment',
				// 		id: '7053c566-db75-4605-b6b2-eca6a0cedff2',
				// 	},
				// },
			],
			content: [
				{
					type: 'media',
					attrs: {
						url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
						type: 'external',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'The below node contain external media with just an annotation on the media node ',
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {
				layout: 'center',
				width: 760,
				widthType: 'pixel',
			},
			content: [
				{
					type: 'media',
					marks: [
						// {
						// 	type: 'annotation',
						// 	attrs: {
						// 		annotationType: 'inlineComment',
						// 		id: '7053c566-db75-4605-b6b2-eca6a0cedff1',
						// 	},
						// },
					],
					attrs: {
						url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
						type: 'external',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'The below Media contains an annotation mark on the file media node (which will always be loading) and on the caption',
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {
				layout: 'center',
				width: 334,
				widthType: 'pixel',
			},
			content: [
				{
					type: 'media',
					attrs: {
						width: 334,
						alt: 'Screenshot 2024-02-23 at 1.14.43 PM.png',
						id: '1de76526-ecf0-489d-9641-17532579f086',
						collection: 'contentId-26738692',
						type: 'file',
						height: 188,
					},
					marks: [
						// {
						// 	type: 'annotation',
						// 	attrs: {
						// 		annotationType: 'inlineComment',
						// 		id: '965e2ef6-722b-479d-995a-e63fb5511dd3',
						// 	},
						// },
					],
				},
				{
					type: 'caption',
					content: [
						{
							text: 'This is a ',
							type: 'text',
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
					text: 'End.',
				},
			],
		},
	],
};
