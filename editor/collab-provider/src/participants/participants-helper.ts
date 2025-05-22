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

/**
 * Will use the getUsers callback from batchProps to fetch users
 *
 * 1. Determine all the participants that need to be hydrated
 * 2. Only fetch a subset of those participants based on batchSize
 * 3. Of the users fetched, find all of those users' sessions and mark those entries as hydrated
 *
 * @param participantsState
 * @param batchProps
 * @returns
 * @example
 */
export const fetchParticipants = async (
	participantsState: ParticipantsState,
	batchProps: BatchProps,
): Promise<ProviderParticipant[]> => {
	const { batchSize = DEFAULT_BATCH_FETCH_SIZE, getUsers } = batchProps;
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
				const hydratedParticipant = {
					name: user.name,
					avatar: user.avatar,
					email: user.email,
					userId: user.userId,
					isGuest: user.isGuest,
					sessionId,
					lastActive: participant.lastActive,
					clientId: participant.clientId,
					permit: participant.permit,
					presenceId: participant.presenceId,
					presenceActivity: participant.presenceActivity,
					isHydrated: true,
				};

				participantsState.setBySessionId(sessionId, hydratedParticipant);
				hydratedParticipants.push(hydratedParticipant);
			});
	});

	return hydratedParticipants;
};
