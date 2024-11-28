import AnalyticsHelper from '../../analytics/analytics-helper';
import type { PresencePayload } from '../../types';
import { ParticipantsService } from '../participants-service';

describe('participants-service-presence', () => {
	let broadcast: any;
	let emit: any;
	let getUser: any;
	let sendPresenceJoined: any;
	let setUserId: any;
	let getAIProviderActiveIds: any;
	let getPresenceData: any;
	let analyticsHelper: AnalyticsHelper;
	let analyticsSpy: any;
	let participantsService: ParticipantsService;
	let payload: PresencePayload;

	beforeEach(() => {
		broadcast = jest.fn();
		emit = jest.fn();
		getUser = jest.fn();
		sendPresenceJoined = jest.fn();
		setUserId = jest.fn();
		getAIProviderActiveIds = jest.fn().mockReturnValue(['abc']);
		getPresenceData = jest.fn().mockReturnValue(payload);
		analyticsHelper = new AnalyticsHelper('nope');
		analyticsSpy = jest.spyOn(analyticsHelper, 'sendErrorEvent');
		payload = {
			sessionId: '420',
			userId: '69',
			clientId: '666',
			timestamp: 756755856,
		};
		participantsService = new ParticipantsService(
			analyticsHelper,
			// @ts-ignore
			undefined,
			emit,
			getUser,
			broadcast,
			sendPresenceJoined,
			getPresenceData,
			setUserId,
			getAIProviderActiveIds,
		);
	});

	afterEach(() => jest.clearAllMocks());

	describe('onPresence', () => {
		describe('on success', () => {
			beforeEach(() => {
				participantsService.onPresence(payload);
			});
			it('should set userId', () => {
				expect(setUserId).toBeCalledTimes(1);
				expect(setUserId).toBeCalledWith(payload.userId);
			});

			it('should broadcast presence', () => {
				expect(broadcast).toBeCalledTimes(2);
				expect(broadcast).toBeCalledWith('participant:updated', payload);
				expect(broadcast).toBeCalledWith('participant:updated', {
					clientId: 'abc::666',
					permit: {
						isPermittedToComment: false,
						isPermittedToEdit: false,
						isPermittedToView: false,
					},
					sessionId: 'abc::420',
					timestamp: 1502841600000,
					userId: 'abc',
				});
			});

			it('should call sendPresenceJoined', () => {
				expect(sendPresenceJoined).toBeCalledTimes(1);
				expect(sendPresenceJoined).toBeCalledWith();
			});
		});

		describe('on failure', () => {
			const error = new Error('pooped the bed');
			beforeEach(() => {
				sendPresenceJoined.mockImplementation(() => {
					throw error;
				});
				participantsService.onPresence(payload);
			});

			it('should catch error and send analytics', () => {
				expect(analyticsSpy).toBeCalledTimes(1);
				expect(analyticsSpy).toBeCalledWith(error, 'Error while receiving presence');
			});
		});
	});

	describe('onPresenceJoined', () => {
		it('should broadcast presence', () => {
			participantsService.onPresenceJoined(payload);
			expect(broadcast).toBeCalledTimes(2);
			expect(broadcast).toBeCalledWith('participant:updated', payload);
			expect(broadcast).toBeCalledWith('participant:updated', {
				clientId: 'abc::666',
				permit: {
					isPermittedToComment: false,
					isPermittedToEdit: false,
					isPermittedToView: false,
				},
				sessionId: 'abc::420',
				timestamp: 1502841600000,
				userId: 'abc',
			});
		});

		it('should send analytics on error', () => {
			const fakeError = new Error('batman');
			// @ts-expect-error don't care about type issues for a mock
			const sendPresenceSpy = jest.spyOn(participantsService, 'sendPresence') as jest.Mock;
			sendPresenceSpy.mockImplementationOnce(() => {
				throw fakeError;
			});
			participantsService.onPresenceJoined(payload);

			expect(analyticsSpy).toBeCalledTimes(1);
			expect(analyticsSpy).toBeCalledWith(fakeError, 'Error while joining presence');
		});
	});

	describe('sendPresence', () => {
		describe('on success', () => {
			beforeEach(() => {
				jest.spyOn(window, 'setTimeout');
				// @ts-expect-error private function
				participantsService.sendPresence();
			});

			it('should get Presence data from provider', () => {
				// This is called twice because getAIProviderActiveIds also uses getPresenceData
				// to combine AI Provider info with the user's presence data
				expect(getPresenceData).toBeCalledTimes(2);
				expect(getAIProviderActiveIds).toBeCalledTimes(1);
			});

			it('should broadcast presence', () => {
				expect(broadcast).toBeCalledTimes(2);
				expect(broadcast).toBeCalledWith('participant:updated', payload);
				expect(broadcast).toBeCalledWith('participant:updated', {
					clientId: 'abc::666',
					permit: {
						isPermittedToComment: false,
						isPermittedToEdit: false,
						isPermittedToView: false,
					},
					sessionId: 'abc::420',
					timestamp: 1502841600000,
					userId: 'abc',
				});
			});

			it('should set timeout', () => {
				// @ts-expect-error private variable
				expect(participantsService.presenceUpdateTimeout).toBeDefined();
				expect(window.setTimeout).toBeCalledTimes(1);
				expect(window.setTimeout).toBeCalledWith(expect.any(Function), 150000);
			});
		});

		describe('on failure', () => {
			const error = new Error('pooped on the pink bed');
			beforeEach(() => {
				broadcast.mockImplementation(() => {
					throw error;
				});
				// @ts-expect-error private function
				participantsService.sendPresence();
			});

			it('should catch error and send analytics', () => {
				expect(analyticsSpy).toBeCalledTimes(1);
				expect(analyticsSpy).toBeCalledWith(error, 'Error while sending presence');
			});
		});
	});
});
