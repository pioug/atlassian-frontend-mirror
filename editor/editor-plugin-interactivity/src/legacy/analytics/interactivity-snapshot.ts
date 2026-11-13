/**
 * The shape of what the `editor interactivity` event carries: one snapshot, the groups inside
 * it, and the values its fields can take.
 *
 * This is the contract with the analytics pipeline, which the collector fills in and the
 * payload wraps, and the one place in the package where types are shared. A type serving a
 * single module stays with that module.
 */
/**
 * What produced a snapshot.
 *
 * `navigation` and `modeChange` end a session while the editor stays mounted: Confluence
 * live pages keep one editor across page transitions and switch between reading and
 * editing with a command. A session covers one document in one mode, so either change
 * closes it and opens the next.
 */
export type SnapshotReason =
	| 'timer'
	| 'hidden'
	| 'pagehide'
	| 'unmount'
	| 'navigation'
	| 'modeChange';

/**
 * What the editor was being used for at the time of the snapshot: `editing` is the
 * editable editor, `reading` is a live page being viewed with the editor still mounted.
 */
export type SessionMode = 'editing' | 'reading';

/**
 * The editor groups, which are also the fields their histograms are reported in.
 *
 * `editorOther` is the remainder — an interaction the browser counts that is neither typing nor
 * pointing — so the three together cover whatever the browser calls an interaction.
 */
export type EditorInteractionGroupName = 'editorOther' | 'editorPointer' | 'editorTyping';

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

/**
 * One session-to-date snapshot. Consumers take the highest `seq` per
 * `interactivitySessionId` and then sum bucket counts across sessions.
 */
export type InteractivitySnapshot = {
	activeMs: number;
	/** The three editor groups as one; a percentile of the union cannot be derived from theirs. */
	editor: InteractionGroupSnapshot;
	editorDomSize?: number;
	/** Interactions inside the editor that are neither typing nor pointing. */
	editorOther: InteractionGroupSnapshot;
	editorPointer: InteractionGroupSnapshot;
	editorTyping: InteractionGroupSnapshot;
	hiddenMs: number;
	interactivitySessionId: string;
	nodeSize?: number;
	objectId?: string;
	/** Every interaction on the page, the editor groups included. */
	page: InteractionGroupSnapshot;
	reason: SnapshotReason;
	schema: number;
	seq: number;
	/** Fixed for the whole session: a mode change closes it and opens the next. */
	sessionMode?: SessionMode;
};
