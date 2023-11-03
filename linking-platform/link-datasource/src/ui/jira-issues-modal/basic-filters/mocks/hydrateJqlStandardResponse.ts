import { HydrateResponse } from '../types';

export const hydrateJqlStandardResponse: HydrateResponse = {
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

export const hydrateJqlStandardResponseMapped = {
  issuetype: [
    {
      icon: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/16627?size=medium',
      label: 'Category',
      optionType: 'iconLabel',
      value: 'Category',
    },
    {
      icon: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/16640?size=medium',
      label: '!disturbed',
      optionType: 'iconLabel',
      value: '"!disturbed"',
    },
  ],
  project: [
    {
      icon: 'https://hello.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/36328?size=small',
      label: '(Deprecated) Koopa Troopas',
      optionType: 'iconLabel',
      value: '"(Deprecated) Koopa Troopas"',
    },
  ],
  assignee: [
    {
      avatar:
        'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/70121:97052100-1513-42bc-a2f0-d77e71f0b7eb/3d737224-7e8f-4e0c-888c-d5ff6044d484/128',
      isSquare: true,
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
