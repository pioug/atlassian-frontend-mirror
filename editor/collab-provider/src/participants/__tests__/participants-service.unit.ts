import FeatureGates from '@atlaskit/feature-gate-js-client';

import type { PresencePayload } from '../../types';
import type { ParticipantsMap } from '../participants-helper';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import { ParticipantsService } from '../participants-service';
import { ParticipantsState } from '../participants-state';
import { PARTICIPANT_UPDATE_INTERVAL } from '../participants-helper';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { EVENT_ACTION, EVENT_STATUS } from '../../helpers/const';

jest.mock('@atlaskit/feature-gate-js-client');

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

const activeAgent: ProviderParticipant = {
	userId: 'agent:abc',
	clientId: 'agent:abc::328374441',
	sessionId: `agent:abc::${sessionId}`,
	lastActive: baseTime,
	name: 'Agent McAgentFace',
	avatar: 'www.jamescameron.com/image.png',
	email: 'fake.user@email.com',
};

const payload: PresencePayload = {
	sessionId: activeUser.sessionId,
	userId: activeUser.userId,
	clientId: activeUser.clientId,
	timestamp: baseTime,
};

const agentPayload: PresencePayload = {
	...payload,
	data: activeAgent,
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
		jest.useFakeTimers({ legacyFakeTimers: true });
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

	describe('on success (user left and has associated agent)', () => {
		jest.mocked(FeatureGates.getExperimentValue).mockReturnValue(true);

		const emit = jest.fn();
		const participantsMap: ParticipantsMap = new Map()
			.set(activeUser.sessionId, activeUser)
			.set(activeAgent.sessionId, activeAgent);

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
			// @ts-expect-error accessing private property
			expect(participantsService.participantsState.getAIProviderParticipants()).toEqual([]);
		});

		it('should call emitPresence', () => {
			expect(emitPresenceSpy).toHaveBeenCalledTimes(2);
			expect(emitPresenceSpy).toHaveBeenCalledWith(
				{ left: [{ sessionId: activeUser.sessionId }] },
				'participant leaving',
			);
		});

		it('should call emit with participant', () => {
			expect(emit).toHaveBeenCalledTimes(2);
			expect(emit).toHaveBeenCalledWith('presence', {
				left: [{ sessionId: activeUser.sessionId }],
			});
		});

		it('should send analytics', () => {
			expect(sendActionEvent).toHaveBeenCalledTimes(2);
			expect(sendActionEvent).toHaveBeenCalledWith(
				EVENT_ACTION.UPDATE_PARTICIPANTS,
				EVENT_STATUS.SUCCESS,
				{ participants: 0 },
			);
		});
	});

	describe('on success (agent left)', () => {
		jest.mocked(FeatureGates.getExperimentValue).mockReturnValue(true);

		const emit = jest.fn();
		const participantsMap: ParticipantsMap = new Map()
			.set(activeUser.sessionId, activeUser)
			.set(activeAgent.sessionId, activeAgent);

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

		participantsService.onParticipantLeft(agentPayload);

		it('should remove participant', () => {
			// @ts-expect-error accessing private property
			expect(participantsService.participantsState.getParticipants()).toEqual([activeUser]);
			// @ts-expect-error accessing private property
			expect(participantsService.participantsState.getAIProviderParticipants()).toEqual([]);
		});

		it('should call emitPresence', () => {
			expect(emitPresenceSpy).toHaveBeenCalledTimes(1);
			expect(emitPresenceSpy).toHaveBeenCalledWith(
				{ left: [{ sessionId: activeAgent.sessionId }] },
				'participant leaving',
			);
		});

		it('should call emit with participant', () => {
			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit).toHaveBeenCalledWith('presence', {
				left: [{ sessionId: activeAgent.sessionId }],
			});
		});

		it('should send analytics', () => {
			expect(sendActionEvent).toHaveBeenCalledTimes(1);
			expect(sendActionEvent).toHaveBeenCalledWith(
				EVENT_ACTION.UPDATE_PARTICIPANTS,
				EVENT_STATUS.SUCCESS,
				{ participants: 1 },
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

describe('getCollabMode', () => {
	it('should return collab mode for single user correctly', () => {
		const participantsMap: ParticipantsMap = new Map().set(activeUser.sessionId, activeUser);
		const participants: ParticipantsState = new ParticipantsState(participantsMap);

		const participantsService = participantsServiceConstructor({ participants });

		const collabMode = participantsService.getCollabMode();
		expect(collabMode).toBe('single');
	});

	it('should return collab mode for multiple users correctly', () => {
		const participantsMap: ParticipantsMap = new Map();
		participantsMap.set(activeUser.sessionId, activeUser);
		participantsMap.set(activeAgent.sessionId, activeAgent);
		const participants: ParticipantsState = new ParticipantsState(participantsMap);

		const participantsService = participantsServiceConstructor({ participants });

		const collabMode = participantsService.getCollabMode();
		expect(collabMode).toBe('collab');
	});
});
