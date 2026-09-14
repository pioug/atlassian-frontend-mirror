import type { SlowInteraction } from '../analytics/interactivity-snapshot';
import { BoundedList } from '../collections/bounded-list';
import { BoundedMap } from '../collections/bounded-map';

import { eventKey } from './interaction-events';
import type {
	InteractionBoundaries,
	InteractionEntry,
	InteractionUpdate,
} from './interaction-tracker';
import type { LongAnimationFrame, LongAnimationFrameScript } from './long-animation-frame-observer';

/** Fixed by the schema, so the event stays a bounded size. */
const MAX_RECORDS = 5;

/**
 * The latency an interaction has to beat to be recorded. 200 ms is the Google INP "good" threshold,
 * so anything below it is an interaction the user was not waiting for.
 */
const MIN_LATENCY_MS = 200;

/**
 * How many frames are kept to attribute records from. An interaction spans one paint, so a few dozen
 * cover even a second of a janky page.
 */
const MAX_FRAMES = 64;

/**
 * How many event paths are kept for the entries still to arrive. The entry of an event arrives a
 * paint or two after it, and a fast typist dispatches three events per keystroke, so a few dozen
 * cover what can be in flight.
 */
const MAX_PATHS = 50;

/**
 * The attributes a target may be named by, all of them ours: `data-vc` for visual completion, the
 * test ids for tests. Ids, roles, class names, text and accessibility labels are left out because
 * they can carry what the user wrote.
 */
const ALLOWED_TARGET_ATTRIBUTES = ['data-vc', 'data-testid', 'data-test-id'];

const MAX_TARGET_ELEMENTS = 4;
const MAX_ATTRIBUTE_VALUE_LENGTH = 32;
const MAX_TARGET_LENGTH = 120;

/** How long a reported script or function name may be. */
const MAX_NAME_LENGTH = 64;

const QUERY_OR_HASH = /[?#]/u;

/** The part of a record that only the frames the interaction ran in can fill in. */
type SlowInteractionAttribution = Pick<
	SlowInteraction,
	| 'functionName'
	| 'invokerType'
	| 'longestScriptMs'
	| 'scriptName'
	| 'scriptSubpart'
	| 'totalPaintDurationMs'
	| 'totalScriptDurationMs'
	| 'totalStyleAndLayoutDurationMs'
	| 'totalUnattributedDurationMs'
>;

/**
 * Whether two attributions say the same thing. Shallow, because every field of one is a number or a
 * string; by the field names of both, so that a field going missing counts as a change rather than
 * as nothing to see.
 */
function sameAttribution(
	one: SlowInteractionAttribution,
	other: SlowInteractionAttribution,
): boolean {
	const fields = Object.keys(one) as (keyof SlowInteractionAttribution)[];

	return (
		fields.length === Object.keys(other).length &&
		fields.every((field) => one[field] === other[field])
	);
}

/**
 * One recorded interaction. The reported phases are not among its fields: they are the gaps between
 * the boundaries, worked out when the record is reported, which is also where the latency is
 * rounded into the `durationMs` the event carries.
 *
 * The attribution is kept whole rather than spread across the record, so that a record can never
 * hold half of what one set of frames said and half of what another did.
 *
 * `interactionId` identifies the interaction across the entries measuring it, and `boundaries` is
 * also what its frames are matched to it by. Neither is reported.
 */
type InteractionRecord = Pick<SlowInteraction, 'group' | 'name' | 'target'> & {
	attribution: SlowInteractionAttribution | undefined;
	boundaries: InteractionBoundaries | undefined;
	interactionId: number;
	/** As the browser measured it, which is what the records are ranked by. */
	latencyMs: number;
};

/**
 * The slowest interactions of one session, which is what the event's `slowest` records are.
 *
 * Interactions arrive from the tracker and frames from the Long Animation Frame observer, and this
 * is where the two meet: a record says both how long the user waited and where that time went.
 *
 * A record is built from the entry that measured the interaction, as that entry arrives. Its target
 * comes from the path of the event that entry measured, taken as the event was dispatched: by the
 * time the entry arrives the handlers have run, and `entry.target` is `null` once they have removed
 * the element — which is what a slow pointer interaction usually does.
 */
export class SlowInteractionList {
	/** Slowest first. */
	private readonly records: InteractionRecord[] = [];
	private readonly frames = new BoundedList<LongAnimationFrame>(MAX_FRAMES);
	private readonly pathByEvent = new BoundedMap<string, EventTarget[]>(MAX_PATHS);

	/**
	 * Takes in an event as the browser dispatched it, keeping the path it travelled so that the
	 * target of the interaction it belongs to can be named once the entry measuring it arrives.
	 *
	 * Only the array of references is kept: `composedPath()` copies the path the browser built for
	 * the dispatch and reads nothing from the DOM, and neither does this.
	 */
	recordEvent(event: Event): void {
		this.pathByEvent.set(eventKey(event.type, event.timeStamp), event.composedPath());
	}

	/**
	 * Takes in what the tracker now says about an interaction, keeping it when it is one of the
	 * slowest of the session.
	 *
	 * @returns whether that changed what a snapshot would carry.
	 */
	trackInteractionUpdate(entry: InteractionEntry, update: InteractionUpdate): boolean {
		const { boundaries, interactionId, latencyMs } = update;
		const index = this.records.findIndex((record) => record.interactionId === interactionId);
		const knownRecord = index === -1 ? undefined : this.records[index];

		if (knownRecord && latencyMs <= knownRecord.latencyMs) {
			// The interaction at the latency it already had, so its name and target still come from
			// the entry that measured it at its slowest — and so do `startedAt` and `presentedAt`,
			// which leaves the processing as the only pair that can have moved.
			if (
				knownRecord.boundaries?.processingStartedAt === boundaries?.processingStartedAt &&
				knownRecord.boundaries?.processingEndedAt === boundaries?.processingEndedAt
			) {
				return false;
			}

			knownRecord.boundaries = boundaries;
			this.attribute(knownRecord);

			return true;
		}

		// Everything below builds a record out of `entry`, so it has to be an entry of this
		// interaction. The tracker also reports an interaction whose boundaries moved because of an
		// event that is no interaction of its own, and that event names something else entirely.
		if (entry.interactionId !== interactionId) {
			return false;
		}

		if (knownRecord) {
			// An interaction measured as slower replaces itself rather than taking a second place.
			this.records[index] = this.toRecord(entry, update);
		} else {
			const toBeatMs =
				this.records.length === MAX_RECORDS
					? this.records[MAX_RECORDS - 1].latencyMs
					: MIN_LATENCY_MS;

			if (latencyMs <= toBeatMs) {
				return false;
			}

			this.records.push(this.toRecord(entry, update));
		}

		this.records.sort((a, b) => b.latencyMs - a.latencyMs);
		this.records.splice(MAX_RECORDS);

		return true;
	}

	/**
	 * Takes in the frames the browser has just reported and works out again what the frames say about
	 * every record — again, because the frames of one interaction can be reported in several batches
	 * and the first of them may hold neither its longest script nor all of its style and layout.
	 *
	 * @returns whether that changed what a snapshot would carry.
	 */
	trackLongAnimationFrames(frames: LongAnimationFrame[]): boolean {
		this.frames.push(...frames);

		let changed = false;
		for (const record of this.records) {
			changed = this.attribute(record) || changed;
		}

		return changed;
	}

	snapshot(): SlowInteraction[] | undefined {
		if (this.records.length === 0) {
			return undefined;
		}

		return this.records.map((record) => {
			const boundaries = record.boundaries;

			return {
				group: record.group,
				name: record.name,
				durationMs: Math.round(record.latencyMs),
				inputDelayMs:
					boundaries && Math.round(boundaries.processingStartedAt - boundaries.startedAt),
				processingMs:
					boundaries && Math.round(boundaries.processingEndedAt - boundaries.processingStartedAt),
				presentationDelayMs:
					boundaries && Math.round(boundaries.presentedAt - boundaries.processingEndedAt),
				target: record.target,
				functionName: record.attribution?.functionName,
				invokerType: record.attribution?.invokerType,
				longestScriptMs: record.attribution?.longestScriptMs,
				scriptName: record.attribution?.scriptName,
				scriptSubpart: record.attribution?.scriptSubpart,
				totalPaintDurationMs: record.attribution?.totalPaintDurationMs,
				totalScriptDurationMs: record.attribution?.totalScriptDurationMs,
				totalStyleAndLayoutDurationMs: record.attribution?.totalStyleAndLayoutDurationMs,
				totalUnattributedDurationMs: record.attribution?.totalUnattributedDurationMs,
			};
		});
	}

	private toRecord(entry: InteractionEntry, update: InteractionUpdate): InteractionRecord {
		// The target is named only once the interaction has earned a place: naming it reads the DOM,
		// and this runs while the page is already slow.
		const path =
			this.pathByEvent.get(eventKey(entry.name, entry.startTime)) ?? this.lineageOf(entry.target);
		const record: InteractionRecord = {
			attribution: undefined,
			boundaries: update.boundaries,
			interactionId: update.interactionId,
			// An interaction the editor never reported an event for is not the editor's as far as we
			// know.
			group: update.group ?? 'outsideEditor',
			name: entry.name,
			latencyMs: update.latencyMs,
			target: this.describeTarget(path),
		};

		// Frames reported before this entry already answer for it.
		this.attribute(record);

		return record;
	}

	private attribute(record: InteractionRecord): boolean {
		const attribution = record.boundaries && this.attributionFor(record.boundaries);

		if (!attribution) {
			return false;
		}

		if (record.attribution && sameAttribution(record.attribution, attribution)) {
			return false;
		}

		record.attribution = attribution;

		return true;
	}

	/**
	 * What the frames say about an interaction, attributed the way `web-vitals` attributes INP: every
	 * frame overlapping the interaction counts, the script that counts is the one with the longest
	 * part inside it, and style and layout is summed across those frames.
	 *
	 * @returns nothing when no frame overlaps the interaction — the browser reports frames above
	 * 50 ms only.
	 */
	private attributionFor(
		boundaries: InteractionBoundaries,
	): SlowInteractionAttribution | undefined {
		let overlapped = false;
		let lastFrameEndTime = 0;
		let totalScriptDurationMs = 0;
		let totalStyleAndLayoutDurationMs = 0;
		let longestScript: LongAnimationFrameScript | undefined;
		let longestScriptMs = 0;

		for (const frame of this.frames) {
			// Frames come in the order they were rendered, so once one starts after the interaction,
			// so does every frame after it.
			if (frame.startTime > boundaries.processingEndedAt) {
				break;
			}

			const frameEndTime = frame.startTime + frame.duration;

			if (frameEndTime < boundaries.startedAt) {
				continue;
			}

			overlapped = true;
			lastFrameEndTime = frameEndTime;
			totalStyleAndLayoutDurationMs += this.styleAndLayoutOf(frame);

			for (const script of frame.scripts ?? []) {
				const scriptEndTime = script.startTime + script.duration;

				if (scriptEndTime < boundaries.startedAt) {
					continue;
				}

				const insideInteractionMs =
					scriptEndTime - Math.max(boundaries.startedAt, script.startTime);
				// `forcedStyleAndLayoutDuration` carries no timestamps, so the part of it inside the
				// interaction is apportioned. It counts as style and layout rather than script time,
				// the same split DevTools shows.
				const forcedInsideMs = script.duration
					? (insideInteractionMs / script.duration) * (script.forcedStyleAndLayoutDuration ?? 0)
					: 0;

				totalScriptDurationMs += insideInteractionMs - forcedInsideMs;
				totalStyleAndLayoutDurationMs += forcedInsideMs;

				if (insideInteractionMs > longestScriptMs) {
					longestScript = script;
					longestScriptMs = insideInteractionMs;
				}
			}
		}

		if (!overlapped) {
			return undefined;
		}

		// What the browser did after the last frame of the interaction, so it only counts when that
		// frame ended no earlier than the handlers did.
		const totalPaintDurationMs =
			lastFrameEndTime >= boundaries.processingEndedAt
				? Math.max(0, boundaries.presentedAt - lastFrameEndTime)
				: 0;
		// Every total is brought to what it is reported as before this subtraction, so that the four
		// of them add up to the latency rather than to more than it: a frame whose render phase runs
		// past the interaction would otherwise leave a negative here to be counted twice.
		totalScriptDurationMs = Math.max(0, totalScriptDurationMs);
		totalStyleAndLayoutDurationMs = Math.max(0, totalStyleAndLayoutDurationMs);
		// Whatever is left of the latency: the thread was busy with something the frames attributed
		// to no script, to no style and layout, and to no paint.
		const totalUnattributedDurationMs = Math.max(
			0,
			boundaries.presentedAt -
				boundaries.startedAt -
				totalScriptDurationMs -
				totalStyleAndLayoutDurationMs -
				totalPaintDurationMs,
		);

		return {
			functionName: this.truncated(longestScript?.sourceFunctionName),
			invokerType: this.truncated(longestScript?.invokerType),
			longestScriptMs: longestScript && Math.round(longestScriptMs),
			scriptName: this.truncated(this.fileName(longestScript?.sourceURL)),
			scriptSubpart: longestScript && this.subpartOf(longestScript, boundaries),
			totalPaintDurationMs: Math.round(totalPaintDurationMs),
			totalScriptDurationMs: Math.round(totalScriptDurationMs),
			totalStyleAndLayoutDurationMs: Math.round(totalStyleAndLayoutDurationMs),
			totalUnattributedDurationMs: Math.round(totalUnattributedDurationMs),
		};
	}

	/**
	 * Style, layout and paint of the frame, which the browser reports as starting at 0 when the
	 * frame did none.
	 */
	private styleAndLayoutOf(frame: LongAnimationFrame): number {
		const { styleAndLayoutStart } = frame;

		if (typeof styleAndLayoutStart !== 'number' || styleAndLayoutStart === 0) {
			return 0;
		}

		const frameEndTime = frame.startTime + frame.duration;

		return Math.max(0, frameEndTime - styleAndLayoutStart);
	}

	/** Which phase of the interaction the script ran in, by where it started. */
	private subpartOf(
		script: LongAnimationFrameScript,
		boundaries: InteractionBoundaries,
	): SlowInteraction['scriptSubpart'] {
		if (script.startTime < boundaries.processingStartedAt) {
			return 'inputDelay';
		}

		return script.startTime >= boundaries.processingEndedAt ? 'presentationDelay' : 'processing';
	}

	private truncated(name: string | undefined): string | undefined {
		return name ? name.slice(0, MAX_NAME_LENGTH) : undefined;
	}

	/**
	 * The file as the browser named it, content hash and all: that is what identifies the artefact
	 * and its source map, and a query can be grouped away downstream.
	 */
	private fileName(sourceURL: string | undefined): string | undefined {
		if (!sourceURL) {
			return undefined;
		}

		const path = sourceURL.split(QUERY_OR_HASH)[0];

		return path.slice(path.lastIndexOf('/') + 1);
	}

	/**
	 * Names the element an interaction happened on — `div[data-vc="x"] > p > span`, outermost first —
	 * from its path, the target first and its ancestors after it. The path is climbed until an element
	 * carries an allow-listed attribute, because that is what says which part of the page this was.
	 */
	private describeTarget(path: readonly EventTarget[]): string | undefined {
		const names: string[] = [];

		for (const target of path) {
			// An event's target can be a text node, and a path ends in the document and the window; the
			// elements are the answer.
			if (!(target instanceof Element)) {
				continue;
			}

			const attribute = this.identifyingAttribute(target);
			names.unshift(`${target.localName}${attribute ?? ''}`);

			if (attribute || names.length === MAX_TARGET_ELEMENTS) {
				break;
			}
		}

		if (names.length === 0) {
			return undefined;
		}

		return names.join(' > ').slice(0, MAX_TARGET_LENGTH);
	}

	/**
	 * The path of an entry's own target, as far as the document still has it: what is left when no
	 * event was seen for the entry. Only as many nodes as `describeTarget` can use.
	 */
	private lineageOf(node: Node | null | undefined): Node[] {
		const lineage: Node[] = [];

		for (
			let current: Node | null = node ?? null;
			current && lineage.length <= MAX_TARGET_ELEMENTS;
			current = current.parentElement
		) {
			lineage.push(current);
		}

		return lineage;
	}

	private identifyingAttribute(element: Element): string | undefined {
		for (const attribute of ALLOWED_TARGET_ATTRIBUTES) {
			const value = element.getAttribute(attribute);
			if (value) {
				// Encoded and cut: a value we did not write cannot bring quotes or a paragraph of
				// text into the event.
				const safeValue = encodeURIComponent(value).slice(0, MAX_ATTRIBUTE_VALUE_LENGTH);
				return `[${attribute}="${safeValue}"]`;
			}
		}

		return undefined;
	}
}
