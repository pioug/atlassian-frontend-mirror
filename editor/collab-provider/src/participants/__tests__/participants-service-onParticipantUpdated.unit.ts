import type { PresencePayload } from '../../types';
import AnalyticsHelper from '../../analytics/analytics-helper';
import type { BatchProps, ParticipantsMap } from '../participants-helper';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import { ParticipantsService } from '../participants-service';
import { ParticipantsState } from '../participants-state';

const baseTime = 1676863793756;

const sessionId = 'vXrOwZ7OIyXq17jdB2jh';

const hydratedParticipant: ProviderParticipant = {
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
	isGuest: undefined,
	presenceId: 'mockPresenceId',
	presenceActivity: undefined,
	isHydrated: true,
};

const payload: PresencePayload = {
	sessionId: hydratedParticipant.sessionId,
	userId: hydratedParticipant.userId,
	clientId: hydratedParticipant.clientId,
	timestamp: baseTime,
	permit: {
		isPermittedToComment: false,
		isPermittedToEdit: false,
		isPermittedToView: true,
	},
	presenceId: hydratedParticipant.presenceId,
	presenceActivity: hydratedParticipant.presenceActivity,
};

const participantsServiceConstructor = (deps: {
	analyticsHelper?: AnalyticsHelper;
	participantsState?: ParticipantsState;
	emit?: any;
	getUser?: any;
	broadcast?: any;
	sendPresenceJoined?: any;
	getPresenceData?: any;
	setUserId?: any;
	batchProps?: BatchProps;
}): ParticipantsService =>
	new ParticipantsService(
		deps.analyticsHelper,
		deps.participantsState ?? new ParticipantsState(),
		deps.emit || jest.fn(),
		deps.getUser || jest.fn(),
		deps.batchProps || undefined,
		deps.broadcast || jest.fn(),
		deps.sendPresenceJoined || jest.fn(),
		deps.getPresenceData || jest.fn().mockReturnValue(payload),
		deps.setUserId || jest.fn(),
	);

describe('onParticpantUpdated updateParticipantEager', () => {
	const getUser = jest.fn().mockReturnValue({
		name: hydratedParticipant.name,
		avatar: hydratedParticipant.avatar,
		email: hydratedParticipant.email,
		isGuest: hydratedParticipant.isGuest,
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
			expect(emit).toHaveBeenCalledWith('presence', { joined: [hydratedParticipant] });
		});
	});

	describe('when participant already exists', () => {
		const participantsMap: ParticipantsMap = new Map().set(
			hydratedParticipant.sessionId,
			hydratedParticipant,
		);
		const participantsService = participantsServiceConstructor({
			participantsState: new ParticipantsState(participantsMap),
			emit,
		});

		describe('when participant activity is not changed', () => {
			it('should not call emit', async () => {
				const participantPayload: PresencePayload = { ...payload };

				await participantsService.onParticipantUpdated({
					...participantPayload,
					presenceActivity: undefined,
				}); // Change to unknown (default), no change

				expect(emit).not.toHaveBeenCalled();
			});
		});

		describe('when participant activity is changed', () => {
			it('should call emit', async () => {
				const participantPayload: PresencePayload = { ...payload };

				await participantsService.onParticipantUpdated({
					...participantPayload,
					presenceActivity: 'editor',
				}); // Change to editor
				await participantsService.onParticipantUpdated({
					...participantPayload,
					presenceActivity: 'viewer',
				}); // Change to viewer
				await participantsService.onParticipantUpdated({
					...participantPayload,
					presenceActivity: undefined,
				}); // Change to unknown (default)

				expect(emit).toHaveBeenCalledTimes(3);
			});
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

describe('onParticpantUpdated updateParticipantLazy', () => {
	const mockGetUsers = jest.fn().mockReturnValue([
		{
			name: hydratedParticipant.name,
			avatar: hydratedParticipant.avatar,
			email: hydratedParticipant.email,
			isGuest: hydratedParticipant.isGuest,
		},
	]);

	const defaultBatchProps: BatchProps = {
		getUsers: mockGetUsers,
	};

	const emit = jest.fn();

	afterEach(() => jest.clearAllMocks());

	describe.each([[true], [false]])(
		'when participant is new and currentlyPollingFetchUsers=%s',
		(isCurrentlyPollingFetchUsers) => {
			it('should not call emit with no previous participant and no participantsLimit configured', async () => {
				const participantsService = participantsServiceConstructor({
					emit,
					batchProps: {
						...defaultBatchProps,
						participantsLimit: 1,
					},
				});

				// @ts-ignore private variable
				participantsService.currentlyPollingFetchUsers = isCurrentlyPollingFetchUsers;
				const spyBatchFetchUsers = jest.spyOn(participantsService, 'batchFetchUsers');

				await participantsService.onParticipantUpdated(payload);
				expect(emit).toHaveBeenCalledWith('presence', {
					joined: [
						{
							...payload,
							lastActive: payload.timestamp,
							name: '',
							avatar: '',
							email: '',
						},
					],
				});

				if (!isCurrentlyPollingFetchUsers) {
					expect(spyBatchFetchUsers).toHaveBeenCalled();
				} else {
					expect(spyBatchFetchUsers).not.toHaveBeenCalled();
				}
			});

			it('should call emit with no previous participant and participantsLimit configured', async () => {
				const participantsService = participantsServiceConstructor({
					emit,
					batchProps: defaultBatchProps,
				});

				// @ts-ignore private variable
				participantsService.currentlyPollingFetchUsers = isCurrentlyPollingFetchUsers;
				const spyBatchFetchUsers = jest.spyOn(participantsService, 'batchFetchUsers');

				await participantsService.onParticipantUpdated(payload);
				expect(emit).not.toHaveBeenCalledWith('presence', {
					joined: [
						{
							...payload,
							lastActive: payload.timestamp,
							name: '',
							avatar: '',
							email: '',
						},
					],
				});

				if (!isCurrentlyPollingFetchUsers) {
					expect(spyBatchFetchUsers).toHaveBeenCalled();
				} else {
					expect(spyBatchFetchUsers).not.toHaveBeenCalled();
				}
			});

			it('should call emit with presence:changed with previous participant and different activity', async () => {
				const participantsState: ParticipantsState = new ParticipantsState();
				participantsState.setBySessionId(hydratedParticipant.sessionId, hydratedParticipant);

				const participantsService = participantsServiceConstructor({
					participantsState,
					emit,
					batchProps: defaultBatchProps,
				});

				// @ts-ignore private variable
				participantsService.currentlyPollingFetchUsers = isCurrentlyPollingFetchUsers;
				const spyBatchFetchUsers = jest.spyOn(participantsService, 'batchFetchUsers');

				await participantsService.onParticipantUpdated({
					...payload,
					presenceActivity: 'editor',
				});

				expect(emit).toHaveBeenCalledWith('presence:changed', {
					activity: 'editor',
					type: 'participant:activity',
				});

				// we should never call if we participant isn't new, otherwise we'll make unecessary network calls
				expect(spyBatchFetchUsers).not.toHaveBeenCalled();
			});

			it('should not call emit with presence:changed with previous participant and same activity', async () => {
				const participantsState: ParticipantsState = new ParticipantsState();
				participantsState.setBySessionId(hydratedParticipant.sessionId, {
					...hydratedParticipant,
					presenceActivity: 'viewer',
				});

				const participantsService = participantsServiceConstructor({
					participantsState,
					emit,
					batchProps: defaultBatchProps,
				});

				// @ts-ignore private variable
				participantsService.currentlyPollingFetchUsers = isCurrentlyPollingFetchUsers;
				const spyBatchFetchUsers = jest.spyOn(participantsService, 'batchFetchUsers');

				await participantsService.onParticipantUpdated({
					...payload,
					presenceActivity: 'viewer',
				});

				expect(emit).not.toHaveBeenCalledWith('presence:changed', expect.anything());

				// we should never call if we participant isn't new, otherwise we'll make unecessary network calls
				expect(spyBatchFetchUsers).not.toHaveBeenCalled();
			});

			test.each([['unidentified'], [undefined]])(
				'should call emit for anonymous with userId=%s',
				async (userId) => {
					const participantsService = participantsServiceConstructor({
						emit,
						batchProps: defaultBatchProps,
					});
					const spyBatchFetchUsers = jest.spyOn(participantsService, 'batchFetchUsers');

					await participantsService.onParticipantUpdated({
						...payload,
						userId,
					});
					expect(emit).toHaveBeenCalledWith('presence', {
						joined: [
							{
								...payload,
								lastActive: payload.timestamp,
								name: '',
								avatar: '',
								email: '',
								userId: 'unidentified',
								isHydrated: true,
							},
						],
					});
					expect(spyBatchFetchUsers).not.toHaveBeenCalled();
				},
			);
		},
	);
});
