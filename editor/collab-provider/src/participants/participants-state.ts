import { ParticipantsMap, ProviderParticipant } from './participants-helper';

export class ParticipantsState {
  private participants: ParticipantsMap;

  constructor(baseParticipants: ParticipantsMap = new Map()) {
    this.participants = baseParticipants;
  }

  getBySessionId = (sessionId: string): ProviderParticipant | undefined => {
    const participant = this.participants.get(sessionId);
    // Spread to ensure we get a deep copy
    return participant ? { ...participant } : undefined;
  };

  setBySessionId = (
    sessionId: string,
    participant: ProviderParticipant,
  ): void => {
    this.participants.set(sessionId, participant);
  };

  getParticipants = (): ProviderParticipant[] =>
    // Spread to get deep copy
    [...this.participants.values()].map((p) => ({ ...p }));

  removeBySessionId = (sessionId: string): boolean =>
    this.participants.delete(sessionId);

  clear = (): void => this.participants.clear();

  doesntHave = (sessionId: string): boolean =>
    !this.participants.has(sessionId);

  size = (): number => this.participants.size;

  // If userId of participant in userIds, set lastActive to now
  updateLastActive = (now: number, userIds: string[]): void =>
    this.participants.forEach((p) => {
      p.lastActive = userIds.includes(p.userId) ? now : p.lastActive;
    });
}
