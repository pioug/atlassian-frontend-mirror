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
              jqlTerm: 'issuetype',
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

export const hydrateJqlStandardResponseMapped = {
  issuetype: [
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
      value: '"!disturbed"',
    },
  ],
  project: [
    {
      icon: hotdog,
      label: '(Deprecated) Koopa Troopas',
      optionType: 'iconLabel',
      value: '"(Deprecated) Koopa Troopas"',
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
    value: '"[System] Change"',
  },
  {
    icon: arrows,
    label: '[System] Incident',
    optionType: 'iconLabel',
    value: '"[System] Incident"',
  },
  {
    icon: bug,
    label: '[System] Post-incident review',
    optionType: 'iconLabel',
    value: '"[System] Post-incident review"',
  },
  {
    icon: lightning,
    label: '[System] Problem',
    optionType: 'iconLabel',
    value: '"[System] Problem"',
  },
  {
    icon: alert,
    label: '[System] Service request',
    optionType: 'iconLabel',
    value: '"[System] Service request"',
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
    value: '"Awaiting approval"',
  },
  {
    appearance: 'inprogress',
    label: 'Awaiting implementation',
    optionType: 'lozengeLabel',
    value: '"Awaiting implementation"',
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
    value: '"My IT TEST"',
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
    value: '"Test rights"',
  },
  {
    icon: handshake,
    label: 'Test2',
    optionType: 'iconLabel',
    value: 'Test2',
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
                jqlTerm: 'membersOf(confluence-admins-nmccormick2)',
                displayName: 'confluence-admins-nmccormick2',
                group: {
                  name: 'confluence-admins-nmccormick2',
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
    label: 'confluence-admins-nmccormick2',
    optionType: 'avatarLabel',
    value: 'membersOf(confluence-admins-nmccormick2)',
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

export const fieldValuesEmptyResponseMapped = [];
