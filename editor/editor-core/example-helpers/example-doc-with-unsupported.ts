export const exampleDocument: {
    type: string; version: number; content: {
        type: string;
        content: ({
            type: string;
            text: string;
            marks?: undefined;
        } | {
            type: string;
            text: string;
            marks: ({
                type: string;
                attrs?: undefined;
            } | {
                type: string;
                attrs: {
                    href: string;
                };
            })[];
        })[];
    }[];
} = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hello, ',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://www.atlassian.com',
							},
						},
					],
				},
				{
					type: 'text',
					text: 'World!',
					marks: [
						{
							type: 'strong',
						},
						{
							type: 'link',
							attrs: {
								href: 'https://www.atlassian.com',
							},
						},
					],
				},
			],
		},
		{
			type: 'unknownTypeNode',
			content: [
				{
					type: 'text',
					text: 'This is unknown block node',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Another example ',
				},
				{
					type: 'unknownTypeInline',
					text: 'World!',
					marks: [
						{
							type: 'strong',
						},
						{
							type: 'link',
							attrs: {
								href: 'https://www.atlassian.com',
							},
						},
					],
				},
			],
		},
	],
};
