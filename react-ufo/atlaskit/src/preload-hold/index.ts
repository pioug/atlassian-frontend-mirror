import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	adoptPreloadHoldForActiveInteraction,
	registerPreloadInfo,
	setPreloadHoldAdoptionHook,
} from '../interaction-metrics';
import { makePreloadKey } from './make-preload-key';
import { type PendingPreloadHold, preloadHoldState } from './state';

export type BeginUFOPreloadHoldArgs = {
	name: string;
	source?: string;
	preloadStartedAt?: number;
	routeIdentifier?: string;
	query?: Readonly<Record<string, string | undefined>>;
};

const NOOP_RELEASE = () => {};

const { pending } = preloadHoldState;

function makeRegistryKey(overwriteKey: string): string {
	preloadHoldState.registryKeySequence += 1;
	return `${overwriteKey}#${preloadHoldState.registryKeySequence}`;
}

export function beginUFOPreloadHold(args: BeginUFOPreloadHoldArgs): () => void {
	if (!fg('platform_ufo_preload_hold_adoption')) {
		return NOOP_RELEASE;
	}
	if (!preloadHoldState.adoptionHookRegistered) {
		setPreloadHoldAdoptionHook(adoptPendingPreloadHolds);
		preloadHoldState.adoptionHookRegistered = true;
	}

	const { name, source = 'rrr-preload', routeIdentifier, query } = args;

	if (!name) {
		return NOOP_RELEASE;
	}

	const now = performance.now();
	const preloadStartedAt = args.preloadStartedAt ?? now;
	const preloadKey = makePreloadKey({ name, routeIdentifier, query });
	const overwriteKey = makePreloadKey({ name, routeIdentifier, query, source });
	const key = makeRegistryKey(overwriteKey);

	const releaseActiveHold = adoptPreloadHoldForActiveInteraction({
		experienceKey: name,
		preloadKey,
		source,
		preloadStartedAt,
		adoptedAt: now,
	});
	if (releaseActiveHold) {
		let released = false;
		return () => {
			if (released) {
				return;
			}
			released = true;
			releaseActiveHold();
		};
	}

	for (const [existingKey, existing] of pending) {
		if (!existing.settled && !existing.adoptedRelease && existing.overwriteKey === overwriteKey) {
			existing.overridden = true;
			pending.delete(existingKey);
			break;
		}
	}

	const entry: PendingPreloadHold = {
		key,
		preloadKey,
		overwriteKey,
		name,
		source,
		preloadStartedAt,
		settled: false,
		overridden: false,
		release: NOOP_RELEASE,
	};
	entry.release = makePendingRelease(entry);

	pending.set(key, entry);

	return entry.release;
}

function makePendingRelease(entry: PendingPreloadHold): () => void {
	let released = false;
	return () => {
		if (released) {
			return;
		}
		released = true;
		entry.settled = true;

		if (entry.overridden) {
			return;
		}

		if (entry.adoptedRelease) {
			entry.adoptedRelease();
			entry.adoptedRelease = undefined;
			return;
		}

		if (pending.get(entry.key) === entry) {
			pending.delete(entry.key);
		}
	};
}

function adoptPendingPreloadHolds(
	interactionId: string,
	ufoName: string,
	interactionPreloadKey?: string,
): void {
	if (!fg('platform_ufo_preload_hold_adoption')) {
		return;
	}

	for (const [key, entry] of pending) {
		if (
			entry.name !== ufoName ||
			entry.settled ||
			(interactionPreloadKey !== undefined && entry.preloadKey !== interactionPreloadKey)
		) {
			continue;
		}

		const adoptedAt = performance.now();
		entry.adoptedRelease = registerPreloadInfo(interactionId, {
			source: entry.source,
			preloadStartedAt: entry.preloadStartedAt,
			adoptedAt,
		});

		pending.delete(key);
	}
}
