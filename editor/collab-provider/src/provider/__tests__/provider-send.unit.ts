import { getVersion, sendableSteps } from '@atlaskit/prosemirror-collab';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
// eslint-disable-next-line @atlaskit/platform/no-alias
import * as ffPackage from '@atlaskit/platform-feature-flags';
import type { Provider } from '..';
import { EVENT_STATUS } from '../../helpers/const';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import { AcknowledgementResponseTypes } from '../../types';

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));
jest.mock('@atlaskit/prosemirror-collab', () => {
	const originPC = jest.requireActual('@atlaskit/prosemirror-collab');
	return {
		...originPC,
		sendableSteps: jest.fn(),
		getVersion: jest.fn(),
	};
});

describe('#sendData', () => {
	jest.useFakeTimers();
	let fakeStep: Step;
	let anyEditorState: EditorState;
	let provider: Provider;
	let documentServiceBroadcastSpy: jest.SpyInstance;
	let fakeAnalyticsWebClient: AnalyticsWebClient;
	const documentAri = 'ari:cloud:confluence:ABC:page/testpage';

	beforeEach(() => {
		fakeAnalyticsWebClient = {
			sendOperationalEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendUIEvent: jest.fn(),
		};
		const testProviderConfigWithAnalytics = {
			url: `http://provider-url:6661`,
			documentAri: documentAri,
			analyticsClient: fakeAnalyticsWebClient,
		};
		provider = createSocketIOCollabProvider(testProviderConfigWithAnalytics);

		jest.runOnlyPendingTimers();
		jest.clearAllTimers();
		documentServiceBroadcastSpy = jest.spyOn(
			// @ts-ignore
			provider.documentService as any,
			'broadcast',
		);

		fakeStep = new ReplaceStep(1, 1, Slice.empty);

		const { collab: collabPlugin } = jest.requireActual('@atlaskit/prosemirror-collab');
		anyEditorState = createEditorState(doc(p('lol')), collabPlugin({ clientID: 3771180701 }));

		const getStateMock = () => anyEditorState;
		provider.initialize(getStateMock);

		// So we can check sendOperationalEvent is called
		jest
			.spyOn(window, 'requestAnimationFrame')
			// @ts-ignore
			.mockImplementation((cb) => cb());
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.runOnlyPendingTimers();
	});

	it('catchupv2 : triggers catchupv2 on processSteps failure', () => {
		jest.spyOn(ffPackage, 'getBooleanFF').mockImplementation(() => true);

		const catchupv2Spy = jest.spyOn(
			// @ts-ignore
			provider.documentService as any,
			'catchupv2',
		);

		//@ts-expect-error private method call but it's okay we're testing
		provider.documentService.processSteps({
			version: 1625,
			// @ts-ignore breaking on purpose
			steps: 'hot garbarge', // even the spelling is garbage, nice
		});

		expect(fakeAnalyticsWebClient.sendTrackEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendTrackEvent).toBeCalledWith({
			action: 'error',
			actionSubject: 'collab',
			attributes: {
				collabService: 'ncs',
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				network: {
					status: 'ONLINE',
				},
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				errorCode: undefined,
				errorStack: expect.any(String),
				errorName: 'TypeError',
				errorMessage: 'Error while processing steps',
				originalErrorMessage: 'steps.map is not a function',
			},
			nonPrivacySafeAttributes: {
				error: new TypeError('steps.map is not a function'),
			},
			source: 'unknown',
			tags: ['editor'],
		});
		expect(catchupv2Spy).toHaveBeenCalledTimes(1);
		expect(catchupv2Spy).toBeCalledWith();
	});

	it('broadcasts message to steps:commit when there are sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [fakeStep],
		});
		(getVersion as jest.Mock).mockReturnValue(1);

		provider.send(null, null, anyEditorState);
		expect(documentServiceBroadcastSpy).toHaveBeenCalledWith(
			'steps:commit',
			expect.anything(),
			expect.any(Function),
		);
	});

	it('serializes steps with clientId and userId when there are sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [fakeStep],
		});
		(getVersion as jest.Mock).mockReturnValue(1);

		provider.send(null, null, anyEditorState);
		expect(documentServiceBroadcastSpy).toHaveBeenCalledWith(
			'steps:commit',
			expect.objectContaining({
				steps: [
					expect.objectContaining({
						...fakeStep.toJSON(),
					}),
				],
			}),
			expect.any(Function),
		);
	});

	it('calls onStepsAdded on successful response when there are sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [fakeStep],
		});
		(getVersion as jest.Mock).mockReturnValue(1);

		provider.send(null, null, anyEditorState);

		const ackCallback = documentServiceBroadcastSpy.mock.calls[0][2];

		// @ts-ignore emit is a protected function
		jest.spyOn(provider, 'emit').mockImplementation(() => {});
		jest.spyOn(global.Math, 'random').mockReturnValue(0.069);

		ackCallback({
			type: AcknowledgementResponseTypes.SUCCESS,
			version: 2,
		});
		// @ts-ignore
		expect(provider.emit).toBeCalledWith('data', {
			json: [
				{
					clientId: 3771180701,
					from: 1,
					stepType: 'replace',
					to: 1,
					userId: undefined,
				},
			],
			userIds: [3771180701],
			version: 2,
		});
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
			action: 'addSteps',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				eventStatus: EVENT_STATUS.SUCCESS_10x_SAMPLED,
				type: 'ACCEPTED',
				latency: 0,
				stepType: {
					replace: 1,
				},
			},
			tags: ['editor'],
			source: 'unknown',
		});
		// @ts-ignore
		window.requestAnimationFrame.mockRestore();
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	it('handles step conflicts due to late head version update when there are sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [fakeStep],
		});
		(getVersion as jest.Mock).mockReturnValue(1);

		provider.send(null, null, anyEditorState);

		const ackCallback = documentServiceBroadcastSpy.mock.calls[0][2];
		// @ts-ignore emit is a protected function
		jest.spyOn(provider, 'emit').mockImplementation(() => {});
		jest.spyOn(global.Math, 'random').mockReturnValue(0.069);

		ackCallback({
			type: AcknowledgementResponseTypes.ERROR,
			error: { data: { code: 'HEAD_VERSION_UPDATE_FAILED' } },
		});
		// @ts-ignore just spying on a private method, nothing to see here
		expect(provider.emit).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendTrackEvent).toHaveBeenCalledTimes(1);

		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(2);
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenNthCalledWith(2, {
			action: 'addSteps',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				eventStatus: 'FAILURE',
				type: 'REJECTED',
				latency: 0,
			},
			tags: ['editor'],
			source: 'unknown',
		});
		expect(fakeAnalyticsWebClient.sendTrackEvent).toBeCalledWith({
			action: 'error',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				errorCode: 'HEAD_VERSION_UPDATE_FAILED',
				errorMessage: 'Error while adding steps - Acknowledgement Error',
				originalErrorMessage: undefined,
			},
			nonPrivacySafeAttributes: {
				error: {
					data: {
						code: 'HEAD_VERSION_UPDATE_FAILED',
					},
				},
			},
			tags: ['editor'],
			source: 'unknown',
		});

		// @ts-ignore
		window.requestAnimationFrame.mockRestore();
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	it('handles step conflicts due to version number already exists error when there are sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [fakeStep],
		});
		(getVersion as jest.Mock).mockReturnValue(1);

		provider.send(null, null, anyEditorState);

		const ackCallback = documentServiceBroadcastSpy.mock.calls[0][2];
		// @ts-ignore emit is a protected function
		jest.spyOn(provider, 'emit').mockImplementation(() => {});
		jest.spyOn(global.Math, 'random').mockReturnValue(0.069);

		ackCallback({
			type: AcknowledgementResponseTypes.ERROR,
			error: { data: { code: 'VERSION_NUMBER_ALREADY_EXISTS' } },
		});
		// @ts-ignore just spying on a private method, nothing to see here
		expect(provider.emit).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendTrackEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(2);
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenNthCalledWith(2, {
			action: 'addSteps',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				eventStatus: 'FAILURE',
				type: 'REJECTED',
				latency: 0,
			},
			tags: ['editor'],
			source: 'unknown',
		});
		expect(fakeAnalyticsWebClient.sendTrackEvent).toBeCalledWith({
			action: 'error',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				errorCode: 'VERSION_NUMBER_ALREADY_EXISTS',
				errorMessage: 'Error while adding steps - Acknowledgement Error',
				originalErrorMessage: undefined,
			},
			nonPrivacySafeAttributes: {
				error: {
					data: {
						code: 'VERSION_NUMBER_ALREADY_EXISTS',
					},
				},
			},
			tags: ['editor'],
			source: 'unknown',
		});

		// @ts-ignore
		window.requestAnimationFrame.mockRestore();
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	it('auto-triggers a step commit on step conflict when there are sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [fakeStep],
		});
		(getVersion as jest.Mock).mockReturnValue(1);

		provider.send(null, null, anyEditorState);

		const ackCallback = documentServiceBroadcastSpy.mock.calls[0][2];
		// @ts-ignore emit is a protected function
		jest.spyOn(provider, 'emit').mockImplementation(() => {});
		jest.spyOn(global.Math, 'random').mockReturnValue(0.069);

		jest.spyOn(
			// @ts-ignore
			provider.documentService as any,
			'sendStepsFromCurrentState',
		);
		ackCallback({
			type: AcknowledgementResponseTypes.ERROR,
			error: { data: { code: 'VERSION_NUMBER_ALREADY_EXISTS' } },
		});
		expect(
			// @ts-ignore just spying on a private method, nothing to see here
			provider.documentService.sendStepsFromCurrentState,
		).not.toHaveBeenCalled();

		// Fast forward and exhaust only currently pending timers
		// (but not any new timers that get created during that process)
		jest.runOnlyPendingTimers();

		expect(
			// @ts-ignore just spying on a private method, nothing to see here
			provider.documentService.sendStepsFromCurrentState,
		).toHaveBeenCalledTimes(1);
		expect(
			// @ts-ignore just spying on a private method, nothing to see here
			provider.documentService.sendStepsFromCurrentState,
		).toHaveBeenCalledWith();

		// @ts-ignore
		window.requestAnimationFrame.mockRestore();
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	// FIXME: Jest 29 upgrade - Expected number of calls: 2
	it.skip('handles technical error response when there are sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [fakeStep],
		});
		(getVersion as jest.Mock).mockReturnValue(1);

		provider.send(null, null, anyEditorState);

		const ackCallback = documentServiceBroadcastSpy.mock.calls[0][2];
		// @ts-ignore emit is a protected function
		jest.spyOn(provider, 'emit').mockImplementation(() => {});
		jest.spyOn(global.Math, 'random').mockReturnValue(0.069);

		ackCallback({
			type: AcknowledgementResponseTypes.ERROR,
			error: { data: { code: 'SOME_TECHNICAL_ERROR' } },
		});

		// @ts-ignore provider emit is protected
		expect(provider.emit).toHaveBeenCalledTimes(1);
		// expect(provider.emit).toHaveBeenCalledWith('error', {
		//   code: 'INTERNAL_SERVICE_ERROR',
		//   message: 'Collab service has experienced an internal server error',
		//   status: 500,
		// });
		expect(fakeAnalyticsWebClient.sendTrackEvent).toHaveBeenCalledTimes(2);

		expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendTrackEvent).toHaveBeenNthCalledWith(1, {
			action: 'error',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				errorCode: 'SOME_TECHNICAL_ERROR',
				errorMessage: 'Error handled',
				errorName: undefined,
				originalErrorMessage: undefined,
			},
			nonPrivacySafeAttributes: {
				error: {
					data: {
						code: 'SOME_TECHNICAL_ERROR',
					},
				},
			},
			tags: ['editor'],
			source: 'unknown',
		});
		expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
			action: 'addSteps',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				eventStatus: 'FAILURE',
				type: 'ERROR',
				latency: 0,
			},
			tags: ['editor'],
			source: 'unknown',
		});
		expect(fakeAnalyticsWebClient.sendTrackEvent).toHaveBeenNthCalledWith(2, {
			action: 'error',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				errorCode: 'SOME_TECHNICAL_ERROR',
				errorMessage: 'Error while adding steps - Acknowledgement Error',
				originalErrorMessage: undefined,
			},
			nonPrivacySafeAttributes: {
				error: {
					data: {
						code: 'SOME_TECHNICAL_ERROR',
					},
				},
			},
			tags: ['editor'],
			source: 'unknown',
		});
		// @ts-ignore
		window.requestAnimationFrame.mockRestore();
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	// FIXME: Jest 29 upgrade - Expected number of calls: 2
	it.skip('emits analytics event on invalid acknowledgement when there are sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [fakeStep],
		});
		(getVersion as jest.Mock).mockReturnValue(1);

		provider.send(null, null, anyEditorState);

		const ackCallback = documentServiceBroadcastSpy.mock.calls[0][2];
		// @ts-ignore emit is a protected function
		jest.spyOn(provider, 'emit').mockImplementation(() => {});
		jest.spyOn(global.Math, 'random').mockReturnValue(0.069);

		ackCallback({ wat: true });
		// @ts-ignore just spying on a private method, nothing to see here
		expect(provider.emit).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendTrackEvent).toHaveBeenCalledTimes(1);
		expect(fakeAnalyticsWebClient.sendTrackEvent).toBeCalledWith({
			action: 'error',
			actionSubject: 'collab',
			attributes: {
				packageName: '@atlaskit/fabric',
				packageVersion: '0.0.0',
				collabService: 'ncs',
				network: {
					status: 'ONLINE',
				},
				documentAri: 'ari:cloud:confluence:ABC:page/testpage',
				errorName: 'Error',
				errorMessage: 'Error while adding steps - Invalid Acknowledgement',
				originalErrorMessage: undefined,
			},
			nonPrivacySafeAttributes: {
				error: new Error('Response type: No response type'),
			},
			tags: ['editor'],
			source: 'unknown',
		});

		// @ts-ignore
		window.requestAnimationFrame.mockRestore();
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	it('does not send a broadcast message when no sendable steps are returned', () => {
		(sendableSteps as jest.Mock).mockReturnValue(null);

		provider.send(null, null, anyEditorState);

		expect(documentServiceBroadcastSpy).not.toHaveBeenCalled();
	});

	it('does not send a broadcast message when there are no sendable steps', () => {
		(sendableSteps as jest.Mock).mockReturnValue({
			steps: [],
		});

		provider.send(null, null, anyEditorState);

		expect(documentServiceBroadcastSpy).not.toHaveBeenCalled();
	});
});
