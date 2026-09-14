import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { PresencePayload } from '../../types';
import type { BatchProps, ParticipantsMap } from '../participants-helper';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import {
	AGENT_PRESENCE_INACTIVE_MS,
	AGENT_PRESENCE_TTL_MS,
	ParticipantsService,
} from '../participants-service';
import { ParticipantsState } from '../participants-state';
import { PARTICIPANT_UPDATE_INTERVAL } from '../participants-helper';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { EVENT_ACTION, EVENT_STATUS } from '../../helpers/const';

jest.mock('@atlaskit/feature-gate-js-client/feature-gates');

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

describe('removeInactiveParticipants', () => {
	it('Should not throw when filterInactive throws an error', () => {
		const participantsService = participantsServiceConstructor({});
		jest.useFakeTimers({ legacyFakeTimers: true });
		expect(setTimeout).not.toHaveBeenCalled();
		// @ts-ignore
		participantsService.filterInactive = jest.fn().mockImplementation(() => {
			throw new Error('Mock Error');
		});
		participantsService.startInactiveRemover(undefined);
		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), PARTICIPANT_UPDATE_INTERVAL);
	});
});

describe('upsertAIProviderParticipantLocally', () => {
	const providerId = 'agent:abc';
	const expectedSessionId = `${providerId}::${sessionId}`;

	beforeEach(() => {
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	it('adds the agent with editing activity when agent presence is moved', () => {
		passGate('platform_move_presence_agents');
		passGate('confluence_ncs_step_diffing_version_history');
		const emit = jest.fn();
		const getUser = jest.fn();
		const service = participantsServiceConstructor({ emit, getUser });

		service.upsertAIProviderParticipantLocally(providerId, 'mcp');

		const agents = service.getAIProviderParticipants();
		expect(agents).toHaveLength(1);
		expect(agents[0]).toEqual(
			expect.objectContaining({
				agentType: 'mcp',
				presenceId: 'abc',
				userId: providerId,
				sessionId: expectedSessionId,
				presenceActivity: 'editor',
				name: '',
				avatar: '',
			}),
		);
		expect(emit).toHaveBeenCalledWith('presence', {
			joined: [
				expect.objectContaining({
					agentType: 'mcp',
					presenceId: 'abc',
					userId: providerId,
					sessionId: expectedSessionId,
					presenceActivity: 'editor',
				}),
			],
		});
		// getUser is only for human hydration; agents must bypass it.
		expect(getUser).not.toHaveBeenCalled();
		// Agents are not part of the human participant list.
		expect(service.getParticipants()).toHaveLength(0);
	});

	it('preserves legacy agent presence activity when agent presence is not moved', () => {
		failGate('platform_move_presence_agents');
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId);

		const [agent] = service.getAIProviderParticipants();
		expect(agent).not.toHaveProperty('presenceActivity');
		expect(emit).toHaveBeenCalledWith('presence', {
			joined: [expect.not.objectContaining({ presenceActivity: expect.anything() })],
		});
	});

	it('does not re-emit presence on refresh (same agent, subsequent steps)', () => {
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId);
		emit.mockClear();

		service.upsertAIProviderParticipantLocally(providerId);

		expect(emit).not.toHaveBeenCalled();
		expect(service.getAIProviderParticipants()).toHaveLength(1);
	});

	it('re-emits presence when the local agent type changes', () => {
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId, 'mcp');
		emit.mockClear();
		service.upsertAIProviderParticipantLocally(providerId, 'twg');

		expect(emit).toHaveBeenCalledWith('presence', {
			joined: [expect.objectContaining({ agentType: 'twg', userId: providerId })],
		});
	});

	it('removes the agent and emits presence(left) after the 30s sliding window elapses', () => {
		failGate('platform_move_presence_agents');
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId);
		emit.mockClear();

		jest.advanceTimersByTime(AGENT_PRESENCE_INACTIVE_MS);

		expect(service.getAIProviderParticipants()).toHaveLength(0);
		expect(emit).toHaveBeenCalledWith('presence', {
			left: [{ sessionId: expectedSessionId }],
		});
	});

	it('slides the window: a refresh before expiry keeps the agent alive, then expires later', () => {
		failGate('platform_move_presence_agents');
		const service = participantsServiceConstructor({});

		service.upsertAIProviderParticipantLocally(providerId);
		jest.advanceTimersByTime(AGENT_PRESENCE_INACTIVE_MS - 1);

		// Refresh resets the sliding window.
		service.upsertAIProviderParticipantLocally(providerId);
		jest.advanceTimersByTime(AGENT_PRESENCE_INACTIVE_MS - 1);
		expect(service.getAIProviderParticipants()).toHaveLength(1);

		jest.advanceTimersByTime(1);
		expect(service.getAIProviderParticipants()).toHaveLength(0);
	});

	it('retains an inactive agent at 30 seconds and removes it at five minutes when enriched presence is enabled', () => {
		passGate('platform_move_presence_agents');
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId);
		emit.mockClear();

		jest.advanceTimersByTime(AGENT_PRESENCE_INACTIVE_MS);
		expect(service.getAIProviderParticipants()).toHaveLength(1);
		expect(emit).not.toHaveBeenCalled();

		jest.advanceTimersByTime(AGENT_PRESENCE_TTL_MS - AGENT_PRESENCE_INACTIVE_MS);
		expect(service.getAIProviderParticipants()).toHaveLength(0);
		expect(emit).toHaveBeenCalledWith('presence', {
			left: [{ sessionId: expectedSessionId }],
		});
	});

	it('emits presence when an inactive agent becomes active again', () => {
		passGate('platform_move_presence_agents');
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId);
		emit.mockClear();
		jest.advanceTimersByTime(AGENT_PRESENCE_INACTIVE_MS);

		service.upsertAIProviderParticipantLocally(providerId);

		expect(emit).toHaveBeenCalledWith('presence', {
			joined: [expect.objectContaining({ sessionId: expectedSessionId })],
		});
	});

	it('tracks multiple distinct agents independently', () => {
		const service = participantsServiceConstructor({});

		service.upsertAIProviderParticipantLocally('agent:abc');
		service.upsertAIProviderParticipantLocally('agent:mcp');

		expect(service.getAIProviderParticipants()).toHaveLength(2);
	});

	it('clearTimers cancels pending agent removal timers', () => {
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId);
		emit.mockClear();

		service.clearTimers();
		jest.advanceTimersByTime(AGENT_PRESENCE_TTL_MS * 2);

		// Timer cancelled → no leave emitted; participant stays in state.
		expect(emit).not.toHaveBeenCalled();
		expect(service.getAIProviderParticipants()).toHaveLength(1);
	});

	it('clears an agent expiry timer when the agent leaves', () => {
		passGate('platform_move_presence_agents');
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId);
		service.onParticipantLeft({
			...payload,
			data: { sessionId: expectedSessionId },
		});
		emit.mockClear();
		jest.advanceTimersByTime(AGENT_PRESENCE_TTL_MS);

		expect(emit).not.toHaveBeenCalled();
	});

	it('removes agents from consumers and clears their timers on disconnect', () => {
		passGate('platform_move_presence_agents');
		const emit = jest.fn();
		const service = participantsServiceConstructor({ emit });

		service.upsertAIProviderParticipantLocally(providerId);
		emit.mockClear();
		service.disconnect('CLOSE_CONNECTION', sessionId);

		expect(service.getAIProviderParticipants()).toHaveLength(0);
		expect(emit).toHaveBeenCalledWith('presence', {
			left: [expect.objectContaining({ sessionId: expectedSessionId })],
		});
		emit.mockClear();
		jest.advanceTimersByTime(AGENT_PRESENCE_TTL_MS);
		expect(emit).not.toHaveBeenCalled();
	});

	it('preserves the legacy disconnect event when enriched presence is disabled', () => {
		failGate('platform_move_presence_agents');
		const emit = jest.fn();
		const service = participantsServiceConstructor({
			emit,
			participantsState: new ParticipantsState(new Map([[activeUser.sessionId, activeUser]])),
		});

		service.upsertAIProviderParticipantLocally(providerId);
		emit.mockClear();
		service.disconnect('CLOSE_CONNECTION', sessionId);

		expect(service.getAIProviderParticipants()).toHaveLength(0);
		expect(emit).toHaveBeenCalledWith('presence', { left: [activeUser] });
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
			participantsState: participants,
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
			expect(emitPresenceSpy).toHaveBeenCalledTimes(1);
			expect(emitPresenceSpy).toHaveBeenCalledWith(
				{ left: [{ sessionId: activeUser.sessionId }] },
				'participant leaving',
			);
		});

		it('should call emit with participant', () => {
			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit).toHaveBeenCalledWith('presence', {
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

		const analyticsHelper = new AnalyticsHelper('fakeDocumentAri');
		const sendActionEvent = jest.spyOn(analyticsHelper, 'sendActionEvent');

		const participantsService = participantsServiceConstructor({
			analyticsHelper,
			participantsState: new ParticipantsState(participantsMap),
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

		const analyticsHelper = new AnalyticsHelper('fakeDocumentAri');
		const sendActionEvent = jest.spyOn(analyticsHelper, 'sendActionEvent');

		const participantsService = participantsServiceConstructor({
			analyticsHelper,
			participantsState: new ParticipantsState(participantsMap),
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
		const participantsService = participantsServiceConstructor({
			analyticsHelper,
			participantsState: new ParticipantsState(participantsMap),
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

		const participantsService = participantsServiceConstructor({
			participantsState: new ParticipantsState(participantsMap),
		});

		const collabMode = participantsService.getCollabMode();
		expect(collabMode).toBe('single');
	});

	it('should return collab mode for multiple users correctly', () => {
		const participantsMap: ParticipantsMap = new Map();
		participantsMap.set(activeUser.sessionId, activeUser);
		participantsMap.set(activeAgent.sessionId, activeAgent);

		const participantsService = participantsServiceConstructor({
			participantsState: new ParticipantsState(participantsMap),
		});

		const collabMode = participantsService.getCollabMode();
		expect(collabMode).toBe('collab');
	});
});

describe('batchFetchUsers', () => {
	const mockGetUsers = jest.fn().mockReturnValue([
		{
			...activeUser,
			isHydrated: true,
		},
	]);

	const defaultBatchProps: BatchProps = {
		getUsers: mockGetUsers,
	};

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it('Should clear timers', async () => {
		const participantsService = participantsServiceConstructor({});
		//once for inactiveTimer and once for batch timer
		jest.useFakeTimers({ legacyFakeTimers: true });

		participantsService.clearTimers();
		expect(clearTimeout).toHaveBeenCalledTimes(2);
	});

	it('Should do nothing with no batchProps', async () => {
		const participantsService = participantsServiceConstructor({});
		// @ts-ignore private variable
		expect(participantsService.currentlyPollingFetchUsers).toBeTruthy();
		await participantsService.batchFetchUsers();

		// @ts-ignore private variable
		expect(participantsService.currentlyPollingFetchUsers).toBeTruthy();
		expect(mockGetUsers).not.toHaveBeenCalled();
	});

	it('Should do nothing if hasBatchFetchError', async () => {
		const participantsService = participantsServiceConstructor({
			batchProps: defaultBatchProps,
		});

		jest.useFakeTimers({ legacyFakeTimers: true });

		// @ts-ignore private variable
		expect(participantsService.hasBatchFetchError).toEqual(false);
		// @ts-ignore private variable
		participantsService.hasBatchFetchError = true;
		await participantsService.batchFetchUsers();

		// @ts-ignore private variable
		expect(participantsService.hasBatchFetchError).toEqual(true);
		expect(mockGetUsers).not.toHaveBeenCalled();

		expect(clearTimeout).toHaveBeenCalledTimes(1);
	});

	it.each([['default'], [1000]])(
		'Should delay and fetch correctly with delay of %s',
		async (customDelay) => {
			const participantsState = new ParticipantsState();
			participantsState.setBySessionId(activeUser.sessionId, activeUser);
			const participantsService = participantsServiceConstructor({
				participantsState,
				batchProps:
					customDelay === 'default'
						? defaultBatchProps
						: {
								...defaultBatchProps,
								debounceTime: customDelay as number,
							},
			});

			// 500 is DEFAULT_FETCH_USERS_INTERVAL
			const timeout = customDelay === 'default' ? 500 : (customDelay as number);

			// @ts-ignore private variable
			expect(participantsService.currentlyPollingFetchUsers).toBeTruthy();

			jest.useFakeTimers({ legacyFakeTimers: true });
			expect(setTimeout).not.toHaveBeenCalled();
			const delay = participantsService.initializeFirstBatchFetchUsers();

			expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), timeout);

			jest.advanceTimersByTime(200);
			// @ts-ignore private variable
			expect(participantsService.currentlyPollingFetchUsers).toBeTruthy();

			jest.advanceTimersByTime(timeout + 100);
			await delay;

			expect(mockGetUsers).toHaveBeenCalled();
			// don't want to await batchFetchUsers in service, so wait for promises resovled
			await new Promise(process.nextTick);
			// @ts-ignore private variable
			expect(participantsService.currentlyPollingFetchUsers).toBeFalsy();
		},
	);

	it('Should handle error', async () => {
		const analyticsHelper = new AnalyticsHelper('fakeDocumentAri');
		const sendErrorEventSpy = jest.spyOn(analyticsHelper, 'sendErrorEvent');
		const mockOnError = jest.fn();

		const participantsState = new ParticipantsState();
		participantsState.setBySessionId(activeUser.sessionId, activeUser);

		const participantsService = participantsServiceConstructor({
			analyticsHelper,
			participantsState,
			batchProps: {
				...defaultBatchProps,
				getUsers: jest.fn().mockImplementation(() => {
					throw error;
				}),
				onError: mockOnError,
			},
		});

		jest.useFakeTimers({ legacyFakeTimers: true });
		expect(setTimeout).not.toHaveBeenCalled();

		const error = new Error('Mock Error');
		await participantsService.batchFetchUsers();

		expect(mockOnError).toHaveBeenCalledWith(error);
		// @ts-ignore private variable
		expect(participantsService.hasBatchFetchError).toEqual(true);

		expect(sendErrorEventSpy).toHaveBeenCalledWith(error, 'Failed while fetching participants');
	});

	it('Should call timeout with custom debounceTime', async () => {
		const participantsState = new ParticipantsState();
		participantsState.setBySessionId(activeUser.sessionId, activeUser);

		const participantsService = participantsServiceConstructor({
			participantsState,
			batchProps: {
				debounceTime: 35,
			},
		});
		jest.useFakeTimers({ legacyFakeTimers: true });
		expect(setTimeout).not.toHaveBeenCalled();

		await participantsService.batchFetchUsers();

		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 35);
	});

	it('Should enrich participants if no restriction on maxIntervalFetchSize', async () => {
		const participantsState = new ParticipantsState();
		participantsState.setBySessionId(activeUser.sessionId, activeUser);

		const participantsService = participantsServiceConstructor({
			participantsState,
			batchProps: defaultBatchProps,
		});
		jest.useFakeTimers({ legacyFakeTimers: true });
		expect(setTimeout).not.toHaveBeenCalled();

		await participantsService.batchFetchUsers();

		expect(setTimeout).toHaveBeenCalledTimes(0);
		expect(mockGetUsers).toHaveBeenCalledTimes(1);
	});

	it('Should not enrich participants if participantsLimit reached', async () => {
		const participantsState = new ParticipantsState();
		participantsState.setBySessionId(activeUser.sessionId, {
			...activeUser,
			isHydrated: true,
		});

		const participantsService = participantsServiceConstructor({
			participantsState,
			batchProps: {
				...defaultBatchProps,
				participantsLimit: 1,
			},
		});
		jest.useFakeTimers({ legacyFakeTimers: true });
		expect(setTimeout).not.toHaveBeenCalled();

		await participantsService.batchFetchUsers();

		expect(setTimeout).toHaveBeenCalledTimes(0);
		expect(mockGetUsers).toHaveBeenCalledTimes(0);
	});
});
