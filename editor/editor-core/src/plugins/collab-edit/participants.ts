import { CollabParticipant } from './types';

export interface ReadOnlyParticipants {
  get(sessionId: string): CollabParticipant | undefined;
  toArray(): ReadonlyArray<CollabParticipant>;
  eq(other: ReadOnlyParticipants): boolean;
}

export class Participants implements ReadOnlyParticipants {
  private participants: Map<string, CollabParticipant>;

  constructor(
    participants: Map<string, CollabParticipant> = new Map<
      string,
      CollabParticipant
    >(),
  ) {
    this.participants = participants;
  }

  add(data: CollabParticipant[]) {
    const newSet = new Map<string, CollabParticipant>(this.participants);
    data.forEach(participant => {
      newSet.set(participant.sessionId, participant);
    });
    return new Participants(newSet);
  }

  remove(sessionIds: string[]) {
    const newSet = new Map<string, CollabParticipant>(this.participants);
    sessionIds.forEach(sessionId => {
      newSet.delete(sessionId);
    });

    return new Participants(newSet);
  }

  update(sessionId: string, lastActive: number) {
    const newSet = new Map<string, CollabParticipant>(this.participants);
    const data = newSet.get(sessionId);
    if (!data) {
      return this;
    }

    newSet.set(sessionId, {
      ...data,
      lastActive,
    });

    return new Participants(newSet);
  }

  toArray() {
    return Array.from(this.participants.values());
  }

  get(sessionId: string) {
    return this.participants.get(sessionId);
  }

  eq(other: Participants) {
    const left = this.toArray()
      .map(p => p.sessionId)
      .sort((a, b) => (a > b ? -1 : 1))
      .join('');
    const right = other
      .toArray()
      .map(p => p.sessionId)
      .sort((a, b) => (a > b ? -1 : 1))
      .join('');

    return left === right;
  }
}
