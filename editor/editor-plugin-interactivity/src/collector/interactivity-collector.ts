import { getDocument } from '@atlaskit/browser-apis';

import type {
	CollectedSnapshot,
	CollectorReason,
	RegionSnapshot,
	SessionKeys,
} from '../analytics/interactivity-snapshot';
import { SCHEMA_VERSION } from './bucket-boundaries';
import { InteractionObserver } from './interaction-observer';
import type { InteractionEntry } from './interaction-tracker';
import { InteractivitySession } from './interactivity-session';
import { LifecycleObserver } from './lifecycle-observer';
import { type InteractivityRegion, RegionEventObserver } from './region-event-observer';
import { SnapshotScheduler } from './snapshot-scheduler';

export type InteractivityCollectorOptions<Keys extends SessionKeys, RotateReason extends string> = {
	/** Called as the snapshot is taken, so what the owner reads then is of the same moment. */
	emit: (snapshot: CollectedSnapshot<Keys, RotateReason>) => void;
	/** The parts of the page whose interactions are counted on their own. Fixed for the collector. */
	regions: readonly string[];
	/** What the owner can end a session with. Fixed for the collector, like the regions. */
	rotateReasons: readonly RotateReason[];
	/** Every session key with the value it has now, `undefined` when not known yet. */
	sessionKeys: Keys;
};

export type SessionKeysChange<Keys extends SessionKeys, RotateReason extends string> = {
	/** What the session ends with if any of the values is a different known one. */
	rotateReason: RotateReason;
	/** The keys that may have changed. `undefined` is no information, never a change. */
	values: Partial<Keys>;
};

/**
 * Collects interaction latencies and emits session-to-date snapshots.
 *
 * Every interaction is counted in `page`, and the ones with a region again in that region, in `all`
 * and in the group of its kind, which is what tells a slow region apart from a slow page around it.
 * An interaction with two regions is counted in each of them.
 *
 * `start` and `stop` bound the collecting, which happens once. Within it there can be several
 * sessions, because a session covers one value of each session key: the first known value fills
 * the session in, and a different one closes it and opens the next.
 */
export class InteractivityCollector<
	Keys extends SessionKeys = SessionKeys,
	const RotateReason extends string = never,
> {
	private readonly emit: InteractivityCollectorOptions<Keys, RotateReason>['emit'];
	private readonly regions: InteractivityCollectorOptions<Keys, RotateReason>['regions'];
	private readonly rotateReasons: InteractivityCollectorOptions<
		Keys,
		RotateReason
	>['rotateReasons'];
	/** The latest known value of each key, which a new session starts with. */
	private readonly sessionKeys: Keys;

	private readonly interactionObserver: InteractionObserver;
	private readonly regionEventObservers = new Map<string, RegionEventObserver>();
	private readonly snapshotScheduler: SnapshotScheduler;
	private readonly lifecycleObserver: LifecycleObserver;

	private session: InteractivitySession<Keys>;
	private started = false;
	private stopped = false;

	constructor(options: InteractivityCollectorOptions<Keys, RotateReason>) {
		this.emit = options.emit;
		this.regions = options.regions;
		this.rotateReasons = options.rotateReasons;
		this.sessionKeys = { ...options.sessionKeys };

		this.interactionObserver = new InteractionObserver((entries) => this.recordEntries(entries));
		for (const region of this.regions) {
			this.regionEventObservers.set(region, new RegionEventObserver());
		}
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
		for (const [region, regionEventObserver] of this.regionEventObservers) {
			regionEventObserver.start((event) => this.recordRegionEvent(region, event));
		}
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
		for (const regionEventObserver of this.regionEventObservers.values()) {
			regionEventObserver.stop();
		}
		this.snapshotScheduler.stop();
		this.lifecycleObserver.stop();
	}

	/**
	 * What the region is made of, for its owner to fill in; the same object every time. The session
	 * is not tied to it: interactions from before an element arrives are counted in `page` only.
	 */
	region(name: string): InteractivityRegion {
		const regionEventObserver = this.regionEventObservers.get(name);
		if (!regionEventObserver) {
			throw new Error(`Undeclared interactivity region: ${name}`);
		}
		return regionEventObserver;
	}

	/**
	 * The first known value of a key fills the session in. A different known one ends it with
	 * `rotateReason`, once, however many keys changed.
	 */
	setSessionKeys({ values, rotateReason }: SessionKeysChange<Keys, RotateReason>): void {
		if (!this.rotateReasons.includes(rotateReason)) {
			throw new Error(`Undeclared interactivity rotate reason: ${rotateReason}`);
		}

		let rotates = false;
		for (const key in values) {
			if (this.updateSessionKey(key, values[key])) {
				rotates = true;
			}
		}

		if (this.stopped) {
			return;
		}

		if (rotates) {
			this.rotateSession(rotateReason);
		} else {
			Object.assign(this.session.sessionKeys, this.sessionKeys);
		}
	}

	/**
	 * Keeps the key's value when it is a new known one.
	 *
	 * @returns whether the session has to end, because the key had a different known value.
	 */
	private updateSessionKey<Key extends keyof Keys>(key: Key, value: Partial<Keys>[Key]): boolean {
		if (value === undefined || value === this.sessionKeys[key]) {
			return false;
		}

		if (!(key in this.sessionKeys)) {
			throw new Error(`Undeclared interactivity session key: ${String(key)}`);
		}

		const hadValue = this.sessionKeys[key] !== undefined;
		this.sessionKeys[key] = value;
		return hadValue;
	}

	/**
	 * @param startsAfterInteractionId the highest interaction the previous session saw, so
	 * entries still arriving for it are not counted here as well.
	 */
	private createSession(startsAfterInteractionId: number): InteractivitySession<Keys> {
		return new InteractivitySession({
			hidden: getDocument()?.visibilityState === 'hidden',
			regions: this.regions,
			sessionKeys: { ...this.sessionKeys },
			startsAfterInteractionId,
		});
	}

	/** Reports the current session as ended by `reason` and puts a new one in its place. */
	private rotateSession(reason: RotateReason): void {
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
	 * Counts an interaction with a region, including the ones Event Timing never reports because
	 * they were faster than its threshold — which is why a count alone moves the session on.
	 */
	private recordRegionEvent(region: string, event: Event): void {
		if (this.stopped) {
			return;
		}

		// An event a script dispatched is no interaction: the browser counts none of them either.
		if (!event.isTrusted) {
			return;
		}

		const kind = this.session.tracker.recordRegionEvent(region, event);
		const regionGroups = this.session.regionGroups.get(region);
		if (!kind || !regionGroups) {
			return;
		}

		regionGroups.all.countTotal();
		regionGroups[kind].countTotal();
		this.session.revision += 1;
	}

	private recordEntries(entries: InteractionEntry[]): void {
		for (const entry of entries) {
			const update = this.session.tracker.merge(entry);
			if (!update) {
				continue;
			}

			let changed = this.session.page.trackInteractionUpdate(update);
			if (update.attribution) {
				const { kind, regions } = update.attribution;
				for (const region of regions) {
					const regionGroups = this.session.regionGroups.get(region);
					if (!regionGroups) {
						continue;
					}
					changed = regionGroups.all.trackInteractionUpdate(update) || changed;
					changed = regionGroups[kind].trackInteractionUpdate(update) || changed;
				}
			}

			if (changed) {
				this.session.revision += 1;
			}
		}
	}

	private takeSnapshot(reason: CollectorReason | RotateReason): void {
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

		// Must run before the change check: the browser may be holding entries that have not reached
		// the observer callback yet, and on `pagehide` there is no later chance to pick them up.
		this.interactionObserver.drain();

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

		const regions: Record<string, RegionSnapshot> = {};
		for (const [region, regionGroups] of session.regionGroups) {
			regions[region] = {
				all: regionGroups.all.snapshot(),
				typing: regionGroups.typing.snapshot(),
				pointer: regionGroups.pointer.snapshot(),
				other: regionGroups.other.snapshot(),
			};
		}

		this.emit({
			schema: SCHEMA_VERSION,
			interactivitySessionId: session.id,
			seq: session.seq,
			reason,
			sessionKeys: { ...session.sessionKeys },
			activeMs: Math.round(Math.max(0, now - session.startedAt - hiddenMs)),
			hiddenMs: Math.round(hiddenMs),
			// Only `page` is told its total; each region has counted its own.
			page: session.page.snapshot(pageTotalCount),
			regions,
		});
	}
}
