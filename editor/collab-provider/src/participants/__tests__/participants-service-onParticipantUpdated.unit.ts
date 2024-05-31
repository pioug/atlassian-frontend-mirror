import type { PresencePayload } from '../../types';
import AnalyticsHelper from '../../analytics/analytics-helper';
import type { ParticipantsMap } from '../participants-helper';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import { ParticipantsService } from '../participants-service';
import { ParticipantsState } from '../participants-state';

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
	permit: {
		isPermittedToComment: false,
		isPermittedToEdit: false,
		isPermittedToView: true,
	},
};

const payload: PresencePayload = {
	sessionId: activeUser.sessionId,
	userId: activeUser.userId,
	clientId: activeUser.clientId,
	timestamp: baseTime,
	permit: {
		isPermittedToComment: false,
		isPermittedToEdit: false,
		isPermittedToView: true,
	},
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

describe('onParticpantUpdated', () => {
	const getUser = jest.fn().mockReturnValue({
		name: activeUser.name,
		avatar: activeUser.avatar,
		email: activeUser.email,
	});

	const emit = jest.fn();

	beforeEach(() => jest.clearAllMocks());

	describe('when participant is new', () => {
		const participantsService = participantsServiceConstructor({
			emit,
			getUser,
		});

		it('should call emit with participant', async () => {
			await participantsService.onParticipantUpdated(payload);
			expect(emit).toBeCalledWith('presence', { joined: [activeUser] });
		});
	});

	describe('when participant already exists', () => {
		const participantsMap: ParticipantsMap = new Map().set(activeUser.sessionId, activeUser);
		const participants: ParticipantsState = new ParticipantsState(participantsMap);
		const participantsService = participantsServiceConstructor({
			participants,
			emit,
		});

		it('should not call emit', async () => {
			await participantsService.onParticipantUpdated(payload);
			expect(emit).not.toBeCalled();
		});
	});

	describe('on error with getUser', () => {
		const fakeError = 'missingno';
		const getUser = jest.fn().mockImplementation(() => {
			throw fakeError;
		});
		const analyticsHelper = new AnalyticsHelper('fakeDocumentAri');
		const sendErrorEventSpy = jest.spyOn(analyticsHelper, 'sendErrorEvent');

		const participantsService = participantsServiceConstructor({
			analyticsHelper,
			getUser,
		});

		beforeEach(() => jest.clearAllMocks());

		it('should not throw', async () => {
			expect(async () => await participantsService.onParticipantUpdated(payload)).not.toThrow(
				fakeError,
			);
		});

		it('should call analytics', async () => {
			await participantsService.onParticipantUpdated(payload);
			expect(sendErrorEventSpy).toBeCalledTimes(1);
			expect(sendErrorEventSpy).toBeCalledWith(fakeError, 'Error while enriching participant');
		});
	});

	describe('when no userId provided', () => {
		const payloadWithNoId = { ...payload, userId: undefined };
		const participantsService = participantsServiceConstructor({ emit });

		it('should not call emit', async () => {
			await participantsService.onParticipantUpdated(payloadWithNoId);
			expect(emit).not.toBeCalled();
		});
	});
});
