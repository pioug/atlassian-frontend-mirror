import type {
  CollabEventPresenceData,
  CollabParticipant,
} from '@atlaskit/editor-common/collab';
import type { CollabEventTelepointerData, PresencePayload } from '../types';

export const PARTICIPANT_UPDATE_INTERVAL = 300 * 1000; // 300 seconds

export type ProviderParticipant = CollabParticipant & {
  userId: string;
  clientId: number | string;
};

export type ParticipantsMap = Map<string, ProviderParticipant>;

export type PresenceEmit = (
  evt: 'presence',
  data: CollabEventPresenceData,
) => void;

export type TelepointerEmit = (
  evt: 'telepointer',
  data: CollabEventTelepointerData,
) => void;

export type GetUserType =
  | ((
      userId: string,
    ) => Promise<Pick<ProviderParticipant, 'name' | 'avatar' | 'userId'>>)
  | undefined;

export const createParticipantFromPayload = async (
  // userId must be defined, unlike in PresencePayload
  payload: PresencePayload & { userId: string },
  getUser: GetUserType,
): Promise<ProviderParticipant> => {
  const { sessionId, timestamp, clientId, userId } = payload;

  const user = await getUser?.(userId);

  const participant: ProviderParticipant = {
    name: user?.name || '',
    avatar: user?.avatar || '',
    sessionId,
    lastActive: timestamp,
    userId,
    clientId,
  };

  return participant;
};
