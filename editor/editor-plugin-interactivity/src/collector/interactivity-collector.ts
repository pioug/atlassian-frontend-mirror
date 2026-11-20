import { getDocument } from '@atlaskit/browser-apis';

import type {
	CollectedSnapshot,
	InterimReason,
	RegionSnapshot,
	SessionKeys,
	SnapshotSendHints,
} from '../analytics/interactivity-snapshot';
import { SCHEMA_VERSION } from './bucket-boundaries';
import { InteractionObserver } from './interaction-observer';
import type { InteractionEntry } from './interaction-tracker';
import { InteractivitySession } from './interactivity-session';
import { LifecycleObserver } from './lifecycle-observer';
import { type InteractivityRegion, RegionEventObserver } from './region-event-observer';
import { SnapshotScheduler } from './snapshot-scheduler';

export type InteractivityCollectorOptions<Keys extends SessionKeys, EndReason extends string> = {
	/** Called as the snapshot is taken, so what the owner reads then is of the same moment. */
	emit: (snapshot: CollectedSnapshot<Keys, EndReason>, sendHints: SnapshotSendHints) => void;
	/**
	 * What the owner can end a session with: a changed session key, or a stop. Fixed for the
	 * collector, like the regions.
	 */
	endReasons: readonly EndReason[];
	/** The parts of the page whose interactions are counted on their own. Fixed for the collector. */
	regions: readonly string[];
	/** Every session key with the value it has now, `undefined` when not known yet. */
	sessionKeys: Keys;
};

export type SessionKeysChange<Keys extends SessionKeys, EndReason extends string> = {
	/** What the session ends with if any of the values is a different known one. */
	endReason: EndReason;
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
 * `start` and `stop` bound the collecting, and every `start` opens a new session. Within it there
 * can be several more, because a session covers one value of each session key: the first known
 * value fills the session in, and a different one ends it and opens the next.
 */
export class InteractivityCollector<
	Keys extends SessionKeys = SessionKeys,
	const EndReason extends string = never,
> {
	private readonly emit: InteractivityCollectorOptions<Keys, EndReason>['emit'];
	private readonly regions: InteractivityCollectorOptions<Keys, EndReason>['regions'];
	private readonly endReasons: InteractivityCollectorOptions<Keys, EndReason>['endReasons'];
	/** The latest known value of each key, which a new session starts with. */
	private readonly sessionKeys: Keys;

	private readonly interactionObserver: InteractionObserver;
	private readonly regionEventObservers = new Map<string, RegionEventObserver>();
	private readonly snapshotScheduler: SnapshotScheduler;
	private readonly lifecycleObserver: LifecycleObserver;

	/** There only while collecting. */
	private session: InteractivitySession<Keys> | undefined;
	/** The highest interaction a session saw, so the next one does not count it again. */
	private startsAfterInteractionId = 0;

	/** Touches nothing of the page until `start`, so an owner can create it while rendering. */
	constructor(options: InteractivityCollectorOptions<Keys, EndReason>) {
		this.emit = options.emit;
		this.regions = options.regions;
		this.endReasons = options.endReasons;
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
	}

	/**
	 * Starts collecting in a new session. Calling it again while collecting changes nothing.
	 *
	 * @returns whether collecting is running; `false` when the browser cannot support it.
	 */
	start(): boolean {
		if (this.session) {
			return true;
		}

		if (!InteractionObserver.isSupported()) {
			return false;
		}

		this.session = this.createSession();
		this.interactionObserver.start();
		for (const [region, regionEventObserver] of this.regionEventObservers) {
			regionEventObserver.start((event) => this.recordRegionEvent(region, event));
		}
		this.snapshotScheduler.start();
		this.lifecycleObserver.start();

		return true;
	}

	/** Reports the session as ended by `endReason`, and stops collecting until the next `start`. */
	stop({ endReason }: { endReason: EndReason }): void {
		this.assertDeclaredEndReason(endReason);
		if (!this.session) {
			return;
		}

		this.endSession(endReason, { immediate: true });
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
	 * `endReason`, once, however many keys changed.
	 */
	setSessionKeys({ values, endReason }: SessionKeysChange<Keys, EndReason>): void {
		this.assertDeclaredEndReason(endReason);

		let rotates = false;
		for (const key in values) {
			if (this.updateSessionKey(key, values[key])) {
				rotates = true;
			}
		}

		// A stopped collector has no session to end: the next `start` opens one with these values.
		if (!this.session) {
			return;
		}

		if (rotates) {
			this.endSession(endReason, { immediate: false });
			this.session = this.createSession();
			this.snapshotScheduler.restart();
		} else {
			Object.assign(this.session.sessionKeys, this.sessionKeys);
		}
	}

	private assertDeclaredEndReason(endReason: EndReason): void {
		if (!this.endReasons.includes(endReason)) {
			throw new Error(`Undeclared interactivity end reason: ${endReason}`);
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
	 * Its timings start now, with the collecting, and it counts only interactions after the ones
	 * the previous session saw, so entries still arriving for those are not counted twice.
	 */
	private createSession(): InteractivitySession<Keys> {
		return new InteractivitySession({
			hidden: getDocument()?.visibilityState === 'hidden',
			regions: this.regions,
			sessionKeys: { ...this.sessionKeys },
			startsAfterInteractionId: this.startsAfterInteractionId,
		});
	}

	/** Reports the session as ended by `endReason` and lets go of it. */
	private endSession(endReason: EndReason, { immediate }: SnapshotSendHints): void {
		this.takeSnapshot(endReason, { immediate });
		if (this.session) {
			this.startsAfterInteractionId = this.session.tracker.lastInteractionId;
		}
		this.session = undefined;
	}

	private onTimer(): void {
		this.takeSnapshot('timer', { immediate: false });
	}

	private onHidden(): void {
		if (this.session && this.session.hiddenSince === undefined) {
			this.session.hiddenSince = performance.now();
		}
		this.takeSnapshot('hidden', { immediate: true });
	}

	private onVisible(): void {
		const session = this.session;
		if (!session) {
			return;
		}

		if (session.hiddenSince !== undefined) {
			session.hiddenMs += performance.now() - session.hiddenSince;
			session.hiddenSince = undefined;
		}
		session.lifecycleSnapshotEmitted = false;
	}

	private onPageHide(): void {
		this.takeSnapshot('pagehide', { immediate: true });
	}

	/**
	 * The page came back from the back/forward cache, which never raises a visibility change.
	 * The session continues, and the signal that suspended it has been reported, so the next
	 * one is due.
	 */
	private onPageShow(): void {
		if (this.session) {
			this.session.lifecycleSnapshotEmitted = false;
		}
	}

	/**
	 * Counts an interaction with a region, including the ones Event Timing never reports because
	 * they were faster than its threshold — which is why a count alone moves the session on.
	 */
	private recordRegionEvent(region: string, event: Event): void {
		// An event a script dispatched is no interaction: the browser counts none of them either.
		const session = this.session;
		if (!session || !event.isTrusted) {
			return;
		}

		const kind = session.tracker.recordRegionEvent(region, event);
		const regionGroups = session.regionGroups.get(region);
		if (!kind || !regionGroups) {
			return;
		}

		regionGroups.all.countTotal();
		regionGroups[kind].countTotal();
		session.revision += 1;
	}

	private recordEntries(entries: InteractionEntry[]): void {
		// Entries the browser hands over after `stop` belong to no session.
		const session = this.session;
		if (!session) {
			return;
		}

		for (const entry of entries) {
			const update = session.tracker.merge(entry);
			if (!update) {
				continue;
			}

			let changed = session.page.trackInteractionUpdate(update);
			if (update.attribution) {
				const { kind, regions } = update.attribution;
				for (const region of regions) {
					const regionGroups = session.regionGroups.get(region);
					if (!regionGroups) {
						continue;
					}
					changed = regionGroups.all.trackInteractionUpdate(update) || changed;
					changed = regionGroups[kind].trackInteractionUpdate(update) || changed;
				}
			}

			if (changed) {
				session.revision += 1;
			}
		}
	}

	private takeSnapshot(reason: InterimReason | EndReason, { immediate }: SnapshotSendHints): void {
		const session = this.session;
		if (!session) {
			return;
		}

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

		this.emit(
			{
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
			},
			{ immediate },
		);
	}
}
