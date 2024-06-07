import { Node } from '@atlaskit/editor-prosemirror/model';

import { JQLEditorSchema } from '../../../schema';

import getDocumentPosition from './index';

const empty = {
	represents: '',
	// 0 chars + 1 block node
	expectedDocPos: 1,
	doc: {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
			},
		],
	},
};

const simple = {
	represents: 'issuetype = bug',
	// 15 chars + 1 block node
	expectedDocPos: 16,
	doc: {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [{ type: 'text', text: 'issuetype = bug' }],
			},
		],
	},
};

const simpleWithTokenMarks = {
	represents: 'issuetype = bug',
	// 15 chars + 1 block node
	expectedDocPos: 16,
	doc: {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'field' } }],
						text: 'issuetype',
					},
					{ type: 'text', text: ' ' },
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'operator' } }],
						text: '=',
					},
					{ type: 'text', text: ' ' },
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'operand' } }],
						text: 'bug',
					},
				],
			},
		],
	},
};

const simpleWithNewLine = {
	represents: 'issuetype = bug\n',
	// 15 chars + 2 block enter + 1 block exit
	expectedDocPos: 18,
	doc: {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [{ type: 'text', text: 'issuetype = bug' }],
			},
			{ type: 'paragraph' },
		],
	},
};

const simpleWithMultipleNewLines = {
	represents: 'issuetype = bug\n\n\n',
	// 15 chars + 4 block enter + 3 block exit
	expectedDocPos: 22,
	doc: {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [{ type: 'text', text: 'issuetype = bug' }],
			},
			{ type: 'paragraph' },
			{ type: 'paragraph' },
			{ type: 'paragraph' },
		],
	},
};

const complicatedWithMultipleNewLines = {
	represents: 'issuetype = bug\n\n\nand status = open',
	// 32 chars + 4 block enter + 3 block exit
	expectedDocPos: 39,
	doc: {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [{ type: 'text', text: 'issuetype = bug' }],
			},
			{ type: 'paragraph' },
			{ type: 'paragraph' },
			{
				type: 'paragraph',
				content: [{ type: 'text', text: 'and status = open' }],
			},
		],
	},
};

const complicatedWithMultipleNewLinesAndTokenMarks = {
	represents: 'issuetype = bug\n\n\nand status = open',
	// 32 chars + 4 block enter + 3 block exit
	expectedDocPos: 39,
	doc: {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'field' } }],
						text: 'issuetype',
					},
					{ type: 'text', text: ' ' },
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'operator' } }],
						text: '=',
					},
					{ type: 'text', text: ' ' },
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'operand' } }],
						text: 'bug',
					},
				],
			},
			{ type: 'paragraph' },
			{ type: 'paragraph' },
			{
				type: 'paragraph',
				content: [
					{ type: 'text', text: 'and ' },
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'field' } }],
						text: 'status',
					},
					{ type: 'text', text: ' ' },
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'operator' } }],
						text: '=',
					},
					{ type: 'text', text: ' ' },
					{
						type: 'text',
						marks: [{ type: 'token', attrs: { tokenType: 'operand' } }],
						text: 'open',
					},
				],
			},
		],
	},
};

const richInlineNodeDocument = {
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					marks: [
						{
							type: 'token',
							attrs: {
								tokenType: 'field',
							},
						},
					],
					text: 'assignee',
				},
				{
					type: 'text',
					text: ' ',
				},
				{
					type: 'text',
					marks: [
						{
							type: 'token',
							attrs: {
								tokenType: 'operator',
							},
						},
					],
					text: '=',
				},
				{
					type: 'text',
					text: ' ',
				},
				{
					type: 'user',
					attrs: {
						id: 'rjuedbergtlfrde',
						name: 'Cristian Casais',
						fieldName: 'assignee',
					},
					content: [
						{
							type: 'text',
							marks: [
								{
									type: 'token',
									attrs: {
										tokenType: 'operand',
									},
								},
							],
							text: 'rjuedbergtlfrde',
						},
					],
					marks: [
						{
							type: 'token',
							attrs: {
								tokenType: 'operand',
							},
						},
					],
				},
			],
		},
	],
};

const richInlineNodeStart = {
	represents: 'assignee = rjuedbergtlfrde',
	// Right before the operand, i.e. assignee = |rjuedbergtlfrde
	textPos: 11,
	// 11 chars + paragraph block enter
	expectedDocPos: 12,
	doc: richInlineNodeDocument,
};

const richInlineNodeEnd = {
	represents: 'assignee = rjuedbergtlfrde',
	// Right after the operand, i.e. assignee = rjuedbergtlfrde|
	textPos: 26,
	// 26 chars + paragraph block enter + node view enter + node view exit
	expectedDocPos: 29,
	doc: richInlineNodeDocument,
};

const testCases = {
	empty,
	simple,
	simpleWithTokenMarks,
	simpleWithNewLine,
	simpleWithMultipleNewLines,
	complicatedWithMultipleNewLines,
	complicatedWithMultipleNewLinesAndTokenMarks,
	richInlineNodeStart,
	richInlineNodeEnd,
};

describe('getDocumentPosition', () => {
	for (const key in testCases) {
		it(`calculates the correct document position for test case: ${key}`, () => {
			// @ts-ignore
			const testCase = testCases[key];
			const textPosition = testCase.textPos ?? testCase.represents.length;
			const doc = Node.fromJSON(JQLEditorSchema, testCase.doc);
			expect(getDocumentPosition(doc, textPosition)).toEqual(testCase.expectedDocPos);
		});
	}
});
