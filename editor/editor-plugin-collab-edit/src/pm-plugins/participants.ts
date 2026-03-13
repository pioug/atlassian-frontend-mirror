import type { CollabParticipant } from '@atlaskit/editor-common/collab';

import type { ReadOnlyParticipants } from '../types';

export class Participants implements ReadOnlyParticipants {
	private participants: Map<string, CollabParticipant>;

	constructor(participants: Map<string, CollabParticipant> = new Map<string, CollabParticipant>()) {
		this.participants = participants;
	}

	add(data: CollabParticipant[]): Participants {
		const newSet = new Map<string, CollabParticipant>(this.participants);
		data.forEach((participant) => {
			newSet.set(participant.sessionId, participant);
		});
		return new Participants(newSet);
	}

	remove(sessionIds: string[]): Participants {
		const newSet = new Map<string, CollabParticipant>(this.participants);
		sessionIds.forEach((sessionId) => {
			newSet.delete(sessionId);
		});

		return new Participants(newSet);
	}

	update(sessionId: string, lastActive: number): Participants {
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

	updateCursorPos(sessionId: string, cursorPos: number): Participants {
		const newSet = new Map<string, CollabParticipant>(this.participants);
		const data = newSet.get(sessionId);
		if (!data) {
			return this;
		}

		newSet.set(sessionId, {
			...data,
			cursorPos,
		});

		return new Participants(newSet);
	}

	toArray(): CollabParticipant[] {
		return Array.from(this.participants.values());
	}

	get(sessionId: string): CollabParticipant | undefined {
		return this.participants.get(sessionId);
	}

	size(): number {
		return this.participants.size;
	}

	eq(other: ReadOnlyParticipants): boolean {
		const left = this.toArray()
			.map((p) => p.sessionId)
			.sort((a, b) => (a > b ? -1 : 1))
			.join('');
		const right = other
			.toArray()
			.map((p) => p.sessionId)
			.sort((a, b) => (a > b ? -1 : 1))
			.join('');

		return left === right;
	}
}
