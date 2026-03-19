export const exampleDocument: {
    version: number; type: string; content: ({
        type: string;
        attrs: {
            panelType: string;
            panelColor: string;
            panelIcon?: undefined;
        };
        content: {
            type: string;
            content: {
                type: string;
                text: string;
            }[];
        }[];
    } | {
        type: string;
        attrs: {
            panelType: string;
            panelIcon: string;
            panelColor?: undefined;
        };
        content: {
            type: string;
            content: {
                type: string;
                text: string;
            }[];
        }[];
    } | {
        type: string;
        attrs: {
            panelType: string;
            panelColor?: undefined;
            panelIcon?: undefined;
        };
        content: {
            type: string;
            content: ({
                type: string;
                text: string;
                marks?: undefined;
            } | {
                type: string;
                text: string;
                marks: {
                    type: string;
                    attrs: {
                        color: string;
                    };
                }[];
            })[];
        }[];
    } | {
        type: string;
        attrs: {
            panelType: string;
            panelColor: string;
            panelIcon: string;
        };
        content: {
            type: string;
            content: ({
                type: string;
                text: string;
                marks?: undefined;
            } | {
                type: string;
                text: string;
                marks: {
                    type: string;
                    attrs: {
                        color: string;
                    };
                }[];
            })[];
        }[];
    })[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'panel',
			attrs: {
				panelType: 'info',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'normal info panel',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'custom',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'custom - missing defaults',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'custom',
				panelColor: '#57D9A3',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'custom - only background',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'custom',
				panelIcon: ':wink:',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'custom - only emoji',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'custom',
				panelIcon: ':relieved:',
				panelColor: '#FFBDAD',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'hello full custom panel!',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'custom',
				panelIcon: ':rofl:',
				panelColor: '#B3F5FF',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'another hello full custom panel!',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'success',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'r',
						},
						{
							type: 'text',
							text: 'a',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#4c9aff',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'i',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#00b8d9',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'n',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#36b37e',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'b',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#ffc400',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'o',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#ff5630',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'w',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#6554c0',
									},
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'custom',
				panelColor: '#B3F5FF',
				panelIcon: ':rainbow:',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'r',
						},
						{
							type: 'text',
							text: 'a',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#4c9aff',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'i',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#00b8d9',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'n',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#36b37e',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'b',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#ffc400',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'o',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#ff5630',
									},
								},
							],
						},
						{
							type: 'text',
							text: 'w',
							marks: [
								{
									type: 'textColor',
									attrs: {
										color: '#6554c0',
									},
								},
							],
						},
					],
				},
			],
		},
	],
};
