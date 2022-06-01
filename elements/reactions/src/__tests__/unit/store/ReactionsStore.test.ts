import waitForExpect from 'wait-for-expect';
import { ReactionClient } from '../../../client';
import {
  ari,
  containerAri,
  reaction,
  user,
} from '../../../client/MockReactionsClient';
import * as ReactionStore from '../../../store/ReactionsStore';
import { ReactionStatus } from '../../../types/ReactionStatus';
import * as AnalyticsModule from '../../../analytics';

const fakeCreateAndFireSafe = jest.fn();
const spyCreateAndFireSafe = jest.spyOn(AnalyticsModule, 'createAndFireSafe');

// when creating a rejected promise like `const a = Promise.reject('')` in a test, it causes the test failed
// because the rejected value is not caught and handled correctly. That make very hard to test and debug the root cause.
// This helper will create a rejected-promise-like so the test does not need to catch the exception/error.

const createSafeRejectedPromise = (error: any) => {
  const catchError = () => {
    // ignore the error
  };
  const catchFn = (callback: (error: any) => Promise<void>) => {
    try {
      const promise = callback(error);
      if (promise.then !== undefined) {
        promise.catch(catchError);
      }
    } catch (e) {
      catchError();
    }
  };

  return {
    then: () => ({
      then: () => ({
        catch: catchFn,
      }),
      catch: catchFn,
    }),
  };
};

/**
 * Custom type for simulate the UFOExperience main methods
 */
interface FakeUFOInstance {
  start: jest.Mock;
  success: jest.Mock;
  failure: jest.Mock;
  abort: jest.Mock;
}

describe('ReactionStore', () => {
  const fakeCreateAnalyticsEvent = jest.fn();
  const fakeAddUFOInstance: FakeUFOInstance = {
    start: jest.fn(),
    success: jest.fn(),
    failure: jest.fn(),
    abort: jest.fn(),
  };
  const fakeRemoveUFOInstance: FakeUFOInstance = {
    start: jest.fn(),
    success: jest.fn(),
    failure: jest.fn(),
    abort: jest.fn(),
  };
  const fakeRenderUFOInstance: FakeUFOInstance = {
    start: jest.fn(),
    success: jest.fn(),
    failure: jest.fn(),
    abort: jest.fn(),
  };

  const fakeFetchDetailsUFOInstance: FakeUFOInstance = {
    start: jest.fn(),
    success: jest.fn(),
    failure: jest.fn(),
    abort: jest.fn(),
  };

  const fakeClient: ReactionClient = {
    getReactions: jest.fn(),
    getDetailedReaction: jest.fn(),
    addReaction: jest.fn(),
    deleteReaction: jest.fn(),
  };

  const getReactionsResponse = Promise.resolve({
    [ari]: [
      reaction(':fire:', 2, true),
      reaction(':thumbsup:', 3, false),
      reaction(':clap:', 1, true),
    ],
  });

  /**
   * Mock the getInstance method for all different UfoExperience object
   */
  const loadFakeUFOInstances = () => {
    ReactionStore.ufoExperiences.add.getInstance = jest.fn(
      () => fakeAddUFOInstance as any,
    );
    ReactionStore.ufoExperiences.remove.getInstance = jest.fn(
      () => fakeRemoveUFOInstance as any,
    );
    ReactionStore.ufoExperiences.render.getInstance = jest.fn(
      () => fakeRenderUFOInstance as any,
    );
    ReactionStore.ufoExperiences.fetchDetails.getInstance = jest.fn(
      () => fakeFetchDetailsUFOInstance as any,
    );
  };

  /**
   * Jest mock reset for all different methods of a UfoExperience object
   * @param instance given instance to reset
   */
  const mockResetUFOInstance = (instance: FakeUFOInstance) => {
    instance.start.mockReset();
    instance.abort.mockReset();
    instance.failure.mockReset();
    instance.success.mockReset();
  };

  let store: ReactionStore.MemoryReactionsStore;
  beforeAll(() => {
    jest.useFakeTimers();
    spyCreateAndFireSafe.mockImplementation(fakeCreateAndFireSafe);
    loadFakeUFOInstances();
  });
  afterAll(() => {
    jest.useRealTimers();
    spyCreateAndFireSafe.mockRestore();
  });

  beforeEach(() => {
    (fakeClient.getReactions as jest.Mock<any>).mockReset();
    (fakeClient.getDetailedReaction as jest.Mock<any>).mockReset();
    (fakeClient.addReaction as jest.Mock<any>).mockReset();
    (fakeClient.deleteReaction as jest.Mock<any>).mockReset();

    fakeCreateAndFireSafe.mockReset();

    // Add UFO experience reset mocks
    mockResetUFOInstance(fakeAddUFOInstance);

    // Remove UFO experience reset mocks
    mockResetUFOInstance(fakeRemoveUFOInstance);

    // Render UFO experience reset mocks
    mockResetUFOInstance(fakeRemoveUFOInstance);

    // Fetch details UFO experience reset mocks
    mockResetUFOInstance(fakeFetchDetailsUFOInstance);

    store = new ReactionStore.MemoryReactionsStore(fakeClient);
  });

  describe('with empty state', () => {
    beforeEach(() => {
      store = new ReactionStore.MemoryReactionsStore(fakeClient);
    });

    it('should set initial state', () => {
      expect(store.getState()).toMatchObject({
        reactions: {},
        flash: {},
      });
    });

    it('should call client to get reactions', () => {
      (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
        getReactionsResponse,
      );

      store.getReactions(containerAri, ari);

      jest.runAllTimers();

      expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

      return getReactionsResponse.then(() => {
        expect(store.getState()).toMatchObject({
          reactions: {
            [`${containerAri}|${ari}`]: {
              status: ReactionStatus.ready,
              reactions: [
                reaction(':thumbsup:', 3, false),
                reaction(':fire:', 2, true),
                reaction(':clap:', 1, true),
              ],
            },
          },
          flash: {},
        });
      });
    });

    it('should notify notify onUpdate', () => {
      (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
        getReactionsResponse,
      );

      const callback = jest.fn();
      store.onChange(callback);

      store.getReactions(containerAri, ari);

      jest.runAllTimers();

      return getReactionsResponse.then(() => {
        // we need to run all timers because onUpdate notification is batched
        jest.runAllTimers();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({
          reactions: {
            [`${containerAri}|${ari}`]: {
              status: ReactionStatus.ready,
              reactions: [
                reaction(':thumbsup:', 3, false),
                reaction(':fire:', 2, true),
                reaction(':clap:', 1, true),
              ],
            },
          },
          flash: {},
        });
      });
    });

    it('should not notify after removing the callback', () => {
      (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
        getReactionsResponse,
      );

      const callback = jest.fn();
      store.onChange(callback);

      store.removeOnChangeListener(callback);

      store.getReactions(containerAri, ari);

      jest.runAllTimers();

      return getReactionsResponse.then(() => {
        // we need to run all timers because onUpdate notification is batched
        jest.runAllTimers();
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('with metadata set', () => {
    const metadata = {
      subproduct: 'atlaskit-test',
    };
    beforeEach(() => {
      store = new ReactionStore.MemoryReactionsStore(
        fakeClient,
        {
          reactions: {
            [`${containerAri}|${ari}`]: {
              reactions: [
                reaction(':thumbsup:', 3, false),
                reaction(':clap:', 3, true),
              ],
              status: ReactionStatus.ready,
            },
          },
          flash: {},
        },
        metadata,
      );
    });

    it('should send metadata information when adding a reaction', () => {
      const response = Promise.resolve(reaction(':thumbsup:', 4, true));

      (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      store.addReaction(containerAri, ari, '1f44d');

      expect(fakeClient.addReaction).toBeCalledWith(
        containerAri,
        ari,
        '1f44d',
        metadata,
      );
    });
  });
  describe('with state set', () => {
    beforeEach(() => {
      store = new ReactionStore.MemoryReactionsStore(fakeClient, {
        reactions: {
          [`${containerAri}|${ari}`]: {
            reactions: [
              reaction(':thumbsup:', 3, false),
              reaction(':clap:', 3, true),
            ],
            status: ReactionStatus.ready,
          },
        },
        flash: {},
      });
    });

    it('should call adaptor to add reaction', () => {
      const response = Promise.resolve(reaction(':thumbsup:', 4, true));

      (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      store.addReaction(containerAri, ari, '1f44d');

      expect(store.getState()).toMatchObject({
        reactions: {
          [`${containerAri}|${ari}`]: {
            status: ReactionStatus.ready,
            reactions: [
              {
                ...reaction(':thumbsup:', 4, true),
                optimisticallyUpdated: true,
              },
              reaction(':clap:', 3, true),
            ],
          },
        },
      });
    });

    it('should call adaptor to add reaction using toggle action', () => {
      const response = Promise.resolve(reaction(':thumbsup:', 4, true));

      (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      store.toggleReaction(containerAri, ari, '1f44d');

      expect(store.getState()).toMatchObject({
        reactions: {
          [`${containerAri}|${ari}`]: {
            status: ReactionStatus.ready,
            reactions: [
              {
                ...reaction(':thumbsup:', 4, true),
                optimisticallyUpdated: true,
              },
              reaction(':clap:', 3, true),
            ],
          },
        },
      });
    });

    it('should flash reaction when the user tries to add it again', () => {
      store.addReaction(containerAri, ari, '1f44f');

      expect(store.getState()).toMatchObject({
        reactions: {
          [`${containerAri}|${ari}`]: {
            status: ReactionStatus.ready,
            reactions: [
              reaction(':thumbsup:', 3, false),
              reaction(':clap:', 3, true),
            ],
          },
        },
        flash: {
          [`${containerAri}|${ari}`]: { '1f44f': true },
        },
      });

      expect(fakeClient.addReaction).not.toHaveBeenCalled();
    });

    it('should call adaptor to remove reaction', () => {
      (fakeClient.deleteReaction as jest.Mock<any>).mockRejectedValueOnce(
        new Error('delete error'),
      );

      store.toggleReaction(containerAri, ari, '1f44f');

      expect(store.getState()).toMatchObject({
        reactions: {
          [`${containerAri}|${ari}`]: {
            status: ReactionStatus.ready,
            reactions: [
              reaction(':thumbsup:', 3, false),
              {
                ...reaction(':clap:', 2, false),
                optimisticallyUpdated: true,
              },
            ],
          },
        },
      });
    });
  });

  describe('SLI analytics', () => {
    beforeEach(() => {
      store = new ReactionStore.MemoryReactionsStore(fakeClient, {
        reactions: {
          [`${containerAri}|${ari}`]: {
            reactions: [
              reaction(':thumbsup:', 3, false),
              reaction(':clap:', 3, true),
            ],
            status: ReactionStatus.ready,
          },
        },
        flash: {},
      });
    });

    describe('getDetailedReaction analytics', () => {
      it('should call adaptor to get detailed reaction', async () => {
        const response = Promise.resolve({
          ...reaction(':thumbsup:', 1, true),
          users: [user('id', 'Some real user')],
        });
        (fakeClient.getDetailedReaction as jest.Mock<any>).mockReturnValueOnce(
          response,
        );

        store.getDetailedReaction(containerAri, ari, '1f44d');

        // Validate the start method been called
        expect(fakeFetchDetailsUFOInstance.start).toBeCalled();
        expect(fakeClient.getDetailedReaction).toHaveBeenCalledTimes(1);

        await response;

        // Check success response
        expect(fakeFetchDetailsUFOInstance.success).toBeCalled();
        expect(fakeFetchDetailsUFOInstance.failure).not.toBeCalled();
        expect(store.getState()).toMatchObject({
          reactions: {
            [`${containerAri}|${ari}`]: {
              status: ReactionStatus.ready,
              reactions: [
                {
                  ...reaction(':thumbsup:', 3, false),
                  users: [user('id', 'Some real user')],
                },
                reaction(':clap:', 3, true),
              ],
            },
          },
        });
      });

      it('should not call adaptor when detailed reaction data failed to be fetched', async () => {
        const response = Promise.resolve(new Error('delete error'));
        (fakeClient.getDetailedReaction as jest.Mock<
          any
        >).mockRejectedValueOnce(response);

        store.getDetailedReaction(containerAri, ari, '1f44d');

        // Validate the start method been called
        expect(fakeFetchDetailsUFOInstance.start).toBeCalled();

        await response;

        await waitForExpect(() => {
          expect(fakeFetchDetailsUFOInstance.success).not.toBeCalled();
          expect(fakeFetchDetailsUFOInstance.failure).toBeCalled();
        });
      });
    });

    describe('addReaction analytics', () => {
      it('should fire SLI analytics when reaction is added successfully', async () => {
        const response = Promise.resolve(reaction(':thumbsup:', 4, true));
        store.setCreateAnalyticsEvent(fakeCreateAnalyticsEvent);
        (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(
          response,
        );

        store.addReaction(containerAri, ari, '1f44d');

        // Validate the start method been called
        expect(fakeAddUFOInstance.start).toBeCalled();

        await response;

        // Check success response
        expect(fakeCreateAndFireSafe).toBeCalledWith(
          fakeCreateAnalyticsEvent,
          AnalyticsModule.createRestSucceededEvent,
          'addReaction',
        );
        expect(fakeAddUFOInstance.success).toBeCalled();
        expect(fakeAddUFOInstance.failure).not.toBeCalled();
      });

      it('should fire SLI analytics when reaction failed to be added', async () => {
        // setup
        const error = { code: 503, reason: 'error' };
        const response = createSafeRejectedPromise(error);
        store.setCreateAnalyticsEvent(fakeCreateAnalyticsEvent);

        (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(
          response,
        );

        // act
        store.addReaction(containerAri, ari, '1f44d');

        // assert
        // Validate the start method been called
        expect(fakeAddUFOInstance.start).toBeCalled();
        expect(fakeCreateAndFireSafe).toBeCalledWith(
          fakeCreateAnalyticsEvent,
          AnalyticsModule.createRestFailedEvent,
          'addReaction',
          503,
        );
        expect(fakeAddUFOInstance.success).not.toBeCalled();
        expect(fakeAddUFOInstance.failure).toBeCalled();
      });

      it('should not fire addReaction SLI analytics when createAnalyticsEvent is not provided', async () => {
        const response = Promise.resolve(reaction(':thumbsup:', 4, true));
        store.setCreateAnalyticsEvent(undefined);
        (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(
          response,
        );

        store.addReaction(containerAri, ari, '1f44d');

        await response;
        expect(fakeCreateAndFireSafe).not.toHaveBeenCalled();
      });
    });

    describe('removeReaction analytics', () => {
      it('should fire SLI analytics when reaction is removed successfully', async () => {
        const response = Promise.resolve();
        (fakeClient.deleteReaction as jest.Mock<any>).mockReturnValueOnce(
          response,
        );

        store.toggleReaction(containerAri, ari, '1f44f');

        // Validate the start method been called
        expect(fakeRemoveUFOInstance.start).toBeCalled();
        await response;
        // Check success response
        expect(fakeRemoveUFOInstance.success).toBeCalled();
      });

      it('should fire SLI analytics when reaction failed to be removed', async () => {
        const response = Promise.resolve(new Error('delete error'));
        (fakeClient.deleteReaction as jest.Mock<any>).mockRejectedValueOnce(
          response,
        );

        store.toggleReaction(containerAri, ari, '1f44f');

        // Validate the start method been called
        expect(fakeRemoveUFOInstance.start).toBeCalled();

        await response;

        await waitForExpect(() => {
          expect(fakeRemoveUFOInstance.success).not.toBeCalled();
          expect(fakeRemoveUFOInstance.failure).toBeCalled();
        });
      });
    });

    describe('getReactions analytics', () => {
      it('should fire SLI analytics when reactions are fetched successfully', async () => {
        (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
          getReactionsResponse,
        );

        store.setCreateAnalyticsEvent(fakeCreateAnalyticsEvent);
        store.getReactions(containerAri, ari);

        jest.runAllTimers();
        expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

        await getReactionsResponse;

        await waitForExpect(() => {
          expect(fakeRenderUFOInstance.start).toBeCalled();
          expect(fakeRenderUFOInstance.success).toBeCalled();
          expect(fakeCreateAndFireSafe).toBeCalledWith(
            fakeCreateAnalyticsEvent,
            AnalyticsModule.createRestSucceededEvent,
            'getReactions',
          );
        });
      });

      it('should fire SLI analytics when reactions failed to be fetched', async () => {
        // setup
        const error = { code: 503, reason: 'error' };
        const response = createSafeRejectedPromise(error);
        store.setCreateAnalyticsEvent(fakeCreateAnalyticsEvent);
        (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
          response,
        );
        // act
        store.getReactions(containerAri, ari);
        jest.runAllTimers();

        // assert
        await waitForExpect(() => {
          expect(fakeRenderUFOInstance.start).toBeCalled();
          expect(fakeRenderUFOInstance.failure).toBeCalled();
          expect(fakeCreateAndFireSafe).toBeCalledWith(
            fakeCreateAnalyticsEvent,
            AnalyticsModule.createRestFailedEvent,
            'getReactions',
            503,
          );
        });
      });

      it('should not fire getReactions SLI analytics when createAnalyticsEvent is not provided', async () => {
        (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
          getReactionsResponse,
        );
        store.setCreateAnalyticsEvent(undefined);
        store.getReactions(containerAri, ari);

        jest.runAllTimers();
        expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

        await getReactionsResponse;

        expect(fakeCreateAndFireSafe).not.toHaveBeenCalled();
      });
    });
  });
});
