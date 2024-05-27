import { type SelectOption } from '../ui/common/modal/popup-select/types';
import {
  type FieldValuesResponse,
  type HydrateResponse,
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

export const mockUserRecommendationsResponse = {
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

export const mockUserHydrationResponse = {
  data: {
    users: [
      {
        accountId: '655363:d8dff7fe-efb7-4073-a3cd-12463ac79e1c',
        name: 'Peter Grasevski',
        picture:
          'https://secure.gravatar.com/avatar/f4bb2f6eef1621e67cd136c0be9af81c?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FPG-5.png',
      },
      {
        accountId: '62cf07378afb5805e5d46454',
        name: 'Richard Wang',
        picture:
          'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/62cf07378afb5805e5d46454/5d1719ab-8717-4837-9ae7-a3761c3b6604/128',
      },
      {
        accountId: '62f3ed1ee50f2f2a39573e7f',
        name: 'Luke Muller',
        picture:
          'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/62f3ed1ee50f2f2a39573e7f/1bd99ace-ea01-4d41-b0ab-3e1ebc353914/128',
      },
      {
        accountId: '6232212a62dc1e006802dea8',
        name: 'Nidhin Joseph',
        picture:
          'https://secure.gravatar.com/avatar/815c1ee3e8e2839ef94bf90b134d1c68?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FNJ-2.png',
      },
    ],
  },
};

export const mockTransformedUserHydrationResponse: SelectOption[] = [
  {
    optionType: 'avatarLabel',
    label: 'Peter Grasevski',
    value: '655363:d8dff7fe-efb7-4073-a3cd-12463ac79e1c',
    avatar:
      'https://secure.gravatar.com/avatar/f4bb2f6eef1621e67cd136c0be9af81c?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FPG-5.png',
  },
  {
    optionType: 'avatarLabel',
    label: 'Richard Wang',
    value: '62cf07378afb5805e5d46454',
    avatar:
      'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/62cf07378afb5805e5d46454/5d1719ab-8717-4837-9ae7-a3761c3b6604/128',
  },
  {
    optionType: 'avatarLabel',
    label: 'Luke Muller',
    value: '62f3ed1ee50f2f2a39573e7f',
    avatar:
      'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/62f3ed1ee50f2f2a39573e7f/1bd99ace-ea01-4d41-b0ab-3e1ebc353914/128',
  },
  {
    optionType: 'avatarLabel',
    label: 'Nidhin Joseph',
    value: '6232212a62dc1e006802dea8',
    avatar:
      'https://secure.gravatar.com/avatar/815c1ee3e8e2839ef94bf90b134d1c68?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FNJ-2.png',
  },
];
