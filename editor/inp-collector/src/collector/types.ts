/** The types an owner of an `InteractivityCollector` reads and writes. */

/**
 * `other` is the remainder — an interaction the browser counts that is neither typing nor
 * pointing — so the three together cover whatever the browser calls an interaction.
 */
export type InteractionKind = 'other' | 'pointer' | 'typing';

/**
 * Session-to-date latency distribution for one group of interactions.
 *
 * `totalCount` counts every interaction, including those below the Event Timing reporting
 * threshold, so `totalCount - observedCount` is the sub-threshold count. `percentilesMs` ranks over
 * `totalCount`, so a percentile among the sub-threshold interactions reads as the threshold. `buckets`
 * is keyed by each bucket's upper boundary in milliseconds and is not cumulative; empty buckets are
 * omitted, so a missing bucket means zero.
 */
export type InteractionGroupSnapshot = {
	buckets: Record<string, number>;
	maxMs: number;
	observedCount: number;
	/** Percentiles of the same interactions, keyed by percentile and exact to the 8 ms of Event Timing. */
	percentilesMs: Record<string, number>;
	sumMs: number;
	totalCount: number;
};

/** The interactions with one region: its three kinds, and `all` of them as one. */
export type RegionSnapshot = {
	/** A percentile of the union cannot be derived from the kinds' own. */
	all: InteractionGroupSnapshot;
	other: InteractionGroupSnapshot;
	pointer: InteractionGroupSnapshot;
	typing: InteractionGroupSnapshot;
};

/** Why the collector takes a snapshot of a session that goes on. */
export type InterimReason = 'timer' | 'hidden' | 'pagehide';

/** What the collector knows about how a snapshot should be sent. The owner decides what to do with it. */
export type SnapshotSendHints = {
	/** It cannot wait for an idle moment: the page or the owner may not be there later. */
	immediate: boolean;
};

/** What a region's owner tells the collector the region is made of. */
export type InteractivityRegion = {
	/**
	 * Makes interactions with the element interactions with the region, until the function it
	 * returns is called. Calling that again does nothing. An element added several times is
	 * listened to once, until each of them is removed.
	 */
	addElement: (element: Element) => () => void;
};

/** The value of each session key, `undefined` while it is not known. */
export type SessionKeys = Record<string, string | undefined>;

/**
 * What the collector measured.
 *
 * @template RegionName the owner's regions.
 * @template Keys the owner's session keys.
 * @template EndReason what the owner can end a session with.
 */
export type InteractivitySnapshot<
	RegionName extends string = never,
	Keys extends SessionKeys = SessionKeys,
	EndReason extends string = never,
> = {
	activeMs: number;
	hiddenMs: number;
	interactivitySessionId: string;
	/** Every interaction on the page, the regions' included. */
	page: InteractionGroupSnapshot;
	/** Why the snapshot was taken. An `EndReason` means it is the session's last. */
	reason: InterimReason | EndReason;
	regions: Record<RegionName, RegionSnapshot>;
	schema: number;
	seq: number;
	/** What the session was collected against. */
	sessionKeys: Keys;
};
