import type { PresencePayload } from '../types';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';
import { ParticipantsState } from './participants-state';

export const PARTICIPANT_UPDATE_INTERVAL = 300 * 1000; // 300 seconds

export type ParticipantsMap = Map<string, ProviderParticipant>;

type UserType = Pick<ProviderParticipant, 'name' | 'avatar' | 'userId' | 'email' | 'isGuest'>;

// Names are hard
export type GetUserType = ((userId: string) => Promise<UserType>) | undefined;
export type GetUsersType = ((userIds: string[]) => Promise<UserType[]>) | undefined;

export type BatchProps = {
	/** Defaults to {@link #DEFAULT_BATCH_FETCH_SIZE} if none provided **/
	batchSize?: number;
	/** how often the debounce should run. Defaults to {@link ./participants-service#DEFAULT_FETCH_USERS_INTERVAL} if none provided **/
	debounceTime?: number;
	getUsers?: GetUsersType;
	onError?(error: unknown): void;
	/** when to stop fetching users. eg. if this = 5, we won't attempt to hydrate more than 5 **/
	participantsLimit?: number;
};

const DEFAULT_BATCH_FETCH_SIZE = 25;

export const createParticipantFromPayload = async (
	// userId must be defined, unlike in PresencePayload
	payload: PresencePayload & { userId: string },
	getUser: GetUserType,
): Promise<ProviderParticipant> => {
	const { sessionId, timestamp, clientId, userId, permit, presenceId, presenceActivity } = payload;

	const user = await getUser?.(userId);

	const participant: ProviderParticipant = {
		name: user?.name || '',
		avatar: user?.avatar || '',
		email: user?.email || '',
		sessionId,
		lastActive: timestamp,
		userId,
		clientId,
		permit,
		isGuest: user?.isGuest,
		presenceId: presenceId,
		presenceActivity: presenceActivity,
		isHydrated: !!user,
	};

	return participant;
};

export const fetchParticipants = async (
	// userId must be defined, unlike in PresencePayload
	participantsState: ParticipantsState,
	batchProps: BatchProps,
): Promise<ProviderParticipant[]> => {
	const { batchSize = batchProps.batchSize || DEFAULT_BATCH_FETCH_SIZE, getUsers } = batchProps;
	const participantsToHydrate = participantsState.getUniqueParticipants({
		isHydrated: false,
	});
	const participants = participantsToHydrate.splice(0, batchSize);

	if (!participants.length) {
		return [];
	}

	const aaids = new Set<string>();
	participants.forEach((p) => {
		aaids.add(p.userId);
	});

	const users = await getUsers?.([...aaids.values()]);
	const hydratedParticipants: ProviderParticipant[] = [];

	users?.forEach((user) => {
		// find all sessions of the user we just hydrated and populate data
		participantsState
			.getParticipants()
			.filter((p) => p.userId === user.userId)
			.forEach((participant) => {
				const { sessionId } = participant;

				if (participant && sessionId) {
					const hydratedParticipant = {
						name: user?.name || '',
						avatar: user?.avatar || '',
						email: user?.email || '',
						sessionId,
						lastActive: participant.lastActive,
						userId: user.userId,
						clientId: participant.clientId,
						permit: participant.permit,
						isGuest: user?.isGuest,
						presenceId: participant.presenceId,
						presenceActivity: participant.presenceActivity,
						isHydrated: true,
					};

					participantsState.setBySessionId(sessionId, hydratedParticipant);
					hydratedParticipants.push(hydratedParticipant);
				}
			});
	});

	return hydratedParticipants;
};
