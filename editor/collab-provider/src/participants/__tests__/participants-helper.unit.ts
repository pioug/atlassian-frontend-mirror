import type { ProviderParticipant, PresenceActivity } from '@atlaskit/editor-common/collab';
import {
	BatchProps,
	createParticipantFromPayload,
	fetchParticipants,
	PARTICIPANT_UPDATE_INTERVAL,
} from '../participants-helper';
import { ParticipantsState } from '../participants-state';

// Realistic time as a base reference
const baseTime = 1676863793756;

const activeUserId = '420';
const hydratedUser: ProviderParticipant = {
	userId: activeUserId,
	clientId: 'unused1',
	sessionId: '69',
	// 7.5 minutes from base
	lastActive: baseTime + PARTICIPANT_UPDATE_INTERVAL * 1.5,
	name: 'Mr Kafei',
	avatar: 'www.jamescameron.com/image.png',
	email: 'fake.user@email.com',
	isGuest: false,
	permit: {
		isPermittedToComment: false,
		isPermittedToEdit: false,
		isPermittedToView: true,
	},
	presenceId: 'mockPresenceId',
	presenceActivity: 'viewer',
	isHydrated: true,
};

const nonHydratedParticipant: ProviderParticipant = {
	...hydratedUser,
	name: '',
	avatar: '',
	email: '',
	isGuest: undefined,
	isHydrated: false,
};

describe('createParticipantFromPayload', () => {
	describe('when the user exists', () => {
		// 15 minutes since base
		const lastActive = baseTime + PARTICIPANT_UPDATE_INTERVAL * 3;
		const payload = {
			...hydratedUser,
			timestamp: lastActive,
			permit: {
				isPermittedToComment: false,
				isPermittedToEdit: false,
				isPermittedToView: true,
			},
		};

		describe('and getUser doesnt', () => {
			const getUser = undefined;
			const expectedParticipant: ProviderParticipant = {
				...hydratedUser,
				lastActive,
				// Blank when getUser unavailable
				name: '',
				avatar: '',
				email: '',
				isGuest: undefined,
				isHydrated: false,
			};

			it('should return participant to update', async () => {
				const recievedParticipant = await createParticipantFromPayload(payload, getUser);
				expect(recievedParticipant).toEqual(expectedParticipant);
			});
		});

		describe('and getUser exists', () => {
			const getUser = jest.fn().mockReturnValue(hydratedUser);
			const expectedParticipant: ProviderParticipant = {
				...hydratedUser,
				lastActive,
				isHydrated: true,
			};

			beforeEach(() => jest.clearAllMocks());

			it('should return participant to update', async () => {
				const recievedParticipant = await createParticipantFromPayload(payload, getUser);
				expect(recievedParticipant).toEqual(expectedParticipant);
			});

			it('should call getUser', async () => {
				await createParticipantFromPayload(payload, getUser);
				expect(getUser).toBeCalledTimes(1);
				expect(getUser).toBeCalledWith(payload.userId);
			});
		});
	});

	describe('when the user is new', () => {
		const getUser = jest.fn().mockReturnValue({
			name: 'bob',
			avatar: undefined,
			isGuest: false,
		});
		const payload = {
			sessionId: '',
			userId: '50',
			clientId: '',
			timestamp: baseTime,
			permit: {
				isPermittedToComment: false,
				isPermittedToEdit: false,
				isPermittedToView: true,
			},
			presenceId: 'mockPresenceId',
			presenceActivity: 'viewer' as PresenceActivity,
		};
		const { timestamp, ...rest } = payload;
		const expectedParticipant: ProviderParticipant = {
			name: 'bob',
			avatar: '',
			email: '',
			isGuest: false,
			lastActive: timestamp,
			isHydrated: true,
			...rest,
		};

		it('should return new participant', async () => {
			const recievedParticipant = await createParticipantFromPayload(payload, getUser);
			expect(recievedParticipant).toEqual(expectedParticipant);
		});
	});
});

describe('fetchParticipants', () => {
	const getUsersMock = jest.fn();

	const defaultBatchProps: BatchProps = {
		getUsers: getUsersMock,
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('when no participants, return nothing', async () => {
		const participantsState = new ParticipantsState();
		const result = await fetchParticipants(participantsState, defaultBatchProps);
		expect(result.length).toEqual(0);
	});

	it('when no participants to hydrate, return nothing', async () => {
		const participantsState = new ParticipantsState();
		participantsState.setBySessionId(hydratedUser.sessionId, hydratedUser);
		const result = await fetchParticipants(participantsState, defaultBatchProps);
		expect(getUsersMock).not.toHaveBeenCalled();
		expect(result.length).toEqual(0);
	});

	it('when no getUsers provided, return nothing', async () => {
		const participantsState = new ParticipantsState();
		const result = await fetchParticipants(participantsState, {});
		expect(result.length).toEqual(0);
	});

	it('return hydrated participants', async () => {
		const participantsState = new ParticipantsState();
		// not yet hydrated
		participantsState.setBySessionId(nonHydratedParticipant.sessionId, nonHydratedParticipant);
		getUsersMock.mockReturnValue([hydratedUser]);

		const result = await fetchParticipants(participantsState, defaultBatchProps);

		expect(result.length).toEqual(1);
		expect(result[0]).toEqual({
			...hydratedUser,
			isHydrated: true,
		});

		// verify we updated state in the helper
		expect(participantsState.getBySessionId(hydratedUser.sessionId)).toEqual({
			...hydratedUser,
			isHydrated: true,
		});
	});

	it('call getUsers with correct spliced participants to hydrate', async () => {
		const participantsState = new ParticipantsState();
		// not yet hydrated
		[
			nonHydratedParticipant,
			{ ...nonHydratedParticipant, userId: '123', sessionId: '123' },
			{ ...nonHydratedParticipant, userId: '321', sessionId: '321' },
			{ ...nonHydratedParticipant, userId: '999', sessionId: '999' },
		].forEach((p) => {
			participantsState.setBySessionId(p.sessionId, p);
		});

		getUsersMock.mockReturnValue([hydratedUser]);

		await fetchParticipants(participantsState, {
			...defaultBatchProps,
			batchSize: 3,
		});

		expect(getUsersMock).toHaveBeenCalledWith([activeUserId, '123', '321']);
	});

	it('hydrates all sessions of duplicate users', async () => {
		const participantsState = new ParticipantsState();
		// not yet hydrated
		[
			nonHydratedParticipant,
			{ ...nonHydratedParticipant, userId: '123', sessionId: '123' },
			{ ...nonHydratedParticipant, userId: '123', sessionId: '321' },
			{ ...nonHydratedParticipant, userId: '123', sessionId: '999' },
		].forEach((p) => {
			participantsState.setBySessionId(p.sessionId, p);
		});

		getUsersMock.mockReturnValue([hydratedUser, { ...hydratedUser, userId: '123' }]);

		const result = await fetchParticipants(participantsState, defaultBatchProps);

		expect(getUsersMock).toHaveBeenCalledWith([activeUserId, '123']);
		expect(result.length).toEqual(4);
		expect(result).toEqual(participantsState.getParticipants());
	});
});
