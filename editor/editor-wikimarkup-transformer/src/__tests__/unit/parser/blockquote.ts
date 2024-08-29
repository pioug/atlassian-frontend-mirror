import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - blockquote', () => {
	const testCases: Array<[string, string]> = [
		['[CS-607] should not need a whitespace', 'bq.this is a blockquote node'],
		['Blockquote', '{quote}This is a great quote!{quote}'],
		['Blockquote with nested codeblock', "bq.{code:javascript}pls don't put code in quotes{code}"],
		[
			'Blockquote macro with nested codeblock',
			"{quote}{code:javascript}pls don't put code in quotes{code}{quote}",
		],
		['Blockquote with nested mediaSingle', 'bq.!abc-1|width=200,height=183,alt="Hello world"!'],
		[
			'Blockquote macro with nested mediaSingle',
			'{quote}!abc-1|width=200,height=183,alt="Hello world"!{quote}',
		],
		['Blockquote with nested mediaGroup', 'bq.[^file1.txt] [^file2.txt]{quote}'],
		['Blockquote macro with nested mediaGroup', '{quote}[^file1.txt] [^file2.txt]{quote}'],
	];

	for (const [testCaseDescription, markup] of testCases) {
		it(testCaseDescription, () => {
			const transformer = new WikiMarkupTransformer();
			expect(transformer.parse(markup)).toMatchSnapshot();
		});
	}
});
