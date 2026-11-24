import { BoundedMap } from '../collections/bounded-map';
import { eventKey, interactionEventKind } from './interaction-events';
import type { InteractionKind } from './types';

/** Optional so a `PerformanceEntry` is assignable without a cast: the DOM typings lack the field. */
export type InteractionEntry = PerformanceEntry & {
	interactionId?: number;
};

/** Which regions an interaction was with, and what kind it was. */
export type InteractionAttribution = {
	kind: InteractionKind;
	regions: string[];
};

export type InteractionUpdate =
	| {
			attribution: InteractionAttribution | undefined;
			interactionId: number;
			latencyMs: number;
			type: 'new';
	  }
	| {
			attribution: InteractionAttribution | undefined;
			interactionId: number;
			latencyMs: number;
			previousLatencyMs: number;
			type: 'remeasured';
	  };

type TrackedInteraction = {
	attribution: InteractionAttribution | undefined;
	latencyMs: number;
};

/** Entries of one interaction arrive within it, so older than the last few hundred is not needed. */
const MAX_TRACKED = 256;

/**
 * Makes interactions out of what the observer reports, for one session. Entries sharing a non-zero
 * `interactionId` — the browser's own definition of an interaction, the one INP filters on — are one
 * interaction whose latency is the maximum `duration` among them. They arrive incrementally, so a
 * latency can grow after it was first reported, and callers move what they counted rather than
 * counting the interaction twice.
 *
 * The regions' events answer what an entry cannot: which interactions were with a region, and how
 * many there were, including the ones below the Event Timing reporting threshold.
 */
export class InteractionTracker {
	private readonly startsAfterInteractionId: number;
	private readonly startedAt: number;

	private readonly interactions = new BoundedMap<number, TrackedInteraction>(MAX_TRACKED);
	private readonly attributionByEvent = new BoundedMap<string, InteractionAttribution>(MAX_TRACKED);

	private highestInteractionId = 0;

	/**
	 * Both arguments keep the interactions of the previous session out of this one.
	 *
	 * @param startsAfterInteractionId the highest id the previous tracker saw. Without it, an entry
	 * still arriving for that session's interaction would look new here and be counted twice.
	 * @param startedAt when the session opened. No id can keep out an interaction started before the
	 * first session of a page: Event Timing produces the entry after the event was presented, so the
	 * click that made the owner start collecting reaches an observer which subscribed while its handler
	 * ran. The page count the session started from has already counted it.
	 */
	constructor(startsAfterInteractionId = 0, startedAt = 0) {
		this.startsAfterInteractionId = startsAfterInteractionId;
		this.startedAt = startedAt;
	}

	get lastInteractionId(): number {
		return Math.max(this.highestInteractionId, this.startsAfterInteractionId);
	}

	/**
	 * Merges an entry into the interaction it belongs to.
	 *
	 * @returns what that changed, or nothing when the entry belongs to no interaction of this
	 * session or left the latency as it was.
	 */
	merge(entry: InteractionEntry): InteractionUpdate | undefined {
		if (!Number.isFinite(entry.duration) || entry.duration < 0) {
			return undefined;
		}

		const { interactionId } = entry;

		if (!interactionId) {
			return undefined;
		}

		// Neither check covers the other: an entry is dated by its own event rather than by the
		// interaction, so the `keyup` of a press that rotated the session is dated after the
		// rotation, and the click that started the collecting has no id to recognise it by.
		if (interactionId <= this.startsAfterInteractionId || entry.startTime < this.startedAt) {
			return undefined;
		}

		this.highestInteractionId = Math.max(this.highestInteractionId, interactionId);

		const tracked = this.interactions.get(interactionId);

		if (tracked === undefined) {
			// Taken once: an entry that only makes the interaction slower has to move its count
			// within the groups it was counted in, not into other ones.
			const attribution = this.attributionByEvent.get(eventKey(entry.name, entry.startTime));
			const interaction = { attribution, latencyMs: entry.duration };

			this.interactions.set(interactionId, interaction);

			return { type: 'new', interactionId, latencyMs: interaction.latencyMs, attribution };
		}

		// Not the slowest entry of the interaction, so its latency stands.
		if (entry.duration <= tracked.latencyMs) {
			return undefined;
		}

		const previousLatencyMs = tracked.latencyMs;
		tracked.latencyMs = entry.duration;

		return {
			type: 'remeasured',
			interactionId,
			previousLatencyMs,
			latencyMs: tracked.latencyMs,
			attribution: tracked.attribution,
		};
	}

	/**
	 * Remembers that the region reported the event, for the entry that will measure it.
	 *
	 * @returns the kind of interaction to count in the region, when this is its counted event.
	 */
	recordRegionEvent(region: string, event: Event): InteractionKind | undefined {
		const eventKind = interactionEventKind(event.type);
		if (!eventKind) {
			return undefined;
		}

		// Every event of the interaction, because any of them can be the one Event Timing reports
		// as the slowest: for a pointer press that is usually the click.
		const key = eventKey(event.type, event.timeStamp);
		const attribution = this.attributionByEvent.get(key) ?? { kind: eventKind.kind, regions: [] };
		if (!attribution.regions.includes(region)) {
			attribution.regions.push(region);
		}
		this.attributionByEvent.set(key, attribution);

		return eventKind.counts ? eventKind.kind : undefined;
	}
}
