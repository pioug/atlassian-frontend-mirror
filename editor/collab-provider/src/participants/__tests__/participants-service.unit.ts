import type { PresencePayload } from '../../types';
import type { ParticipantsMap } from '../participants-helper';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import { ParticipantsService } from '../participants-service';
import { ParticipantsState } from '../participants-state';
import { PARTICIPANT_UPDATE_INTERVAL } from '../participants-helper';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { EVENT_ACTION, EVENT_STATUS } from '../../helpers/const';

const baseTime = 1676863793756;

const sessionId = 'vXrOwZ7OIyXq17jdB2jh';

const activeUser: ProviderParticipant = {
	userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
	clientId: '328374441',
	sessionId: sessionId,
	lastActive: baseTime,
	name: 'Mr Kafei',
	avatar: 'www.jamescameron.com/image.png',
	email: 'fake.user@email.com',
};

const payload: PresencePayload = {
	sessionId: activeUser.sessionId,
	userId: activeUser.userId,
	clientId: activeUser.clientId,
	timestamp: baseTime,
};

const participantsServiceConstructor = (deps: {
	analyticsHelper?: AnalyticsHelper;
	participants?: ParticipantsState;
	emit?: any;
	getUser?: any;
	broadcast?: any;
	sendPresenceJoined?: any;
	getPresenceData?: any;
	setUserId?: any;
}): ParticipantsService =>
	new ParticipantsService(
		deps.analyticsHelper,
		// @ts-ignore
		deps.participants,
		deps.emit || jest.fn(),
		deps.getUser || jest.fn(),
		deps.broadcast || jest.fn(),
		deps.sendPresenceJoined || jest.fn(),
		deps.getPresenceData || jest.fn().mockReturnValue(payload),
		deps.setUserId || jest.fn(),
	);

describe('removeInactiveParticipants', () => {
	it('Should not throw when filterInactive throws an error', () => {
		const participantsService = participantsServiceConstructor({});
		jest.useFakeTimers();
		expect(setTimeout).not.toBeCalled();
		// @ts-ignore
		participantsService.filterInactive = jest.fn().mockImplementation(() => {
			throw new Error('Mock Error');
		});
		participantsService.startInactiveRemover(undefined);
		expect(setTimeout).toBeCalledWith(expect.any(Function), PARTICIPANT_UPDATE_INTERVAL);
	});
});

describe('onParticipantLeft', () => {
	describe('on success', () => {
		const emit = jest.fn();
		const participantsMap: ParticipantsMap = new Map().set(activeUser.sessionId, activeUser);
		const participants: ParticipantsState = new ParticipantsState(participantsMap);
		const analyticsHelper = new AnalyticsHelper('fakeDocumentAri');
		const sendActionEvent = jest.spyOn(analyticsHelper, 'sendActionEvent');

		const participantsService = participantsServiceConstructor({
			analyticsHelper,
			participants,
			emit,
		});

		// @ts-expect-error expect type error
		const emitPresenceSpy = jest.spyOn(participantsService, 'emitPresence');

		participantsService.onParticipantLeft(payload);

		it('should remove participant', () => {
			// @ts-expect-error accessing private property
			expect(participantsService.participantsState.getParticipants()).toEqual([]);
		});

		it('should call emitPresence', () => {
			expect(emitPresenceSpy).toBeCalledTimes(1);
			expect(emitPresenceSpy).toBeCalledWith(
				{ left: [{ sessionId: activeUser.sessionId }] },
				'participant leaving',
			);
		});

		it('should call emit with participant', () => {
			expect(emit).toBeCalledTimes(1);
			expect(emit).toBeCalledWith('presence', {
				left: [{ sessionId: activeUser.sessionId }],
			});
		});

		it('should send analytics', () => {
			expect(sendActionEvent).toHaveBeenCalledTimes(1);
			expect(sendActionEvent).toHaveBeenCalledWith(
				EVENT_ACTION.UPDATE_PARTICIPANTS,
				EVENT_STATUS.SUCCESS,
				{ participants: 0 },
			);
		});
	});

	describe('on failure', () => {
		const fakeError = new Error('fake error');

		const emit = jest.fn().mockImplementationOnce(() => {
			throw fakeError;
		});

		const analyticsHelper = new AnalyticsHelper('fakeDocumentAri');
		const sendErrorEventSpy = jest.spyOn(analyticsHelper, 'sendErrorEvent');
		const participantsMap: ParticipantsMap = new Map().set(activeUser.sessionId, activeUser);
		const participants: ParticipantsState = new ParticipantsState(participantsMap);
		const participantsService = participantsServiceConstructor({
			analyticsHelper,
			participants,
			emit,
		});

		participantsService.onParticipantLeft(payload);

		it('should send analytics', () => {
			expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
			expect(sendErrorEventSpy).toHaveBeenCalledWith(fakeError, 'Error while participant leaving');
		});
	});
});
