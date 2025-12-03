import { createExample } from '../example-helpers/createExample';

const CodeBlocksExample = createExample({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is an example document with text and code blocks.',
				},
			],
		},
		{
			type: 'codeBlock',
			attrs: {
				language: 'javascript',
			},
			content: [
				{
					type: 'text',
					text: "const greeting = 'Hello, World!';\nconsole.log(greeting);",
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Here is another example with Python code:',
				},
			],
		},
		{
			type: 'codeBlock',
			attrs: {
				language: 'python',
			},
			content: [
				{
					type: 'text',
					text: "def hello():\n    print('Hello, World!')\n\nhello()",
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'And a final paragraph of text.',
				},
			],
		},
	],
});

export default CodeBlocksExample;
