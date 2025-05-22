import type { ParticipantsMap } from '../participants-helper';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import { ParticipantsState } from '../participants-state';

const activeUser: ProviderParticipant = {
	userId: '420',
	clientId: 'unused1',
	sessionId: '69',
	lastActive: 999,
	name: 'Mr Kafei',
	avatar: 'www.jamescameron.com/image.png',
	email: 'fake.user@email.com',
};

const activeAgent: ProviderParticipant = {
	userId: 'agent:420',
	clientId: 'agent:unused1',
	sessionId: 'agent:69',
	lastActive: 999,
	name: 'Agent McAgentFace',
	avatar: 'www.jamescameron.com/image.png',
	email: 'fake.user@email.com',
};

describe('get functions', () => {
	const participants: ParticipantsMap = new Map()
		.set(activeUser.sessionId, activeUser)
		.set(activeAgent.sessionId, activeAgent);

	const participantsState = new ParticipantsState(participants);

	describe('getBySessionId', () => {
		const copy = participantsState.getBySessionId(activeUser.sessionId);
		it('should create a deep copy', () => {
			expect(copy).not.toBe(activeUser);
		});
	});

	describe('getParticipants', () => {
		const copy = participantsState.getParticipants();

		it('should create a deep copy', () => {
			expect(copy[0]).not.toBe(activeUser);
		});

		it('should not include agents', () => {
			expect(copy).toHaveLength(1);
		});
	});

	describe('getUniqueParticipants', () => {
		it('should only return unique participants', () => {
			const duplicateUser: ProviderParticipant = {
				...activeUser,
				sessionId: '1',
				lastActive: 1,
			};

			participantsState.setBySessionId(duplicateUser.sessionId, duplicateUser);
			const participantsToHydrate = participantsState.getUniqueParticipants({ isHydrated: false });
			expect(participantsState.size()).toEqual(3);

			expect(participantsToHydrate.length).toEqual(1);
			// last user added wins
			expect(participantsToHydrate).toEqual([duplicateUser]);
			expect(participantsState.getUniqueParticipantSize()).toEqual(1);
		});

		it('should filter for hydrated users only', () => {
			const hydratedUser: ProviderParticipant = {
				userId: '1',
				clientId: 'unused2',
				sessionId: '1',
				lastActive: 999,
				name: 'User 2',
				avatar: 'www.jamescameron.com/image.png',
				email: 'fake.user@email.com',
				isHydrated: true,
			};

			participantsState.setBySessionId(hydratedUser.sessionId, hydratedUser);
			const hydratedParticipants = participantsState.getUniqueParticipants({ isHydrated: true });
			expect(participantsState.size()).toEqual(3);

			expect(hydratedParticipants.length).toEqual(1);
			expect(hydratedParticipants).toEqual([hydratedUser]);
			expect(participantsState.getUniqueParticipantSize()).toEqual(2);
		});

		it('should filter for non hydrated users only', () => {
			const hydratedUser: ProviderParticipant = {
				userId: '1',
				clientId: 'unused2',
				sessionId: '1',
				lastActive: 999,
				name: 'User 2',
				avatar: 'www.jamescameron.com/image.png',
				email: 'fake.user@email.com',
			};

			participantsState.setBySessionId(hydratedUser.sessionId, hydratedUser);
			const hydratedParticipants = participantsState.getUniqueParticipants({ isHydrated: false });
			expect(participantsState.size()).toEqual(3);

			expect(hydratedParticipants.length).toEqual(2);
			expect(hydratedParticipants).toEqual([activeUser, hydratedUser]);
			expect(participantsState.getUniqueParticipantSize()).toEqual(2);
		});
	});

	describe('getAIProviderParticipants', () => {
		const copy = participantsState.getAIProviderParticipants();

		it('should create a deep copy', () => {
			expect(copy[0]).not.toBe(activeAgent);
		});

		it('should not include agents', () => {
			expect(copy).toHaveLength(1);
		});
	});
});

describe('removeBySessionId', () => {
	const participants: ParticipantsMap = new Map().set(activeUser.sessionId, activeUser);

	const participantsState = new ParticipantsState(participants);

	participantsState.removeBySessionId(activeUser.sessionId);

	it('should remove correct participant', () => {
		// @ts-ignore Private variable access to check
		expect(participantsState.participants).toEqual(new Map());
	});
});

describe('clear', () => {
	const participants: ParticipantsMap = new Map().set(activeUser.sessionId, activeUser);

	const participantsState = new ParticipantsState(participants);

	participantsState.clear();

	it('should remove all participants', () => {
		// @ts-ignore Private variable access to check
		expect(participantsState.participants).toEqual(new Map());
	});
});

describe('doesntHave', () => {
	it('should return true when participant not stored', () => {
		const participantsState = new ParticipantsState();
		expect(participantsState.doesntHave(activeUser.sessionId)).toEqual(true);
	});

	it('should return false when participant is stored', () => {
		const participants: ParticipantsMap = new Map().set(activeUser.sessionId, activeUser);
		const participantsState = new ParticipantsState(participants);

		expect(participantsState.doesntHave(activeUser.sessionId)).toEqual(false);
	});
});
