import type {
	InteractionGroupSnapshot,
	InteractivitySnapshot,
} from '@atlaskit/inp-collector/types';

/**
 * The shape of what the `editor interactivity` event carries: one snapshot, the groups inside
 * it, and the values its fields can take. This is the contract with the analytics pipeline.
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
 * One session-to-date snapshot as the event's attributes. Consumers take the highest `seq` per
 * `interactivitySessionId` and then sum bucket counts across sessions.
 */
export type InteractivityEventAttributes = Omit<
	InteractivitySnapshot,
	'reason' | 'regions' | 'sessionKeys'
> & {
	/** The three editor groups as one; a percentile of the union cannot be derived from theirs. */
	editor: InteractionGroupSnapshot;
	editorDomSize?: number;
	/** Interactions inside the editor that are neither typing nor pointing. */
	editorOther: InteractionGroupSnapshot;
	editorPointer: InteractionGroupSnapshot;
	editorTyping: InteractionGroupSnapshot;
	nodeSize?: number;
	objectId?: string;
	reason: SnapshotReason;
	/** Fixed for the whole session: a mode change closes it and opens the next. */
	sessionMode?: SessionMode;
};
