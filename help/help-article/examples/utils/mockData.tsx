export const AdfDocument = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: "We're improving things!",
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'There are a ',
				},
				{
					type: 'text',
					marks: [
						{
							type: 'em',
						},
					],
					text: 'lot',
				},
				{
					type: 'text',
					text: ' of interesting items changing, a few ',
				},
				{
					type: 'text',
					marks: [
						{
							type: 'strong',
						},
					],
					text: 'breaking changes',
				},
				{
					type: 'text',
					text: '.',
				},
			],
		},
	],
};

export const AdfDocumentComplex = {
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
				{
					type: 'text',
					text: ' Look I can do ',
				},
				{
					type: 'text',
					text: 'italic ',
					marks: [
						{
							type: 'em',
						},
					],
				},
				{
					type: 'text',
					text: ', strong ',
					marks: [
						{
							type: 'em',
						},
						{
							type: 'strong',
						},
					],
				},
				{
					type: 'text',
					text: 'and underlined text!',
					marks: [
						{
							type: 'em',
						},
						{
							type: 'strong',
						},
						{
							type: 'underline',
						},
					],
				},
				{
					type: 'text',
					text: ' and action mark',
					marks: [
						{
							type: 'action',
							attrs: {
								key: 'test-action-key',
								title: 'test action mark',
								target: {
									receiver: 'some-receiver',
									key: 'some-key',
								},
								parameters: {
									test: 20,
								},
							},
						},
					],
				},
				{
					type: 'text',
					text: ' and invalid action mark',
					marks: [
						{
							type: 'action',
							attrs: {
								key: 'test-action-key',
								title: 'test action mark',
								target: {
									receiver: 'some-receiver',
								},
								parameters: {
									test: 30,
								},
							},
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'My favourite emoji are ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':grin:',
						id: '1f601',
						text: '😁',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':evilburns:',
						id: 'atlassian-evilburns',
						text: ':evilburns:',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':not-an-emoji:',
					},
				},
				{
					type: 'text',
					text: '. What are yours?',
					marks: [
						{
							type: 'unkown mark',
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'date',
					attrs: {
						timestamp: '1554163200000',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hi, my name is... My name is... My name is... My name is ',
				},
				{
					type: 'mention',
					attrs: {
						id: '1',
						text: '@Oscar Wallhult',
					},
				},
				{
					type: 'text',
					text: ' :D',
					marks: [
						{
							type: 'unknown mark',
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is a ',
				},
				{
					type: 'mention',
					attrs: {
						text: '@mention',
						id: '2',
					},
				},
				{
					type: 'text',
					text: '. And this is a broken ',
				},
				{
					type: 'mention',
					attrs: {
						textxtx: '@mention',
						id: 'mention',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Mention with restricted access',
				},
				{
					type: 'mention',
					attrs: {
						id: '1',
						accessLevel: 'APPLICATION',
					},
					text: '@oscar',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Mentions with generic ids',
				},
				{
					type: 'mention',
					attrs: {
						id: 'here',
						accessLevel: 'CONTAINER',
					},
					text: '@here',
				},
				{
					type: 'mention',
					attrs: {
						id: 'all',
						accessLevel: 'CONTAINER',
					},
					text: '@all',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is  a   text    with\tmultiple\t\tspaces \t\t\tand\t\t\t\ttabs.',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'italic',
					marks: [
						{
							type: 'em',
						},
					],
				},
				{
					type: 'text',
					text: 'link',
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
					text: 'strike-through',
					marks: [
						{
							type: 'strike',
						},
					],
				},
				{
					type: 'text',
					text: 'strong',
					marks: [
						{
							type: 'strong',
						},
					],
				},
				{
					type: 'text',
					text: 'sub',
					marks: [
						{
							type: 'subsup',
							attrs: {
								type: 'sub',
							},
						},
					],
				},
				{
					type: 'text',
					text: 'sup',
					marks: [
						{
							type: 'subsup',
							attrs: {
								type: 'sup',
							},
						},
					],
				},
				{
					type: 'text',
					text: 'underline',
					marks: [
						{
							type: 'underline',
						},
					],
				},
				{
					type: 'text',
					text: ' red text',
					marks: [
						{
							type: 'textColor',
							attrs: {
								color: '#ff0000',
							},
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'some inline code: ',
				},
				{
					type: 'text',
					text: 'const foo = bar();',
					marks: [
						{
							type: 'code',
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'unknown type',
					attrs: {
						text: 'fallback text in node.attrs.text',
					},
				},
				{
					type: 'hardBreak',
				},
				{
					type: 'unknown type 2',
					text: 'fallback text in node.text',
				},
				{
					type: 'hardBreak',
				},
				{
					type: 'very unknown',
				},
			],
		},
		{
			type: 'some block unknown type',
			content: [
				{
					type: 'text',
					text: 'This is text content inside unknown block',
				},
			],
		},
		{
			type: 'some block unknown type with content and text',
			content: [
				{
					type: 'text',
					text: 'This is also a piece of text inside unknown block',
				},
			],
			text: 'ERROR: This text should be ignored!',
		},
		{
			type: 'unknown_table',
			content: [
				{
					type: 'unknown_row2',
					content: [
						{
							type: 'unknown_cell',
							content: [
								{
									type: 'text',
									text: 'Madness?',
								},
							],
						},
					],
				},
				{
					type: 'unknown_row2',
					content: [
						{
							type: 'unknown_cell3',
							content: [
								{
									type: 'text',
									text: 'This is',
								},
							],
						},
						{
							type: 'unknown_cell4',
							content: [
								{
									type: 'sparta-node',
									attrs: {
										textUrl: 'https://en.wikipedia.org/wiki/Sparta',
									},
									text: 'Sparta!',
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is a line with ',
				},
				{
					type: 'hardBreak',
				},
				{
					type: 'text',
					text: 'a hardbreak in it.',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Showing a status: ',
				},
				{
					type: 'status',
					attrs: {
						text: 'In progress',
						color: 'blue',
					},
				},
			],
		},
		{
			type: 'paragraph',
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 1,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Paragraph with 1 level of indentation',
				},
			],
		},
		{
			type: 'paragraph',
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 2,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Paragraph with 2 levels of indentation',
				},
			],
		},
		{
			type: 'paragraph',
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 3,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Paragraph with 3 levels of indentation',
				},
			],
		},
		{
			type: 'paragraph',
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 4,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Paragraph with 4 levels of indentation',
				},
			],
		},
		{
			type: 'paragraph',
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 5,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Paragraph with 5 levels of indentation',
				},
			],
		},
		{
			type: 'paragraph',
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 6,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Paragraph with 6 levels of indentation',
				},
			],
		},
		{
			type: 'paragraph',
			marks: [
				{
					type: 'alignment',
					attrs: {
						align: 'center',
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Paragraph with center alignment',
				},
			],
		},
		{
			type: 'paragraph',
			marks: [
				{
					type: 'alignment',
					attrs: {
						align: 'end',
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Paragraph with end alignment',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 1,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 1',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 2,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 2',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'www.atlassian.com',
							},
						},
					],
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 3,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 3',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 4,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 4',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 5,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 5',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 6,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 6',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 1,
			},
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 1,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Heading 1 with 1 level of indentation',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 2,
			},
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 2,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Heading 2 with 2 levels of indentation',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'www.atlassian.com',
							},
						},
					],
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 3,
			},
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 3,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Heading 3 with 3 levels of indentation',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 4,
			},
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 4,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Heading 4 with 4 levels of indentation',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 5,
			},
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 5,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Heading 5 with 5 levels of indentation',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 6,
			},
			marks: [
				{
					type: 'indentation',
					attrs: {
						level: 6,
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Heading 6 with 6 levels of indentation',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 2,
			},
			marks: [
				{
					type: 'alignment',
					attrs: {
						align: 'center',
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Heading 2 with center alignment',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 3,
			},
			marks: [
				{
					type: 'alignment',
					attrs: {
						align: 'end',
					},
				},
			],
			content: [
				{
					type: 'text',
					text: 'Heading 3 with end alignment',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is a paragraph with a text node',
				},
				{
					type: 'text',
					text: '\n',
				},
				{
					type: 'text',
					text: 'that contains a new line',
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {
				layout: 'full-width',
			},
			content: [
				{
					type: 'media',
					attrs: {
						id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
						type: 'file',
						collection: 'MediaServicesSample',
						width: 5845,
						height: 1243,
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Click me! ',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'javascript:alert("hello world")',
							},
						},
					],
				},
				{
					type: 'text',
					text: 'www.atlassian.com',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'www.atlassian.com',
							},
						},
					],
				},
			],
		},
		{
			type: 'codeBlock',
			content: [
				{
					type: 'text',
					text: '// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);',
				},
				{
					type: 'text',
					text: '\nint count = map.forEach(new IntIntProcedure()\n{\n   int count;\n   public void apply(int key, int value)\n   {\n       if (value >= 5) count++;\n   }\n}).count;\nSystem.out.println("There are " + count + " values >= 5");',
				},
			],
			attrs: {
				language: 'javascript',
			},
		},
		{
			type: 'mediaSingle',
			attrs: {
				layout: 'full-width',
			},
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
						collection: 'MediaServicesSample',
						height: 200,
						width: 300,
					},
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {},
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: '3291050e-6b66-4296-94c6-12088ef6fbad',
						collection: 'MediaServicesSample',
						height: 200,
						width: 400,
					},
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {},
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: 'cdff20d6-2c0a-4d0d-b2a9-22cc728a0368',
						collection: 'MediaServicesSample',
						height: 200,
						width: 400,
					},
				},
			],
		},
		{
			type: 'mediaGroup',
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
						collection: 'MediaServicesSample',
					},
				},
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: '2afaf845-4385-431f-9a15-3e21520cf896',
						collection: 'MediaServicesSample',
					},
				},
			],
		},
		{
			type: 'mediaGroup',
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
						collection: 'MediaServicesSample',
					},
				},
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: '2dfcc12d-04d7-46e7-9fdf-3715ff00ba40',
						collection: 'MediaServicesSample',
					},
				},
			],
		},
		{
			type: 'mediaGroup',
			content: [
				{
					type: 'media',
					attrs: {
						type: 'link',
						id: '410f38f7-ce31-4527-a69d-740e958bf1d1',
						collection: 'MediaServicesSample',
					},
				},
			],
		},
		{
			type: 'mediaGroup',
			content: [
				{
					type: 'media',
					attrs: {
						type: 'link',
						id: '15a9fb95-2d72-4d28-b338-00fd6bea121b',
						collection: 'MediaServicesSample',
					},
				},
				{
					type: 'media',
					attrs: {
						type: 'link',
						id: '410f38f7-ce31-4527-a69d-740e958bf1d1',
						collection: 'MediaServicesSample',
					},
				},
			],
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'First list item',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Second list item',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Third list item',
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'codeBlock',
			marks: [
				{
					type: 'breakout',
					attrs: {
						mode: 'wide',
					},
				},
			],
			content: [
				{
					type: 'text',
					text: '// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);',
				},
			],
			attrs: {
				language: 'javascript',
			},
		},
		{
			type: 'orderedList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'First list item',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Second list item',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Third list item',
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'All that is gold does not glitter, not all those who wander are lost; The old that is strong does not wither, deep roots are not reached by the frost.',
						},
					],
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'From the ashes a fire shall be woken, a light from the shadows shall spring; Renewed shall be blade that was broken, the crownless again shall be king.',
						},
					],
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'J.R.R. Tolkien, The Fellowship of the Ring.',
							marks: [
								{
									type: 'em',
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
				panelType: 'info',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is an info panel with ',
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
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'note',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a note panel with ',
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
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'tip',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a tip panel with ',
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
							text: 'This is a success panel with ',
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
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'warning',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a warning panel with ',
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
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'error',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a error panel with ',
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
					],
				},
			],
		},
		{
			type: 'rule',
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Do not use this image node; it may be removed at any time without notice.',
				},
				{
					type: 'image',
					attrs: {
						src: 'https://www.google.com.au/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
						alt: 'Google Logo',
						title: 'Google!',
					},
				},
				{
					type: 'text',
					text: 'Do not use this image node; it may be removed at any time without notice.',
				},
			],
		},
		{
			type: 'decisionList',
			attrs: {
				localId: 'empty-list-should-not-render',
			},
			content: [
				{
					type: 'decisionItem',
					attrs: {
						localId: 'to-be-ignored-as-no-content',
						state: 'DECIDED',
					},
				},
			],
		},
		{
			type: 'taskList',
			attrs: {
				localId: '638aece7-97ac-4acd-99ee-4c76bebcd6ba',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'b5fc19b3-0742-4279-bccc-60ddd404a8e1',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'just text',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: 'c800bf19-e4dc-4e5b-9189-cc6673a4fe4c',
						state: 'TODO',
					},
					content: [
						{
							type: 'mention',
							attrs: {
								id: '0',
								text: '@Carolyn',
								accessLevel: '',
							},
						},
						{
							type: 'text',
							text: '  with mention',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: '9f523424-081b-4bb8-8031-e4450acce7de',
						state: 'TODO',
					},
					content: [
						{
							type: 'date',
							attrs: {
								timestamp: '1554422400000',
							},
						},
						{
							type: 'text',
							text: ' with date',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: 'f70222ac-4e36-41d4-a6df-ebe687a5e97f',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'with emoji ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':slight_smile:',
								id: '1f642',
								text: '🙂',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: '29295813-3065-4cae-b125-0b51ac1ba79b',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'multiline!',
						},
						{
							type: 'hardBreak',
						},
						{
							type: 'text',
							text: 'dfsfdad',
						},
					],
				},
			],
		},
		{
			type: 'taskList',
			attrs: {
				localId: 'e10bc6bd-ad20-426a-9d65-351907af90bf',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'fd7f6239-17c3-4bf9-89a0-51291ab8474f',
						state: 'DONE',
					},
					content: [
						{
							type: 'text',
							text: 'ticked off plain text',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: '22f227d1-6ff0-43da-8f76-9a57c5853a36',
						state: 'DONE',
					},
					content: [
						{
							type: 'mention',
							attrs: {
								id: '0',
								text: '@Carolyn',
								accessLevel: '',
							},
						},
						{
							type: 'text',
							text: ' ticked off mention',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: '815c9ab3-2393-4041-8c82-4dcc1a31343a',
						state: 'DONE',
					},
					content: [
						{
							type: 'date',
							attrs: {
								timestamp: '1554422400000',
							},
						},
						{
							type: 'text',
							text: ' ticked off date',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: '82f316ca-d334-4ea4-a377-400e687de75a',
						state: 'DONE',
					},
					content: [
						{
							type: 'text',
							text: 'with emoji ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':slight_smile:',
								id: '1f642',
								text: '🙂',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: 'ade6f17f-566b-422a-953d-50c00c63e2f1',
						state: 'DONE',
					},
					content: [
						{
							type: 'text',
							text: 'Multiline!',
						},
						{
							type: 'hardBreak',
						},
						{
							type: 'text',
							text: 'asd',
						},
					],
				},
			],
		},
		{
			type: 'decisionList',
			attrs: {
				localId: '68a15a03-12cd-4959-8502-67ba070a9cad',
			},
			content: [
				{
					type: 'decisionItem',
					attrs: {
						localId: '6dc81c6b-dbd6-460f-b54a-c9255815bcd5',
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: 'plain text',
						},
					],
				},
				{
					type: 'decisionItem',
					attrs: {
						localId: '52439c36-138d-4aa9-bac3-711dfed600dc',
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: 'all the stuff ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':slight_smile:',
								id: '1f642',
								text: '🙂',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'status',
							attrs: {
								text: 'todo',
								color: 'neutral',
								localId: 'd1b227fa-26ab-419a-84a0-2a580551f75e',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'date',
							attrs: {
								timestamp: '1554422400000',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'mention',
							attrs: {
								id: '0',
								text: '@Carolyn',
								accessLevel: '',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
					],
				},
				{
					type: 'decisionItem',
					attrs: {
						localId: '863bd5e3-dc32-426e-a5bb-d53dd8069117',
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: 'multiline!',
						},
						{
							type: 'hardBreak',
						},
						{
							type: 'text',
							text: 'asdf',
						},
					],
				},
			],
		},
		{
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colspan: 2,
								colwidth: [233, 100],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'header',
										},
									],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								background: '#deebff',
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'header',
										},
									],
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
							attrs: {
								colspan: 1,
								rowspan: 1,
								background: null,
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
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
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 1,
			},
			content: [
				{
					type: 'text',
					text: 'Media single without width defined',
				},
			],
		},
		{
			type: 'mediaSingle',
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
						collection: 'MediaServicesSample',
					},
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 1,
			},
			content: [
				{
					type: 'text',
					text: 'Media single with link',
				},
			],
		},
		{
			type: 'mediaSingle',
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
						collection: 'MediaServicesSample',
					},
				},
			],
			marks: [
				{
					type: 'link',
					attrs: {
						href: 'http://www.google.com',
					},
				},
			],
		},
		{
			type: 'bodiedExtension',
			attrs: {
				extensionType: 'com.atlassian.fabric',
				extensionKey: 'clock',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is the default content of the extension',
						},
					],
				},
			],
		},
		{
			type: 'layoutSection',
			content: [
				{
					type: 'layoutColumn',
					attrs: {
						width: 50,
					},
					content: [
						{
							type: 'table',
							attrs: {
								isNumberColumnEnabled: true,
								layout: 'default',
							},
							content: [
								{
									type: 'tableRow',
									content: [
										{
											type: 'tableHeader',
											attrs: {
												colwidth: [225],
												defaultMarks: [
													{
														type: 'strong',
													},
												],
											},
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'Extreme node nesting example',
															marks: [
																{
																	type: 'strong',
																},
															],
														},
													],
												},
											],
										},
										{
											type: 'tableHeader',
											attrs: {
												colwidth: [57],
												defaultMarks: [
													{
														type: 'strong',
													},
												],
											},
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
											attrs: {
												colwidth: [225],
											},
											content: [
												{
													type: 'taskList',
													attrs: {
														localId: '68350926-57a5-42f6-9683-9305def1183f',
													},
													content: [
														{
															type: 'taskItem',
															attrs: {
																localId: '02b53fa4-8c20-478e-bb6b-fe0ea8920ba0',
																state: 'TODO',
															},
															content: [
																{
																	type: 'mention',
																	attrs: {
																		id: '0',
																		text: '@Carolyn',
																		accessLevel: '',
																	},
																},
																{
																	type: 'text',
																	text: ' ',
																},
																{
																	type: 'date',
																	attrs: {
																		timestamp: '1554249600000',
																	},
																},
																{
																	type: 'text',
																	text: ' ',
																},
																{
																	type: 'emoji',
																	attrs: {
																		shortName: ':slight_smile:',
																		id: '1f642',
																		text: '🙂',
																	},
																},
																{
																	type: 'text',
																	text: ' ',
																},
																{
																	type: 'text',
																	text: 'bold ',
																	marks: [
																		{
																			type: 'em',
																		},
																		{
																			type: 'strong',
																		},
																		{
																			type: 'underline',
																		},
																	],
																},
																{
																	type: 'text',
																	text: "FAB-1520 UI: Poor man's search",
																	marks: [
																		{
																			type: 'link',
																			attrs: {
																				href: 'https://product-fabric.atlassian.net/browse/FAB-1520',
																			},
																		},
																		{
																			type: 'em',
																		},
																		{
																			type: 'strong',
																		},
																		{
																			type: 'underline',
																		},
																	],
																},
															],
														},
													],
												},
											],
										},
										{
											type: 'tableCell',
											attrs: {
												colwidth: [57],
											},
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
											attrs: {
												colwidth: [225],
											},
											content: [
												{
													type: 'panel',
													attrs: {
														panelType: 'info',
													},
													content: [
														{
															type: 'orderedList',
															content: [
																{
																	type: 'listItem',
																	content: [
																		{
																			type: 'paragraph',
																			content: [
																				{
																					type: 'text',
																					text: 'a',
																				},
																			],
																		},
																	],
																},
																{
																	type: 'listItem',
																	content: [
																		{
																			type: 'paragraph',
																			content: [
																				{
																					type: 'text',
																					text: 'b',
																				},
																			],
																		},
																	],
																},
																{
																	type: 'listItem',
																	content: [
																		{
																			type: 'paragraph',
																			content: [
																				{
																					type: 'text',
																					text: 'c',
																				},
																			],
																		},
																		{
																			type: 'orderedList',
																			content: [
																				{
																					type: 'listItem',
																					content: [
																						{
																							type: 'paragraph',
																							content: [
																								{
																									type: 'text',
																									text: 'd',
																								},
																							],
																						},
																					],
																				},
																				{
																					type: 'listItem',
																					content: [
																						{
																							type: 'paragraph',
																							content: [
																								{
																									type: 'text',
																									text: 'e',
																								},
																							],
																						},
																					],
																				},
																				{
																					type: 'listItem',
																					content: [
																						{
																							type: 'paragraph',
																							content: [
																								{
																									type: 'text',
																									text: 'g',
																								},
																							],
																						},
																					],
																				},
																				{
																					type: 'listItem',
																					content: [
																						{
																							type: 'paragraph',
																							content: [
																								{
																									type: 'mention',
																									attrs: {
																										id: '0',
																										text: '@Carolyn',
																										accessLevel: '',
																									},
																								},
																								{
																									type: 'text',
																									text: ' ',
																								},
																								{
																									type: 'date',
																									attrs: {
																										timestamp: '1554422400000',
																									},
																								},
																								{
																									type: 'text',
																									text: ' ',
																								},
																							],
																						},
																					],
																				},
																			],
																		},
																	],
																},
															],
														},
													],
												},
											],
										},
										{
											type: 'tableCell',
											attrs: {
												colwidth: [57],
											},
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
				},
				{
					type: 'layoutColumn',
					attrs: {
						width: 50,
					},
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
};
