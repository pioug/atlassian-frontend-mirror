import { FieldValuesResponse } from '../types';

export const fieldValuesResponseForStatuses: FieldValuesResponse = {
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
