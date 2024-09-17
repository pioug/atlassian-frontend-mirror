import waitForExpect from 'wait-for-expect';
import { type Client, ReactionStatus, ReactionUpdateType } from '../types';
import * as AnalyticsModule from '../analytics';
import {
	mockReactDomWarningGlobal,
	mockResetUFOInstance,
	useFakeTimers,
} from '../__tests__/_testing-library';
import type { FakeUFOInstance } from '../__tests__/_testing-library';
import { ari, containerAri, getReactionSummary, getUser } from '../MockReactionsClient';
import { MemoryReactionsStore, ufoExperiences } from './MemoryReactionsStore';
import { waitFor } from '@testing-library/react';

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

describe('MemoryReactionsStore', () => {
	const fakeCreateAnalyticsEvent = jest.fn();
	const fakeAddUFOInstance: FakeUFOInstance = {
		start: jest.fn(),
		success: jest.fn(),
		failure: jest.fn(),
		abort: jest.fn(),
		addMetadata: jest.fn(),
	};
	const fakeRemoveUFOInstance: FakeUFOInstance = {
		start: jest.fn(),
		success: jest.fn(),
		failure: jest.fn(),
		abort: jest.fn(),
		addMetadata: jest.fn(),
	};
	const fakeRenderUFOInstance: FakeUFOInstance = {
		start: jest.fn(),
		success: jest.fn(),
		failure: jest.fn(),
		abort: jest.fn(),
		addMetadata: jest.fn(),
	};

	const fakeFetchDetailsUFOInstance: FakeUFOInstance = {
		start: jest.fn(),
		success: jest.fn(),
		failure: jest.fn(),
		abort: jest.fn(),
		addMetadata: jest.fn(),
	};

	const fakeClient: Client = {
		getReactions: jest.fn(),
		getDetailedReaction: jest.fn(),
		addReaction: jest.fn(),
		deleteReaction: jest.fn(),
	};

	const getReactionsResponse = Promise.resolve({
		[ari]: [
			getReactionSummary(':fire:', 2, true),
			getReactionSummary(':thumbsup:', 3, false),
			getReactionSummary(':clap:', 1, true),
		],
	});

	const successCallBackFn = jest.fn();

	/**
	 * Mock the getInstance method for all different UfoExperience object
	 */
	const loadFakeUFOInstances = () => {
		ufoExperiences.add.getInstance = jest.fn(() => fakeAddUFOInstance as any);
		ufoExperiences.remove.getInstance = jest.fn(() => fakeRemoveUFOInstance as any);
		ufoExperiences.render = jest.fn(() => fakeRenderUFOInstance as any);
		ufoExperiences.fetchDetails.getInstance = jest.fn(() => fakeFetchDetailsUFOInstance as any);
	};

	let store: MemoryReactionsStore;
	mockReactDomWarningGlobal(
		() => {
			spyCreateAndFireSafe.mockImplementation(fakeCreateAndFireSafe);
			loadFakeUFOInstances();
		},
		() => {
			spyCreateAndFireSafe.mockRestore();
		},
	);
	useFakeTimers(() => {
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
				particleEffectByEmoji: {},
			});
		});

		it('should call client to get reactions', () => {
			(fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(getReactionsResponse);

			store.getReactions(containerAri, ari);

			jest.runAllTimers();

			expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

			return getReactionsResponse.then(() => {
				expect(store.getState()).toMatchObject({
					reactions: {
						[`${containerAri}|${ari}`]: {
							status: ReactionStatus.ready,
							reactions: [
								getReactionSummary(':thumbsup:', 3, false),
								getReactionSummary(':fire:', 2, true),
								getReactionSummary(':clap:', 1, true),
							],
						},
					},
					flash: {},
					particleEffectByEmoji: {},
				});
			});
		});

		it('should update error state if get reactions failed with response', () => {
			const error = { code: 503, reason: 'error' };
			const response = createSafeRejectedPromise(error);

			(fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(response);

			store.getReactions(containerAri, ari);

			jest.runAllTimers();

			expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

			return expect(store.getState()).toMatchObject({
				reactions: {
					[`${containerAri}|${ari}`]: {
						status: ReactionStatus.error,
						reactions: [],
					},
				},
				flash: {},
				particleEffectByEmoji: {},
			});
		});

		// errors thrown at requestService.fetch in serviceUtils
		it('should update error state if get reactions failed with no response but error code available', async () => {
			const error = { code: 404, reason: 'error' };

			(fakeClient.getReactions as jest.Mock<any>).mockRejectedValueOnce(error);

			store.getReactions(containerAri, ari);

			jest.runAllTimers();

			expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

			await waitFor(() => {
				expect(store.getState()).toMatchObject({
					reactions: {
						[`${containerAri}|${ari}`]: {
							status: ReactionStatus.error,
							reactions: [],
						},
					},
					flash: {},
					particleEffectByEmoji: {},
				});
			});
		});

		// errors thrown at requestService.fetch in serviceUtils
		it('should update error state if get reactions failed with no error code', async () => {
			const error = new Error(`I'm error`);

			(fakeClient.getReactions as jest.Mock<any>).mockRejectedValueOnce(error);

			store.getReactions(containerAri, ari);

			jest.runAllTimers();

			expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

			await waitFor(() => {
				expect(store.getState()).toMatchObject({
					reactions: {
						[`${containerAri}|${ari}`]: {
							status: ReactionStatus.error,
							reactions: [],
						},
					},
					flash: {},
					particleEffectByEmoji: {},
				});
			});
		});

		it('should notify notify onUpdate', () => {
			(fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(getReactionsResponse);

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
								getReactionSummary(':thumbsup:', 3, false),
								getReactionSummary(':fire:', 2, true),
								getReactionSummary(':clap:', 1, true),
							],
						},
					},
					flash: {},
					particleEffectByEmoji: {},
				});
			});
		});

		it('should not notify after removing the callback', () => {
			(fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(getReactionsResponse);

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
			store = new MemoryReactionsStore(
				fakeClient,
				{
					reactions: {
						[`${containerAri}|${ari}`]: {
							reactions: [
								getReactionSummary(':thumbsup:', 3, false),
								getReactionSummary(':clap:', 3, true),
							],
							status: ReactionStatus.ready,
						},
					},
					flash: {},
					particleEffectByEmoji: {},
				},
				metadata,
			);
		});

		it('should send metadata information when adding a reaction', () => {
			const response = Promise.resolve(getReactionSummary(':thumbsup:', 4, true));

			(fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

			store.addReaction(containerAri, ari, '1f44d');

			expect(fakeClient.addReaction).toBeCalledWith(containerAri, ari, '1f44d', metadata);
		});
	});
	describe('with state set', () => {
		beforeEach(() => {
			store = new MemoryReactionsStore(fakeClient, {
				reactions: {
					[`${containerAri}|${ari}`]: {
						reactions: [
							getReactionSummary(':thumbsup:', 3, false),
							getReactionSummary(':clap:', 3, true),
						],
						status: ReactionStatus.ready,
					},
				},
				flash: {},
				particleEffectByEmoji: {},
			});
		});

		it('should call adaptor to add reaction', () => {
			const response = Promise.resolve(getReactionSummary(':thumbsup:', 4, true));

			(fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

			store.addReaction(containerAri, ari, '1f44d');

			expect(store.getState()).toMatchObject({
				reactions: {
					[`${containerAri}|${ari}`]: {
						status: ReactionStatus.ready,
						reactions: [
							{
								...getReactionSummary(':thumbsup:', 4, true),
								optimisticallyUpdated: true,
							},
							getReactionSummary(':clap:', 3, true),
						],
					},
				},
			});
		});

		it('should call adaptor to add reaction using toggle action', () => {
			const response = Promise.resolve(getReactionSummary(':thumbsup:', 4, true));

			(fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

			store.toggleReaction(containerAri, ari, '1f44d');

			expect(store.getState()).toMatchObject({
				reactions: {
					[`${containerAri}|${ari}`]: {
						status: ReactionStatus.ready,
						reactions: [
							{
								...getReactionSummary(':thumbsup:', 4, true),
								optimisticallyUpdated: true,
							},
							getReactionSummary(':clap:', 3, true),
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
							getReactionSummary(':thumbsup:', 3, false),
							getReactionSummary(':clap:', 3, true),
						],
					},
				},
				flash: {
					[`${containerAri}|${ari}`]: { '1f44f': true },
				},
				particleEffectByEmoji: {},
			});

			expect(fakeClient.addReaction).not.toHaveBeenCalled();
		});

		it('should call success callback passed to add reaction using toggle action if defined', async () => {
			const REACTIONS_COUNT = 4;
			const response = Promise.resolve(getReactionSummary(':thumbsup:', REACTIONS_COUNT, true));

			(fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

			await store.toggleReaction(containerAri, ari, '1f44d', successCallBackFn);

			expect(successCallBackFn).toHaveBeenCalledTimes(1);

			expect(successCallBackFn).toHaveBeenCalledWith(
				ReactionUpdateType.added,
				ari,
				'1f44d',
				REACTIONS_COUNT,
			);
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
							getReactionSummary(':thumbsup:', 3, false),
							{
								...getReactionSummary(':clap:', 2, false),
								optimisticallyUpdated: true,
							},
						],
					},
				},
			});
		});

		it('should call success callback passed to remove reaction using toggle action if defined', () => {
			const response = Promise.resolve();
			(fakeClient.deleteReaction as jest.Mock<any>).mockReturnValueOnce(response);

			store.toggleReaction(containerAri, ari, '1f44f', successCallBackFn);

			expect(successCallBackFn).toHaveBeenCalledTimes(1);
		});
	});

	describe('SLI analytics', () => {
		beforeEach(() => {
			store = new MemoryReactionsStore(fakeClient, {
				reactions: {
					[`${containerAri}|${ari}`]: {
						reactions: [
							getReactionSummary(':thumbsup:', 3, false),
							getReactionSummary(':clap:', 3, true),
						],
						status: ReactionStatus.ready,
					},
				},
				flash: {},
				particleEffectByEmoji: {},
			});
		});

		describe('getDetailedReaction analytics', () => {
			it('should call adaptor to get detailed reaction', async () => {
				const response = Promise.resolve({
					...getReactionSummary(':thumbsup:', 1, true),
					users: [getUser('id', 'Some real user')],
				});
				(fakeClient.getDetailedReaction as jest.Mock<any>).mockReturnValueOnce(response);

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
									...getReactionSummary(':thumbsup:', 3, false),
									users: [getUser('id', 'Some real user')],
								},
								getReactionSummary(':clap:', 3, true),
							],
						},
					},
				});
			});

			it('should not call adaptor when detailed reaction data failed to be fetched', async () => {
				const response = Promise.resolve(new Error('delete error'));
				(fakeClient.getDetailedReaction as jest.Mock<any>).mockRejectedValueOnce(response);

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
				const response = Promise.resolve(getReactionSummary(':thumbsup:', 4, true));
				store.setCreateAnalyticsEvent(fakeCreateAnalyticsEvent);
				(fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

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

				(fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

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
				const response = Promise.resolve(getReactionSummary(':thumbsup:', 4, true));
				store.setCreateAnalyticsEvent(undefined);
				(fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

				store.addReaction(containerAri, ari, '1f44d');

				await response;
				expect(fakeCreateAndFireSafe).not.toHaveBeenCalled();
			});
		});

		describe('removeReaction analytics', () => {
			it('should fire SLI analytics when reaction is removed successfully', async () => {
				const response = Promise.resolve();
				(fakeClient.deleteReaction as jest.Mock<any>).mockReturnValueOnce(response);

				store.toggleReaction(containerAri, ari, '1f44f');

				// Validate the start method been called
				expect(fakeRemoveUFOInstance.start).toBeCalled();
				await response;
				// Check success response
				expect(fakeRemoveUFOInstance.success).toBeCalled();
			});

			it('should fire SLI analytics when reaction failed to be removed', async () => {
				const response = Promise.resolve(new Error('delete error'));
				(fakeClient.deleteReaction as jest.Mock<any>).mockRejectedValueOnce(response);

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
				(fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(getReactionsResponse);

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
				(fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(response);

				store.setCreateAnalyticsEvent(fakeCreateAnalyticsEvent);
				store.getReactions(containerAri, ari);

				jest.runAllTimers();
				expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

				await getReactionsResponse;

				// assert
				expect(fakeRenderUFOInstance.start).toBeCalled();
				expect(fakeRenderUFOInstance.failure).toBeCalled();
				expect(fakeCreateAndFireSafe).toBeCalledWith(
					fakeCreateAnalyticsEvent,
					AnalyticsModule.createRestFailedEvent,
					'getReactions',
				);
			});

			it('should not fire getReactions SLI analytics when createAnalyticsEvent is not provided', async () => {
				(fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(getReactionsResponse);
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
