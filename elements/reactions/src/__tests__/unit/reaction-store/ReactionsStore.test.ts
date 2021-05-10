import waitForExpect from 'wait-for-expect';
import { ReactionClient } from '../../../client';
import {
  ari,
  containerAri,
  reaction,
  user,
} from '../../../client/MockReactionsClient';
import { MemoryReactionsStore } from '../../../reaction-store/ReactionsStore';
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
      if (promise && promise.then) {
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

describe('ReactionContext', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    spyCreateAndFireSafe.mockImplementation(fakeCreateAndFireSafe);
  });
  afterAll(() => {
    jest.useRealTimers();
    spyCreateAndFireSafe.mockRestore();
  });

  const fakeCreateAnalyticsEvent = jest.fn();

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

  let store: MemoryReactionsStore;

  beforeEach(() => {
    (fakeClient.getReactions as jest.Mock<any>).mockReset();
    (fakeClient.getDetailedReaction as jest.Mock<any>).mockReset();
    (fakeClient.addReaction as jest.Mock<any>).mockReset();
    (fakeClient.deleteReaction as jest.Mock<any>).mockReset();
    fakeCreateAndFireSafe.mockReset();

    store = new MemoryReactionsStore(fakeClient);
  });

  describe('with empty state', () => {
    beforeEach(() => {
      store = new MemoryReactionsStore(fakeClient);
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

  describe('with state set', () => {
    beforeEach(() => {
      store = new MemoryReactionsStore(fakeClient, {
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

    it('should call adaptor to get detailed reaction', () => {
      const response = Promise.resolve({
        ...reaction(':thumbsup:', 1, true),
        users: [user('id', 'Some real user')],
      });

      (fakeClient.getDetailedReaction as jest.Mock<any>).mockReturnValueOnce(
        response,
      );

      store.getDetailedReaction(containerAri, ari, '1f44d');

      expect(fakeClient.getDetailedReaction).toHaveBeenCalledTimes(1);

      return response.then(() => {
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
      store = new MemoryReactionsStore(fakeClient, {
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

    describe('addReaction analytics', () => {
      it('should fire SLI analytics when reaction is added successfully', async () => {
        const response = Promise.resolve(reaction(':thumbsup:', 4, true));
        store.setCreateAnalyticsEvent(fakeCreateAnalyticsEvent);
        (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(
          response,
        );

        store.addReaction(containerAri, ari, '1f44d');

        await response;
        expect(fakeCreateAndFireSafe).toBeCalledWith(
          fakeCreateAnalyticsEvent,
          AnalyticsModule.createRestSucceededEvent,
          'addReaction',
        );
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
        expect(fakeCreateAndFireSafe).toBeCalledWith(
          fakeCreateAnalyticsEvent,
          AnalyticsModule.createRestFailedEvent,
          'addReaction',
          503,
        );
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
        expect(fakeCreateAndFireSafe).toBeCalledWith(
          fakeCreateAnalyticsEvent,
          AnalyticsModule.createRestFailedEvent,
          'getReactions',
          503,
        );
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
