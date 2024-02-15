import {
  FieldValuesResponse,
  HydrateResponse,
} from '../ui/jira-issues-modal/basic-filters/types';

export const mockHydrateJqlResponse: HydrateResponse = {
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
                            small:
                              '/rest/api/2/universal_avatar/view/type/issuetype/avatar/16627?size=medium',
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
                            small:
                              '/rest/api/2/universal_avatar/view/type/issuetype/avatar/16640?size=medium',
                          },
                        },
                        {
                          avatar: {
                            small:
                              '/rest/api/2/universal_avatar/view/type/issuetype/avatar/16628?size=medium',
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
                          small:
                            'https://hello.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/36328?size=small',
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
                        picture:
                          'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/70121:97052100-1513-42bc-a2f0-d77e71f0b7eb/3d737224-7e8f-4e0c-888c-d5ff6044d484/128',
                      },
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

export const mockFieldValuesResponse: FieldValuesResponse = {
  data: {
    jira: {
      jqlBuilder: {
        fieldValues: {
          totalCount: 4,
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
                    small:
                      'https://nmccormick2.jira-dev.com/rest/api/2/universal_avatar/view/type/project/avatar/10403?size=small',
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
                    small:
                      'https://nmccormick2.jira-dev.com/rest/api/2/universal_avatar/view/type/project/avatar/10411?size=small',
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
                    small:
                      'https://nmccormick2.jira-dev.com/rest/api/2/universal_avatar/view/type/project/avatar/10405?size=small',
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
                    small:
                      'https://nmccormick2.jira-dev.com/rest/api/2/universal_avatar/view/type/project/avatar/10410?size=small',
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
