import type { PresencePayload } from '../../types';
import AnalyticsHelper from '../../analytics/analytics-helper';
import type { BatchProps, ParticipantsMap } from '../participants-helper';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { AGENT_PRESENCE_TTL_MS, ParticipantsService } from '../participants-service';
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
	batchProps?: BatchProps;
	broadcast?: any;
	emit?: any;
	getPresenceData?: any;
	getUser?: any;
	participantsState?: ParticipantsState;
	sendPresenceJoined?: any;
	setUserId?: any;
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
		it('should call emit with participant', async () => {
			const participantsService = participantsServiceConstructor({
				emit,
				getUser,
			});

			await participantsService.onParticipantUpdated(payload);
			expect(emit).toHaveBeenCalledWith('presence', { joined: [hydratedParticipant] });
		});

		it('includes agent type when agent presence is moved', async () => {
			passGate('platform_move_presence_agents');
			const emit = jest.fn();
			const participantsService = participantsServiceConstructor({ emit, getUser });

			await participantsService.onParticipantUpdated({ ...payload, agentType: 'mcp' });

			expect(emit).toHaveBeenCalledWith('presence', {
				joined: [expect.objectContaining({ agentType: 'mcp' })],
			});
		});

		it('omits agent type when agent presence is not moved', async () => {
			failGate('platform_move_presence_agents');
			const emit = jest.fn();
			const participantsService = participantsServiceConstructor({ emit, getUser });

			await participantsService.onParticipantUpdated({ ...payload, agentType: 'mcp' });

			expect(emit).toHaveBeenCalledWith('presence', {
				joined: [expect.objectContaining({ agentType: undefined })],
			});
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

		describe('when participant acting user is changed', () => {
			it('should emit presence with updated participant', async () => {
				const participantsMap: ParticipantsMap = new Map().set(
					hydratedParticipant.sessionId,
					hydratedParticipant,
				);
				const participantsService = participantsServiceConstructor({
					participantsState: new ParticipantsState(participantsMap),
					emit,
					getUser,
				});

				await participantsService.onParticipantUpdated({
					...payload,
					actingUserId: 'acting-user',
				});

				expect(emit).toHaveBeenCalledWith('presence', {
					joined: [
						expect.objectContaining({
							actingUserId: 'acting-user',
							sessionId: hydratedParticipant.sessionId,
						}),
					],
				});
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
			expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
			expect(sendErrorEventSpy).toHaveBeenCalledWith(
				fakeError,
				'Error while enriching participant',
			);
		});
	});

	describe('when no userId or anonymous is provided', () => {
		test.each([['unidentified'], [undefined]])(
			'should call emit for anonymous with userId=%s',
			async (userId) => {
				const participantsService = participantsServiceConstructor({
					emit,
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
	});
});

describe('onParticipantUpdated updateParticipantLazy', () => {
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

	it('should emit presence:joined when participant is ai agent', async () => {
		const participantsService = participantsServiceConstructor({
			emit,
			batchProps: defaultBatchProps,
		});

		const spyBatchFetchUsers = jest.spyOn(participantsService, 'batchFetchUsers');
		const aiPayload = {
			...payload,
			userId: 'agent:123',
		};

		// @ts-ignore private variable, ensure we pass conditional to verify we don't actually invoke batch fetch users
		participantsService.currentlyPollingFetchUsers = false;
		await participantsService.onParticipantUpdated(aiPayload);
		expect(emit).toHaveBeenCalledWith('presence', {
			joined: [
				{
					...aiPayload,
					lastActive: payload.timestamp,
					name: '',
					avatar: '',
					email: '',
				},
			],
		});

		expect(spyBatchFetchUsers).not.toHaveBeenCalled();
	});

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

			it('should emit presence with updated participant when previous participant receives actingUserId', async () => {
				const participantsState: ParticipantsState = new ParticipantsState();
				participantsState.setBySessionId('agent-session', {
					...hydratedParticipant,
					avatar: '',
					email: '',
					isHydrated: undefined,
					name: '',
					sessionId: 'agent-session',
					userId: 'agent:123',
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
					actingUserId: 'rohan-account-id',
					sessionId: 'agent-session',
					userId: 'agent:123',
				});

				expect(emit).toHaveBeenCalledWith('presence', {
					joined: [
						expect.objectContaining({
							actingUserId: 'rohan-account-id',
							sessionId: 'agent-session',
							userId: 'agent:123',
						}),
					],
				});
				expect(participantsState.getBySessionId('agent-session')).toEqual(
					expect.objectContaining({
						actingUserId: 'rohan-account-id',
						lastActive: payload.timestamp,
					}),
				);
				expect(spyBatchFetchUsers).not.toHaveBeenCalled();
			});

			it('should update lastActive without emitting presence when actingUserId and activity are unchanged', async () => {
				const participantsState: ParticipantsState = new ParticipantsState();
				participantsState.setBySessionId(hydratedParticipant.sessionId, {
					...hydratedParticipant,
					actingUserId: 'acting-user',
					presenceActivity: 'viewer',
				});

				const participantsService = participantsServiceConstructor({
					participantsState,
					emit,
					batchProps: defaultBatchProps,
				});

				await participantsService.onParticipantUpdated({
					...payload,
					actingUserId: 'acting-user',
					presenceActivity: 'viewer',
					timestamp: baseTime + 1,
				});

				expect(participantsState.getBySessionId(hydratedParticipant.sessionId)).toEqual(
					expect.objectContaining({
						actingUserId: 'acting-user',
						lastActive: baseTime + 1,
					}),
				);
				expect(emit).not.toHaveBeenCalled();
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

	it('updates agent type when agent presence is moved', async () => {
		passGate('platform_move_presence_agents');
		const participantsState = new ParticipantsState();
		participantsState.setBySessionId(hydratedParticipant.sessionId, hydratedParticipant);
		const participantsService = participantsServiceConstructor({
			participantsState,
			emit,
			batchProps: defaultBatchProps,
		});

		await participantsService.onParticipantUpdated({ ...payload, agentType: 'mcp' });

		expect(participantsState.getBySessionId(hydratedParticipant.sessionId)).toEqual(
			expect.objectContaining({ agentType: 'mcp' }),
		);
		expect(emit).toHaveBeenCalledWith('presence', {
			joined: [expect.objectContaining({ agentType: 'mcp' })],
		});
	});

	it('omits agent type when agent presence is not moved', async () => {
		failGate('platform_move_presence_agents');
		const participantsState = new ParticipantsState();
		participantsState.setBySessionId(hydratedParticipant.sessionId, hydratedParticipant);
		const participantsService = participantsServiceConstructor({
			participantsState,
			emit,
			batchProps: defaultBatchProps,
		});

		await participantsService.onParticipantUpdated({ ...payload, agentType: 'mcp' });

		expect(participantsState.getBySessionId(hydratedParticipant.sessionId)).toEqual(
			expect.objectContaining({ agentType: undefined }),
		);
		expect(emit).not.toHaveBeenCalled();
	});
});

describe('agent expiry lifecycle', () => {
	const agentSessionId = 'agent-session';
	const remoteAgentPayload: PresencePayload = {
		...payload,
		agentType: 'mcp',
		sessionId: agentSessionId,
		userId: 'agent:123',
	};

	beforeEach(() => {
		passGate('platform_move_presence_agents');
		jest.useFakeTimers();
		jest.setSystemTime(baseTime);
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	it('removes a remote agent five minutes after its valid last-active timestamp', async () => {
		const emit = jest.fn();
		const service = participantsServiceConstructor({
			batchProps: { getUsers: jest.fn() },
			emit,
		});

		await service.onParticipantUpdated(remoteAgentPayload);
		expect(service.getAIProviderParticipants()).toEqual([
			expect.objectContaining({ agentType: 'mcp', sessionId: agentSessionId }),
		]);
		emit.mockClear();
		jest.advanceTimersByTime(AGENT_PRESENCE_TTL_MS);

		expect(service.getAIProviderParticipants()).toHaveLength(0);
		expect(emit).toHaveBeenCalledWith('presence', {
			left: [{ sessionId: agentSessionId }],
		});
	});

	it('does not invent an expiry for a remote agent without a valid timestamp', async () => {
		const service = participantsServiceConstructor({
			batchProps: { getUsers: jest.fn() },
		});

		await service.onParticipantUpdated({ ...remoteAgentPayload, timestamp: Number.NaN });
		jest.advanceTimersByTime(AGENT_PRESENCE_TTL_MS * 2);

		expect(service.getAIProviderParticipants()).toHaveLength(1);
	});

	it('emits presence when a remote inactive agent becomes active again', async () => {
		const emit = jest.fn();
		const participantsState = new ParticipantsState();
		participantsState.setBySessionId(agentSessionId, {
			...hydratedParticipant,
			avatar: '',
			email: '',
			lastActive: baseTime,
			name: '',
			sessionId: agentSessionId,
			userId: 'agent:123',
		});
		const service = participantsServiceConstructor({
			batchProps: { getUsers: jest.fn() },
			emit,
			participantsState,
		});
		jest.setSystemTime(baseTime + 30 * 1000);

		await service.onParticipantUpdated({
			...remoteAgentPayload,
			timestamp: baseTime + 30 * 1000,
		});

		expect(emit).toHaveBeenCalledWith('presence', {
			joined: [expect.objectContaining({ sessionId: agentSessionId })],
		});
	});
});
