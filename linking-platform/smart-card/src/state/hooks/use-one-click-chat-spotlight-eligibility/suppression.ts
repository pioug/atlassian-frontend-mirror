import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';

import { SEVEN_DAYS_MS, type SpotlightHistory } from './evaluate';

/** Shared across inline cards. Account identifiers are held in memory only. */
const stores = new Map<string, Promise<SpotlightSuppression | undefined>>();
let activeSpotlight: symbol | undefined;

export interface SpotlightSuppression {
	dismiss: (now: number) => boolean;
	impress: (now: number) => boolean;
	read: () => SpotlightHistory | undefined;
}

const isHistory = (value: unknown): value is SpotlightHistory => {
	if (typeof value !== 'object' || value === null || !('impressions' in value)) {
		return false;
	}
	return (
		Array.isArray(value.impressions) &&
		value.impressions.every(
			(timestamp: unknown) => typeof timestamp === 'number' && Number.isFinite(timestamp),
		) &&
		(!('dismissedAt' in value) ||
			value.dismissedAt === undefined ||
			(typeof value.dismissedAt === 'number' && Number.isFinite(value.dismissedAt)))
	);
};

/** Reuses Smart Card's StorageClient, with timestamp-only values and a one-way user namespace. */
export function createSuppressionStore(
	storage: StorageClient,
	isAvailable: () => boolean = () => true,
): SpotlightSuppression {
	let blocked = false;
	const read = (): SpotlightHistory | undefined => {
		try {
			const value: unknown = storage.getItem('history');
			if (blocked || !isAvailable()) {
				return undefined;
			}
			return value === undefined ? { impressions: [] } : isHistory(value) ? value : undefined;
		} catch {
			return undefined;
		}
	};
	const write = (history: SpotlightHistory): boolean => {
		try {
			storage.setItemWithExpiry('history', history, SEVEN_DAYS_MS);
			// StorageClient can swallow write failures. Verify persistence before counting delivery.
			const persisted =
				isAvailable() && JSON.stringify(storage.getItem('history')) === JSON.stringify(history);
			blocked = !persisted;
			return persisted;
		} catch {
			blocked = true;
			return false;
		}
	};
	return {
		read,
		impress: (now) => {
			const history = read();
			return (
				!!history &&
				write({
					...history,
					impressions: [
						...history.impressions.filter((timestamp) => timestamp > now - SEVEN_DAYS_MS),
						now,
					],
				})
			);
		},
		dismiss: (now) => {
			const history = read();
			return !!history && write({ ...history, dismissedAt: now });
		},
	};
}

export function getSuppressionStore(accountId: string): Promise<SpotlightSuppression | undefined> {
	const cached = stores.get(accountId);
	if (cached) {
		return cached;
	}
	const pending = (async () => {
		try {
			if (typeof window === 'undefined' || !window.crypto?.subtle) {
				return undefined;
			}
			const digest = await window.crypto.subtle.digest(
				'SHA-256',
				new TextEncoder().encode(`one-click-chat-spotlight-v2:${accountId}`),
			);
			const namespace = Array.from(new Uint8Array(digest), (byte) =>
				byte.toString(16).padStart(2, '0'),
			).join('');
			let available = true;
			const storage = new StorageClient(`one-click-chat-spotlight-v2:${namespace}`, {
				handlers: {
					captureException: () => {
						available = false;
					},
				},
			});
			return createSuppressionStore(storage, () => available);
		} catch {
			return undefined;
		}
	})();
	stores.set(accountId, pending);
	return pending;
}

export function claimSpotlight(owner: symbol): boolean {
	if (activeSpotlight && activeSpotlight !== owner) {
		return false;
	}
	activeSpotlight = owner;
	return true;
}

export function releaseSpotlight(owner: symbol): void {
	if (activeSpotlight === owner) {
		activeSpotlight = undefined;
	}
}

export function isSpotlightActive(owner: symbol): boolean {
	return activeSpotlight !== undefined && activeSpotlight !== owner;
}
