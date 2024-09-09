// For platform_editor_element_level_templates experiment only
// clean up ticket ED-24873
export const discussionNotes = (tableWidth: number) => [
	{
		type: 'panel',
		attrs: {
			panelType: 'custom',
			panelIcon: ':bulb:',
			panelIconId: '1f4a1',
			panelIconText: '💡',
			panelColor: '#E6FCFF',
		},
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'Use ',
					},
					{
						type: 'text',
						text: 'Discussion notes ',
						marks: [
							{
								type: 'strong',
							},
						],
					},
					{
						type: 'text',
						text: 'to capture meeting items, ',
					},
					{
						type: 'text',
						text: 'assign owners',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Mention',
								},
							},
						],
					},
					{
						type: 'text',
						text: ', and track ',
					},
					{
						type: 'text',
						text: 'actions',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Action-items',
								},
							},
						],
					},
					{
						type: 'text',
						text: ' and ',
					},
					{
						type: 'text',
						text: 'decisions',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Decision',
								},
							},
						],
					},
					{
						type: 'text',
						text: '.',
					},
				],
			},
		],
	},
	{
		type: 'table',
		attrs: {
			isNumberColumnEnabled: false,
			layout: 'default',
			localId: 'f0f0bb2f-e350-4056-8c9c-e16ba3c9d958',
			width: tableWidth,
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
								content: [
									{
										type: 'text',
										text: 'Date',
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
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Item',
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
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Owner',
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
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Notes',
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
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Relevant Links',
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
								content: [
									{
										type: 'date',
										attrs: {
											timestamp: '1723161600000',
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
								content: [
									{
										type: 'text',
										text: '@someone ',
									},
								],
							},
						],
					},
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'taskList',
								attrs: {
									localId: 'ae66ca64-9c5c-4343-aef9-293d1c2c29f2',
								},
								content: [
									{
										type: 'taskItem',
										attrs: {
											localId: 'dfcf2a4e-aafb-45c2-a399-978054532d05',
											state: 'TODO',
										},
										content: [
											{
												type: 'text',
												text: 'Action',
											},
										],
									},
								],
							},
							{
								type: 'decisionList',
								attrs: {
									localId: '6d34898c-bc27-4256-b759-6de6d5b68547',
								},
								content: [
									{
										type: 'decisionItem',
										attrs: {
											localId: '933d720c-c625-4309-b055-d6e1fcdcdcad',
											state: 'DECIDED',
										},
									},
								],
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
];

export const approvalsTracker = (tableWidth: number) => [
	{
		type: 'panel',
		attrs: {
			panelType: 'custom',
			panelIcon: ':bulb:',
			panelIconId: '1f4a1',
			panelIconText: '💡',
			panelColor: '#E6FCFF',
		},
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'Use ',
					},
					{
						type: 'text',
						text: 'Approvals tracker',
						marks: [
							{
								type: 'strong',
							},
						],
					},
					{
						type: 'text',
						text: ' to track ',
					},
					{
						type: 'text',
						text: 'reviewers',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Mention',
								},
							},
						],
					},
					{
						type: 'text',
						text: ', ',
					},
					{
						type: 'text',
						text: 'approvals',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Action-items',
								},
							},
						],
					},
					{
						type: 'text',
						text: ', ',
					},
					{
						type: 'text',
						text: 'dates',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Date',
								},
							},
						],
					},
					{
						type: 'text',
						text: ', and comments.',
					},
				],
			},
		],
	},
	{
		type: 'table',
		attrs: {
			isNumberColumnEnabled: false,
			layout: 'default',
			localId: '27805aee-7df7-4b41-96a7-6572763007fa',
			width: tableWidth,
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
								content: [
									{
										type: 'text',
										text: 'Reviewer',
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
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Approval',
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
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Comments',
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
								content: [
									{
										type: 'text',
										text: '@someone ',
									},
								],
							},
						],
					},
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'taskList',
								attrs: {
									localId: 'c79f45e3-8859-4bd9-8b15-78d03f287f51',
								},
								content: [
									{
										type: 'taskItem',
										attrs: {
											localId: 'a044d7fa-35ae-4241-9ce7-f74458f4f320',
											state: 'TODO',
										},
										content: [
											{
												type: 'text',
												text: 'Approve ',
											},
											{
												type: 'date',
												attrs: {
													timestamp: '1723161600000',
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
			{
				type: 'tableRow',
				content: [
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: '@someone ',
									},
								],
							},
						],
					},
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'taskList',
								attrs: {
									localId: 'f7630d43-4082-4a2d-b9a7-69a793ab36a3',
								},
								content: [
									{
										type: 'taskItem',
										attrs: {
											localId: 'f319f074-e348-453b-b978-53c7b4bac38f',
											state: 'TODO',
										},
										content: [
											{
												type: 'text',
												text: 'Approve ',
											},
											{
												type: 'date',
												attrs: {
													timestamp: '1723161600000',
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
			{
				type: 'tableRow',
				content: [
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: '@someone ',
									},
								],
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
];

export const decisionMatrix = (tableWidth: number) => [
	{
		type: 'panel',
		attrs: {
			panelType: 'custom',
			panelIcon: ':bulb:',
			panelIconId: '1f4a1',
			panelIconText: '💡',
			panelColor: '#E6FCFF',
		},
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'Use ',
					},
					{
						type: 'text',
						text: 'Decision matrix',
						marks: [
							{
								type: 'strong',
							},
						],
					},
					{
						type: 'text',
						text: ' to outline pros, cons, and ',
					},
					{
						type: 'text',
						text: 'recommended options',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Status',
								},
							},
						],
					},
					{
						type: 'text',
						text: '.',
					},
				],
			},
		],
	},
	{
		type: 'table',
		attrs: {
			isNumberColumnEnabled: false,
			layout: 'default',
			localId: '3eac8266-8d44-410c-b54a-59f9b834ba12',
			width: tableWidth,
		},
		content: [
			{
				type: 'tableRow',
				content: [
					{
						type: 'tableHeader',
						attrs: {
							background: 'var(--ds-background-accent-gray-subtlest, #F4F5F7)',
						},
						content: [
							{
								type: 'paragraph',
								content: [],
								marks: [
									{
										type: 'alignment',
										attrs: {
											align: 'center',
										},
									},
								],
							},
						],
					},
					{
						type: 'tableHeader',
						attrs: {
							background: 'var(--ds-background-accent-gray-subtlest, #F4F5F7)',
						},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Option 1 ',
										marks: [
											{
												type: 'strong',
											},
										],
									},
									{
										type: 'status',
										attrs: {
											text: 'RECOMMENDED',
											color: 'green',
											localId: 'e46fa792-2824-41a6-ae3a-d1f88d833157',
											style: 'bold',
										},
									},
								],
								marks: [
									{
										type: 'alignment',
										attrs: {
											align: 'center',
										},
									},
								],
							},
						],
					},
					{
						type: 'tableHeader',
						attrs: {
							background: 'var(--ds-background-accent-gray-subtlest, #F4F5F7)',
						},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Option 2',
										marks: [
											{
												type: 'strong',
											},
										],
									},
								],
								marks: [
									{
										type: 'alignment',
										attrs: {
											align: 'center',
										},
									},
								],
							},
						],
					},
					{
						type: 'tableHeader',
						attrs: {
							background: 'var(--ds-background-accent-gray-subtlest, #F4F5F7)',
						},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Option 3',
										marks: [
											{
												type: 'strong',
											},
										],
									},
								],
								marks: [
									{
										type: 'alignment',
										attrs: {
											align: 'center',
										},
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
						type: 'tableHeader',
						attrs: {
							background: 'var(--ds-background-accent-gray-subtlest, #F4F5F7)',
						},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Name',
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
			{
				type: 'tableRow',
				content: [
					{
						type: 'tableHeader',
						attrs: {
							background: 'var(--ds-background-accent-gray-subtlest, #F4F5F7)',
						},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Description',
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
			{
				type: 'tableRow',
				content: [
					{
						type: 'tableHeader',
						attrs: {
							background: '#abf5d1',
						},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Pros',
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
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'emoji',
										attrs: {
											shortName: ':white_check_mark:',
											id: '2705',
											text: '✅',
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
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'emoji',
										attrs: {
											shortName: ':white_check_mark:',
											id: '2705',
											text: '✅',
										},
									},
								],
							},
						],
					},
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'emoji',
										attrs: {
											shortName: ':white_check_mark:',
											id: '2705',
											text: '✅',
										},
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
						type: 'tableHeader',
						attrs: {
							background: '#ffbdad',
						},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Cons',
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
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'emoji',
										attrs: {
											shortName: ':no_entry:',
											id: '26d4',
											text: '⛔',
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
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'emoji',
										attrs: {
											shortName: ':no_entry:',
											id: '26d4',
											text: '⛔',
										},
									},
								],
							},
						],
					},
					{
						type: 'tableCell',
						attrs: {},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'emoji',
										attrs: {
											shortName: ':no_entry:',
											id: '26d4',
											text: '⛔',
										},
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
		type: 'paragraph',
		content: [],
	},
];

export const actionList = [
	{
		type: 'panel',
		attrs: {
			panelType: 'custom',
			panelIcon: ':bulb:',
			panelIconId: '1f4a1',
			panelIconText: '💡',
			panelColor: '#E6FCFF',
		},
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'Use ',
					},
					{
						type: 'text',
						text: 'List of actions',
						marks: [
							{
								type: 'strong',
							},
						],
					},
					{
						type: 'text',
						text: ' to manage a ',
					},
					{
						type: 'text',
						text: 'checklist of tasks',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Action-items',
								},
							},
						],
					},
					{
						type: 'text',
						text: ', assign ',
					},
					{
						type: 'text',
						text: 'team members',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Mention',
								},
							},
						],
					},
					{
						type: 'text',
						text: ', and set ',
					},
					{
						type: 'text',
						text: 'due dates',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Date',
								},
							},
						],
					},
					{
						type: 'text',
						text: '.',
					},
				],
			},
		],
	},
	{
		type: 'taskList',
		attrs: {
			localId: '036fd61e-b145-4c65-8ded-1234a992c4bd',
		},
		content: [
			{
				type: 'taskItem',
				attrs: {
					localId: '41ca73c3-8fb0-4c31-9758-fce4938d3660',
					state: 'TODO',
				},
				content: [
					{
						type: 'text',
						text: 'Action | @someone | due ',
					},
					{
						type: 'date',
						attrs: {
							timestamp: '1738281600000',
						},
					},
				],
			},
			{
				type: 'taskItem',
				attrs: {
					localId: 'b861ab12-f131-4e64-ae34-9f9df36ca5d1',
					state: 'TODO',
				},
				content: [
					{
						type: 'text',
						text: 'Action | @someone | due ',
					},
					{
						type: 'date',
						attrs: {
							timestamp: '1722556800000',
						},
					},
				],
			},
			{
				type: 'taskItem',
				attrs: {
					localId: 'ede3bdce-2a49-40a4-9f1b-c7d14ad30014',
					state: 'TODO',
				},
				content: [
					{
						type: 'text',
						text: 'Action | @someone | due ',
					},
					{
						type: 'date',
						attrs: {
							timestamp: '1722211200000',
						},
					},
				],
			},
			{
				type: 'taskItem',
				attrs: {
					localId: '5af5e453-d89f-412f-9ff1-8e74bd36dd05',
					state: 'TODO',
				},
				content: [
					{
						type: 'text',
						text: 'Action | @someone | due ',
					},
					{
						type: 'date',
						attrs: {
							timestamp: '1745971200000',
						},
					},
				],
			},
		],
	},
];

export const instructionsOutline = [
	{
		type: 'panel',
		attrs: {
			panelType: 'custom',
			panelIcon: ':bulb:',
			panelIconId: '1f4a1',
			panelIconText: '💡',
			panelColor: '#E6FCFF',
		},
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'Use ',
					},
					{
						type: 'text',
						text: 'Step by step instructions ',
						marks: [
							{
								type: 'strong',
							},
						],
					},
					{
						type: 'text',
						text: 'to create layouts for images, ',
					},
					{
						type: 'text',
						text: 'panels',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Panel',
								},
							},
						],
					},
					{
						type: 'text',
						text: ', and further details in ',
					},
					{
						type: 'text',
						text: 'expandable sections',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://support.atlassian.com/confluence-cloud/docs/insert-elements-into-a-page/#Expand',
								},
							},
						],
					},
					{
						type: 'text',
						text: '.',
					},
				],
			},
		],
	},
	{
		type: 'orderedList',
		attrs: {
			order: 1,
		},
		content: [
			{
				type: 'listItem',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Step 1',
							},
						],
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
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Image',
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
						content: [
							{
								type: 'text',
								text: 'Description',
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
						text: "Highlight important information in a panel like this one. To edit this panel's color or style, select one of the options in the menu.",
					},
				],
			},
		],
	},
	{
		type: 'expand',
		attrs: {
			title: 'Further details',
		},
		content: [
			{
				type: 'paragraph',
				content: [],
			},
		],
	},
	{
		type: 'paragraph',
		content: [],
	},
	{
		type: 'orderedList',
		attrs: {
			order: 2,
		},
		content: [
			{
				type: 'listItem',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Step 2',
							},
						],
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
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Image',
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
						content: [
							{
								type: 'text',
								text: 'Description',
							},
						],
					},
				],
			},
		],
	},
];
