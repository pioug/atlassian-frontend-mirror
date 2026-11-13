import { type MentionIdDiff, diffMentionIds } from './mention-id-diff';

/** Remembers one editor draft's mention IDs between document snapshots. */
export class MentionIdChangeTracker {
	private previousIds: string[] | undefined;

	reconcile(nextIds: readonly string[]): MentionIdDiff & { isInitial: boolean } {
		const isInitial = this.previousIds === undefined;
		const changes = diffMentionIds(this.previousIds ?? [], nextIds);
		this.previousIds = [...nextIds];
		return { isInitial, ...changes };
	}
}
