import { FieldValuesResponse } from '../types';

export const fieldValuesResponseForAssignees: FieldValuesResponse = {
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
                  picture:
                    'https://secure.gravatar.com/avatar/1c65adef3d88d3eb97507f4952523df0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Fdefault-avatar-2.png',
                },
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
                  picture:
                    'https://secure.gravatar.com/avatar/587a67c5b8494943560a3a24ada6408d?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FE-4.png',
                },
              },
            },
            {
              node: {
                jqlTerm: '5d959053ede9300dd30c304d',
                displayName: 'GitLab for Jira (gitlab.com)',
                user: {
                  picture:
                    'https://secure.gravatar.com/avatar/38baf1356a59e6822365c81b245ba811?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Fdefault-avatar-5.png',
                },
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
    avatar:
      'https://secure.gravatar.com/avatar/1c65adef3d88d3eb97507f4952523df0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Fdefault-avatar-2.png',
    isSquare: true,
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
    avatar:
      'https://secure.gravatar.com/avatar/587a67c5b8494943560a3a24ada6408d?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FE-4.png',
    isSquare: true,
    label: 'eu-test',
    optionType: 'avatarLabel',
    value: '63d708e8c3eb74ad8e949fef',
  },
  {
    avatar:
      'https://secure.gravatar.com/avatar/38baf1356a59e6822365c81b245ba811?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Fdefault-avatar-5.png',
    isSquare: true,
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
