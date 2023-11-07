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
  hydrateJqlEmptyResponse,
  hydrateJqlEmptyResponseMapped,
  hydrateJqlStandardResponse,
  hydrateJqlStandardResponseMapped,
} from '@atlaskit/link-test-helpers/datasource';

import { HydrateResponse } from '../types';
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
});

describe('mapFieldValuesToFilterOptions', () => {
  it.each([
    ['type', fieldValuesResponseForTypes, fieldValuesResponseForTypesMapped],
    [
      'status',
      fieldValuesResponseForStatuses,
      fieldValuesResponseForStatusesMapped,
    ],
    [
      'project',
      fieldValuesResponseForProjects,
      fieldValuesResponseForProjectsMapped,
    ],
    [
      'assignee',
      fieldValuesResponseForAssignees,
      fieldValuesResponseForAssigneesMapped,
    ],
  ])(
    'should correctly map response for option type "$%s" to SelectOption array',
    (_, response, expectedAfterMapping) => {
      const mappedOptions = mapFieldValuesToFilterOptions(response);

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
