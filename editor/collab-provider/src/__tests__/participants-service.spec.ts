import './jest_mocks/socket.io-client.mock';

import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { collab } from '@atlaskit/prosemirror-collab';
import { createSocketIOCollabProvider } from '../socket-io-provider';
import type { Config } from '../types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import type { Channel } from '../channel';
import type { ParticipantsService } from '../participants/participants-service';
import type { Provider } from '../provider';

describe('participantsService integration tests', () => {
	let provider: Provider;
	let participantsService: ParticipantsService;
	let channel: Channel;
	const documentAri = 'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230';
	const collabProviderUrl = 'http://localhost/ccollab'; // Not important but preparing this for a good E2E test
	const getUserMock = jest.fn().mockReturnValue('test-user');
	const analyticsWebClientMock: AnalyticsWebClient = {
		sendUIEvent: jest.fn(),
		sendOperationalEvent: jest.fn(),
		sendTrackEvent: jest.fn(),
		sendScreenEvent: jest.fn(),
	};
	const permissionTokenRefreshMock = jest.fn(() => Promise.resolve('permission-token'));
	let channelBroadcastSpy: jest.SpyInstance;

	const providerConfig: Omit<Config, 'createSocket'> = {
		documentAri,
		url: collabProviderUrl,
		getUser: getUserMock,
		need404: true,
		analyticsClient: analyticsWebClientMock,
		productInfo: {
			product: 'Confluence',
		},
		permissionTokenRefresh: permissionTokenRefreshMock,
	};

	// Create fake EditorState with Collab Plugin
	const editorState = createEditorState(
		doc(p('lol')),
		collab({ clientID: 3771180701 }) as SafePlugin,
	);
	const getStateMock = jest.fn().mockReturnValue(editorState);

	beforeEach(() => {
		provider = createSocketIOCollabProvider(providerConfig);
		// provider.on('error', () => {}); // Noop error handler so the mock throwing errors doesn't cause issues
		// @ts-expect-error access private variable
		participantsService = provider.participantsService;
		// @ts-expect-error access private variable
		channel = provider.channel;
		channelBroadcastSpy = jest.spyOn(
			participantsService,
			// @ts-expect-error
			'channelBroadcast',
		);
	});

	afterEach(() => {
		provider.destroy();
		jest.clearAllMocks();
	});

	describe('correct function behaviour', () => {
		it('channelBroadcast calls channel.socket.emit with correct data', () => {
			provider.setup({ getState: getStateMock });
			channel.getSocket()!.connect();
			// clear socket io usages of below functions calls before testing
			jest.clearAllMocks();
			// @ts-expect-error access private variable
			participantsService.channelBroadcast('test:type', {
				whoIsAwesome: 'zarif',
			});
			expect(channelBroadcastSpy).toBeCalledTimes(1);
			expect(channel.getSocket()!.emit).toBeCalledTimes(1);
			expect(channel.getSocket()!.emit).toBeCalledWith(
				'broadcast',
				{
					type: 'test:type',
					whoIsAwesome: 'zarif',
				},
				undefined, //no callbacks passed
			);
		});

		it('getPresenceData should return provider data correclty', () => {
			// @ts-expect-error access private variable
			expect(participantsService.getPresenceData()).toEqual(
				// @ts-expect-error access private variable
				provider.getPresenceData(),
			);
		});

		it('sendPresence should call channel.socket.emit with local provider data', () => {
			provider.setup({ getState: getStateMock });
			channel.getSocket()!.connect();
			// clear socket io usages of below functions calls before testing
			jest.clearAllMocks();

			// @ts-expect-error access private variable
			participantsService.sendPresence();
			expect(channelBroadcastSpy).toBeCalledTimes(1);
			expect(channel.getSocket()!.emit).toBeCalledTimes(1);
			expect(channel.getSocket()!.emit).toBeCalledWith(
				'broadcast',
				{
					type: 'participant:updated',
					// @ts-expect-error
					...provider.getPresenceData(),
				},
				undefined, //no callbacks passed
			);
		});

		it('setUserId updates userId in Provider', () => {
			// @ts-expect-error access private variable
			participantsService.setUserId('new-user-id');
			// @ts-expect-error access private variable
			expect(provider.userId).toEqual('new-user-id');
		});

		it('emit correctly emits data on provider', (done) => {
			provider.on('telepointer', (data) => {
				expect(data).toEqual({ data: 'test' });
				done();
			});

			// @ts-expect-error
			participantsService.emit('telepointer', { data: 'test' });
		});

		it('getUser returns correct user', () => {
			// @ts-expect-error
			expect(participantsService.getUser()).toEqual('test-user');
		});
	});

	describe('emitting events', () => {
		beforeEach(() => {
			jest.spyOn(participantsService, 'onPresence');
			jest.spyOn(participantsService, 'onPresenceJoined');
			provider.setup({ getState: getStateMock });
			// check mock socketio client to see what events happening on connect
			channel.getSocket()?.connect();
		});

		it('emits both presence events when connecting to BE', () => {
			expect(participantsService.onPresence).toBeCalledTimes(1);
			// 2 times for connecting to BE (i.e. mock.io) 3rd time for other user join behaviour in mock io
			// we really only looking for first two. ie
			//  1) when channel recieves a presence event from BE it sends its own details
			//  2) also sends a presence:joined event
			// (see onPresence in ParticipantsService)
			expect(channel.getSocket()!.emit).toBeCalledTimes(2 + 1);
			expect(channel.getSocket()!.emit).toHaveBeenNthCalledWith(
				1,
				'broadcast',
				{
					type: 'participant:updated',
					// @ts-expect-error private
					...provider.getPresenceData(),
				},
				undefined,
			);
			expect(channel.getSocket()!.emit).toHaveBeenNthCalledWith(2, 'presence:joined');
		});

		it('sends presence when other participants join', () => {
			// first call is from itself after calling sendPresenceJoined inside onPresence
			// second on is from BE when a new participant joins (the one we are interested in)!
			expect(participantsService.onPresenceJoined).toBeCalledTimes(1 + 1);
			expect(participantsService.onPresenceJoined).toHaveBeenNthCalledWith(2, {
				sessionId: 'NX5-eFC6rmgE7Y3PAH1D',
				timestamp: 1680759407925,
			});
		});

		it('updates participants state on new participants joining', () => {
			// on socket connect in beforeEach of this describe block, an event is sent to
			// mimic joining of another participant, this test ensures that participant
			// is added to our local state
			expect(
				// @ts-expect-error private variable
				participantsService.participantsState.getBySessionId('NX5-eFC6rmgE7Y3PAH1D'),
			).toEqual({
				// this is sent from our mock socket io client
				avatar: '',
				clientId: 3274991230,
				lastActive: 1680759407071,
				name: '',
				sessionId: 'NX5-eFC6rmgE7Y3PAH1D',
				permit: {
					isPermittedToEdit: true,
					isPermittedToView: true,
					isPermittedToComment: true,
				},
				userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
				email: '',
			});
		});
	});
});
