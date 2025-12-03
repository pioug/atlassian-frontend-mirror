import { createExample } from '../example-helpers/createExample';

const TextExample = createExample({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is the first paragraph with ',
				},
				{
					type: 'text',
					text: 'bold text',
					marks: [
						{
							type: 'strong',
						},
					],
				},
				{
					type: 'text',
					text: '.',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is the second paragraph where ',
				},
				{
					type: 'text',
					text: 'some words',
					marks: [
						{
							type: 'strong',
						},
					],
				},
				{
					type: 'text',
					text: ' are bolded.',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This third paragraph contains only regular text.',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Here is a paragraph where ',
				},
				{
					type: 'text',
					text: 'most of the text',
					marks: [
						{
							type: 'strong',
						},
					],
				},
				{
					type: 'text',
					text: ' is bolded.',
				},
			],
		},
	],
});

export default TextExample;
