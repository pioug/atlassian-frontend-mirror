export const exampleDocument = {
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
				panelColor: '#34eb6e',
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
				panelColor: '#f7bada',
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
				panelColor: '#baf7ef',
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
				panelColor: '#baf7ef',
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
