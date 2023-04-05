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

export const createParticipantFromPayload = async (
  payload: PresencePayload & { userId: string },
  getUser:
    | ((userId: string) => Promise<
        Pick<CollabParticipant, 'name' | 'email' | 'avatar'> & {
          userId: string;
        }
      >)
    | undefined,
): Promise<ProviderParticipant> => {
  const { sessionId, timestamp, clientId, userId } = payload;

  let user;
  if (getUser) {
    user = await getUser(userId);
  }

  const participant: ProviderParticipant = {
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    sessionId,
    lastActive: timestamp,
    userId,
    clientId,
  };

  return participant;
};
