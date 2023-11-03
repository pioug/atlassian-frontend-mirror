import {
  fieldValuesEmptyResponse,
  fieldValuesEmptyResponseMapped,
} from '../mocks/fieldValuesEmptyResponse';
import {
  fieldValuesResponseForAssignees,
  fieldValuesResponseForAssigneesMapped,
} from '../mocks/fieldValuesExpectedResponseForAssignees';
import {
  fieldValuesResponseForProjects,
  fieldValuesResponseForProjectsMapped,
} from '../mocks/fieldValuesStandardResponseForProjects';
import {
  fieldValuesResponseForStatuses,
  fieldValuesResponseForStatusesMapped,
} from '../mocks/fieldValuesStandardResponseForStatuses';
import {
  fieldValuesResponseForTypes,
  fieldValuesResponseForTypesMapped,
} from '../mocks/fieldValuesStandardResponseForTypes';
import {
  hydrateJqlEmptyResponse,
  hydrateJqlEmptyResponseMapped,
} from '../mocks/hydrateJqlEmptyResponse';
import {
  hydrateJqlStandardResponse,
  hydrateJqlStandardResponseMapped,
} from '../mocks/hydrateJqlStandardResponse';
import {
  mapFieldValuesResponseData,
  mapHydrateResponseData,
} from '../utils/transformers';

describe('mapHydrateResponseData', () => {
  it('should correctly map response that includes each option type to SelectOption array', () => {
    const mappedOptions = mapHydrateResponseData(hydrateJqlStandardResponse);

    expect(mappedOptions).toEqual(hydrateJqlStandardResponseMapped);
  });

  it('should correctly map an empty AGG response to an empty array', () => {
    const mappedOptions = mapHydrateResponseData(hydrateJqlEmptyResponse);

    expect(mappedOptions).toEqual(hydrateJqlEmptyResponseMapped);
  });
});

describe('mapFieldValuesResponseData', () => {
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
      const mappedOptions = mapFieldValuesResponseData(response);

      expect(mappedOptions).toEqual(expectedAfterMapping);
    },
  );

  it('should correctly map an empty AGG response to an empty array', () => {
    const mappedOptions = mapFieldValuesResponseData(fieldValuesEmptyResponse);

    expect(mappedOptions).toEqual(fieldValuesEmptyResponseMapped);
  });
});
