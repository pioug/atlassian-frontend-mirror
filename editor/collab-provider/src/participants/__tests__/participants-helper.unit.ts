import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import { createParticipantFromPayload, PARTICIPANT_UPDATE_INTERVAL } from '../participants-helper';

// Realistic time as a base reference
const baseTime = 1676863793756;

const activeUserId = '420';
const activeUser: ProviderParticipant = {
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
};

describe('createParticipantFromPayload', () => {
	describe('when the user exists', () => {
		// 15 minutes since base
		const lastActive = baseTime + PARTICIPANT_UPDATE_INTERVAL * 3;
		const payload = {
			...activeUser,
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
				...activeUser,
				lastActive,
				// Blank when getUser unavailable
				name: '',
				avatar: '',
				email: '',
				isGuest: undefined,
			};

			it('should return participant to update', async () => {
				const recievedParticipant = await createParticipantFromPayload(payload, getUser);
				expect(recievedParticipant).toEqual(expectedParticipant);
			});
		});

		describe('and getUser exists', () => {
			const getUser = jest.fn().mockReturnValue(activeUser);
			const expectedParticipant: ProviderParticipant = {
				...activeUser,
				lastActive,
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
		};
		const { timestamp, ...rest } = payload;
		const expectedParticipant: ProviderParticipant = {
			name: 'bob',
			avatar: '',
			email: '',
			isGuest: false,
			lastActive: timestamp,
			...rest,
		};

		it('should return new participant', async () => {
			const recievedParticipant = await createParticipantFromPayload(payload, getUser);
			expect(recievedParticipant).toEqual(expectedParticipant);
		});
	});
});
