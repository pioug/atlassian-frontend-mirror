import { createSocketIOCollabProvider } from '../../socket-io-provider';
import { replaceRaf } from 'raf-stub';
import { Channel } from '../../channel';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { Node } from '@atlaskit/editor-prosemirror/model';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';

import { catchupv2 } from '../../document/catchupv2';
import * as getConflictChanges from '../../document/getConflictChanges';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

replaceRaf();

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

jest.mock('../commit-step');

jest.mock('../../channel', () => {
	const events = new Map<string, (...args: any) => {}>();

	function Channel() {
		return {
			emit: (event: string, ...args: any[]) => {
				const handler = events.get(event);
				if (handler) {
					handler(...args);
				}
			},
			on: jest.fn().mockImplementation(function (this: any, eventName, callback) {
				events.set(eventName, callback);
				// Ignored via go/ees005
				// eslint-disable-next-line no-invalid-this
				return this;
			}),
			connect: jest.fn(),
			broadcast: () => jest.fn(),
			fetchCatchupv2: () => jest.fn(),
			sendMetadata: () => jest.fn(),
			fetchReconcile: () => jest.fn(),
			disconnect: jest.fn(),
			getConnected: () => true,
		};
	}
	return {
		Channel,
	};
});

jest.mock('../../document/catchupv2', () => {
	return {
		catchupv2: jest.fn().mockImplementation(({ onCatchupComplete }) => {
			onCatchupComplete();
			return Promise.resolve();
		}),
	};
});

const testProviderConfig = {
	url: `http://provider-url:66661`,
	documentAri: 'ari:cloud:confluence:ABC:page/testpage',
};
const clientId = 'some-random-prosemirror-client-Id';

const editorState: any = {
	plugins: [
		{
			key: 'collab$',
			spec: {
				config: {
					clientID: clientId,
				},
			},
		},
	],
	collab: {
		steps: [],
		origins: [],
		version: 0,
	},
	doc: Node.fromJSON(defaultSchema, {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					{ type: 'text', text: 'Hello, World!' },
					{
						// Add a node that looks different in ADF
						type: 'text',
						marks: [
							{
								type: 'typeAheadQuery',
								attrs: {
									trigger: '/',
								},
							},
						],
						text: '/',
					},
				],
			},
		],
	}),
};

describe('reconnection analytics', () => {
	let channel: any;

	beforeEach(() => {
		const analyticsHelper = new AnalyticsHelper(testProviderConfig.documentAri);
		channel = new Channel({} as any, analyticsHelper);
	});

	afterEach(jest.clearAllMocks);

	eeTest
		.describe('collab_bypass_out_of_sync_period_experiment', 'experiment disabled')
		.variant(false, () => {
			it('Should not reconnecting analytics after being disconnected for less than 3s', async () => {
				const fakeAnalyticsWebClient = {
					sendOperationalEvent: jest.fn(),
					sendScreenEvent: jest.fn(),
					sendTrackEvent: jest.fn(),
					sendUIEvent: jest.fn(),
				};
				const provider = createSocketIOCollabProvider({
					...testProviderConfig,
					analyticsClient: fakeAnalyticsWebClient,
				});
				provider.initialize(() => editorState);

				jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 2 * 1000); // Time travel 2s to the past
				channel.emit('disconnect', {
					reason: 'Testing - Faking that we got disconnected 2s ago',
				});

				channel.emit('connected', {
					sid: 'pweq3Q7NOPY4y88QAGyr',
					initialized: true,
				});

				(requestAnimationFrame as any).step();
				// With experiment disabled, catchupv2 should NOT be called for < 3s disconnection
				expect(catchupv2).not.toHaveBeenCalled();
				expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(0);
				provider.destroy();
			});
		});

	it('Should trigger reconnecting analytics after being disconnected for more than 3s', async () => {
		const fakeAnalyticsWebClient = {
			sendOperationalEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendUIEvent: jest.fn(),
		};
		const provider = createSocketIOCollabProvider({
			...testProviderConfig,
			analyticsClient: fakeAnalyticsWebClient,
		});
		provider.initialize(() => editorState);

		jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 3 * 1000); // Time travel 3s to the past
		channel.emit('disconnect', {
			reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
		});

		channel.emit('connected', {
			sid: 'pweq3Q7NOPY4y88QAGyr',
			initialized: true,
		});

		(requestAnimationFrame as any).step();
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledWith({
			action: 'providerReconnection',
			actionSubject: 'collab',
			attributes: {
				collabService: 'ncs',
				disconnectionPeriodSeconds: 3,
				remoteStepsLength: 0,
				unconfirmedStepsLength: undefined,
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				eventStatus: 'INFO',
				network: {
					status: 'ONLINE',
				},
				packageName: '@product/platform',
				packageVersion: '0.0.0',
				subProduct: undefined,
			},
			source: 'unknown',
			tags: ['editor'],
		});
		provider.destroy();
	});

	it('Should trigger reconnecting analytics after being disconnected for more than 5s', async () => {
		const fakeAnalyticsWebClient = {
			sendOperationalEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendUIEvent: jest.fn(),
		};
		const provider = createSocketIOCollabProvider({
			...testProviderConfig,
			analyticsClient: fakeAnalyticsWebClient,
		});
		provider.initialize(() => editorState);

		jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 5.1 * 1000); // Time travel 5s to the past
		channel.emit('disconnect', {
			reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
		});

		channel.emit('connected', {
			sid: 'pweq3Q7NOPY4y88QAGyr',
			initialized: true,
		});

		(requestAnimationFrame as any).step();
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledWith({
			action: 'providerReconnection',
			actionSubject: 'collab',
			attributes: {
				collabService: 'ncs',
				disconnectionPeriodSeconds: 5,
				remoteStepsLength: 0,
				unconfirmedStepsLength: undefined,
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				eventStatus: 'INFO',
				network: {
					status: 'ONLINE',
				},
				packageName: '@product/platform',
				packageVersion: '0.0.0',
				subProduct: undefined,
			},
			source: 'unknown',
			tags: ['editor'],
		});
		provider.destroy();
	});

	it('Should trigger reconnecting analytics with unconfirmed steps after being disconnected', async () => {
		const fakeAnalyticsWebClient = {
			sendOperationalEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendUIEvent: jest.fn(),
		};
		const provider = createSocketIOCollabProvider({
			...testProviderConfig,
			analyticsClient: fakeAnalyticsWebClient,
		});
		provider.initialize(() => editorState);

		const mockedSteps = [{ type: 'fakeStep' }, { type: 'fakeStep' }];
		jest
			// @ts-ignore
			.spyOn(provider.documentService as any, 'getUnconfirmedSteps')
			.mockImplementationOnce(() => mockedSteps);

		jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 3 * 1000); // Time travel 3s to the past
		channel.emit('disconnect', {
			reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
		});

		channel.emit('connected', {
			sid: 'pweq3Q7NOPY4y88QAGyr',
			initialized: true,
		});

		(requestAnimationFrame as any).step();
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledWith({
			action: 'providerReconnection',
			actionSubject: 'collab',
			attributes: {
				collabService: 'ncs',
				disconnectionPeriodSeconds: 3,
				remoteStepsLength: 0,
				unconfirmedStepsLength: 2,
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				eventStatus: 'INFO',
				network: {
					status: 'ONLINE',
				},
				packageName: '@product/platform',
				packageVersion: '0.0.0',
				subProduct: undefined,
			},
			source: 'unknown',
			tags: ['editor'],
		});
		provider.destroy();
	});

	it('Should trigger reconnecting analytics with remote steps after being disconnected', async () => {
		const fakeAnalyticsWebClient = {
			sendOperationalEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendUIEvent: jest.fn(),
		};
		const provider = createSocketIOCollabProvider({
			...testProviderConfig,
			analyticsClient: fakeAnalyticsWebClient,
		});

		(catchupv2 as jest.Mock).mockImplementation(({ onCatchupComplete }) => {
			onCatchupComplete([{ step: 'remoteStep' }, { step: 'remoteStep' }, { step: 'remoteStep' }]);
			return Promise.resolve();
		});
		provider.initialize(() => editorState);

		jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 3 * 1000); // Time travel 3s to the past
		channel.emit('disconnect', {
			reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
		});

		channel.emit('connected', {
			sid: 'pweq3Q7NOPY4y88QAGyr',
			initialized: true,
		});

		(requestAnimationFrame as any).step();
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledWith({
			action: 'providerReconnection',
			actionSubject: 'collab',
			attributes: {
				collabService: 'ncs',
				disconnectionPeriodSeconds: 3,
				remoteStepsLength: 3,
				unconfirmedStepsLength: undefined,
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				eventStatus: 'INFO',
				network: {
					status: 'ONLINE',
				},
				packageName: '@product/platform',
				packageVersion: '0.0.0',
				subProduct: undefined,
			},
			source: 'unknown',
			tags: ['editor'],
		});
		provider.destroy();
	});

	eeTest
		.describe('collab_bypass_out_of_sync_period_experiment', 'experiment enabled')
		.variant(true, () => {
			it('Should trigger reconnecting analytics after being disconnected for less than 3s when experiment is enabled', async () => {
				// Reset catchupv2 mock to return empty steps for this test
				(catchupv2 as jest.Mock).mockImplementation(({ onCatchupComplete }) => {
					onCatchupComplete([]);
					return Promise.resolve();
				});

				const fakeAnalyticsWebClient = {
					sendOperationalEvent: jest.fn(),
					sendScreenEvent: jest.fn(),
					sendTrackEvent: jest.fn(),
					sendUIEvent: jest.fn(),
				};
				const provider = createSocketIOCollabProvider({
					...testProviderConfig,
					analyticsClient: fakeAnalyticsWebClient,
				});
				provider.initialize(() => editorState);

				jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 2 * 1000);
				channel.emit('disconnect', {
					reason: 'Testing - Faking that we got disconnected 2s ago',
				});

				channel.emit('connected', {
					sid: 'pweq3Q7NOPY4y88QAGyr',
					initialized: true,
				});

				(requestAnimationFrame as any).step();
				// With experiment enabled, catchupv2 should be called even for < 3s disconnection
				expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(1);
				expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledWith({
					action: 'providerReconnection',
					actionSubject: 'collab',
					attributes: {
						collabService: 'ncs',
						disconnectionPeriodSeconds: 2,
						remoteStepsLength: 0,
						unconfirmedStepsLength: undefined,
						documentAri: 'ari:cloud:confluence:ABC:page/testpage',
						eventStatus: 'INFO',
						network: {
							status: 'ONLINE',
						},
						packageName: '@product/platform',
						packageVersion: '0.0.0',
						subProduct: undefined,
					},
					source: 'unknown',
					tags: ['editor'],
				});
				provider.destroy();
			});
		});

	eeTest
		.describe('platform_editor_offline_editing_web', 'With experiment enabled')
		.variant(true, () => {
			const editorState: any = {
				config: {
					pluginsByKey: {
						collab$: {
							spec: {
								config: {
									clientID: clientId,
								},
							},
						},
					},
				},
				plugins: [
					{
						key: 'collab$',
						spec: {
							config: {
								clientID: clientId,
							},
						},
					},
				],
				collab$: {
					unconfirmed: [{ step: { type: 'fakeStep' } }],
					spec: {
						config: {
							clientID: clientId,
						},
					},
				},
				collab: {
					steps: [{ type: 'fakeStep' }],
					origins: [],
					version: 0,
				},
				doc: Node.fromJSON(defaultSchema, {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{ type: 'text', text: 'Hello, World!' },
								{
									// Add a node that looks different in ADF
									type: 'text',
									marks: [
										{
											type: 'typeAheadQuery',
											attrs: {
												trigger: '/',
											},
										},
									],
									text: '/',
								},
							],
						},
					],
				}),
			};

			it('should notify editor of potential conflict after being disconnected', () => {
				const fakeAnalyticsWebClient = {
					sendOperationalEvent: jest.fn(),
					sendScreenEvent: jest.fn(),
					sendTrackEvent: jest.fn(),
					sendUIEvent: jest.fn(),
				};
				const remoteSteps = [
					{ step: 'remoteStep' },
					{ step: 'remoteStep' },
					{ step: 'remoteStep' },
				];
				// @ts-expect-error
				jest.spyOn(getConflictChanges, 'getConflictChanges').mockImplementation(() => ({
					inserted: [{ from: 1, to: 2 }],
					deleted: [],
				}));
				// @ts-expect-error
				jest.spyOn(ProseMirrorStep, 'fromJSON').mockImplementation(() => remoteSteps);
				const provider = createSocketIOCollabProvider({
					...testProviderConfig,
					analyticsClient: fakeAnalyticsWebClient,
				});
				// @ts-expect-error
				const emitterCallback = jest.spyOn(provider.documentService as any, 'providerEmitCallback');
				(catchupv2 as jest.Mock).mockImplementation(({ onCatchupComplete }) => {
					onCatchupComplete(remoteSteps);
					return Promise.resolve();
				});
				provider.initialize(() => editorState);

				jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 3 * 1000); // Time travel 3s to the past
				channel.emit('disconnect', {
					reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
				});

				channel.emit('connected', {
					sid: 'pweq3Q7NOPY4y88QAGyr',
					initialized: true,
				});

				(requestAnimationFrame as any).step();

				expect(emitterCallback).toHaveBeenCalledWith('data:conflict', {
					offlineDoc: expect.any(Object),
					inserted: expect.any(Array),
					deleted: expect.any(Array),
				});

				provider.destroy();
			});

			it('should not notify after being disconnected if there are no remote steps', () => {
				const fakeAnalyticsWebClient = {
					sendOperationalEvent: jest.fn(),
					sendScreenEvent: jest.fn(),
					sendTrackEvent: jest.fn(),
					sendUIEvent: jest.fn(),
				};
				const provider = createSocketIOCollabProvider({
					...testProviderConfig,
					analyticsClient: fakeAnalyticsWebClient,
				});
				// @ts-expect-error
				const emitterCallback = jest.spyOn(provider.documentService as any, 'providerEmitCallback');
				(catchupv2 as jest.Mock).mockImplementation(({ onCatchupComplete }) => {
					onCatchupComplete([]);
					return Promise.resolve();
				});
				provider.initialize(() => editorState);

				jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 3 * 1000); // Time travel 3s to the past
				channel.emit('disconnect', {
					reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
				});

				channel.emit('connected', {
					sid: 'pweq3Q7NOPY4y88QAGyr',
					initialized: true,
				});

				(requestAnimationFrame as any).step();

				expect(emitterCallback).not.toHaveBeenCalledWith('data:conflict', {
					offlineDoc: expect.any(Object),
				});

				provider.destroy();
				emitterCallback.mockClear();
			});
		});
});
