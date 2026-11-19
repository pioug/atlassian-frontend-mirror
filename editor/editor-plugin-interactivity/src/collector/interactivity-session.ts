import type { InteractionKind, SessionKeys } from '../analytics/interactivity-snapshot';
import { InteractionGroup } from './interaction-group';
import { InteractionObserver } from './interaction-observer';
import { InteractionTracker } from './interaction-tracker';

function createSessionId(): string {
	if (typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export type RegionGroups = Record<InteractionKind | 'all', InteractionGroup>;

export type InteractivitySessionStart<Keys extends SessionKeys> = {
	hidden: boolean;
	regions: readonly string[];
	sessionKeys: Keys;
	startsAfterInteractionId: number;
};

/**
 * Everything that belongs to one session.
 *
 * Nothing here is reset — the next session is a new instance — so a field added here cannot
 * be left carrying the previous session's value.
 */
export class InteractivitySession<Keys extends SessionKeys> {
	readonly id: string = createSessionId();
	readonly startedAt: number = performance.now();
	/** Page interaction count when the session opened, subtracted to get its own total. */
	readonly interactionCountAtStart: number = InteractionObserver.readPageInteractionCount();
	readonly tracker: InteractionTracker;
	readonly page: InteractionGroup = new InteractionGroup();
	readonly regionGroups: Map<string, RegionGroups> = new Map();

	/** Increments per snapshot; a query takes the highest one per session. */
	seq = 0;
	/** Fixed for the session once known: a change to any of them closes it and opens the next. */
	readonly sessionKeys: Keys;

	hiddenMs = 0;
	hiddenSince: number | undefined;

	/**
	 * Bumped on every change to the accumulated data. A snapshot is emitted only when this
	 * has moved past `emittedRevision`, so identical snapshots are never sent twice.
	 */
	revision = 0;
	emittedRevision = 0;
	/** One lifecycle snapshot per hidden episode; cleared when the page comes back. */
	lifecycleSnapshotEmitted = false;

	constructor(start: InteractivitySessionStart<Keys>) {
		this.sessionKeys = start.sessionKeys;
		this.hiddenSince = start.hidden ? this.startedAt : undefined;
		this.tracker = new InteractionTracker(start.startsAfterInteractionId, this.startedAt);

		for (const region of start.regions) {
			this.regionGroups.set(region, {
				all: new InteractionGroup(),
				typing: new InteractionGroup(),
				pointer: new InteractionGroup(),
				other: new InteractionGroup(),
			});
		}
	}
}
