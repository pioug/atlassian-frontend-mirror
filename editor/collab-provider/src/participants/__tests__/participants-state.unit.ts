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

describe('get functions', () => {
	const participants: ParticipantsMap = new Map().set(activeUser.sessionId, activeUser);

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
