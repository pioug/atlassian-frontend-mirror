export const twoDatesAdf: {
    version: number; type: string; content: {
        type: string;
        content: ({
            type: string;
            attrs: {
                timestamp: string;
            };
            text?: undefined;
        } | {
            type: string;
            text: string;
            attrs?: undefined;
        })[];
    }[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'date',
					attrs: {
						timestamp: '1701734400000',
					},
				},
				{
					type: 'text',
					text: '',
				},
				{
					type: 'date',
					attrs: {
						timestamp: '1701820800000',
					},
				},
				{
					type: 'text',
					text: '',
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export const tableAdf: {
    version: number; type: string; content: {
        type: string;
        attrs: {
            isNumberColumnEnabled: boolean;
            layout: string;
            localId: string;
        };
        content: {
            type: string;
            content: {
                type: string;
                attrs: {};
                content: {
                    type: string;
                    content: never[];
                }[];
            }[];
        }[];
    }[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: '1030dece-a85b-4e66-809c-0c796e483c0b',
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
			],
		},
	],
};
