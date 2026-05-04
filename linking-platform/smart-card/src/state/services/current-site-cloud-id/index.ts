import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';
import { request } from '@atlaskit/linking-common';

/**
 * Logical key shape matches smart-card storage conventions (see personalization-service). {@link StorageClient}
 * stores rows as `<clientKey>_<itemKey>` with `clientKey === '@atlaskit/smart-card'` and
 * `itemKey === 'site-cloud-id:v1'` (no further scope segments; unlike `pct-map:v1:`, this is a single fixed row).
 */
const SMART_CARD_STORAGE_SCOPE = '@atlaskit/smart-card';

export const CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY: string = 'site-cloud-id:v1';

const smartCardStorage = new StorageClient(SMART_CARD_STORAGE_SCOPE);

/** Keys written by this service in localStorage when using {@link smartCardStorage}. */
export const CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY: string = `${SMART_CARD_STORAGE_SCOPE}_${CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY}`;

export class CurrentSiteCloudIdService {
	/**
	 * Holds the shared tenant_info work: one in-flight fetch, then (on success) a settled promise for the session cloud
	 * id so later callers never trigger another `tenant_info` in the same page lifetime (until {@link clearCache}).
	 */
	private tenantInfoInflightPromise: Promise<string | undefined> | null = null;

	private readStoredCloudId(): string | undefined {
		try {
			const cloudId = smartCardStorage.getItem(CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY);
			if (typeof cloudId !== 'string' || !cloudId || cloudId === 'undefined') {
				return undefined;
			}
			return cloudId;
		} catch {
			return undefined;
		}
	}

	private writeStoredCloudId(cloudId: string): void {
		if (!cloudId) {
			return;
		}
		try {
			smartCardStorage.setItemWithExpiry(CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY, cloudId);
		} catch {
			// Quota, private-mode, SSR, etc. — same intent as personalization-service.
		}
	}

	private ensureTenantInfoInflightStarted(baseUriWithNoTrailingSlash: string): void {
		if (this.tenantInfoInflightPromise !== null) {
			return;
		}

		this.tenantInfoInflightPromise = (async (): Promise<string | undefined> => {
			try {
				const response = await request<{ cloudId: string }>(
					'get',
					baseUriWithNoTrailingSlash + '/_edge/tenant_info',
				);
				const cloudId = response?.cloudId;

				if (cloudId) {
					this.writeStoredCloudId(cloudId);
				}

				return cloudId ? cloudId : this.readStoredCloudId();
			} catch {
				this.tenantInfoInflightPromise = null;
				return this.readStoredCloudId();
			}
		})();
	}

	/**
	 * Returns the currently cached cloud id synchronously and starts a background refresh.
	 * The refresh result is persisted for future calls but is not awaited by this call.
	 */
	getCachedCloudIdAndRefresh(): string | undefined {
		this.ensureTenantInfoInflightStarted('');
		return this.readStoredCloudId();
	}

	/** Writes tenant cloud id for tests or callers that intentionally warm storage before edge resolves. */
	persistStoredCloudId(cloudId: string): void {
		this.writeStoredCloudId(cloudId);
	}

	/**
	 * When local storage already has a tenant cloud id, it is returned immediately; a background tenant_info refresh
	 * is still kicked off unless one is already in flight.
	 *
	 * Without storage, this awaits the deduped in-flight tenant_info (first concurrent caller chooses the URL;
	 * all share one promise regardless of subsequent `baseUriWithNoTrailingSlash`).
	 *
	 * On network success with no cloud id, or on failure: falls back via {@link readStoredCloudId}.
	 */
	async get(baseUriWithNoTrailingSlash = ''): Promise<string | undefined> {
		const fromStorage = this.readStoredCloudId();
		this.ensureTenantInfoInflightStarted(baseUriWithNoTrailingSlash);

		if (fromStorage) {
			return fromStorage;
		}

		return this.tenantInfoInflightPromise as Promise<string | undefined>;
	}

	/** Clears the session pin so the next {@link get} may run `tenant_info` again (e.g. tests). */
	clearCache(): void {
		this.tenantInfoInflightPromise = null;
	}
}

export const currentSiteCloudIdService: CurrentSiteCloudIdService = new CurrentSiteCloudIdService();

/**
 * Resolves the current site cloud id through the module-level {@link currentSiteCloudIdService}.
 * Returns a stored cloud id immediately when one exists; otherwise waits for the shared
 * `tenant_info` request and persists the result for subsequent cached reads.
 */
export const getCurrentSiteCloudId: (
	baseUriWithNoTrailingSlash?: string,
) => Promise<string | undefined> = (
	baseUriWithNoTrailingSlash = '',
): Promise<string | undefined> => currentSiteCloudIdService.get(baseUriWithNoTrailingSlash);

/**
 * Reads the current site cloud id from browser storage (the `site-cloud-id:v1` row) via the
 * module-level {@link currentSiteCloudIdService} singleton, without awaiting network work.
 * Calling this also starts the shared `tenant_info` refresh in the background when one is not
 * already running, so a later call can observe a refreshed value when available.
 */
export function getCachedCurrentSiteCloudIdAndRefresh(): string | undefined {
	return currentSiteCloudIdService.getCachedCloudIdAndRefresh();
}