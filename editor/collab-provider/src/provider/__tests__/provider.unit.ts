jest.useFakeTimers({ legacyFakeTimers: true });

jest.mock('@atlaskit/prosemirror-collab', () => ({
	sendableSteps: (state: any) => state.collab,
	getCollabState: (state: any) => state.collab,
}));

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

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { UserPermitType } from '@atlaskit/editor-common/collab';
import { Node } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import type { Provider } from '../';
import { MAX_STEP_REJECTED_ERROR } from '../';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { Channel } from '../../channel';
import { catchupv2 } from '../../document/catchupv2';
import { ACK_MAX_TRY, CatchupEventReason } from '../../helpers/const';
import * as Utilities from '../../helpers/utils';
import * as Telepointer from '../../participants/telepointers-helper';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import { commitStepQueue } from '../commit-step';
// @ts-ignore only used for mock
import ProseMirrorCollab from '@atlaskit/prosemirror-collab';
import { ProviderInitialisationError } from '../../errors/custom-errors';
import type { InternalError } from '../../errors/internal-errors';
import { INTERNAL_ERROR_CODE } from '../../errors/internal-errors';
import { NCS_ERROR_CODE } from '../../errors/ncs-errors';
import { NullDocumentService } from '../../document/null-document-service';
import { NullApi } from '../../api/null-api';
import { DocumentService } from '../../document/document-service';
import { Api } from '../../api/api';

const testProviderConfig = {
	url: `http://provider-url:66661`,
	documentAri: 'ari:cloud:confluence:ABC:page/testpage',
};

const testProviderConfigWithDraft = {
	initialDraft: {
		document: 'test-document' as any,
		version: 1,
		metadata: { title: 'random-title' },
	},
	...testProviderConfig,
	isBufferingEnabled: true,
};

const testProviderPresenceConfig = {
	...testProviderConfig,
	isPresenceOnly: true,
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

describe('Provider', () => {
	let channel: any;

	beforeEach(() => {
		const analyticsHelper = new AnalyticsHelper(testProviderConfig.documentAri);
		channel = new Channel({} as any, analyticsHelper);
	});

	afterEach(jest.clearAllMocks);

	describe('setup', () => {
		it('Should throw an error when cookies are not enabled', () => {
			const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');
			Object.defineProperty(global.navigator, 'cookieEnabled', {
				value: false,
				writable: true,
			});
			const provider = createSocketIOCollabProvider(testProviderConfig);
			expect(() => {
				provider.setup({ getState: () => editorState });
			}).toThrowErrorMatchingInlineSnapshot(
				`"Cookies are not enabled. Please enable cookies to use collaborative editing."`,
			);
			expect(sendErrorEventSpy).toHaveBeenCalledWith(
				new ProviderInitialisationError(
					'Cookies are not enabled. Please enable cookies to use collaborative editing.',
				),
				'Error while initialising the provider - cookies disabled',
			);
			Object.defineProperty(global.navigator, 'cookieEnabled', {
				value: true,
			});
		});
		it('Should initialize provider and calls catchupv2 on connect', async () => {
			expect.assertions(4);
			const sid = 'expected-sid-123';
			const provider = createSocketIOCollabProvider({
				...testProviderConfigWithDraft,
			});
			const sendStepsFromCurrentStateSpy = jest.spyOn(
				// @ts-ignore
				provider.documentService as any,
				'sendStepsFromCurrentState',
			);
			provider.on('init', (data) => {
				expect(data).toEqual({
					doc: 'test-document',
					version: 1,
					metadata: { title: 'random-title' },
				});
			});
			provider.setup({ getState: () => editorState });
			channel.emit('connected', { sid, initialized: true });
			expect((provider as any).isProviderInitialized).toEqual(true);
			expect((provider as any).isBuffered).toEqual(true);
			expect(sendStepsFromCurrentStateSpy).toHaveBeenCalledTimes(1);
		});

		it('Should start document setup and channel connection', (done) => {
			expect.assertions(3);
			const provider = createSocketIOCollabProvider(testProviderConfigWithDraft);
			const mockEditorState = jest.fn(() => editorState);
			const documentSetupSpy = jest.spyOn(
				// @ts-ignore
				provider.documentService as any,
				'setup',
			);
			const initializeChannelSpy = jest.spyOn(provider as any, 'initializeChannel');
			provider.setup({ getState: mockEditorState });
			expect(documentSetupSpy).toHaveBeenCalledTimes(1);
			expect(documentSetupSpy).toHaveBeenCalledWith({
				getState: mockEditorState,
				clientId: 'some-random-prosemirror-client-Id',
				onSyncUpError: undefined,
			});
			expect(initializeChannelSpy).toHaveBeenCalledTimes(1);
			done();
		});
		it('Should fire analytics events on initialization and buffering', async () => {
			expect.assertions(3);
			const sid = 'expected-sid-123';
			const provider = createSocketIOCollabProvider(testProviderConfigWithDraft);
			const sendActionEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendActionEvent');
			provider.on('init', (data) => {
				expect(data).toEqual({
					doc: 'test-document',
					version: 1,
					metadata: { title: 'random-title' },
				});
			});
			provider.setup({ getState: () => editorState });
			expect(sendActionEventSpy).toHaveBeenCalledWith('providerInitialized', 'INFO', {
				isBuffered: true,
			});
			channel.emit('connected', { sid, initialized: true });
			expect(sendActionEventSpy).toHaveBeenCalledWith('hasUnconfirmedSteps', 'INFO', {
				numUnconfirmedSteps: 0,
			});
		});

		it('Should use DocumentService and Api when isPresenceOnly is false', () => {
			const provider = createSocketIOCollabProvider(testProviderConfigWithDraft);
			expect(provider['documentService']).toBeInstanceOf(DocumentService);
			expect(provider['api']).toBeInstanceOf(Api);
		});
	});

	describe('setupForPresenceOnly', () => {
		it('Should throw an error when cookies are not enabled', () => {
			const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');
			Object.defineProperty(global.navigator, 'cookieEnabled', {
				value: false,
				writable: true,
			});
			const provider = createSocketIOCollabProvider(testProviderPresenceConfig);
			expect(() => {
				provider.setupForPresenceOnly(clientId);
			}).toThrowErrorMatchingInlineSnapshot(
				`"Cookies are not enabled. Please enable cookies to use collaborative editing."`,
			);
			expect(sendErrorEventSpy).toHaveBeenCalledWith(
				new ProviderInitialisationError(
					'Cookies are not enabled. Please enable cookies to use collaborative editing.',
				),
				'Error while initialising the provider - cookies disabled',
			);
			Object.defineProperty(global.navigator, 'cookieEnabled', {
				value: true,
			});
		});

		it('Should call initializeChannel once', () => {
			const provider = createSocketIOCollabProvider(testProviderPresenceConfig);
			const initializeChannelSpy = jest.spyOn(provider as any, 'initializeChannel');
			provider.setupForPresenceOnly(clientId);
			// make sure initializeChannel is called
			expect(initializeChannelSpy).toHaveBeenCalledTimes(1);
			provider.setupForPresenceOnly(clientId);
			// make sure initializeChannel is not called again
			expect(initializeChannelSpy).toHaveBeenCalledTimes(1);
		});

		it('Should use NullDocumentService and NullApi when isPresenceOnly is true', () => {
			const provider = createSocketIOCollabProvider(testProviderPresenceConfig);
			expect(provider['documentService']).toBeInstanceOf(NullDocumentService);
			expect(provider['api']).toBeInstanceOf(NullApi);
		});

		it('Should set the presenceActivity of the provider when passed in', () => {
			const provider = createSocketIOCollabProvider(testProviderPresenceConfig);

			provider.setupForPresenceOnly(clientId, 'viewer');

			expect(provider['presenceActivity']).toBe('viewer');
		});

		it('Should not set the presenceActivity of the provider when not passed in', () => {
			const provider = createSocketIOCollabProvider(testProviderPresenceConfig);

			provider.setupForPresenceOnly(clientId);

			expect(provider['presenceActivity']).toBeUndefined();
		});
	});

	describe('initialisation', () => {
		it('Should call initializeChannel once', () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			const initializeChannelSpy = jest.spyOn(provider as any, 'initializeChannel');
			provider.initialize(() => editorState);
			// make sure initializeChannel is called
			expect(initializeChannelSpy).toHaveBeenCalledTimes(1);
			provider.initialize(() => editorState);
			// make sure initializeChannel is not called again
			expect(initializeChannelSpy).toHaveBeenCalledTimes(1);
		});

		it('Should start the participant inactive remover when the channel is connected', () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			// @ts-ignore - Spy on private member for test
			const participantsService = provider.participantsService;
			jest.spyOn(participantsService, 'startInactiveRemover');

			provider.initialize(() => editorState);
			channel.emit('connected', { sid: 'sid-123' });
			expect(participantsService.startInactiveRemover).toBeCalledWith('sid-123');
		});

		it("Should emit 'connecting' when the connection is being established", (done) => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('connecting', ({ initial }) => {
				expect(initial).toBe(true);
				done();
			});
			provider.initialize(() => editorState);
		});
		it("Should emit 'connected' when the connection is successfully established", async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('connected', ({ sid, initial }) => {
				expect(sid).toBe('sid-123');
				expect(initial).toBe(true);
			});
			provider.initialize(() => editorState);
			channel.emit('connected', { sid: 'sid-123' });
		});
		it("Should emit 'init' with the initialisation data from the collab service", async () => {
			let expectedSid: any;
			const sid = 'expected-sid-123';
			const userId = 'user-123';
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('connected', ({ sid }) => {
				expectedSid = sid;
			});
			provider.on('init', ({ doc, version, metadata }: any) => {
				expect(expectedSid).toBe(sid);
				expect(doc).toBe('bla');
				expect(version).toBe(1);
				expect(metadata).toEqual({
					title: 'some-random-title',
				});
			});
			provider.initialize(() => editorState);
			channel.emit('connected', { sid });
			channel.emit('init', {
				doc: 'bla',
				version: 1,
				userId,
				metadata: {
					title: 'some-random-title',
				},
			});
		});
		it("Should emit 'init' with the initial draft data from the provider config", async () => {
			const testProviderConfigWithDraft = {
				initialDraft: {
					document: 'test-document' as any,
					version: 1,
					metadata: { title: 'random-title' },
				},
				...testProviderConfig,
			};
			const sid = 'expected-sid-123';
			const provider = createSocketIOCollabProvider(testProviderConfigWithDraft);
			provider.on('init', (data) => {
				expect(data).toEqual({
					doc: 'test-document',
					version: 1,
					metadata: { title: 'random-title' },
				});
			});
			provider.initialize(() => editorState);
			channel.emit('connected', { sid, initialized: true });
		});
	});

	describe('presence', () => {
		it('Should not emit empty joined or left presence', async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			let counter = 0;

			// Create a promise that will resolve when the handler is done
			const presenceHandled = new Promise<void>((resolve) => {
				provider.on('presence', ({ joined, left }) => {
					counter++;
					expect(joined?.length).toBe(1);
					expect(left).toBe(undefined); // Ensure no one left
					resolve(); // Resolve the promise when handler is complete
				});
			});

			provider.initialize(() => editorState);
			channel.emit('participant:updated', {
				sessionId: 'random-sessionId',
				timestamp: Date.now(),
				userId: 'blabla-userId',
				clientId: 'blabla-clientId',
			});
			channel.emit('participant:updated', {
				sessionId: 'random-sessionId',
				timestamp: Date.now(),
				userId: 'blabla-userId',
				clientId: 'blabla-clientId',
			});

			await presenceHandled; // Wait for the presence event to be handled
			expect(counter).toBe(1);
		});

		it('Should fire analytics events and updates participants on presence changes', async () => {
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

			const sendActionEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendActionEvent');

			// Create a promise that will resolve when the handler is done
			const presenceHandled = new Promise<void>((resolve) => {
				provider.on('presence', ({ joined, left }) => {
					expect(joined?.length).toBe(1);
					expect(left).toBe(undefined); // Ensure no one left
					resolve(); // Resolve the promise when handler is complete
				});
			});

			channel.emit('participant:updated', {
				sessionId: 'sessionId-1',
				timestamp: Date.now(),
				userId: 'userId-1',
				clientId: 'clientId-1',
			});

			channel.emit('participant:updated', {
				sessionId: 'sessionId-2',
				timestamp: Date.now(),
				userId: 'userId-2',
				clientId: 'clientId-2',
			});

			// Allow the event loop to process any asynchronous updates
			await presenceHandled;

			expect(sendActionEventSpy).toHaveBeenCalledTimes(2);
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(1, 'updateParticipants', 'SUCCESS', {
				participants: 1,
			});
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(2, 'updateParticipants', 'SUCCESS', {
				participants: 2,
			});
		});

		it("Should emit 'disconnected' to consumer", () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			const mockFn = jest.fn();
			provider.on('disconnected', ({ reason, sid }) => {
				mockFn(reason, sid);
			});
			provider.initialize(() => editorState);
			channel.emit('connected', { sid: 'sid-1' });
			channel.emit('disconnect', { reason: 'transport close' });
			channel.emit('connected', { sid: 'sid-2' });
			channel.emit('disconnect', { reason: 'transport error' });
			channel.emit('connected', { sid: 'sid-3' });
			channel.emit('disconnect', { reason: 'ping timeout' });
			channel.emit('connected', { sid: 'sid-4' });
			channel.emit('disconnect', { reason: 'io client disconnect' });
			channel.emit('connected', { sid: 'sid-5' });
			channel.emit('disconnect', { reason: 'io server disconnect' });
			channel.emit('connected', { sid: 'sid-6' });
			channel.emit('disconnect', { reason: 'blah?' });
			expect(mockFn.mock.calls.length).toBe(6);
			expect(mockFn.mock.calls).toEqual([
				['SOCKET_CLOSED', 'sid-1'],
				['SOCKET_ERROR', 'sid-2'],
				['SOCKET_TIMEOUT', 'sid-3'],
				['CLIENT_DISCONNECT', 'sid-4'],
				['SERVER_DISCONNECT', 'sid-5'],
				['UNKNOWN_DISCONNECT', 'sid-6'],
			]);
		});
	});

	describe('Emit metadata cases', () => {
		it('Should emit metadata when title is changed', async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('metadata:changed', (metadata) => {
				expect(metadata).toEqual({
					title: 'some-random-title',
				});
			});
			provider.initialize(() => editorState);
			channel.emit('metadata:changed', {
				title: 'some-random-title',
			});
		});
		it('Should emit metadata when title has changed to empty string', async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('metadata:changed', (metadata) => {
				expect(metadata).toEqual({
					title: '',
				});
			});
			provider.initialize(() => editorState);
			channel.emit('metadata:changed', {
				title: '',
			});
		});
		it('Should emit metadata with editorWidth', async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('metadata:changed', (metadata) => {
				expect(metadata).toEqual({
					editorWidth: 'full-page',
					version: 1,
				});
			});
			provider.initialize(() => editorState);
			channel.emit('metadata:changed', {
				editorWidth: 'full-page',
				version: 1,
			});
		});
		it('Should emit metadata when editor width is changed to empty string', async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('metadata:changed', (metadata) => {
				expect(metadata).toEqual({
					editorWidth: '',
				});
			});
			provider.initialize(() => editorState);
			channel.emit('metadata:changed', {
				editorWidth: '',
			});
		});
		it('Should emit metadata during init', async () => {
			const userId = 'user-123';
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('init', ({ metadata }: any) => {
				expect(metadata).toEqual({
					title: 'some-random-title',
					editorWidth: 'some-random-width',
				});
				provider.on('metadata:changed', (metadata) => {
					expect(metadata).toEqual({
						title: 'some-random-title',
						editorWidth: 'some-random-width',
					});
				});
			});
			provider.initialize(() => editorState);
			channel.emit('init', {
				doc: 'bla',
				version: 1,
				userId,
				metadata: {
					title: 'some-random-title',
					editorWidth: 'some-random-width',
				},
			});
		});
	});

	describe('Emit errors to consumers', () => {
		it('Should emit failed_to_save dynamo errors to consumer', (done) => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('error', (error) => {
				expect(error).toEqual({
					code: 'FAIL_TO_SAVE',
					message: 'Collab service is not able to save changes',
					recoverable: false,
					status: 500,
				});
				done();
			});
			const failedOnDynamo: InternalError = {
				data: {
					status: 500,
					meta: 'No value returned from metadata while updating',
					code: NCS_ERROR_CODE.DYNAMO_ERROR,
				},
				message: 'Error while updating metadata',
			};
			provider.initialize(() => editorState);
			channel.emit('error', failedOnDynamo);
		});

		it('Should emit no permission errors to consumer', (done) => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('error', (error) => {
				expect(error).toEqual({
					code: 'NO_PERMISSION_ERROR',
					message:
						'User does not have permissions to access this document or document is not found',
					recoverable: true,
					status: 403,
				});
				done();
			});
			const noPermissionError: InternalError = {
				data: {
					status: 403,
					code: NCS_ERROR_CODE.INSUFFICIENT_EDITING_PERMISSION,
					meta: {
						description:
							'The user does not have permission for collaborative editing of this resource or the resource was deleted',
					},
				},
				message: 'No permission!',
			};
			provider.initialize(() => editorState);
			channel.emit('error', noPermissionError);
		});

		it('Should emit catchupv2 failed errors to consumer', (done) => {
			const provider = createSocketIOCollabProvider(testProviderConfig);

			provider.on('error', (error) => {
				expect(error).toEqual({
					code: 'INTERNAL_SERVICE_ERROR',
					message: 'Collab Provider experienced an unrecoverable error',
					reason: 'CATCHUP_FAILED',
					recoverable: true,
					status: 500,
				});
				done();
			});
			const catchupError: InternalError = {
				data: {
					status: 500,
					code: INTERNAL_ERROR_CODE.CATCHUP_FAILED,
				},
				message: 'Cannot fetch catchupv2 from collab service',
			};
			provider.initialize(() => editorState);
			channel.emit('error', catchupError);
		});

		it('Should emit 404 errors to consumer', (done) => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.on('error', (error) => {
				expect(error).toEqual({
					code: 'DOCUMENT_NOT_FOUND',
					message: 'The requested document is not found',
					recoverable: true,
					status: 404,
				});
				done();
			});
			provider.initialize(() => editorState);
			channel.emit('error', {
				data: {
					code: 'DOCUMENT_NOT_FOUND',
				},
			});
		});
	});

	describe('catch-up-v2', () => {
		let sendActionEventSpy: jest.SpyInstance;
		const stepRejectedError: InternalError = {
			data: {
				code: NCS_ERROR_CODE.HEAD_VERSION_UPDATE_FAILED,
				meta: {
					currentVersion: 3,
					incomingVersion: 4,
				},
				status: 409,
			},
			message: 'Version number does not match current head version.',
		};

		beforeEach(() => {
			sendActionEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendActionEvent');
		});
		it('Should be triggered when reconnecting after being disconnected for more than 3s', async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			const throttledCatchupv2Spy = jest.spyOn(
				// @ts-ignore
				provider.documentService as any,
				'throttledCatchupv2',
			);
			provider.initialize(() => editorState);

			jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 3 * 1000); // Time travel 3s to the past
			channel.emit('disconnect', {
				reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
			});

			channel.emit('connected', {
				sid: 'pweq3Q7NOPY4y88QAGyr',
				initialized: true,
			});

			expect(throttledCatchupv2Spy).toHaveBeenCalledTimes(1);
			expect(throttledCatchupv2Spy).toHaveBeenCalledWith(CatchupEventReason.RECONNECTED, {
				disconnectionPeriodSeconds: 3,
				unconfirmedStepsLength: 0,
			});
		});
		it('Should be triggered when initial draft is present and is reconnecting after being disconnected for more than 3s', async () => {
			// ensure that if initial draft exists, any reconnections do not attempt to re-update document/metadata with initial draft
			const provider = createSocketIOCollabProvider(testProviderConfigWithDraft);
			const throttledCatchupv2Spy = jest.spyOn(
				// @ts-ignore
				provider.documentService as any,
				'throttledCatchupv2',
			);
			const updateDocumentSpy = jest.spyOn(
				//@ts-ignore
				provider.documentService as any,
				'updateDocument',
			);
			provider.initialize(() => editorState);

			jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - 3 * 1000); // Time travel 3s to the past
			channel.emit('disconnect', {
				reason: 'Testing - Faking that we got disconnected 3s ago, HAHAHA, take that code',
			});

			channel.emit('connected', {
				sid: 'pweq3Q7NOPY4y88QAGyr',
				initialized: true,
			});

			expect(updateDocumentSpy).toHaveBeenCalledTimes(1);
			expect(updateDocumentSpy).toHaveBeenCalledWith({
				doc: 'test-document',
				metadata: { title: 'random-title' },
				version: 1,
			});
			expect(throttledCatchupv2Spy).toHaveBeenCalledTimes(1);
			expect(throttledCatchupv2Spy).toHaveBeenCalledWith(CatchupEventReason.RECONNECTED, {
				disconnectionPeriodSeconds: 3,
				unconfirmedStepsLength: 0,
			});
		});
		it('Should be triggered when confirmed steps from other participants were received from NCS that are further in the future than the local steps (aka some changes got lost before reaching us)', async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			const throttledCatchupv2Spy = jest.spyOn(
				// @ts-ignore
				provider.documentService as any,
				'throttledCatchupv2',
			);
			provider.initialize(() => editorState);

			channel.emit('steps:added', {
				version: 9999, // High version, indicated we didn't get a ton of steps, expected version is 1
				steps: [
					{
						stepType: 'replace',
						from: 1479,
						to: 1479,
						slice: { content: [{ type: 'text', text: 'lol' }] },
						clientId: 666950124,
						userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
						createdAt: 1679027507189,
					},
				],
			});

			expect(throttledCatchupv2Spy).toHaveBeenCalledTimes(1);
			expect(throttledCatchupv2Spy).toHaveBeenCalledWith(CatchupEventReason.STEPS_ADDED);
		});

		it('Should be triggered after 15 rejected steps and reset the rejected steps counter', async () => {
			const provider = createSocketIOCollabProvider(testProviderConfig);
			const throttledCatchupv2Spy = jest.spyOn(
				// @ts-ignore
				provider.documentService as any,
				'throttledCatchupv2',
			);

			const initializationComplete = new Promise<void>((resolve) => {
				provider.initialize(() => {
					resolve(); // Resolve the promise when initialization is complete
					return editorState; // Return the editorState as required
				});
			});

			await initializationComplete;

			// Emit errors for the first batch
			for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
				channel.emit('error', stepRejectedError);
			}

			expect(throttledCatchupv2Spy).toHaveBeenCalledTimes(1);
			expect(throttledCatchupv2Spy).toHaveBeenCalledWith(CatchupEventReason.STEPS_REJECTED);
			expect(catchupv2).toHaveBeenCalledTimes(1);
			expect(catchupv2).toHaveBeenCalledWith({
				getCurrentPmVersion: expect.any(Function),
				fetchCatchupv2: expect.any(Function),
				updateMetadata: expect.any(Function),
				onCatchupComplete: expect.any(Function),
				analyticsHelper: expect.any(Object),
				clientId: 'some-random-prosemirror-client-Id',
				onStepsAdded: expect.any(Function),
				catchUpOutofSync: false,
				reason: CatchupEventReason.STEPS_REJECTED,
				getState: expect.any(Function),
			});

			// Use a resolved promise to wait for all asynchronous tasks to complete
			await Promise.resolve();

			// Emit errors for the second batch
			for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
				channel.emit('error', stepRejectedError);
			}

			expect(throttledCatchupv2Spy).toHaveBeenCalledTimes(2);
			expect(throttledCatchupv2Spy).toHaveBeenCalledWith(CatchupEventReason.STEPS_REJECTED);
			expect(catchupv2).toHaveBeenCalledTimes(2);
			expect(catchupv2).toHaveBeenNthCalledWith(2, {
				getCurrentPmVersion: expect.any(Function),
				fetchCatchupv2: expect.any(Function),
				updateMetadata: expect.any(Function),
				onCatchupComplete: expect.any(Function),
				analyticsHelper: expect.any(Object),
				clientId: 'some-random-prosemirror-client-Id',
				onStepsAdded: expect.any(Function),
				reason: CatchupEventReason.STEPS_REJECTED,
				getState: expect.any(Function),
			});
		});
		it('Should reset the rejected step counter when catchup throws an error', async () => {
			const catchupv2Mock = (catchupv2 as jest.Mock).mockImplementation(() => {
				throw new Error('catchupv2 error');
			});

			const provider = createSocketIOCollabProvider(testProviderConfig);
			const throttledCatchupv2Spy = jest.spyOn(
				// @ts-ignore
				provider.documentService as any,
				'throttledCatchupv2',
			);

			provider.initialize(() => editorState);
			for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
				channel.emit('error', stepRejectedError);
			}

			expect(throttledCatchupv2Spy).toHaveBeenCalledTimes(1);
			expect(catchupv2).toHaveBeenCalledTimes(1);
			expect(sendActionEventSpy).toHaveBeenCalledTimes(17);
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(17, 'catchup', 'FAILURE', {
				latency: 0,
			});
			channel.emit('error', stepRejectedError);

			expect(sendActionEventSpy).toHaveBeenCalledTimes(18);
			expect(throttledCatchupv2Spy).toHaveBeenCalledTimes(1);
			expect(catchupv2Mock).toHaveBeenCalledTimes(1);
		});
	});

	describe('Presence failure', () => {
		it('Should send error when consumer sends a telepointer message', () => {
			const fakeError = new Error('Kaboooooom!');
			const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');
			const provider = createSocketIOCollabProvider(testProviderConfig);

			jest.spyOn(global.Math, 'random').mockReturnValue(0.00006);
			jest.spyOn(Telepointer, 'telepointerCallback').mockImplementationOnce(() => {
				throw fakeError;
			});

			provider.sendMessage({
				type: 'telepointer',
				selection: { type: 'textSelection', anchor: 693, head: 693 },
				sessionId: 'cAA0xTLkAZj-r79VBzG0',
			});

			expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
			expect(sendErrorEventSpy).toHaveBeenCalledWith(
				fakeError,
				'Error while sending message - telepointer',
			);

			jest.spyOn(global.Math, 'random').mockRestore();
		});
	});

	describe('API', () => {
		let sendActionEventSpy: jest.SpyInstance;
		let sendErrorEventSpy: jest.SpyInstance;
		let provider: Provider;
		let sendStepsFromCurrentStateSpy: jest.SpyInstance;

		beforeEach(() => {
			// Jest spies
			sendActionEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendActionEvent');
			sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

			// Initialize provider
			provider = createSocketIOCollabProvider(testProviderConfig);
			provider.initialize(() => editorState);
			provider.setTitle("What's in a good title?");

			sendStepsFromCurrentStateSpy = jest
				// @ts-ignore
				.spyOn(provider.documentService as any, 'sendStepsFromCurrentState')
				.mockImplementation(() => {});

			jest.spyOn(Utilities, 'sleep').mockResolvedValue(() => undefined);
		});

		it('getCurrentState with converted ADF doc: Should resolve to the current editor state for a valid ADF document', async () => {
			const currentState = await provider.getCurrentState();
			expect(currentState).toEqual({
				content: {
					content: [
						{
							content: [
								{
									text: 'Hello, World!',
									type: 'text',
								},
								{
									marks: [],
									text: '/',
									type: 'text',
								},
							],
							type: 'paragraph',
						},
					],
					type: 'doc',
					version: 1,
				},
				stepVersion: 0,
				title: "What's in a good title?",
			});
			expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
			expect(sendActionEventSpy).toHaveBeenCalledWith(
				'getCurrentState',
				'SUCCESS',
				{ latency: undefined }, // Performance API undefined when running jest tests
			);
			expect(sendErrorEventSpy).not.toHaveBeenCalled();
		});

		it('getCurrentState with converted ADF doc: Should reject if document conversion to ADF fails', async () => {
			expect.assertions(5);
			provider.initialize(() => ({
				...editorState,
				doc: 'something invalid',
			}));
			try {
				await provider.getCurrentState();
			} catch (error) {
				const adfConverterError = new TypeError(
					"Cannot read properties of undefined (reading 'forEach')",
				);
				expect(error).toEqual(adfConverterError);
				expect(sendErrorEventSpy).toHaveBeenCalledTimes(2);
				expect(sendErrorEventSpy).toHaveBeenCalledWith(
					adfConverterError,
					'Error while returning ADF version of current draft document',
				);
				expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
				expect(sendActionEventSpy).toHaveBeenCalledWith(
					'getCurrentState',
					'FAILURE',
					{ latency: undefined }, // Performance API undefined when running jest tests
				);
			}
		});

		it('getCurrentState with converted ADF doc: Should log error event when missing collab state and use version 0 instead', async () => {
			expect.assertions(3);
			jest.spyOn(ProseMirrorCollab, 'getCollabState').mockImplementationOnce(() => {
				return undefined;
			});
			const currentState = await provider.getCurrentState();
			expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
			expect(sendErrorEventSpy).toHaveBeenCalledWith(
				new Error('No collab state when calling ProseMirror function'),
				'collab-provider: getCurrentState called without collab state',
			);
			expect(currentState.stepVersion).toEqual(0);
		});

		it('getCurrentState with converted ADF doc: Should return the title if set', async () => {
			channel.emit('metadata:changed', {
				title: "What's in a better title?",
			});
			const currentState = await provider.getCurrentState();
			expect(currentState.title).toEqual("What's in a better title?");
			expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
			expect(sendActionEventSpy).toHaveBeenCalledWith(
				'getCurrentState',
				'SUCCESS',
				{ latency: undefined }, // Performance API undefined when running jest tests
			);
			expect(sendErrorEventSpy).not.toHaveBeenCalled();
		});

		it('getFinalAcknowledgedState with converted ADF document: Should resolve to the final editor state', async () => {
			const finalAcknowledgedState = await provider.getFinalAcknowledgedState();
			expect(finalAcknowledgedState).toEqual({
				title: "What's in a good title?",
				stepVersion: 0,
				content: {
					content: [
						{
							content: [
								{
									type: 'text',
									text: 'Hello, World!',
								},
								{
									type: 'text',
									text: '/',
									marks: [],
								},
							],
							type: 'paragraph',
						},
					],
					type: 'doc',
					version: 1,
				},
			});
			expect(sendActionEventSpy).toHaveBeenCalledTimes(2);
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(
				1,
				'getCurrentState',
				'SUCCESS',
				{ latency: undefined }, // Performance API undefined when running jest tests
			);
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(
				2,
				'publishPage',
				'SUCCESS',
				{ latency: undefined }, // Performance API undefined when running jest tests
			);
			expect(sendErrorEventSpy).not.toHaveBeenCalled();
		});

		it('getFinalAcknowledgedState with converted ADF document: Should include latest updated metadata', async () => {
			const verifyMetadataTitle = async (title: string) => {
				const ackState = await provider.getFinalAcknowledgedState();
				expect(ackState).toEqual(
					expect.objectContaining({
						title,
					}),
				);
			};
			const provider = createSocketIOCollabProvider(testProviderConfig);
			provider.initialize(() => editorState);
			channel.emit('init', {
				doc: 'document-content',
				version: 1,
				metadata: {
					title: 'original-title',
				},
			});
			await nextTick();
			await verifyMetadataTitle('original-title');
			channel.emit('metadata:changed', {
				title: 'new-title',
			});
			await nextTick();
			await verifyMetadataTitle('new-title');
		});

		it('getFinalAcknowledgedState with converted ADF document: Should not log UGC when logging an error', async () => {
			expect.assertions(10);
			const invalidDocument = {
				type: 'doc',
				content: [
					{
						type: 'some-invalid-type',
						textContent: 'Super secret UGC',
					},
				],
			};
			provider.initialize(() => ({
				...editorState,
				doc: invalidDocument,
			}));
			try {
				await provider.getFinalAcknowledgedState();
			} catch (error) {
				expect(error).toEqual(
					new TypeError("Cannot read properties of undefined (reading 'forEach')"),
				);
				expect(sendActionEventSpy).toHaveBeenCalledTimes(3);
				expect(sendActionEventSpy).toHaveBeenNthCalledWith(
					1,
					'getCurrentState',
					'FAILURE',
					{ latency: undefined }, // Performance API undefined when running jest tests
				);
				expect(sendActionEventSpy).toHaveBeenNthCalledWith(
					2,
					'getCurrentState',
					'FAILURE',
					{ latency: undefined }, // Performance API undefined when running jest tests
				);
				expect(sendActionEventSpy).toHaveBeenNthCalledWith(
					3,
					'publishPage',
					'FAILURE',
					{ latency: undefined }, // Performance API undefined when running jest tests
				);
				expect(sendErrorEventSpy).toHaveBeenCalledTimes(4);
				expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
					1,
					new TypeError("Cannot read properties of undefined (reading 'forEach')"),
					'Error while returning ADF version of current draft document',
				);
				expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
					2,
					new TypeError("Cannot read properties of undefined (reading 'forEach')"),
					'Error while returning ADF version of current draft document',
				);
				expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
					3,
					new TypeError("Cannot read properties of undefined (reading 'forEach')"),
					'Error while returning ADF version of the final draft document',
				);
				expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
					4,
					new TypeError("Cannot read properties of undefined (reading 'forEach')"),
					'Error while returning ADF version of the final draft document',
				);
			}
		});

		it('Can sync up: Should return if it can sync up', async () => {
			const mockedSteps = [{ type: 'fakeStep' }];
			jest
				// @ts-ignore
				.spyOn(provider.documentService as any, 'getUnconfirmedSteps')
				.mockImplementationOnce(() => mockedSteps)
				.mockImplementationOnce(() => []);
			jest
				.spyOn(
					// @ts-ignore
					provider.documentService as any,
					'getUnconfirmedStepsOrigins',
				)
				.mockImplementationOnce(() => [1])
				.mockImplementationOnce(() => undefined);
			provider.initialize(() => editorState);

			const finalAck = await provider.getFinalAcknowledgedState();

			expect(sendActionEventSpy).toHaveBeenCalledTimes(3);
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(1, 'commitUnconfirmedSteps', 'SUCCESS', {
				numUnconfirmedSteps: 1,
				latency: undefined, // Performance API undefined when running jest tests
			});
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(2, 'getCurrentState', 'SUCCESS', {
				latency: undefined, // Performance API undefined when running jest tests
			});
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(3, 'publishPage', 'SUCCESS', {
				latency: undefined, // Performance API undefined when running jest tests
			});
			expect(finalAck).toEqual({
				stepVersion: 0,
				title: "What's in a good title?",
				content: {
					content: [
						{
							content: [
								{
									type: 'text',
									text: 'Hello, World!',
								},
								{
									type: 'text',
									text: '/',
									marks: [],
								},
							],
							type: 'paragraph',
						},
					],
					type: 'doc',
					version: 1,
				},
			});
		});

		it('Cannot sync up: Should call reconcile ', async () => {
			provider.initialize(() => ({
				...editorState,
				collab: {
					steps: [1],
					origins: [1],
				},
			}));

			jest
				// @ts-ignore
				.spyOn(provider.documentService as any, 'fetchReconcile')
				.mockImplementationOnce(() => {
					return {
						document: JSON.stringify(editorState.doc),
						version: 2,
					};
				});
			await provider.getFinalAcknowledgedState();
			expect(sendActionEventSpy).toHaveBeenCalledTimes(3);
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(1, 'commitUnconfirmedSteps', 'FAILURE', {
				numUnconfirmedSteps: 1,
				latency: undefined, // Performance API undefined when running jest tests
			});
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(2, 'getCurrentState', 'SUCCESS', {
				latency: undefined, // Performance API undefined when running jest tests
			});
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(3, 'publishPage', 'SUCCESS', {
				latency: undefined, // Performance API undefined when running jest tests
			});
			expect(sendStepsFromCurrentStateSpy).toHaveBeenCalledTimes(ACK_MAX_TRY + 1);
		});

		it('Cannot sync up: Should call onSyncUpError if reconcile fails', async () => {
			const onSyncUpErrorMock = jest.fn();
			jest
				// @ts-ignore
				.spyOn(provider.documentService as any, 'fetchReconcile')
				.mockImplementationOnce(() => {
					throw new Error();
				});
			provider.setup({
				getState: () => ({
					...editorState,
					collab: {
						steps: [1],
						origins: [1],
					},
				}),
				onSyncUpError: onSyncUpErrorMock,
			});
			await expect(provider.getFinalAcknowledgedState()).rejects.toThrow(); // Trigger error from function
			expect(onSyncUpErrorMock).toHaveBeenCalledTimes(1);
			expect(onSyncUpErrorMock).toHaveBeenCalledWith({
				clientId: 'some-random-prosemirror-client-Id',
				lengthOfUnconfirmedSteps: 1,
				maxRetries: 60,
				tries: 61,
				version: 0,
			});
		});

		it('getUnconfirmedSteps: Should return current unconfirmed steps', () => {
			provider.initialize(() => editorState);
			const documentServiceGetUnconfirmedStepsSpy = jest.spyOn(
				(provider as any).documentService,
				'getUnconfirmedSteps',
			);
			expect(provider.getUnconfirmedSteps()).toEqual([]);
			expect(documentServiceGetUnconfirmedStepsSpy).toBeCalledTimes(1);
		});

		it('getCurrentPmVersion: Should return current ProseMirror version', () => {
			provider.initialize(() => ({
				...editorState,
				collab: {
					steps: [],
					origins: [],
					version: 8,
				},
			}));
			const getCurrentPmVersionSpy = jest.spyOn(
				(provider as any).documentService,
				'getCurrentPmVersion',
			);
			expect(provider.getCurrentPmVersion()).toEqual(8);
			expect(getCurrentPmVersionSpy).toHaveBeenCalledTimes(1);
		});

		it('setMetadata: Should set and get latest metadata', () => {
			const setMetadataSpy = jest.spyOn((provider as any).metadataService, 'setMetadata');
			const sampleMetadata = { title: 'hello', editorWidth: '300' };
			provider.setMetadata(sampleMetadata);
			expect(provider.getMetadata()).toEqual(sampleMetadata);
			expect(setMetadataSpy).toBeCalledWith(sampleMetadata);
		});

		it('getIsNamespaceLocked: Should get namespace lock status', () => {
			const getIsNamespaceLockedSpy = jest.spyOn(
				(provider as any).namespaceService,
				'getIsNamespaceLocked',
			);
			provider.getIsNamespaceLocked();
			expect(getIsNamespaceLockedSpy).toBeCalled();
		});
	});

	describe('View Permission Only', () => {
		it('Should block view only steps metadata', () => {
			const provider = createSocketIOCollabProvider({
				...testProviderConfig,
			});
			const setMetadataSpy = jest.spyOn((provider as any).metadataService, 'setMetadata');
			const getIsNamespaceLockedSpy = jest.spyOn(
				(provider as any).namespaceService,
				'getIsNamespaceLocked',
			);
			provider.initialize(() => editorState);
			const permissionResponse: UserPermitType = {
				isPermittedToView: true,
				isPermittedToComment: true,
				isPermittedToEdit: false,
			};
			provider.on('permission', (permissions) => {
				expect(permissions).toStrictEqual({
					isPermittedToView: true,
					isPermittedToEdit: false,
					isPermittedToComment: true,
				});
			});
			channel.emit('permission', permissionResponse);
			provider.send(null, null, {} as any);
			provider.setMetadata({});
			provider.setTitle('title');
			expect(setMetadataSpy).toBeCalledTimes(0);
			expect(getIsNamespaceLockedSpy).toBeCalledTimes(0);
		});
	});

	describe('commitStepQueue', () => {
		it('Should not throw errors when attempting to commit steps', () => {
			expect(() => {
				commitStepQueue({
					// @ts-ignore
					channel: {
						broadcast: jest.fn().mockImplementation(() => {
							throw new Error('Test');
						}),
					},
					steps: [],
					emit: jest.fn(),
				});
			}).not.toThrow();
		});
	});
});
