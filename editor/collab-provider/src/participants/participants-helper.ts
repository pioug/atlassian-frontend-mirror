import type { PresencePayload } from '../types';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';

export const PARTICIPANT_UPDATE_INTERVAL = 300 * 1000; // 300 seconds

export type ParticipantsMap = Map<string, ProviderParticipant>;

// Names are hard
export type GetUserType =
  | ((
      userId: string,
    ) => Promise<
      Pick<ProviderParticipant, 'name' | 'avatar' | 'userId' | 'email'>
    >)
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
    email: user?.email || '',
    sessionId,
    lastActive: timestamp,
    userId,
    clientId,
  };

  return participant;
};
