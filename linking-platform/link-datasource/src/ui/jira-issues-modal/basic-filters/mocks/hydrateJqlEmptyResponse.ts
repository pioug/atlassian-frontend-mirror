import { HydrateResponse } from '../types';

export const hydrateJqlEmptyResponse: HydrateResponse = {
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
