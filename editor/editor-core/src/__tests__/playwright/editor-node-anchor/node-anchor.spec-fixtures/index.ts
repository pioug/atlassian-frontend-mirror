export const adfWithParagraph: {
    version: number;
    type: string;
    content: {
        type: string;
        content: {
            type: string;
            text: string;
        }[];
    }[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is a paragraph with a node anchor.',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is another paragraph.',
				},
			],
		},
	],
};
