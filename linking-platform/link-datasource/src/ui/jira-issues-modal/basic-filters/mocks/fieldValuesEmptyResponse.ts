import { FieldValuesResponse } from '../types';

export const fieldValuesEmptyResponse: FieldValuesResponse = {
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
