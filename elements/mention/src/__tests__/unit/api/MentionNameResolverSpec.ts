import {
	DefaultMentionNameResolver,
	mergeNameResolverQueues,
	type MentionNameResolver,
} from '../../../api/MentionNameResolver';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { type MentionNameClient } from '../../../api/MentionNameClient';
import { isPromise, type MentionNameDetails, MentionNameStatus } from '../../../types';
import { type CreateUIAnalyticsEvent, UIAnalyticsEvent } from '@atlaskit/analytics-next';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('MentionNameResolver', () => {
	let mentionNameResolver: MentionNameResolver;
	let mentionNameClientMock: MentionNameClient;
	let lookupMentionNames: jest.Mock<(ids: string[]) => Promise<MentionNameDetails[]>>;

	beforeEach(() => {
		lookupMentionNames = jest.fn();
		mentionNameClientMock = {
			getLookupLimit: () => 2,
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			lookupMentionNames,
		};
		mentionNameResolver = new DefaultMentionNameResolver(mentionNameClientMock);

		jest.useFakeTimers({ legacyFakeTimers: true });
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('lookup when cached does not call client', () => {
		mentionNameResolver.cacheName('cheese', 'bacon');
		expect(mentionNameResolver.lookupName('cheese')).toEqual({
			id: 'cheese',
			name: 'bacon',
			status: MentionNameStatus.OK,
		});
		expect(lookupMentionNames).toHaveBeenCalledTimes(0);
	});

	it('lookup when not cached, and found in client', (done) => {
		lookupMentionNames.mockReturnValue(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'cheese',
					name: 'bacon',
					status: MentionNameStatus.OK,
				},
			]),
		);
		const namePromise = mentionNameResolver.lookupName('cheese');
		jest.runAllTimers();
		if (isPromise(namePromise)) {
			namePromise
				.then((name) => {
					expect(name).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					// Ensure cached
					const name2 = mentionNameResolver.lookupName('cheese');
					expect(name2).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					done();
				})
				.catch((err) => fail(`Promise was rejected ${err}`));
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${typeof namePromise}`);
		}
	});

	it('lookup when not cached, and not found in client', (done) => {
		lookupMentionNames.mockReturnValue(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'cheese',
					status: MentionNameStatus.UNKNOWN,
				},
			]),
		);
		const namePromise = mentionNameResolver.lookupName('cheese');
		jest.runAllTimers();
		if (isPromise(namePromise)) {
			namePromise
				.then((name) => {
					expect(name).toEqual({
						id: 'cheese',
						status: MentionNameStatus.UNKNOWN,
					});
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					done();
				})
				.catch((err) => fail(`Promise was rejected ${err}`));
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${typeof namePromise}`);
		}
	});

	it('lookup when not cached, and error for id in client', (done) => {
		lookupMentionNames.mockReturnValue(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'cheese',
					status: MentionNameStatus.SERVICE_ERROR,
				},
			]),
		);
		const namePromise = mentionNameResolver.lookupName('cheese');
		jest.runAllTimers();
		if (isPromise(namePromise)) {
			namePromise
				.then((name) => {
					expect(name).toEqual({
						id: 'cheese',
						status: MentionNameStatus.SERVICE_ERROR,
					});
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					done();
				})
				.catch((err) => fail(`Promise was rejected ${err}`));
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${typeof namePromise}`);
		}
	});

	it('lookup when not cached, and error in client', (done) => {
		// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
		//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
		lookupMentionNames.mockReturnValue(Promise.reject('bad times'));
		const namePromise = mentionNameResolver.lookupName('cheese');
		jest.runAllTimers();
		if (isPromise(namePromise)) {
			namePromise
				.then((name) => {
					expect(name).toEqual({
						id: 'cheese',
						status: MentionNameStatus.SERVICE_ERROR,
					});
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					done();
				})
				.catch((err) => fail(`Promise was rejected ${err}`));
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${typeof namePromise}`);
		}
	});

	it('lookup when not cached, exceed batch size', (done) => {
		lookupMentionNames.mockReturnValueOnce(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'cheese',
					name: 'bacon',
					status: MentionNameStatus.OK,
				},
				{
					id: 'ham',
					name: 'mustard',
					status: MentionNameStatus.OK,
				},
			]),
		);
		lookupMentionNames.mockReturnValueOnce(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'mighty',
					name: 'mouse',
					status: MentionNameStatus.OK,
				},
			]),
		);
		// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
		//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
		lookupMentionNames.mockRejectedValue('unexpected call');
		const promises = [
			mentionNameResolver.lookupName('cheese'),
			mentionNameResolver.lookupName('ham'),
			mentionNameResolver.lookupName('mighty'),
		];

		jest.runAllTimers();

		if (promises.every((p) => isPromise(p))) {
			Promise.all(promises)
				.then((names) => {
					expect(lookupMentionNames).toHaveBeenCalledTimes(2);
					expect(lookupMentionNames).toHaveBeenNthCalledWith(1, ['cheese', 'ham']);
					expect(lookupMentionNames).toHaveBeenNthCalledWith(2, ['mighty']);
					expect(names[0]).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(names[1]).toEqual({
						id: 'ham',
						name: 'mustard',
						status: MentionNameStatus.OK,
					});
					expect(names[2]).toEqual({
						id: 'mighty',
						name: 'mouse',
						status: MentionNameStatus.OK,
					});
					// Ensure all cached (return value not promise)
					let cachedName = mentionNameResolver.lookupName('cheese');
					expect(cachedName).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					cachedName = mentionNameResolver.lookupName('ham');
					expect(cachedName).toEqual({
						id: 'ham',
						name: 'mustard',
						status: MentionNameStatus.OK,
					});
					cachedName = mentionNameResolver.lookupName('mighty');
					expect(cachedName).toEqual({
						id: 'mighty',
						name: 'mouse',
						status: MentionNameStatus.OK,
					});
					done();
				})
				.catch((err) => {
					fail(`Promises were rejected ${err}`);
				});
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${promises.map((p) => typeof p)}`);
		}
	});

	it('lookup twice when not cached, only one call to client, but both callbacks', (done) => {
		lookupMentionNames.mockReturnValue(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'cheese',
					name: 'bacon',
					status: MentionNameStatus.OK,
				},
			]),
		);
		const promises = [
			mentionNameResolver.lookupName('cheese'),
			mentionNameResolver.lookupName('cheese'),
		];

		jest.runAllTimers();

		if (promises.every((p) => isPromise(p))) {
			Promise.all(promises)
				.then((names) => {
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					expect(lookupMentionNames).toHaveBeenNthCalledWith(1, ['cheese']);
					expect(names[0]).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(names[1]).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					// Ensure all cached (return value not promise)
					const cachedName = mentionNameResolver.lookupName('cheese');
					expect(cachedName).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					done();
				})
				.catch((err) => {
					fail(`Promises were rejected ${err}`);
				});
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${promises.map((p) => typeof p)}`);
		}
	});

	it('lookup twice when not cached, but first request is "processing"', (done) => {
		let delayedResolve: any;
		const delayedPromise = new Promise((resolve) => {
			delayedResolve = resolve;
		});
		// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
		//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
		lookupMentionNames.mockReturnValueOnce(delayedPromise);
		lookupMentionNames.mockReturnValue(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.reject('only one call expected'),
		);

		const promise1 = mentionNameResolver.lookupName('cheese');
		jest.runAllTimers();

		expect(lookupMentionNames).toHaveBeenCalledTimes(1);

		// Second request after first request sent to service, but not returned
		const promise2 = mentionNameResolver.lookupName('cheese');

		const promises = [promise1, promise2];

		delayedResolve([
			{
				id: 'cheese',
				name: 'bacon',
				status: MentionNameStatus.OK,
			},
		]);

		if (promises.every((p) => isPromise(p))) {
			Promise.all(promises)
				.then((names) => {
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					expect(names[0]).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(names[1]).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					// Ensure all cached (return value not promise)
					const cachedName = mentionNameResolver.lookupName('cheese');
					expect(cachedName).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					done();
				})
				.catch((err) => {
					fail(`Promises were rejected ${err}`);
				});
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${promises.map((p) => typeof p)}`);
		}
	});

	it("processes queue if it's reached the queue limit", (done) => {
		lookupMentionNames.mockReturnValueOnce(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'cheese',
					name: 'bacon',
					status: MentionNameStatus.OK,
				},
				{
					id: 'ham',
					name: 'mustard',
					status: MentionNameStatus.OK,
				},
			]),
		);
		// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
		//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
		lookupMentionNames.mockRejectedValue('unexpected call');
		const promises = [
			mentionNameResolver.lookupName('cheese'),
			mentionNameResolver.lookupName('ham'),
		];

		// No need to run timers - should occur immediately

		if (promises.every((p) => isPromise(p))) {
			Promise.all(promises)
				.then((names) => {
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					expect(lookupMentionNames).toHaveBeenNthCalledWith(1, ['cheese', 'ham']);
					expect(names[0]).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(names[1]).toEqual({
						id: 'ham',
						name: 'mustard',
						status: MentionNameStatus.OK,
					});
					// Ensure all cached (return value not promise)
					let cachedName = mentionNameResolver.lookupName('cheese');
					expect(cachedName).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					cachedName = mentionNameResolver.lookupName('ham');
					expect(cachedName).toEqual({
						id: 'ham',
						name: 'mustard',
						status: MentionNameStatus.OK,
					});
					done();
				})
				.catch((err) => {
					fail(`Promises were rejected ${err}`);
				});
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${promises.map((p) => typeof p)}`);
		}
	});

	it('ensure debouncing of request to MentionNameClient', (done) => {
		lookupMentionNames.mockReturnValue(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'cheese',
					name: 'bacon',
					status: MentionNameStatus.OK,
				},
			]),
		);
		const namePromise = mentionNameResolver.lookupName('cheese');
		jest.advanceTimersByTime(DefaultMentionNameResolver.waitForBatch - 1);
		expect(lookupMentionNames).toHaveBeenCalledTimes(0);
		jest.advanceTimersByTime(2);
		expect(lookupMentionNames).toHaveBeenCalledTimes(1);

		if (isPromise(namePromise)) {
			namePromise
				.then((name) => {
					expect(name).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					// Ensure cached
					const name2 = mentionNameResolver.lookupName('cheese');
					expect(name2).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					done();
				})
				.catch((err) => fail(`Promise was rejected ${err}`));
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${typeof namePromise}`);
		}
	});

	it('lookup when not cached, missing id treated as Unknown', (done) => {
		lookupMentionNames.mockReturnValueOnce(
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			Promise.resolve([
				{
					id: 'cheese',
					name: 'bacon',
					status: MentionNameStatus.OK,
				},
			]),
		);
		// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
		//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
		lookupMentionNames.mockRejectedValue('unexpected call');
		const promises = [
			mentionNameResolver.lookupName('cheese'),
			mentionNameResolver.lookupName('ham'),
		];

		jest.runAllTimers();

		if (promises.every((p) => isPromise(p))) {
			Promise.all(promises)
				.then((names) => {
					expect(lookupMentionNames).toHaveBeenCalledTimes(1);
					expect(lookupMentionNames).toHaveBeenNthCalledWith(1, ['cheese', 'ham']);
					expect(names[0]).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					expect(names[1]).toEqual({
						id: 'ham',
						status: MentionNameStatus.UNKNOWN,
					});
					// Ensure all cached (return value not promise)
					let cachedName = mentionNameResolver.lookupName('cheese');
					expect(cachedName).toEqual({
						id: 'cheese',
						name: 'bacon',
						status: MentionNameStatus.OK,
					});
					cachedName = mentionNameResolver.lookupName('ham');
					expect(cachedName).toEqual({
						id: 'ham',
						status: MentionNameStatus.UNKNOWN,
					});
					done();
				})
				.catch((err) => {
					fail(`Promises were rejected ${err}`);
				});
		} else {
			fail(`Return type of lookupName is not a Promise, but a ${promises.map((p) => typeof p)}`);
		}
	});

	describe('analytics', () => {
		const baseEventPayload = {
			actionSubject: 'mention',
			actionSubjectId: 'hydration',
			eventType: 'operational',
		};
		let mockCreateAnalyticsEvent: jest.Mock<CreateUIAnalyticsEvent>;

		beforeEach(() => {
			mockCreateAnalyticsEvent = jest.fn();
			mockCreateAnalyticsEvent.mockImplementation(
				// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
				//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
				(payload) => new UIAnalyticsEvent(payload),
			);
			mentionNameResolver = new DefaultMentionNameResolver(
				mentionNameClientMock,
				// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
				//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
				{ createAnalyticsEvent: mockCreateAnalyticsEvent },
			);

			// jest.useFakeTimers does not affect Date.now(), so mock it to test duration analytics
			let now = 1000;
			jest.spyOn(Date, 'now').mockImplementation(() => {
				const currentTime = now;
				now = currentTime + 13;
				return currentTime;
			});
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		const analyticsTest = (mentionName: MentionNameDetails, action: string, done: Function) => {
			lookupMentionNames.mockReturnValue(
				// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
				//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
				new Promise((resolve) => {
					setTimeout(() => {
						resolve([mentionName]);
					}, 1000);
				}),
			);

			const namePromise = mentionNameResolver.lookupName(mentionName.id);
			jest.runAllTimers();

			if (isPromise(namePromise)) {
				namePromise
					.then((name) => {
						expect(name).toEqual(mentionName);
						// Check analytics
						expect(mockCreateAnalyticsEvent).toBeCalledTimes(1);
						expect(mockCreateAnalyticsEvent).toBeCalledWith(
							expect.objectContaining({
								...baseEventPayload,
								action,
								attributes: expect.objectContaining({
									duration: 13, // Mock implementation will increment by 13 for each Date.now();
									fromCache: false,
									userId: mentionName.id,
								}),
							}),
						);

						// Ensure cached
						const name2 = mentionNameResolver.lookupName('cheese');
						expect(name2).toEqual(mentionName);
						// Check analytics
						expect(mockCreateAnalyticsEvent).toBeCalledTimes(2);
						expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(
							2,
							expect.objectContaining({
								...baseEventPayload,
								action,
								attributes: expect.objectContaining({
									duration: 0,
									fromCache: true,
									userId: mentionName.id,
								}),
							}),
						);
						done();
					})
					.catch((err) => fail(`Promise was rejected ${err}`));
			} else {
				fail(`Return type of lookupName is not a Promise, but a ${typeof namePromise}`);
			}
		};

		it('Uncached, then cached mention', (done) => {
			analyticsTest(
				{
					id: 'cheese',
					name: 'bacon',
					status: MentionNameStatus.OK,
				},
				'completed',
				done,
			);
		});

		it('Uncached, cached mention with service error', (done) => {
			analyticsTest(
				{
					id: 'cheese',
					status: MentionNameStatus.SERVICE_ERROR,
				},
				'failed',
				done,
			);
		});

		it('Uncached, cached unknown mention', (done) => {
			analyticsTest(
				{
					id: 'cheese',
					status: MentionNameStatus.UNKNOWN,
				},
				'failed',
				done,
			);
		});
	});
});

describe(mergeNameResolverQueues.name, () => {
	it('merges callback items, does not overwrite any', () => {
		const [callbackA, callbackB, callbackC] = [jest.fn(), jest.fn(), jest.fn()];
		const queueA = new Map([['a', [callbackA]]]);
		const queueB = new Map([
			['a', [callbackB]],
			['b', [callbackC]],
		]);
		const result = mergeNameResolverQueues(queueA, queueB);
		const callbacks = result.get('a')!;
		expect(callbacks).toHaveLength(2);
		callbacks.forEach((callback) => {
			expect([callbackA, callbackB].includes(callback as jest.Mock)).toBe(true);
		});
	});

	it('includes items in the second queue not in the first one', () => {
		const [callbackA, callbackB, callbackC] = [jest.fn(), jest.fn(), jest.fn()];
		const queueA = new Map([['a', [callbackA]]]);
		const queueB = new Map([
			['a', [callbackB]],
			['b', [callbackC]],
		]);
		const result = mergeNameResolverQueues(queueA, queueB);
		expect(result.get('b')).toEqual([callbackC]);
	});

	it('deduplicates callbacks with the same references that happen to be across queues', () => {
		const [callbackA, callbackB] = [jest.fn(), jest.fn()];
		const queueA = new Map([['a', [callbackA]]]);
		const queueB = new Map([
			['a', [callbackA]],
			['b', [callbackB]],
		]);
		const result = mergeNameResolverQueues(queueA, queueB);
		expect(result.get('a')).toEqual([callbackA]);
	});
});
