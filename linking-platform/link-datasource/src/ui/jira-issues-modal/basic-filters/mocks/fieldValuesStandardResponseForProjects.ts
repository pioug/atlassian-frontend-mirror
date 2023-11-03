import { FieldValuesResponse } from '../types';

export const fieldValuesResponseForProjects: FieldValuesResponse = {
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

export const fieldValuesResponseForProjectsMapped = [
  {
    icon: 'https://nmccormick2.jira-dev.com/rest/api/2/universal_avatar/view/type/project/avatar/10403?size=small',
    label: 'My IT TEST',
    optionType: 'iconLabel',
    value: '"My IT TEST"',
  },
  {
    icon: 'https://nmccormick2.jira-dev.com/rest/api/2/universal_avatar/view/type/project/avatar/10411?size=small',
    label: 'Test',
    optionType: 'iconLabel',
    value: 'Test',
  },
  {
    icon: 'https://nmccormick2.jira-dev.com/rest/api/2/universal_avatar/view/type/project/avatar/10405?size=small',
    label: 'Test rights',
    optionType: 'iconLabel',
    value: '"Test rights"',
  },
  {
    icon: 'https://nmccormick2.jira-dev.com/rest/api/2/universal_avatar/view/type/project/avatar/10410?size=small',
    label: 'Test2',
    optionType: 'iconLabel',
    value: 'Test2',
  },
];
