import {
  fieldValuesEmptyResponse,
  fieldValuesEmptyResponseMapped,
  fieldValuesResponseForAssignees,
  fieldValuesResponseForAssigneesMapped,
  fieldValuesResponseForProjects,
  fieldValuesResponseForProjectsMapped,
  fieldValuesResponseForStatuses,
  fieldValuesResponseForStatusesMapped,
  fieldValuesResponseForTypes,
  fieldValuesResponseForTypesMapped,
  fieldValuesResponseForTypesWithRelativeUrls,
  fieldValuesResponseForTypesWithRelativeUrlsMapped,
  hydrateJqlEmptyResponse,
  hydrateJqlEmptyResponseMapped,
  hydrateJqlStandardResponse,
  hydrateJqlStandardResponseMapped,
} from '@atlaskit/link-test-helpers/datasource';

import { type HydrateResponse } from '../types';
import {
  mapFieldValuesToFilterOptions,
  mapFieldValuesToPageCursor,
  mapFieldValuesToTotalCount,
  mapHydrateResponseData,
} from '../utils/transformers';

describe('mapHydrateResponseData', () => {
  it('should correctly map response that includes each option type to SelectOption array', () => {
    const mappedOptions = mapHydrateResponseData(
      hydrateJqlStandardResponse as HydrateResponse,
    );

    expect(mappedOptions).toEqual(hydrateJqlStandardResponseMapped);
  });

  it('should correctly map an empty AGG response to an empty array', () => {
    const mappedOptions = mapHydrateResponseData(hydrateJqlEmptyResponse);

    expect(mappedOptions).toEqual(hydrateJqlEmptyResponseMapped);
  });

  it('should only include fields with valid jqlTerm and values properties', () => {
    const mappedOptions = mapHydrateResponseData({
      data: {
        jira: {
          jqlBuilder: {
            hydrateJqlQuery: {
              fields: [
                {} as any,
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
    });

    expect(mappedOptions).toEqual({
      status: [
        {
          appearance: 'success',
          label: 'Done',
          optionType: 'lozengeLabel',
          value: 'Done',
        },
      ],
    });
  });

  it('should only include fields that are valid filter fields', () => {
    const mappedOptions = mapHydrateResponseData({
      data: {
        jira: {
          jqlBuilder: {
            hydrateJqlQuery: {
              fields: [
                {
                  jqlTerm: 'anotherStatus',
                  values: [
                    {
                      values: [
                        {
                          displayName: 'Progess',
                          jqlTerm: 'Progess',
                          statusCategory: {
                            colorName: 'BLUE',
                          },
                        },
                      ],
                    },
                  ],
                } as any,
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
    });

    expect(mappedOptions).toEqual({
      status: [
        {
          appearance: 'success',
          label: 'Done',
          optionType: 'lozengeLabel',
          value: 'Done',
        },
      ],
    });
  });
});

describe('mapFieldValuesToFilterOptions', () => {
  it.each([
    [
      'type',
      fieldValuesResponseForTypes,
      fieldValuesResponseForTypesMapped,
      '',
    ],
    [
      'type',
      fieldValuesResponseForTypesWithRelativeUrls,
      fieldValuesResponseForTypesWithRelativeUrlsMapped,
      'https://forge-smart-link-battleground.jira-dev.com',
    ],
    [
      'status',
      fieldValuesResponseForStatuses,
      fieldValuesResponseForStatusesMapped,
      '',
    ],
    [
      'project',
      fieldValuesResponseForProjects,
      fieldValuesResponseForProjectsMapped,
      '',
    ],
    [
      'assignee',
      fieldValuesResponseForAssignees,
      fieldValuesResponseForAssigneesMapped,
      '',
    ],
  ])(
    'should correctly map response for option type "$%s" to SelectOption array',
    (_, response, expectedAfterMapping, siteUrl) => {
      const mappedOptions = mapFieldValuesToFilterOptions({
        ...response,
        siteUrl,
      });

      expect(mappedOptions).toEqual(expectedAfterMapping);
    },
  );

  it('should correctly map an empty AGG response to an empty array', () => {
    const mappedOptions = mapFieldValuesToFilterOptions(
      fieldValuesEmptyResponse,
    );

    expect(mappedOptions).toEqual(fieldValuesEmptyResponseMapped);
  });
});

describe('mapFieldValuesTotalCount', () => {
  it('should correctly map response for option type to number', () => {
    const mappedTotalCount = mapFieldValuesToTotalCount(
      fieldValuesResponseForStatuses,
    );

    expect(mappedTotalCount).toEqual(27);
  });

  it('should correctly map an empty AGG response to 0', () => {
    const mappedTotalCount = mapFieldValuesToTotalCount(
      fieldValuesEmptyResponse,
    );

    expect(mappedTotalCount).toEqual(0);
  });
});

describe('mapFieldValuesPageCursor', () => {
  it('should correctly map response for option type to page cursor string', () => {
    const mappedPageCursor = mapFieldValuesToPageCursor(
      fieldValuesResponseForStatuses,
    );

    expect(mappedPageCursor).toEqual(
      fieldValuesResponseForStatuses?.data?.jira?.jqlBuilder.fieldValues
        .pageInfo.endCursor,
    );
  });
});
