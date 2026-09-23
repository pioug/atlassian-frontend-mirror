import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';

import { SEVEN_DAYS_MS } from '../evaluate';
import {
	claimSpotlight,
	createSuppressionStore,
	isSpotlightActive,
	releaseSpotlight,
} from '../suppression';

beforeEach(() => localStorage.clear());

it('persists only bounded timestamp history', () => {
	const storage = new StorageClient('test-spotlight');
	const store = createSuppressionStore(storage);
	const now = Date.now();
	storage.setItemWithExpiry('history', { impressions: [now - SEVEN_DAYS_MS, now - 1000] });
	expect(store.impress(now)).toBe(true);
	expect(store.dismiss(now)).toBe(true);
	expect(store.read()).toEqual({ impressions: [now - 1000, now], dismissedAt: now });
	expect(JSON.parse(localStorage.getItem('test-spotlight_history') ?? '{}').value).toEqual({
		impressions: [now - 1000, now],
		dismissedAt: now,
	});
});

it('fails closed on invalid history or inaccessible storage', () => {
	const storage = new StorageClient('test-spotlight');
	const store = createSuppressionStore(storage);
	storage.setItemWithExpiry('history', { impressions: ['not-a-timestamp'] });
	expect(store.read()).toBeUndefined();
	expect(store.impress(Date.now())).toBe(false);
	jest.spyOn(storage, 'getItem').mockImplementation(() => {
		throw new Error('unavailable');
	});
	expect(store.read()).toBeUndefined();
});

it('detects swallowed persistence failures', () => {
	const storage = new StorageClient('test-spotlight');
	jest.spyOn(storage, 'setItemWithExpiry').mockImplementation(() => {});
	expect(createSuppressionStore(storage).impress(Date.now())).toBe(false);
});

it('isolates storage namespaces', () => {
	const first = createSuppressionStore(new StorageClient('first-opaque-scope'));
	const second = createSuppressionStore(new StorageClient('second-opaque-scope'));
	first.dismiss(Date.now());
	expect(second.read()).toEqual({ impressions: [] });
});

it('only the current owner can release the page-wide reservation', () => {
	const first = Symbol('first spotlight');
	const second = Symbol('second spotlight');
	expect(claimSpotlight(first)).toBe(true);
	expect(claimSpotlight(second)).toBe(false);
	expect(isSpotlightActive(first)).toBe(false);
	expect(isSpotlightActive(second)).toBe(true);
	releaseSpotlight(second);
	expect(claimSpotlight(second)).toBe(false);
	releaseSpotlight(first);
	expect(claimSpotlight(second)).toBe(true);
	releaseSpotlight(second);
});
