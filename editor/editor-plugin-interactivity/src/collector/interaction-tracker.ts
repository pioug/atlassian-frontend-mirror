import type { EditorInteractionGroupName } from '../analytics/interactivity-snapshot';
import { BoundedList } from '../collections/bounded-list';
import { BoundedMap } from '../collections/bounded-map';

import { eventKey, interactionEventKind } from './interaction-events';

/**
 * The Event Timing fields this package reads, declared optional so that a `PerformanceEntry` from
 * `getEntries()` is assignable without a cast — `interactionId` is missing from the DOM typings'
 * `PerformanceEventTiming` altogether, and the rest are only on it.
 */
export type InteractionEntry = PerformanceEntry & {
	interactionId?: number;
	processingEnd?: number;
	processingStart?: number;
	target?: Node | null;
};

/**
 * One paint, and the processing of every event it presented.
 *
 * One paint can present several events, and the handlers of all of them ran before it: a
 * `pointerover` handler that was still running when the user clicked held up the paint that showed
 * the click. So an interaction's processing is the processing of its whole paint, not of its own
 * events only — otherwise a handler that is not its own reads as time the user waited for nothing.
 *
 * Event Timing gives a paint no identity. The only thing an entry says about it is
 * `startTime + duration`, the moment it happened, so that is what identifies it.
 */
type Paint = {
	/** When it happened, as the first event it presented reported. */
	presentedAt: number;
	/** The latest any of those events finished running handlers. */
	processingEndedAt: number;
	/** The earliest any of them started. */
	processingStartedAt: number;
};

/**
 * The paint an entry was presented by, and whether the entry moved the processing that paint covers.
 * An entry whose handlers ran inside what the paint already covered changes nothing for any
 * interaction reading its boundaries from it.
 */
type PaintPlacement = {
	grew: boolean;
	paint: Paint;
};

/**
 * The four moments an interaction's latency divides at, in order: the user acted, its handlers
 * started running, they finished, the screen updated.
 */
export type InteractionBoundaries = {
	presentedAt: number;
	processingEndedAt: number;
	processingStartedAt: number;
	startedAt: number;
};

/**
 * What an entry did to the interaction it belongs to: either it is the first entry of a new
 * interaction, or it changed an interaction already known. Both carry the editor group of the
 * interaction, if it is one of the editor's, and the boundaries it now has.
 *
 * A `remeasured` where `previousLatencyMs` equals `latencyMs` is an interaction whose latency stayed
 * as it was and whose boundaries moved: the entry ran in the same paint without being the slowest
 * of them.
 */
export type InteractionUpdate =
	| {
			boundaries: InteractionBoundaries | undefined;
			group: EditorInteractionGroupName | undefined;
			interactionId: number;
			latencyMs: number;
			type: 'new';
	  }
	| {
			boundaries: InteractionBoundaries | undefined;
			group: EditorInteractionGroupName | undefined;
			interactionId: number;
			latencyMs: number;
			previousLatencyMs: number;
			type: 'remeasured';
	  };

/**
 * What is kept per interaction. The boundaries are not among these: they are derived from the paint
 * whenever the interaction is reported, because the paint keeps growing as the browser reports the
 * remaining events it presented.
 */
type TrackedInteraction = {
	group: EditorInteractionGroupName | undefined;
	latencyMs: number;
	/** The paint that presented the entry which measured the interaction at its slowest. */
	presentedIn: Paint | undefined;
	/** The `startTime` of that entry: when the user acted. */
	startedAt: number;
};

/**
 * How many interactions are remembered, so their growth can still be applied, and how many of
 * the editor's events. Entries of one interaction arrive within the interaction itself, so
 * anything older than the last few hundred is not needed.
 */
const MAX_TRACKED = 256;

/**
 * How many paints entries can still be placed in. The entries of a paint arrive within a batch or
 * two of each other, so this only has to cover the paints in flight; it is what `web-vitals` keeps.
 */
const MAX_RECENT_PAINTS = 10;
/**
 * Event Timing rounds `duration` down to 8 ms, so two events presented by one paint report that
 * paint up to this far apart — and nothing else in Event Timing says they share it.
 */
const PRESENTATION_ROUNDING_MS = 8;

/**
 * Makes interactions out of what the two observers report, for one session.
 *
 * Entries sharing a non-zero `interactionId` are one interaction whose latency is the
 * maximum `duration` among them. Entries arrive incrementally, so an interaction's latency
 * can grow after it was first reported — callers apply that to what they already counted
 * rather than counting the interaction twice.
 *
 * A non-zero `interactionId` is the browser's own definition of an interaction, which is
 * also what INP filters on: it is assigned to the pointer and keyboard events that make one
 * up, and never to scrolling or pointer movement.
 *
 * The editor's events answer what an entry cannot: which interactions were with the editor, and
 * how many there were, including the ones below the Event Timing reporting threshold.
 *
 * Every entry is also placed in the paint that presented it, which is what says how an
 * interaction's latency divides into waiting, processing and presentation. See `Paint`.
 */
export class InteractionTracker {
	private readonly startsAfterInteractionId: number;

	private readonly interactions = new BoundedMap<number, TrackedInteraction>(MAX_TRACKED);
	private readonly groupByEvent = new BoundedMap<string, EditorInteractionGroupName>(MAX_TRACKED);
	private readonly recentPaints = new BoundedList<Paint>(MAX_RECENT_PAINTS);

	private highestInteractionId = 0;

	/**
	 * @param startsAfterInteractionId interactions up to and including this one belong to the
	 * previous tracker and are ignored. `interactionId` counts up over the life of the page, so
	 * a session opening mid-page passes the highest id the one before it saw; without that, an
	 * entry still arriving for an interaction from the previous session would look new here and
	 * be counted in both.
	 */
	constructor(startsAfterInteractionId = 0) {
		this.startsAfterInteractionId = startsAfterInteractionId;
	}

	/** The highest `interactionId` this tracker has seen. */
	get lastInteractionId(): number {
		return Math.max(this.highestInteractionId, this.startsAfterInteractionId);
	}

	/**
	 * Merges an entry into the interaction it belongs to.
	 *
	 * @returns what that changed about the interactions this tracker knows, the entry's own first.
	 * More than one of them when the paint the entry ran in presented several.
	 */
	merge(entry: InteractionEntry): InteractionUpdate[] {
		if (!Number.isFinite(entry.duration) || entry.duration < 0) {
			return [];
		}

		const placement = this.paintOf(entry);
		const paint = placement?.paint;

		const { interactionId } = entry;

		// Reported only when the entry grew the paint, because otherwise nothing an interaction reads
		// from it moved. Every interaction the paint presented is here, not only the entry's own: a
		// `first-input` or non-interaction event reports `interactionId` 0 and has none of its own,
		// and a second press of the same paint moved where the first one spent its latency.
		//
		// The check below is neither reached with a `0` nor needed: the interactions reported are the
		// ones this tracker holds, and the only way into that map is past the check.
		const remeasuredOthers = placement?.grew
			? this.remeasuredUpdatesIn(placement.paint, { except: interactionId })
			: [];

		if (!interactionId) {
			return remeasuredOthers;
		}

		if (interactionId <= this.startsAfterInteractionId) {
			// The entry belongs to the session before this one, but its handlers still ran before a
			// paint of this one.
			return remeasuredOthers;
		}

		this.highestInteractionId = Math.max(this.highestInteractionId, interactionId);

		const tracked = this.interactions.get(interactionId);

		if (tracked === undefined) {
			// Taken once: an entry that only makes the interaction slower has to move its count
			// within the group it was counted in, not into another one.
			const group = this.groupByEvent.get(eventKey(entry.name, entry.startTime));
			const interaction = {
				group,
				latencyMs: entry.duration,
				presentedIn: paint,
				startedAt: entry.startTime,
			};

			this.interactions.set(interactionId, interaction);

			return [this.newUpdate(interactionId, interaction), ...remeasuredOthers];
		}

		if (entry.duration > tracked.latencyMs) {
			const previousLatencyMs = tracked.latencyMs;

			tracked.latencyMs = entry.duration;
			tracked.presentedIn = paint;
			tracked.startedAt = entry.startTime;

			return [
				this.remeasuredUpdate(interactionId, tracked, previousLatencyMs),
				...remeasuredOthers,
			];
		}

		// Not the slowest entry of the interaction, so its latency stands. Its handlers still ran
		// before the same paint, if this is that paint, and so moved where that latency went.
		if (!placement?.grew || paint !== tracked.presentedIn) {
			return remeasuredOthers;
		}

		return [this.remeasuredUpdate(interactionId, tracked, tracked.latencyMs), ...remeasuredOthers];
	}

	recordEditorEvent(event: Event): EditorInteractionGroupName | undefined {
		const kind = interactionEventKind(event.type);
		if (!kind) {
			return undefined;
		}

		// Every event of the interaction, because any of them can be the one Event Timing reports
		// as the slowest: for a pointer press that is usually the click.
		this.groupByEvent.set(eventKey(event.type, event.timeStamp), kind.group);

		return kind.counts ? kind.group : undefined;
	}

	/**
	 * Every interaction whose boundaries are read from this paint, reported as measured again at the
	 * latency it already had.
	 *
	 * @param except the interaction the entry measured, which the caller reports itself. `0` or
	 * nothing when the entry measured none, and then no interaction is left out.
	 */
	private remeasuredUpdatesIn(
		paint: Paint,
		{ except }: { except: number | undefined },
	): InteractionUpdate[] {
		const remeasured: InteractionUpdate[] = [];

		this.interactions.forEach((interaction, interactionId) => {
			if (interaction.presentedIn === paint && interactionId !== except) {
				remeasured.push(this.remeasuredUpdate(interactionId, interaction, interaction.latencyMs));
			}
		});

		return remeasured;
	}

	private newUpdate(interactionId: number, tracked: TrackedInteraction): InteractionUpdate {
		return {
			type: 'new',
			interactionId,
			latencyMs: tracked.latencyMs,
			group: tracked.group,
			boundaries: this.boundariesOf(tracked),
		};
	}

	private remeasuredUpdate(
		interactionId: number,
		tracked: TrackedInteraction,
		previousLatencyMs: number,
	): InteractionUpdate {
		return {
			type: 'remeasured',
			interactionId,
			previousLatencyMs,
			latencyMs: tracked.latencyMs,
			group: tracked.group,
			boundaries: this.boundariesOf(tracked),
		};
	}

	/**
	 * The four moments of an interaction, read from the paint as it stands now.
	 *
	 * Limited the way `web-vitals` limits its INP attribution, so the four stay in order: the paint's
	 * handlers can have started before the event arrived, and can have finished after the paint the
	 * event's rounded-down `duration` points at.
	 *
	 * @returns nothing when the browser reported no processing timestamps for the interaction, which
	 * leaves it in no paint.
	 */
	private boundariesOf({
		latencyMs,
		presentedIn,
		startedAt,
	}: TrackedInteraction): InteractionBoundaries | undefined {
		if (!presentedIn) {
			return undefined;
		}

		const processingStartedAt = Math.max(presentedIn.processingStartedAt, startedAt);
		const presentedAt = Math.max(startedAt + latencyMs, processingStartedAt);
		const processingEndedAt = Math.min(presentedIn.processingEndedAt, presentedAt);

		return {
			startedAt,
			processingStartedAt,
			processingEndedAt,
			presentedAt,
		};
	}

	/**
	 * The paint that presented this entry, grown to cover this entry's own processing.
	 *
	 * The moment being matched is always the one the first entry of the paint reported, so that a
	 * run of entries 8 ms apart cannot walk one paint across the next.
	 *
	 * @returns nothing when the browser reported no processing timestamps for the entry, which
	 * leaves nothing to place it by.
	 */
	private paintOf(entry: InteractionEntry): PaintPlacement | undefined {
		const { startTime, duration, processingStart, processingEnd } = entry;

		if (typeof processingStart !== 'number' || typeof processingEnd !== 'number') {
			return undefined;
		}

		const presentedAt = startTime + duration;
		const knownPaint = this.recentPaints.findLast(
			(paint) => Math.abs(presentedAt - paint.presentedAt) <= PRESENTATION_ROUNDING_MS,
		);

		if (knownPaint) {
			const grew =
				processingStart < knownPaint.processingStartedAt ||
				processingEnd > knownPaint.processingEndedAt;

			knownPaint.processingStartedAt = Math.min(processingStart, knownPaint.processingStartedAt);
			knownPaint.processingEndedAt = Math.max(processingEnd, knownPaint.processingEndedAt);

			return { grew, paint: knownPaint };
		}

		const newPaint = {
			presentedAt,
			processingStartedAt: processingStart,
			processingEndedAt: processingEnd,
		};

		this.recentPaints.push(newPaint);

		return { grew: true, paint: newPaint };
	}
}
