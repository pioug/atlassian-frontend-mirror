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
 * The group a record is attributed to. Unlike the `page` histogram, which counts the editor's
 * interactions as well, `outsideEditor` is only the interactions that are not the editor's.
 */
export type SlowInteractionGroup = EditorInteractionGroupName | 'outsideEditor';

/**
 * One of the slowest interactions of the session: which target was slow, and where the time went,
 * neither of which the histograms can answer.
 *
 * The three phases divide `durationMs` and add up to it within rounding, and so do the four totals.
 * Everything but the phases comes from the Long Animation Frames the interaction ran in, so all of
 * it is absent when the browser reported none — and the fields describing one script are absent as
 * well when no script of those frames overlapped the interaction.
 */
export type SlowInteraction = {
	durationMs: number;
	/** Function the interaction's slowest script ran in. */
	functionName?: string;
	group: SlowInteractionGroup;
	/** Time between the event arriving and its handlers starting to run. */
	inputDelayMs?: number;
	/**
	 * What ran that script, as the browser names it: `event-listener`, `user-callback`,
	 * `resolve-promise`, `classic-script` and so on.
	 */
	invokerType?: string;
	/** How much of the interaction's slowest script fell inside the interaction. */
	longestScriptMs?: number;
	/** Type of the event the latency was measured on, which for a pointer press is usually `click`. */
	name: string;
	/** Time between the handlers finishing and the next frame being presented. */
	presentationDelayMs?: number;
	/** Time spent running the event's handlers. */
	processingMs?: number;
	/** The bundle that script came from, without its origin or query. */
	scriptName?: string;
	/** The phase of the interaction that script ran in. */
	scriptSubpart?: 'inputDelay' | 'presentationDelay' | 'processing';
	/** A short DOM path, as it stood when the event was dispatched. */
	target?: string;
	/** Time between the last frame of the interaction ending and the screen updating. */
	totalPaintDurationMs?: number;
	/**
	 * Script time inside the interaction across its frames, the part a script forced into style and
	 * layout excluded.
	 */
	totalScriptDurationMs?: number;
	/** Style and layout across the frames of the interaction, the part forced from a script included. */
	totalStyleAndLayoutDurationMs?: number;
	/**
	 * The part of the latency the frames account for nothing in — the main thread was busy with
	 * something no Long Animation Frame attributed to a script, to style and layout, or to paint.
	 * Not idle time: the browser reports no frame under 50 ms, so the work of those lands here too.
	 */
	totalUnattributedDurationMs?: number;
};

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
	/** Slowest first. Absent when nothing was slow enough to record. */
	slowest?: SlowInteraction[];
};
