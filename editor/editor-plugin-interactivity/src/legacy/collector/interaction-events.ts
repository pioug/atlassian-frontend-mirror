import type { EditorInteractionGroupName } from '../analytics/interactivity-snapshot';

export type InteractionEventKind = {
	/**
	 * Whether an interaction is counted when this event arrives. One event of each group has it,
	 * because an interaction is several events — `keydown`, what the key produced, `keyup`, or
	 * `pointerdown`, `pointerup`, `click` — and counting each would count it three times.
	 */
	counts?: boolean;
	group: EditorInteractionGroupName;
};

/**
 * The events an interaction is made of, and the group they belong to. Both sides of the collector
 * read this, so counting and grouping cannot disagree.
 *
 * These are the events Event Timing can report with a non-zero `interactionId`, so any of them can
 * be the one an entry measured — and it is usually not the one the interaction is counted on: for a
 * pointer press the slow part is normally the `click` handler.
 *
 * The counted event is at a different end of the interaction in each group, because what can go
 * wrong differs. Typing is counted on `keydown`, since the browser opens a new interaction for
 * every repeat of a held key, and nothing cancels a key press. Pointing is counted on `pointerup`,
 * since a press cannot repeat but can be taken over by a scroll — which the browser does not count
 * either, and in that case `pointerup` never arrives.
 *
 * Counting events is also why an editor group's `totalCount` is not comparable with `page`'s, which
 * is told `performance.interactionCount`: when an event is counted the collector cannot know whether
 * the browser will open an interaction for it.
 */
const INTERACTION_EVENTS: Record<string, InteractionEventKind> = {
	keydown: { group: 'editorTyping', counts: true },
	keyup: { group: 'editorTyping' },
	// Only while an IME composes: the browser counts the text it commits in the interaction of the
	// key that caused it.
	input: { group: 'editorTyping' },
	pointerdown: { group: 'editorPointer' },
	pointerup: { group: 'editorPointer', counts: true },
	click: { group: 'editorPointer' },
	// Ends a pointer press the way `pointerup` does, so the browser counts it as an interaction.
	contextmenu: { group: 'editorPointer' },
};

/** Derived, so the types listened for cannot drift from the table. */
export const INTERACTION_EVENT_TYPES: string[] = Object.keys(INTERACTION_EVENTS);

export function interactionEventKind(type: string): InteractionEventKind | undefined {
	return INTERACTION_EVENTS[type];
}

/**
 * Identifies the event an entry measured: an entry's `startTime` is that event's timestamp and its
 * `name` is its type. This is the one link between what the event listeners see and what Event
 * Timing reports, so both sides build it here.
 *
 * The type is in the key because browsers coarsen the timestamp, so two events of one task can
 * share it — and events of one type are always of one group, so a collision cannot move an
 * interaction into another group.
 */
export function eventKey(type: string, timeStamp: number): string {
	return `${type}|${timeStamp}`;
}
