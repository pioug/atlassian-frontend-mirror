import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import {
  failedRecommendationAPIResponse,
  successfulRecommendationAPIResponse,
  transformedRecommendationMockFilterOptions,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { getUserRecommendations } from '@atlaskit/smart-user-picker';

import useRecommendation from '../useRecommendation';

jest.mock('@atlaskit/smart-user-picker');

const mockFetchFilterOptionsProps = (searchTerm = '') => {
  return {
    cloudId: 'SOME_CLOUD_ID',
    userId: 'SOME_USER_ID',
    searchTerm: searchTerm,
  };
};

const expectedRequestParams = (searchTerm = '') => {
  return {
    context: {
      contextType: 'contributors',
      principalId: 'SOME_USER_ID',
      productAttributes: {
        isEntitledConfluenceExternalCollaborator: true,
      },
      productKey: 'confluence',
      siteId: 'SOME_CLOUD_ID',
    },
    includeGroups: false,
    includeTeams: false,
    includeUsers: true,
    maxNumberOfResults: 10,
    performSearchQueryOnly: false,
    query: searchTerm,
  };
};

const differentSuccessfulAPIResponse = {
  recommendedUsers: [
    {
      entityType: 'USER',
      id: 'BOGUS_NEW_SEARCH_ID',
      name: 'BOGUS_NEW_SEARCH_NAME',
      avatarUrl: '',
      nickname: 'BOGUS_NEW_SEARCH_NAME',
      matchPositions: {},
      accessLevel: 'CONTAINER',
      accountStatus: 'ACTIVE',
      notMentionable: false,
      userType: 'APP',
      attributes: {
        isConfluenceExternalCollaborator: false,
      },
    },
  ],
};

const differentTransformedFilterOptions = [
  {
    optionType: 'avatarLabel',
    label: 'BOGUS_NEW_SEARCH_NAME',
    value: 'BOGUS_NEW_SEARCH_ID',
    avatar: '',
  },
];

const initialRenderHookState = {
  filterOptions: [],
  reset: expect.any(Function),
  status: 'empty',
  errors: [],
  fetchFilterOptions: expect.any(Function),
};

const initialValuesHookState = {
  filterOptions: transformedRecommendationMockFilterOptions,
  reset: expect.any(Function),
  status: 'resolved',
  errors: [],
  fetchFilterOptions: expect.any(Function),
};

describe('Testing: useRecommendation', () => {
  const setup = ({
    mockUserRecommendations = successfulRecommendationAPIResponse,
  }: {
    mockUserRecommendations?: object;
  }) => {
    asMock(getUserRecommendations).mockReturnValue(mockUserRecommendations);

    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <IntlProvider locale="en">{children}</IntlProvider>
    );

    const { result, waitForNextUpdate, rerender } = renderHook(
      () => useRecommendation(),
      {
        wrapper,
      },
    );
    return {
      getUserRecommendations,
      result,
      waitForNextUpdate,
      rerender,
    };
  };

  it('should return correct initial state', () => {
    const { result } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    expect(result.current).toEqual(initialRenderHookState);
  });

  it('should set status to loading when fetchFilterOptions is called', async () => {
    const { result } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    expect(result.current.status).toBe('loading');
  });

  it('should call getUserRecommendations with correct parameters for initial values', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    await waitForNextUpdate();

    expect(getUserRecommendations).toHaveBeenCalledWith(
      expectedRequestParams(),
      expect.anything(),
    );
  });

  it('should call getUserRecommendations with correct parameters with search after initial values', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    await waitForNextUpdate();

    act(() => {
      result.current.fetchFilterOptions(
        mockFetchFilterOptionsProps('SOME_SEARCH_TERM'),
      );
    });

    await waitForNextUpdate();

    expect(getUserRecommendations).toHaveBeenLastCalledWith(
      expectedRequestParams('SOME_SEARCH_TERM'),
      expect.anything(),
    );
  });

  it('should set correct state after fetchFilterOptions is called for initial values', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      filterOptions: transformedRecommendationMockFilterOptions,
      reset: expect.any(Function),
      status: 'resolved',
      errors: [],
      fetchFilterOptions: expect.any(Function),
    });
  });

  it('should set different correct state with search term after intial values have been set', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    await waitForNextUpdate();
    expect(result.current).toEqual(initialValuesHookState);

    (getUserRecommendations as jest.Mock).mockReturnValue(
      differentSuccessfulAPIResponse.recommendedUsers,
    );

    act(() => {
      result.current.fetchFilterOptions(
        mockFetchFilterOptionsProps('SOME_SEARCH_TERM'),
      );
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      filterOptions: differentTransformedFilterOptions,
      reset: expect.any(Function),
      status: 'resolved',
      errors: [],
      fetchFilterOptions: expect.any(Function),
    });
  });

  it('should not call API if initial data exists searched again with no search term supplied', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    await waitForNextUpdate();

    expect(result.current).toEqual(initialValuesHookState);

    jest.resetAllMocks();
    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    expect(getUserRecommendations).not.toHaveBeenCalled();
    expect(result.current).toEqual(initialValuesHookState);
  });

  it('should call API if initial data was set and then the reset method was called', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    await waitForNextUpdate();

    expect(result.current).toEqual(initialValuesHookState);

    act(() => {
      result.current.reset();
    });

    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    expect(getUserRecommendations).toHaveBeenCalled();

    await waitForNextUpdate();
    expect(result.current).toEqual(initialValuesHookState);
  });

  it('should reset to initial data when it exists without calling API again', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    // set initial data
    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    await waitForNextUpdate();

    expect(result.current).toEqual(initialValuesHookState);

    (getUserRecommendations as jest.Mock).mockReturnValue(
      differentSuccessfulAPIResponse.recommendedUsers,
    );

    // Set it to a different state of results
    act(() => {
      result.current.fetchFilterOptions(
        mockFetchFilterOptionsProps('SOME_SEARCH_TERM'),
      );
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      filterOptions: differentTransformedFilterOptions,
      reset: expect.any(Function),
      status: 'resolved',
      errors: [],
      fetchFilterOptions: expect.any(Function),
    });

    // Perform requestLikeInitialSearch and expect it to be reset to initialData without calling API
    jest.resetAllMocks();
    act(() => {
      result.current.fetchFilterOptions(mockFetchFilterOptionsProps());
    });

    expect(getUserRecommendations).not.toHaveBeenCalled();
    expect(result.current).toEqual(initialValuesHookState);
  });

  it('should return status as rejected when an error is thrown in fetchFilterOptions', async () => {
    const { result, waitForNextUpdate, getUserRecommendations } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    (getUserRecommendations as jest.Mock).mockRejectedValue(new Error('error'));

    act(() => {
      result.current.fetchFilterOptions(
        mockFetchFilterOptionsProps('SOME_SEARCH_TERM'),
      );
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      filterOptions: [],
      reset: expect.any(Function),
      status: 'rejected',
      errors: expect.any(Array),
      fetchFilterOptions: expect.any(Function),
    });
  });

  it('should return status as rejected when getUserRecommendations returns error response', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations: failedRecommendationAPIResponse,
    });

    act(() => {
      result.current.fetchFilterOptions(
        mockFetchFilterOptionsProps('SOME_SEARCH_TERM'),
      );
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      filterOptions: [],
      reset: expect.any(Function),
      status: 'rejected',
      errors: expect.any(Array),
      fetchFilterOptions: expect.any(Function),
    });
  });

  it('should reset to initial state when reset function called', async () => {
    const { result, waitForNextUpdate } = setup({
      mockUserRecommendations:
        successfulRecommendationAPIResponse.recommendedUsers,
    });

    act(() => {
      result.current.fetchFilterOptions(
        mockFetchFilterOptionsProps('SOME_SEARCH_TERM'),
      );
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      filterOptions: transformedRecommendationMockFilterOptions,
      reset: expect.any(Function),
      status: 'resolved',
      errors: [],
      fetchFilterOptions: expect.any(Function),
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current).toEqual(initialRenderHookState);
  });
});
