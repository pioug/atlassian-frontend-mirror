import { getDocument } from '@atlaskit/browser-apis';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type {
	InteractivitySnapshot,
	SessionMode,
	SnapshotReason,
} from '../analytics/interactivity-snapshot';

import { DocumentEventObserver } from './document-event-observer';
import { EditorEventObserver } from './editor-event-observer';
import { InteractionObserver } from './interaction-observer';
import type { InteractionEntry } from './interaction-tracker';
import { InteractivitySession } from './interactivity-session';
import { SCHEMA_VERSION } from './bucket-boundaries';
import { LifecycleObserver } from './lifecycle-observer';
import {
	type LongAnimationFrame,
	LongAnimationFrameObserver,
} from './long-animation-frame-observer';
import { SnapshotScheduler } from './snapshot-scheduler';

export type InteractivityCollectorOptions = {
	emit: (snapshot: InteractivitySnapshot) => void;
	/** Elements inside the editor's content DOM. Read at snapshot time. */
	getEditorDomSize: () => number | undefined;
	/** Size of the ProseMirror document. Read at snapshot time. */
	getNodeSize: () => number | undefined;
	getObjectId: () => string | undefined;
	getSessionMode: () => SessionMode | undefined;
};

/**
 * Collects interaction latencies for one editor mount and emits session-to-date snapshots.
 *
 * Every interaction is counted in `page`, and the ones with the editor again in `editor` and in one
 * of the editor groups, which is what tells a slow editor apart from a slow page around it.
 *
 * `start` and `stop` bound the collecting, which happens once. Within it there can be several
 * sessions, because a session covers one document in one mode: a Confluence live page
 * navigates and switches between reading and editing without ever remounting the editor, and
 * each of those closes the current session and opens the next.
 */
export class InteractivityCollector {
	private readonly emit: InteractivityCollectorOptions['emit'];
	private readonly getEditorDomSize: InteractivityCollectorOptions['getEditorDomSize'];
	private readonly getNodeSize: InteractivityCollectorOptions['getNodeSize'];
	private readonly getObjectId: InteractivityCollectorOptions['getObjectId'];
	private readonly getSessionMode: InteractivityCollectorOptions['getSessionMode'];

	private readonly interactionObserver: InteractionObserver;
	private readonly longAnimationFrameObserver: LongAnimationFrameObserver | undefined;
	private readonly documentEvents: DocumentEventObserver | undefined;
	private readonly editorEvents: EditorEventObserver;
	private readonly snapshotScheduler: SnapshotScheduler;
	private readonly lifecycleObserver: LifecycleObserver;

	private session: InteractivitySession;
	private editorRoot: Element | undefined;
	private started = false;
	private stopped = false;

	constructor(options: InteractivityCollectorOptions) {
		this.emit = options.emit;
		this.getEditorDomSize = options.getEditorDomSize;
		this.getNodeSize = options.getNodeSize;
		this.getObjectId = options.getObjectId;
		this.getSessionMode = options.getSessionMode;

		this.interactionObserver = new InteractionObserver((entries) => this.recordEntries(entries));
		this.longAnimationFrameObserver = isExperimentEnabled(
			'platform_editor_editor_interactivity_slowest',
		)
			? new LongAnimationFrameObserver((frames) => this.recordFrames(frames))
			: undefined;
		this.documentEvents = isExperimentEnabled('platform_editor_editor_interactivity_slowest')
			? new DocumentEventObserver((event) => this.recordDocumentEvent(event))
			: undefined;
		this.editorEvents = new EditorEventObserver((event) => this.recordEditorEvent(event));
		this.snapshotScheduler = new SnapshotScheduler(() => this.onTimer());
		this.lifecycleObserver = new LifecycleObserver({
			onHidden: () => this.onHidden(),
			onVisible: () => this.onVisible(),
			onPageHide: () => this.onPageHide(),
			onPageShow: () => this.onPageShow(),
		});
		this.session = this.createSession(0);
	}

	/**
	 * Starts collecting. Calling it again while collecting changes nothing.
	 *
	 * @returns whether collecting is running; `false` when the browser cannot support it, or
	 * when it has already been stopped.
	 */
	start(): boolean {
		// Collecting is over for good once stopped: the session it covered has been reported.
		if (this.stopped) {
			return false;
		}

		if (this.started) {
			return true;
		}

		if (!InteractionObserver.isSupported()) {
			return false;
		}

		// Opened again so the session's timings start with the collecting, not with whenever
		// this object was constructed.
		this.session = this.createSession(0);
		this.interactionObserver.start();
		this.longAnimationFrameObserver?.start();
		this.documentEvents?.start();
		this.editorEvents.observe(this.editorRoot);
		this.snapshotScheduler.start();
		this.lifecycleObserver.start();
		this.started = true;

		return true;
	}

	/** Reports the session as ended by the editor unmounting, and stops collecting. */
	stop(): void {
		if (this.stopped) {
			return;
		}

		this.takeSnapshot('unmount');
		this.stopped = true;
		this.interactionObserver.stop();
		this.longAnimationFrameObserver?.stop();
		this.documentEvents?.stop();
		this.editorEvents.stop();
		this.snapshotScheduler.stop();
		this.lifecycleObserver.stop();
	}

	/**
	 * The element the editor renders itself into is what makes an interaction one of the editor's.
	 * The session is not tied to it: interactions from before it arrives are counted in `page`.
	 */
	setEditorRoot(root: Element | null | undefined): void {
		this.editorRoot = root ?? undefined;

		if (this.started && !this.stopped) {
			this.editorEvents.observe(this.editorRoot);
		}
	}

	/**
	 * Rotates the session when the editor is pointed at different content.
	 *
	 * An unknown object id is no information, never a change. The provider resolves
	 * asynchronously after mount, and `contextIdentifierPlugin` resets its state to the
	 * configured provider on transactions that do not carry a new one, so the id read here goes
	 * missing for a moment on a document that never changed.
	 */
	onObjectIdChanged(): void {
		if (this.stopped) {
			return;
		}

		const objectId = this.getObjectId();
		if (objectId === undefined || objectId === this.session.objectId) {
			return;
		}

		if (this.session.objectId === undefined) {
			this.session.objectId = objectId;
			return;
		}

		this.rotateSession('navigation');
	}

	/**
	 * Rotates the session when the editor switches between reading and editing. Interactions
	 * with a read-only page are a different population from interactions while editing, so one
	 * session never covers both.
	 */
	onViewModeChanged(): void {
		if (this.stopped) {
			return;
		}

		const mode = this.getSessionMode();
		if (mode === undefined || mode === this.session.mode) {
			return;
		}

		if (this.session.mode === undefined) {
			this.session.mode = mode;
			return;
		}

		this.rotateSession('modeChange');
	}

	/**
	 * @param startsAfterInteractionId the highest interaction the previous session saw, so
	 * entries still arriving for it are not counted here as well.
	 */
	private createSession(startsAfterInteractionId: number): InteractivitySession {
		return new InteractivitySession({
			objectId: this.getObjectId(),
			mode: this.getSessionMode(),
			hidden: getDocument()?.visibilityState === 'hidden',
			startsAfterInteractionId,
		});
	}

	/** Reports the current session as ended by `reason` and puts a new one in its place. */
	private rotateSession(reason: SnapshotReason): void {
		this.takeSnapshot(reason);
		this.session = this.createSession(this.session.tracker.lastInteractionId);
		this.snapshotScheduler.restart();
	}

	private onTimer(): void {
		this.takeSnapshot('timer');
	}

	private onHidden(): void {
		if (this.session.hiddenSince === undefined) {
			this.session.hiddenSince = performance.now();
		}
		this.takeSnapshot('hidden');
	}

	private onVisible(): void {
		if (this.session.hiddenSince !== undefined) {
			this.session.hiddenMs += performance.now() - this.session.hiddenSince;
			this.session.hiddenSince = undefined;
		}
		this.session.lifecycleSnapshotEmitted = false;
	}

	private onPageHide(): void {
		this.takeSnapshot('pagehide');
	}

	/**
	 * The page came back from the back/forward cache, which never raises a visibility change.
	 * The session continues, and the signal that suspended it has been reported, so the next
	 * one is due.
	 */
	private onPageShow(): void {
		this.session.lifecycleSnapshotEmitted = false;
	}

	/**
	 * Counts an interaction with the editor, including the ones Event Timing never reports because
	 * they were faster than its threshold — which is why a count alone moves the session on.
	 */
	private recordEditorEvent(event: Event): void {
		if (this.stopped) {
			return;
		}

		// An event a script dispatched is no interaction: the browser counts none of them either.
		if (!event.isTrusted) {
			return;
		}

		const group = this.session.tracker.recordEditorEvent(event);
		if (!group) {
			return;
		}

		this.session.editor.countTotal();
		// The session names its editor groups after the fields they are reported in.
		this.session[group].countTotal();
		this.session.revision += 1;
	}

	/**
	 * Keeps what a slow interaction will be named by once its entry arrives. Nothing reported changes
	 * here, so the revision stays.
	 */
	private recordDocumentEvent(event: Event): void {
		if (this.stopped || !event.isTrusted) {
			return;
		}

		this.session.slowest?.recordEvent(event);
	}

	/** Long Animation Frames say where the latency of a slow interaction went. */
	private recordFrames(frames: LongAnimationFrame[]): void {
		if (this.stopped) {
			return;
		}

		if (this.session.slowest?.trackLongAnimationFrames(frames)) {
			this.session.revision += 1;
		}
	}

	private recordEntries(entries: InteractionEntry[]): void {
		for (const entry of entries) {
			for (const update of this.session.tracker.merge(entry)) {
				let groupsChanged = this.session.page.trackInteractionUpdate(update);
				if (update.group) {
					groupsChanged = this.session.editor.trackInteractionUpdate(update) || groupsChanged;
					groupsChanged =
						this.session[update.group].trackInteractionUpdate(update) || groupsChanged;
				}

				const slowestChanged = this.session.slowest?.trackInteractionUpdate(entry, update);

				if (groupsChanged || slowestChanged) {
					this.session.revision += 1;
				}
			}
		}
	}

	private takeSnapshot(reason: SnapshotReason): void {
		if (this.stopped) {
			return;
		}

		const session = this.session;

		// Checked before anything is consumed: `visibilitychange` and `pagehide` fire back to
		// back on the same transition and it is reported once, and draining first would take
		// entries out of the browser's queue only to suppress the snapshot carrying them.
		const lifecycleSignal = reason === 'hidden' || reason === 'pagehide';
		if (lifecycleSignal && session.lifecycleSnapshotEmitted) {
			return;
		}

		// Must run before the change check: the browser may be holding entries and frames that have
		// not reached the observer callbacks yet, and on `pagehide` there is no later chance to
		// pick them up. Entries first, so a record the frames answer for exists by then.
		this.interactionObserver.drain();
		this.longAnimationFrameObserver?.drain();

		if (session.revision === session.emittedRevision) {
			return;
		}

		if (lifecycleSignal) {
			session.lifecycleSnapshotEmitted = true;
		}

		session.seq += 1;
		session.emittedRevision = session.revision;

		const now = performance.now();
		const hiddenMs =
			session.hiddenMs + (session.hiddenSince === undefined ? 0 : now - session.hiddenSince);
		const pageTotalCount =
			InteractionObserver.readPageInteractionCount() - session.interactionCountAtStart;
		const slowest = session.slowest?.snapshot();

		this.emit({
			schema: SCHEMA_VERSION,
			interactivitySessionId: session.id,
			objectId: session.objectId,
			seq: session.seq,
			reason,
			sessionMode: session.mode,
			activeMs: Math.round(Math.max(0, now - session.startedAt - hiddenMs)),
			hiddenMs: Math.round(hiddenMs),
			nodeSize: this.getNodeSize(),
			editorDomSize: this.getEditorDomSize(),
			// Only `page` is told its total; each editor group has counted its own.
			page: session.page.snapshot(pageTotalCount),
			editor: session.editor.snapshot(),
			editorTyping: session.editorTyping.snapshot(),
			editorPointer: session.editorPointer.snapshot(),
			editorOther: session.editorOther.snapshot(),
			...(slowest && { slowest }),
		});
	}
}
