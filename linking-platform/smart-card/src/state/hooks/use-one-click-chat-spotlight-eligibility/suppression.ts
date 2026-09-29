import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';

import { SEVEN_DAYS_MS, type SpotlightHistory } from './evaluate';

/** Shared across inline cards and accounts on this browser origin. */
let store: SpotlightSuppression | undefined;
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

/** Reuses Smart Card's StorageClient, with timestamp-only values in one browser-origin history. */
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

export function getSuppressionStore(): SpotlightSuppression | undefined {
	if (typeof window === 'undefined') {
		return undefined;
	}
	if (!store) {
		try {
			let available = true;
			const storage = new StorageClient('one-click-chat-spotlight-v2', {
				handlers: {
					captureException: () => {
						available = false;
					},
				},
			});
			store = createSuppressionStore(storage, () => available);
		} catch {
			return undefined;
		}
	}
	return store;
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
