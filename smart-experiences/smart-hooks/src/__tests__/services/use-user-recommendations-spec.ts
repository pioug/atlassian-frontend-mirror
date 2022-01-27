import { act, HookResult, renderHook } from '@testing-library/react-hooks';

import { fetchUserRecommendations } from '@atlaskit/smart-common';

import { mockUserSearchData } from '../../../example-helpers/mock-urs-data';
import useUserRecommendations, {
  instrumentFailureOption,
} from '../../services/use-user-recommendations';
import { UseUserRecommendationsProps } from '../../types';

const mockProps: UseUserRecommendationsProps = {
  fieldId: 'mockFieldId',
  tenantId: 'tenantId',
  productKey: 'jira',
};

jest.mock('@atlaskit/smart-common', () => ({
  ...(jest.requireActual('@atlaskit/smart-common') as Object),
  fetchUserRecommendations: jest.fn(),
}));

describe('useUserRecommendations hook', () => {
  let fetchUserRecommendationsMock = fetchUserRecommendations as jest.Mock;

  const setUpInstrumentation = (
    result: HookResult<ReturnType<typeof useUserRecommendations>>,
  ) => {
    expect(result.current.recommendations).toEqual(instrumentFailureOption);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.error).toBeUndefined();

    act(() => {
      // instantiate analytics handlers to satisfy instrumentation verification
      result.current.onChange();
      result.current.onInputChange();
    });

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.error).toBeUndefined();
  };

  beforeEach(() => {
    fetchUserRecommendationsMock.mockReturnValue(
      Promise.resolve(mockUserSearchData),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return recommendations', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserRecommendations(mockProps),
    );

    setUpInstrumentation(result);

    act(() => {
      // search for users
      result.current.onInputChange()('', 'sessionId1');
    });

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.error).toBeUndefined();
    expect(fetchUserRecommendationsMock).toHaveBeenCalledTimes(1);

    // wait for search to resolve
    await waitForNextUpdate();

    expect(result.current.recommendations).toEqual(mockUserSearchData);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should return no recommendations and error if error downstream', async () => {
    const expectedError = new Error('400 - Bad Request');
    fetchUserRecommendationsMock.mockReturnValue(Promise.reject(expectedError));

    const { result, waitForNextUpdate } = renderHook(() =>
      useUserRecommendations(mockProps),
    );

    setUpInstrumentation(result);

    act(() => {
      // search for users
      result.current.onInputChange()('', 'sessionId1');
    });

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.error).toBeUndefined();

    // wait for search to resolve
    await waitForNextUpdate();

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.error).toBe(expectedError);
  });

  it('should respect preload', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserRecommendations({ ...mockProps, preload: true }),
    );

    expect(result.current.recommendations).toEqual(instrumentFailureOption);
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.error).toBeUndefined();

    await waitForNextUpdate();

    act(() => {
      // instantiate analytics handlers to satisfy instrumentation verification
      result.current.onChange();
      result.current.onInputChange();
    });

    expect(result.current.recommendations).toEqual(mockUserSearchData);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should return error message option if not instrumented', () => {
    const {
      result: {
        current: { recommendations, isLoading, error },
      },
    } = renderHook(() => useUserRecommendations(mockProps));

    expect(recommendations).toEqual(instrumentFailureOption);
    expect(isLoading).toEqual(false);
    expect(error).toBeUndefined();
  });
});
