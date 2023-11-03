import { FieldValuesResponse } from '../types';

export const fieldValuesResponseForTypes: FieldValuesResponse = {
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
                        '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10555?size=medium',
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
                      small:
                        '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10551?size=medium',
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
                      small:
                        '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10552?size=medium',
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
                      small:
                        '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10556?size=medium',
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
                      small:
                        '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10553?size=medium',
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
    icon: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10555?size=medium',
    label: '[System] Change',
    optionType: 'iconLabel',
    value: '"[System] Change"',
  },
  {
    icon: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10551?size=medium',
    label: '[System] Incident',
    optionType: 'iconLabel',
    value: '"[System] Incident"',
  },
  {
    icon: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10552?size=medium',
    label: '[System] Post-incident review',
    optionType: 'iconLabel',
    value: '"[System] Post-incident review"',
  },
  {
    icon: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10556?size=medium',
    label: '[System] Problem',
    optionType: 'iconLabel',
    value: '"[System] Problem"',
  },
  {
    icon: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10553?size=medium',
    label: '[System] Service request',
    optionType: 'iconLabel',
    value: '"[System] Service request"',
  },
];
