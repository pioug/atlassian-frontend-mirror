import { act, renderHook, type RenderResult } from '@testing-library/react-hooks';
import { v4 as uuid } from 'uuid';

import { createAndFireEvent } from '@atlaskit/analytics-next';
import { fetchUserRecommendations } from '@atlaskit/smart-common';

import { mockUserSearchData } from '../../../example-helpers/mock-urs-data';
import useUserRecommendations, {
  instrumentFailureOption,
} from '../../services/use-user-recommendations';
import { UsersFetchedUfoExperience } from '../../services/use-user-recommendations/ufoExperiences';
import { type UseUserRecommendationsProps } from '../../types';

jest.mock('../../services/use-user-recommendations/ufoExperiences', () => ({
  UsersFetchedUfoExperience: {
    getInstance: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));

jest.mock('@atlaskit/analytics-next', () => {
  return {
    ...(jest.requireActual('@atlaskit/analytics-next') as Object),
    createAndFireEvent: jest
      .fn()
      .mockReturnValue(jest.fn().mockReturnValue(jest.fn())),
  };
});

jest.mock('@atlaskit/smart-common', () => ({
  ...(jest.requireActual('@atlaskit/smart-common') as Object),
  fetchUserRecommendations: jest.fn(),
}));

const mockProps: UseUserRecommendationsProps = {
  fieldId: 'mockFieldId',
  tenantId: 'tenantId',
  productKey: 'jira',
};

describe('useUserRecommendations hook', () => {
  let uuidMock = uuid as jest.Mock;
  let fetchUserRecommendationsMock = fetchUserRecommendations as jest.Mock;

  // analytics
  let fireEventMock = createAndFireEvent() as jest.Mock;
  let usersFetchedUfoStartMock: jest.Mock;
  let usersFetchedUfoSuccessMock: jest.Mock;
  let usersFetchedUfoFailMock: jest.Mock;
  let usersFetchedUfoAbortMock: jest.Mock;
  let UsersFetchedUfoExperienceInstanceMock = UsersFetchedUfoExperience;

  beforeEach(() => {
    jest.useFakeTimers();

    fetchUserRecommendationsMock.mockReturnValue(
      Promise.resolve(mockUserSearchData),
    );

    uuidMock
      .mockReturnValueOnce('renderId')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('2')
      .mockReturnValue('sessionId');

    usersFetchedUfoStartMock = jest.fn();
    usersFetchedUfoSuccessMock = jest.fn();
    usersFetchedUfoFailMock = jest.fn();
    usersFetchedUfoAbortMock = jest.fn();
    (
      UsersFetchedUfoExperienceInstanceMock.getInstance as jest.Mock
    ).mockReturnValue({
      start: usersFetchedUfoStartMock,
      success: usersFetchedUfoSuccessMock,
      failure: usersFetchedUfoFailMock,
      abort: usersFetchedUfoAbortMock,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    uuidMock.mockReset();
    jest.clearAllMocks();
    jest.resetModules();
  });

  const setUpInstrumentation = (
    result: RenderResult<ReturnType<typeof useUserRecommendations>>,
  ) => {
    expect(result.current.recommendations).toEqual(instrumentFailureOption);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.error).toBeUndefined();

    act(() => {
      // instantiate analytics handlers to satisfy instrumentation verification
      result.current.selectUserFactory();
      result.current.triggerSearchFactory();
    });

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.error).toBeUndefined();
  };

  it('should return recommendations', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserRecommendations(mockProps),
    );

    setUpInstrumentation(result);

    act(() => {
      // search for users
      result.current.triggerSearchFactory()('');
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
      result.current.triggerSearchFactory()('');
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
      result.current.selectUserFactory();
      result.current.triggerSearchFactory();
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

  it('should not refetch if current query was the same as last query', async () => {
    // disable debounce since debounce may cause potential fetch to not refetch
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserRecommendations({ ...mockProps, debounceTimeMs: 0 }),
    );

    setUpInstrumentation(result);

    act(() => {
      // search for users
      result.current.triggerSearchFactory()('');
    });

    // wait for search to resolve
    await waitForNextUpdate();

    expect(fetchUserRecommendationsMock).toHaveBeenCalledTimes(1);

    act(() => {
      // search for users
      result.current.triggerSearchFactory()('');
    });

    // no state change so no need to wait for next update
    expect(result.current.recommendations).toEqual(mockUserSearchData);
    // memoization means hook will skip loading phase
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.error).toBeUndefined();

    // still called only once
    expect(fetchUserRecommendationsMock).toHaveBeenCalledTimes(1);
  });

  describe('with Analytics', () => {
    beforeEach(() => {});

    it('should change sessions between searches', async () => {
      // SETUP
      const { result, waitForNextUpdate } = renderHook(() =>
        useUserRecommendations(mockProps),
      );
      setUpInstrumentation(result);

      // ACT & TEST
      act(() => {
        // search for users
        result.current.triggerSearchFactory()('');
      });

      // wait for search to resolve
      await waitForNextUpdate();

      act(() => {
        // clicks on user
        result.current.selectUserFactory()(mockUserSearchData[0].id);
      });

      expect(fireEventMock).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'selected',
          actionSubject: 'user',
          attributes: expect.objectContaining({
            context: 'mockFieldId',
            loadedUsersSize: mockUserSearchData.length,
            maxNumberOfResults: 25,
            position: 0,
            productKey: 'jira',
            queryLength: 0,
            renderId: 'renderId',
            selectedUser: '2234',
            sessionId: '1',
            tenantId: 'tenantId',
          }),
          eventType: 'track',
          source: '@atlaskit/smart-hooks/use-user-recommendations',
        }),
      );

      // changes input
      act(() => {
        result.current.triggerSearchFactory()('ad');
      });
      // wait for search to resolve
      await waitForNextUpdate();

      // clicks on user
      act(() => {
        result.current.selectUserFactory()(mockUserSearchData[3].id);
      });

      expect(fireEventMock).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'selected',
          actionSubject: 'user',
          attributes: expect.objectContaining({
            position: 3,
            queryLength: 2,
            renderId: 'renderId',
            selectedUser: '12312412',
            sessionId: '2',
          }),
        }),
      );
    });

    it('should track UFO search experience success', async () => {
      // SETUP
      const { result, waitForNextUpdate } = renderHook(() =>
        useUserRecommendations(mockProps),
      );
      setUpInstrumentation(result);

      // ACT & TEST
      act(() => {
        // search for users
        result.current.triggerSearchFactory()('');
      });
      expect(usersFetchedUfoStartMock).toHaveBeenCalledTimes(1);

      // wait for search to resolve
      await waitForNextUpdate();

      expect(usersFetchedUfoSuccessMock).toHaveBeenCalledTimes(1);
    });

    it('should track UFO search experience fail', async () => {
      // SETUP
      fetchUserRecommendationsMock.mockReturnValue(Promise.reject());
      const { result, waitForNextUpdate } = renderHook(() =>
        useUserRecommendations(mockProps),
      );
      setUpInstrumentation(result);

      // ACT & TEST
      act(() => {
        // search for users
        result.current.triggerSearchFactory()('');
      });
      expect(usersFetchedUfoStartMock).toHaveBeenCalledTimes(1);

      // wait for search to resolve
      await waitForNextUpdate();

      expect(usersFetchedUfoFailMock).toHaveBeenCalledTimes(1);
    });

    it('should abort UFO search experience if new search is triggered', async () => {
      // SETUP
      // abortcontroller signal does not cancel fetch because client is mocked
      // so simulate race condition by cancelling the first call
      fetchUserRecommendationsMock
        .mockReturnValueOnce(
          new Promise((_, reject) => {
            setTimeout(() => {
              let error = new Error('AbortError');
              error.name = 'AbortError';
              reject(error);
            }, 10);
          }),
        )
        .mockReturnValueOnce(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(mockUserSearchData);
            }, 20);
          }),
        );
      const { result, waitForNextUpdate } = renderHook(() =>
        useUserRecommendations({ ...mockProps, debounceTimeMs: 0 }),
      );
      setUpInstrumentation(result);

      // ACT & TEST
      act(() => {
        // search for users
        result.current.triggerSearchFactory()('');
      });

      jest.advanceTimersByTime(5);

      act(() => {
        // search for users
        result.current.triggerSearchFactory()('a');
      });

      jest.advanceTimersByTime(100);

      // wait for search to resolve
      await waitForNextUpdate();

      expect(usersFetchedUfoAbortMock).toHaveBeenCalledTimes(1);
    });
  });
});
