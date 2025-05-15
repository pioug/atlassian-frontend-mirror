import { isAIProviderID } from '../helpers/utils';
import { type ParticipantsMap } from './participants-helper';
import type { ProviderParticipant } from '@atlaskit/editor-common/collab';

export type ParticipantFilter = {
	isHydrated: boolean;
};

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

	setBySessionId = (sessionId: string, participant: ProviderParticipant): void => {
		this.participants.set(sessionId, participant);
	};

	getParticipants = (): ProviderParticipant[] =>
		// Spread to get deep copy
		[...this.participants.values()].filter((p) => !isAIProviderID(p.userId)).map((p) => ({ ...p }));

	getAIProviderParticipants = (): ProviderParticipant[] =>
		// Spread to get deep copy
		[...this.participants.values()].filter((p) => isAIProviderID(p.userId)).map((p) => ({ ...p }));

	/**
	 * A user may contain multiple sessions, only return the unique users based on aaid.
	 * If multiple participants with same aaid exist, will return the most recent entry
	 * @param param0
	 * @returns
	 */
	getUniqueParticipants = ({ isHydrated = false }: ParticipantFilter): ProviderParticipant[] => {
		const uniqueParticipants = new Map<string, ProviderParticipant>();
		const participants = this.getParticipants();
		participants.forEach((p) => {
			if (!!p.isHydrated === isHydrated) {
				const previous = uniqueParticipants.get(p.userId);
				uniqueParticipants.set(
					p.userId,
					previous
						? {
								...previous,
								...p,
							}
						: p,
				);
			}
		});
		return [...uniqueParticipants.values()];
	};

	hasMoreParticipantsToHydrate = () => {
		return (
			this.getUniqueParticipants({
				isHydrated: false,
			}).length > 0
		);
	};

	removeBySessionId = (sessionId: string): boolean => this.participants.delete(sessionId);

	clear = (): void => this.participants.clear();

	doesntHave = (sessionId: string): boolean => !this.participants.has(sessionId);

	size = (): number => this.participants.size;

	getUniqueParticipantSize = (): number => {
		const result = new Set();
		this.getParticipants().forEach((p) => result.add(p.userId));
		return result.size;
	};

	// If userId of participant in userIds, set lastActive to now
	updateLastActive = (now: number, userIds: string[]): void =>
		this.participants.forEach((p) => {
			p.lastActive = userIds.includes(p.userId) ? now : p.lastActive;
		});
}
