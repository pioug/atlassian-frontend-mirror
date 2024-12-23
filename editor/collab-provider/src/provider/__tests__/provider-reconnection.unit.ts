import { createSocketIOCollabProvider } from '../../socket-io-provider';
import { replaceRaf } from 'raf-stub';
import { Channel } from '../../channel';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { Node } from '@atlaskit/editor-prosemirror/model';

replaceRaf();

// jest.mock('@atlaskit/prosemirror-collab', () => ({
// 	sendableSteps: (state: any) => state.collab,
// 	getCollabState: (state: any) => state.collab,
// }));

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
		};
	}
	return {
		Channel,
	};
});

jest.mock('../../document/catchupv2', () => {
	return {
		catchupv2: jest.fn().mockImplementation(() => Promise.resolve()),
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

		jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 2 * 1000); // Time travel 3s to the past
		channel.emit('disconnect', {
			reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
		});

		channel.emit('connected', {
			sid: 'pweq3Q7NOPY4y88QAGyr',
			initialized: true,
		});

		(requestAnimationFrame as any).step();
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(0);
		provider.destroy();
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
