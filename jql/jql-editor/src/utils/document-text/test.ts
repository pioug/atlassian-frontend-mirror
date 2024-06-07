import { Fragment } from '@atlaskit/editor-prosemirror/model';

import { JQLEditorSchema } from '../../schema';

import { getFragmentText } from './index';

const empty = {
	represents: '',
	fragment: [{ type: 'paragraph' }],
};

const simple = {
	represents: 'issuetype = bug',
	fragment: [{ type: 'paragraph', content: [{ type: 'text', text: 'issuetype = bug' }] }],
};

const simpleWithTokenMarks = {
	represents: 'issuetype = bug',
	fragment: [
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
};

const simpleWithNewLine = {
	represents: 'issuetype = bug\n',
	fragment: [
		{ type: 'paragraph', content: [{ type: 'text', text: 'issuetype = bug' }] },
		{ type: 'paragraph' },
	],
};

const simpleWithMultipleNewLines = {
	represents: 'issuetype = bug\n\n\n',
	fragment: [
		{ type: 'paragraph', content: [{ type: 'text', text: 'issuetype = bug' }] },
		{ type: 'paragraph' },
		{ type: 'paragraph' },
		{ type: 'paragraph' },
	],
};

const complicatedWithMultipleNewLines = {
	represents: 'issuetype = bug\n\n\nand status = open',
	fragment: [
		{ type: 'paragraph', content: [{ type: 'text', text: 'issuetype = bug' }] },
		{ type: 'paragraph' },
		{ type: 'paragraph' },
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'and status = open' }],
		},
	],
};

const complicatedWithMultipleNewLinesAndTokenMarks = {
	represents: 'issuetype = bug\n\n\nand status = open',
	fragment: [
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
};

const testCases = {
	empty,
	simple,
	simpleWithTokenMarks,
	simpleWithNewLine,
	simpleWithMultipleNewLines,
	complicatedWithMultipleNewLines,
	complicatedWithMultipleNewLinesAndTokenMarks,
};

describe('getFragmentText', () => {
	for (const key in testCases) {
		it(`calculates the correct text for test case: ${key}`, () => {
			// @ts-ignore
			const testCase = testCases[key];
			const fragment = Fragment.fromJSON(JQLEditorSchema, testCase.fragment);
			expect(getFragmentText(fragment, 0, fragment.size)).toEqual(testCase.represents);
		});
	}
});
