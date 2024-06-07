import {
	alert,
	arrows,
	bug,
	handshake,
	hotdog,
	lightning,
	mike,
	nidhin,
	rocket,
	sasha,
} from '../../images';

export const hydrateJqlStandardResponse = {
	data: {
		jira: {
			jqlBuilder: {
				hydrateJqlQuery: {
					fields: [
						{
							jqlTerm: 'type',
							values: [
								{
									values: [
										{
											displayName: 'Category',
											jqlTerm: 'Category',
											issueTypes: [
												{
													avatar: {
														small: alert,
													},
												},
											],
										},
									],
								},
								{
									values: [
										{
											displayName: '!disturbed',
											jqlTerm: '"!disturbed"',
											issueTypes: [
												{
													avatar: {
														small: arrows,
													},
												},
												{
													avatar: {
														small: bug,
													},
												},
											],
										},
									],
								},
							],
						},
						{
							jqlTerm: 'project',
							values: [
								{
									values: [
										{
											displayName: '(Deprecated) Koopa Troopas',
											jqlTerm: '"(Deprecated) Koopa Troopas"',
											project: {
												avatar: {
													small: hotdog,
												},
											},
										},
									],
								},
							],
						},
						{
							jqlTerm: 'assignee',
							values: [
								{
									values: [
										{
											displayName: 'Nidhin Joseph',
											jqlTerm: '70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
											user: {
												picture: nidhin,
											},
											isSquare: false,
										},
									],
								},
							],
						},
						{
							jqlTerm: 'status',
							values: [
								{
									values: [
										{
											displayName: 'Done',
											jqlTerm: 'Done',
											statusCategory: {
												colorName: 'GREEN',
											},
										},
									],
								},
							],
						},
					],
				},
			},
		},
	},
};

export const hydrateJqlStandardResponseForVRTesting = {
	data: {
		jira: {
			jqlBuilder: {
				hydrateJqlQuery: {
					fields: [
						{
							jqlTerm: 'type',
							values: [
								{
									values: [
										{
											displayName: 'Category',
											jqlTerm: 'Category',
											issueTypes: [
												{
													avatar: {
														small: alert,
													},
												},
											],
										},
									],
								},
								{
									values: [
										{
											displayName: '!disturbed',
											jqlTerm: '"!disturbed"',
											issueTypes: [
												{
													avatar: {
														small: arrows,
													},
												},
												{
													avatar: {
														small: bug,
													},
												},
											],
										},
									],
								},
							],
						},
						{
							jqlTerm: 'project',
							values: [
								{
									values: [
										{
											jqlTerm: '"My IT TEST"',
											displayName: 'My IT TEST',
											project: {
												avatar: {
													small: handshake,
												},
											},
										},
									],
								},
								{
									values: [
										{
											jqlTerm: 'Test',
											displayName: 'Test',
											project: {
												avatar: {
													small: hotdog,
												},
											},
										},
									],
								},
							],
						},
						{
							jqlTerm: 'assignee',
							values: [
								{
									values: [
										{
											displayName: 'Nidhin Joseph',
											jqlTerm: '70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
											user: {
												picture: nidhin,
											},
											isSquare: false,
										},
									],
								},
							],
						},
						{
							jqlTerm: 'status',
							values: [
								{
									values: [
										{
											displayName: 'Done',
											jqlTerm: 'Done',
											statusCategory: {
												colorName: 'GREEN',
											},
										},
									],
								},
								{
									values: [
										{
											displayName: 'Done',
											jqlTerm: 'Done',
											statusCategory: {
												colorName: 'GREEN',
											},
										},
									],
								},
							],
						},
					],
				},
			},
		},
	},
};

export const hydrateJqlStandardResponseMapped = {
	type: [
		{
			icon: alert,
			label: 'Category',
			optionType: 'iconLabel',
			value: 'Category',
		},
		{
			icon: arrows,
			label: '!disturbed',
			optionType: 'iconLabel',
			value: '!disturbed',
		},
	],
	project: [
		{
			icon: hotdog,
			label: '(Deprecated) Koopa Troopas',
			optionType: 'iconLabel',
			value: '(Deprecated) Koopa Troopas',
		},
	],
	assignee: [
		{
			avatar: nidhin,
			isSquare: false,
			label: 'Nidhin Joseph',
			optionType: 'avatarLabel',
			value: '70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
		},
	],
	status: [
		{
			appearance: 'success',
			label: 'Done',
			optionType: 'lozengeLabel',
			value: 'Done',
		},
	],
};

export const hydrateJqlEmptyResponse = {
	data: {
		jira: {
			jqlBuilder: {
				hydrateJqlQuery: {
					fields: [],
				},
			},
		},
	},
};

export const hydrateJqlEmptyResponseMapped = {};

export const fieldValuesResponseForTypes = {
	data: {
		jira: {
			jqlBuilder: {
				fieldValues: {
					totalCount: 12,
					pageInfo: {
						endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
					},
					edges: [
						{
							node: {
								jqlTerm: '"[System] Change"',
								displayName: '[System] Change',
								issueTypes: [
									{
										avatar: {
											small: alert,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Incident"',
								displayName: '[System] Incident',
								issueTypes: [
									{
										avatar: {
											small: arrows,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Post-incident review"',
								displayName: '[System] Post-incident review',
								issueTypes: [
									{
										avatar: {
											small: bug,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Problem"',
								displayName: '[System] Problem',
								issueTypes: [
									{
										avatar: {
											small: lightning,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Service request"',
								displayName: '[System] Service request',
								issueTypes: [
									{
										avatar: {
											small: alert,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Change requested"',
								displayName: '[System] Change requested',
								issueTypes: [
									{
										avatar: {
											small: alert,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Incident reported"',
								displayName: '[System] Incident reported',
								issueTypes: [
									{
										avatar: {
											small: arrows,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Post-incident review request"',
								displayName: '[System] Post-incident review request',
								issueTypes: [
									{
										avatar: {
											small: bug,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Issue"',
								displayName: '[System] Issue',
								issueTypes: [
									{
										avatar: {
											small: lightning,
										},
									},
								],
							},
						},
						{
							node: {
								jqlTerm: '"[System] Service"',
								displayName: '[System] Service',
								issueTypes: [
									{
										avatar: {
											small: alert,
										},
									},
								],
							},
						},
					],
				},
			},
		},
	},
};

export const fieldValuesResponseForTypesMapped = [
	{
		icon: alert,
		label: '[System] Change',
		optionType: 'iconLabel',
		value: '[System] Change',
	},
	{
		icon: arrows,
		label: '[System] Incident',
		optionType: 'iconLabel',
		value: '[System] Incident',
	},
	{
		icon: bug,
		label: '[System] Post-incident review',
		optionType: 'iconLabel',
		value: '[System] Post-incident review',
	},
	{
		icon: lightning,
		label: '[System] Problem',
		optionType: 'iconLabel',
		value: '[System] Problem',
	},
	{
		icon: alert,
		label: '[System] Service request',
		optionType: 'iconLabel',
		value: '[System] Service request',
	},
	{
		icon: alert,
		label: '[System] Change requested',
		optionType: 'iconLabel',
		value: '[System] Change requested',
	},
	{
		icon: arrows,
		label: '[System] Incident reported',
		optionType: 'iconLabel',
		value: '[System] Incident reported',
	},
	{
		icon: bug,
		label: '[System] Post-incident review request',
		optionType: 'iconLabel',
		value: '[System] Post-incident review request',
	},
	{
		icon: lightning,
		label: '[System] Issue',
		optionType: 'iconLabel',
		value: '[System] Issue',
	},
	{
		icon: alert,
		label: '[System] Service',
		optionType: 'iconLabel',
		value: '[System] Service',
	},
];

export const fieldValuesResponseForTypesWithRelativeUrls = {
	data: {
		jira: {
			jqlBuilder: {
				fieldValues: {
					totalCount: 12,
					pageInfo: {
						endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
					},
					edges: [
						{
							node: {
								jqlTerm: '"[System] Change"',
								displayName: '[System] Change',
								issueTypes: [
									{
										avatar: {
											small:
												'/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303?size=medium',
										},
									},
								],
							},
						},

						{
							node: {
								jqlTerm: '"Bug"',
								displayName: 'Bug',
								issueTypes: [
									{
										avatar: {
											small:
												'https://hello.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303?size=medium',
										},
									},
								],
							},
						},
					],
				},
			},
		},
	},
};

export const fieldValuesResponseForTypesWithRelativeUrlsMapped = [
	{
		icon: 'https://forge-smart-link-battleground.jira-dev.com/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303?size=medium',
		label: '[System] Change',
		optionType: 'iconLabel',
		value: '[System] Change',
	},
	{
		icon: 'https://hello.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303?size=medium',
		label: 'Bug',
		optionType: 'iconLabel',
		value: 'Bug',
	},
];

export const fieldValuesResponseForStatuses = {
	data: {
		jira: {
			jqlBuilder: {
				fieldValues: {
					totalCount: 27,
					pageInfo: {
						endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
					},
					edges: [
						{
							node: {
								jqlTerm: 'Authorize',
								displayName: 'Authorize',
								statusCategory: {
									colorName: 'YELLOW',
								},
							},
						},
						{
							node: {
								jqlTerm: '"Awaiting approval"',
								displayName: 'Awaiting approval',
								statusCategory: {
									colorName: 'YELLOW',
								},
							},
						},
						{
							node: {
								jqlTerm: '"Awaiting implementation"',
								displayName: 'Awaiting implementation',
								statusCategory: {
									colorName: 'YELLOW',
								},
							},
						},
						{
							node: {
								jqlTerm: 'Canceled',
								displayName: 'Canceled',
								statusCategory: {
									colorName: 'GREEN',
								},
							},
						},
						{
							node: {
								jqlTerm: 'Closed',
								displayName: 'Closed',
								statusCategory: {
									colorName: 'GREEN',
								},
							},
						},
						{
							node: {
								jqlTerm: '"Awaiting information"',
								displayName: 'Awaiting information',
								statusCategory: {
									colorName: 'YELLOW',
								},
							},
						},
						{
							node: {
								jqlTerm: 'Canceled2',
								displayName: 'Canceled2',
								statusCategory: {
									colorName: 'GREEN',
								},
							},
						},
						{
							node: {
								jqlTerm: 'Authorized',
								displayName: 'Authorized',
								statusCategory: {
									colorName: 'YELLOW',
								},
							},
						},
						{
							node: {
								jqlTerm: 'Canceled3',
								displayName: 'Canceled3',
								statusCategory: {
									colorName: 'GREEN',
								},
							},
						},
						{
							node: {
								jqlTerm: 'Canceled4',
								displayName: 'Canceled4',
								statusCategory: {
									colorName: 'GREEN',
								},
							},
						},
					],
				},
			},
		},
	},
};

export const fieldValuesResponseForStatusesMapped = [
	{
		appearance: 'inprogress',
		label: 'Authorize',
		optionType: 'lozengeLabel',
		value: 'Authorize',
	},
	{
		appearance: 'inprogress',
		label: 'Awaiting approval',
		optionType: 'lozengeLabel',
		value: 'Awaiting approval',
	},
	{
		appearance: 'inprogress',
		label: 'Awaiting implementation',
		optionType: 'lozengeLabel',
		value: 'Awaiting implementation',
	},
	{
		appearance: 'success',
		label: 'Canceled',
		optionType: 'lozengeLabel',
		value: 'Canceled',
	},
	{
		appearance: 'success',
		label: 'Closed',
		optionType: 'lozengeLabel',
		value: 'Closed',
	},
	{
		appearance: 'inprogress',
		label: 'Awaiting information',
		optionType: 'lozengeLabel',
		value: 'Awaiting information',
	},
	{
		appearance: 'success',
		label: 'Canceled2',
		optionType: 'lozengeLabel',
		value: 'Canceled2',
	},
	{
		appearance: 'inprogress',
		label: 'Authorized',
		optionType: 'lozengeLabel',
		value: 'Authorized',
	},
	{
		appearance: 'success',
		label: 'Canceled3',
		optionType: 'lozengeLabel',
		value: 'Canceled3',
	},
	{
		appearance: 'success',
		label: 'Canceled4',
		optionType: 'lozengeLabel',
		value: 'Canceled4',
	},
];

export const fieldValuesResponseForStatusesSearched = {
	data: {
		jira: {
			jqlBuilder: {
				fieldValues: {
					totalCount: 27,
					pageInfo: {
						endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
					},
					edges: [
						{
							node: {
								jqlTerm: '"Awaiting approval"',
								displayName: 'Awaiting approval',
								statusCategory: {
									colorName: 'YELLOW',
								},
							},
						},
						{
							node: {
								jqlTerm: '"Awaiting implementation"',
								displayName: 'Awaiting implementation',
								statusCategory: {
									colorName: 'YELLOW',
								},
							},
						},
						{
							node: {
								jqlTerm: '"Awaiting implementation"',
								displayName: 'Awaiting implementation',
								statusCategory: {
									colorName: 'YELLOW',
								},
							},
						},
					],
				},
			},
		},
	},
};

export const fieldValuesResponseForProjects = {
	data: {
		jira: {
			jqlBuilder: {
				fieldValues: {
					totalCount: 12,
					pageInfo: {
						endCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
					},
					edges: [
						{
							node: {
								jqlTerm: '"My IT TEST"',
								displayName: 'My IT TEST',
								project: {
									avatar: {
										small: handshake,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test',
								displayName: 'Test',
								project: {
									avatar: {
										small: hotdog,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: '"Test rights"',
								displayName: 'Test rights',
								project: {
									avatar: {
										small: rocket,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test2',
								displayName: 'Test2',
								project: {
									avatar: {
										small: handshake,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test3',
								displayName: 'Test3',
								project: {
									avatar: {
										small: hotdog,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test4',
								displayName: 'Test4',
								project: {
									avatar: {
										small: rocket,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test5',
								displayName: 'Test5',
								project: {
									avatar: {
										small: handshake,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test6',
								displayName: 'Test6',
								project: {
									avatar: {
										small: hotdog,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test7',
								displayName: 'Test7',
								project: {
									avatar: {
										small: rocket,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test8',
								displayName: 'Test8',
								project: {
									avatar: {
										small: handshake,
									},
								},
							},
						},
					],
				},
			},
		},
	},
};

export const fieldValuesResponseForProjectsMapped = [
	{
		icon: handshake,
		label: 'My IT TEST',
		optionType: 'iconLabel',
		value: 'My IT TEST',
	},
	{
		icon: hotdog,
		label: 'Test',
		optionType: 'iconLabel',
		value: 'Test',
	},
	{
		icon: rocket,
		label: 'Test rights',
		optionType: 'iconLabel',
		value: 'Test rights',
	},
	{
		icon: handshake,
		label: 'Test2',
		optionType: 'iconLabel',
		value: 'Test2',
	},
	{
		icon: hotdog,
		label: 'Test3',
		optionType: 'iconLabel',
		value: 'Test3',
	},
	{
		icon: rocket,
		label: 'Test4',
		optionType: 'iconLabel',
		value: 'Test4',
	},
	{
		icon: handshake,
		label: 'Test5',
		optionType: 'iconLabel',
		value: 'Test5',
	},
	{
		icon: hotdog,
		label: 'Test6',
		optionType: 'iconLabel',
		value: 'Test6',
	},
	{
		icon: rocket,
		label: 'Test7',
		optionType: 'iconLabel',
		value: 'Test7',
	},
	{
		icon: handshake,
		label: 'Test8',
		optionType: 'iconLabel',
		value: 'Test8',
	},
];

export const fieldValuesResponseForProjectsMoreData = {
	data: {
		jira: {
			jqlBuilder: {
				fieldValues: {
					totalCount: 12,
					pageInfo: {
						endCursor: 'YXJyYXljb25uZWN0aW9uOjM2',
					},
					edges: [
						{
							node: {
								jqlTerm: 'Test9',
								displayName: 'Test9',
								project: {
									avatar: {
										small: hotdog,
									},
								},
							},
						},
						{
							node: {
								jqlTerm: 'Test10',
								displayName: 'Test10',
								project: {
									avatar: {
										small: rocket,
									},
								},
							},
						},
					],
				},
			},
		},
	},
};

export const fieldValuesResponseForAssignees = {
	data: {
		jira: {
			jqlBuilder: {
				fieldValues: {
					totalCount: 21,
					pageInfo: {
						endCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
					},
					edges: [
						{
							node: {
								jqlTerm: 'membersOf(administrators)',
								displayName: 'administrators',
								group: {
									name: 'administrators',
								},
							},
						},
						{
							node: {
								jqlTerm: '62df272c3aaeedcae755c533',
								displayName: 'Atlas for Jira (staging)',
								user: {
									picture: mike,
								},
								isSquare: false,
							},
						},
						{
							node: {
								jqlTerm: 'membersOf(atlassian-addons-admin)',
								displayName: 'atlassian-addons-admin',
								group: {
									name: 'atlassian-addons-admin',
								},
							},
						},
						{
							node: {
								jqlTerm: 'membersOf(confluence-admins-nicmccormick2)',
								displayName: 'confluence-admins-nicmccormick2',
								group: {
									name: 'confluence-admins-nicmccormick2',
								},
							},
						},
						{
							node: {
								jqlTerm: 'membersOf(confluence-guests-nmccormick2)',
								displayName: 'confluence-guests-nmccormick2',
								group: {
									name: 'confluence-guests-nmccormick2',
								},
							},
						},
						{
							node: {
								jqlTerm: 'membersOf(confluence-user-access-admins-nmccormick2)',
								displayName: 'confluence-user-access-admins-nmccormick2',
								group: {
									name: 'confluence-user-access-admins-nmccormick2',
								},
							},
						},
						{
							node: {
								jqlTerm: 'membersOf(confluence-users-nmccormick2)',
								displayName: 'confluence-users-nmccormick2',
								group: {
									name: 'confluence-users-nmccormick2',
								},
							},
						},
						{
							node: {
								jqlTerm: '63d708e8c3eb74ad8e949fef',
								displayName: 'eu-test',
								user: {
									picture: nidhin,
								},
								isSquare: false,
							},
						},
						{
							node: {
								jqlTerm: '5d959053ede9300dd30c304d',
								displayName: 'GitLab for Jira (gitlab.com)',
								user: {
									picture: sasha,
								},
								isSquare: false,
							},
						},
						{
							node: {
								jqlTerm: 'membersOf(jira-admins-nmccormick2)',
								displayName: 'jira-admins-nmccormick2',
								group: {
									name: 'jira-admins-nmccormick2',
								},
							},
						},
					],
				},
			},
		},
	},
};

export const fieldValuesResponseForAssigneesMapped = [
	{
		isGroup: true,
		label: 'administrators',
		optionType: 'avatarLabel',
		value: 'membersOf(administrators)',
	},
	{
		avatar: mike,
		isSquare: false,
		label: 'Atlas for Jira (staging)',
		optionType: 'avatarLabel',
		value: '62df272c3aaeedcae755c533',
	},
	{
		isGroup: true,
		label: 'atlassian-addons-admin',
		optionType: 'avatarLabel',
		value: 'membersOf(atlassian-addons-admin)',
	},
	{
		isGroup: true,
		label: 'confluence-admins-nicmccormick2',
		optionType: 'avatarLabel',
		value: 'membersOf(confluence-admins-nicmccormick2)',
	},
	{
		isGroup: true,
		label: 'confluence-guests-nmccormick2',
		optionType: 'avatarLabel',
		value: 'membersOf(confluence-guests-nmccormick2)',
	},
	{
		isGroup: true,
		label: 'confluence-user-access-admins-nmccormick2',
		optionType: 'avatarLabel',
		value: 'membersOf(confluence-user-access-admins-nmccormick2)',
	},
	{
		isGroup: true,
		label: 'confluence-users-nmccormick2',
		optionType: 'avatarLabel',
		value: 'membersOf(confluence-users-nmccormick2)',
	},
	{
		avatar: nidhin,
		isSquare: false,
		label: 'eu-test',
		optionType: 'avatarLabel',
		value: '63d708e8c3eb74ad8e949fef',
	},
	{
		avatar: sasha,
		isSquare: false,
		label: 'GitLab for Jira (gitlab.com)',
		optionType: 'avatarLabel',
		value: '5d959053ede9300dd30c304d',
	},
	{
		isGroup: true,
		label: 'jira-admins-nmccormick2',
		optionType: 'avatarLabel',
		value: 'membersOf(jira-admins-nmccormick2)',
	},
];

export const fieldValuesEmptyResponse = {
	data: {
		jira: {
			jqlBuilder: {
				fieldValues: {
					totalCount: 0,
					pageInfo: {},
					edges: [],
				},
			},
		},
	},
};

export const fieldValuesErrorResponse = {
	errors: [
		{
			message: 'CloudId a436116f-02ce-4520-8fbb-7301462a1674d is not found',
			locations: [],
			extensions: {
				statusCode: 400,
				classification: 'CloudIdNotFound',
				aggUgcPiiSafe: true,
				errorSource: 'GRAPHQL_GATEWAY',
			},
		},
	],
	data: {
		jira: null,
	},
};

export const fieldValuesEmptyResponseMapped = [];

export const successfulUserQueryResponse = {
	data: {
		me: {
			user: {
				accountId: '70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
				id: 'ari:cloud:identity::user/70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
			},
		},
	},
};

export const successfuluserHydrationResponse = {
	data: {
		users: [
			{
				accountId: '5ffe1efc34847e0069446bf8',
				name: 'Atlassian Assist (staging)',
				picture:
					'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/62cf07378afb5805e5d46454/5d1719ab-8717-4837-9ae7-a3761c3b6604/128',
			},
		],
	},
};

export const successfulRecommendationAPIResponse = {
	recommendedUsers: [
		{
			entityType: 'USER',
			id: '5ffe1efc34847e0069446bf8',
			name: 'Atlassian Assist (staging)',
			avatarUrl: '',
			nickname: 'Atlassian Assist (staging)',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			userType: 'APP',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '62df272c3aaeedcae755c533',
			name: 'Atlas for Jira (staging)',
			avatarUrl: '',
			nickname: 'Atlas for Jira (staging)',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			userType: 'APP',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '6232be743eacc50071fe13ba',
			name: 'Stephen',
			email: 'sdemontfort+10@atlassian.com',
			avatarUrl: '',
			nickname: 'Stephen',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			locale: 'en-GB',
			userType: 'DEFAULT',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '608b253e2911000071b6e6d6',
			name: 'Pranay Test 1773',
			email: 'pmarella+1773@atlassian.com',
			avatarUrl: '',
			nickname: 'Pranay Test 1773',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			locale: 'en-US',
			userType: 'DEFAULT',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '6202a8cfc4e2c9006ae620b1',
			name: 'Jacob Test3',
			email: 'jbrunson+test3@atlassian.com',
			avatarUrl: '',
			nickname: 'Jacob Test3',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			locale: 'en-US',
			userType: 'DEFAULT',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '61428180ff23ba00717b7d78',
			name: 'Test Themes',
			avatarUrl: '',
			nickname: 'Test Themes',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			userType: 'APP',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '5d9e2c300d44fc0dca5428bb',
			name: 'Confluence Connect Test - AP methods',
			avatarUrl: '',
			nickname: 'Confluence Connect Test - AP methods',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			userType: 'APP',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '655363:1276a696-f0d0-4f3a-a022-636723eb5148',
			name: 'Confluence Google Drive',
			avatarUrl: '',
			nickname: 'Confluence Google Drive',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			userType: 'APP',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '712020:413e43c0-7202-4016-a318-a004892e7f8c',
			name: 'arthur chen nth user',
			avatarUrl: '',
			nickname: 'arthur chen nth user',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			locale: 'en-US',
			userType: 'DEFAULT',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
		{
			entityType: 'USER',
			id: '712020:9219bf5f-0358-4782-99dc-bc73258b2ddc',
			name: 'jeff mellis',
			avatarUrl: '',
			nickname: 'jeff mellis',
			matchPositions: {},
			accessLevel: 'CONTAINER',
			accountStatus: 'ACTIVE',
			notMentionable: false,
			locale: 'en-US',
			userType: 'DEFAULT',
			attributes: {
				isConfluenceExternalCollaborator: false,
			},
		},
	],
};

export const failedUserQueryResponse = {
	errors: [
		{
			message: 'failed to fetch or some other error message',
			locations: [],
			extensions: {},
		},
	],
	extensions: {},
};

export const failedRecommendationAPIResponse = {
	errors: [],
};

export const transformedRecommendationMockFilterOptions = [
	{
		optionType: 'avatarLabel',
		label: 'Atlassian Assist (staging)',
		value: '5ffe1efc34847e0069446bf8',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'Atlas for Jira (staging)',
		value: '62df272c3aaeedcae755c533',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'Stephen',
		value: '6232be743eacc50071fe13ba',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'Pranay Test 1773',
		value: '608b253e2911000071b6e6d6',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'Jacob Test3',
		value: '6202a8cfc4e2c9006ae620b1',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'Test Themes',
		value: '61428180ff23ba00717b7d78',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'Confluence Connect Test - AP methods',
		value: '5d9e2c300d44fc0dca5428bb',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'Confluence Google Drive',
		value: '655363:1276a696-f0d0-4f3a-a022-636723eb5148',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'arthur chen nth user',
		value: '712020:413e43c0-7202-4016-a318-a004892e7f8c',
		avatar: '',
	},
	{
		optionType: 'avatarLabel',
		label: 'jeff mellis',
		value: '712020:9219bf5f-0358-4782-99dc-bc73258b2ddc',
		avatar: '',
	},
];
