import { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

import { clipboardTextParser, clipboardTextSerializer } from './index';

const testCases = [
	'',
	'issuetype = bug',
	'\n\n\nissuetype = bug\n\n\n',
	'   issuetype = bug    ',
	'issuetype = bug\n',
	'issuetype = bug\n\n\n',
	'issuetype = bug\n\n\nand status = open',
];

describe('clipboard text serializer and parser', () => {
	for (const index in testCases) {
		it(`should parse to PM Slice and be serialised back to text: Case ${index}`, () => {
			const testCase = testCases[index];
			// @ts-ignore incorrect constructor type definition
			const pos = new ResolvedPos(0, [], 0);
			const slice = clipboardTextParser(testCase, pos);
			expect(clipboardTextSerializer(slice)).toEqual(testCase);
		});
	}
});
