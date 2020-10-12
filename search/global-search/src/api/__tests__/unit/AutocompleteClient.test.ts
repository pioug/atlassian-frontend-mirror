import { utils } from '@atlaskit/util-service-support';

import {
  AutocompleteClient,
  AutocompleteClientImpl,
} from '../../AutocompleteClient';

const url = 'https://pug.jira-dev.com/';
const cloudId = 'cloudId';

describe('AutoCompleteClient', () => {
  let requestSpy: jest.SpyInstance;
  let autoCompleteClient: AutocompleteClient;

  beforeEach(() => {
    requestSpy = jest.spyOn(utils, 'requestService');
    requestSpy.mockReturnValue(Promise.resolve(undefined));
    autoCompleteClient = new AutocompleteClientImpl(url, cloudId);
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  it('requests autocomplete suggestion with query', () => {
    autoCompleteClient.getAutocompleteSuggestions('auto');

    expect(requestSpy).toHaveBeenCalledTimes(1);

    const serviceConfigParam = requestSpy.mock.calls[0][0];
    expect(serviceConfigParam).toHaveProperty('url', url);
    const serviceOptions = requestSpy.mock.calls[0][1];
    const expectedQueryParams = {
      cloudId,
      query: 'auto',
    };
    expect(serviceOptions).toHaveProperty('queryParams', expectedQueryParams);
  });

  it('should return the data from autocomplete API', async () => {
    const expectedResult = ['autocomplete', 'automock', 'automation'];
    requestSpy.mockReturnValue(Promise.resolve(expectedResult));

    const result = await autoCompleteClient.getAutocompleteSuggestions('auto');

    expect(result).toEqual(expectedResult);
  });
});
