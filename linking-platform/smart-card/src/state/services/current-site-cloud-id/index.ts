import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';
import { request } from '@atlaskit/linking-common';

const SMART_CARD_STORAGE_SCOPE = 'smart-card-social-proof';

export const CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY_PREFIX = 'site-cloud-id:v1:';
export const CURRENT_SITE_CLOUD_ID_TTL_MS: number = 24 * 60 * 60 * 1000;

const smartCardStorage = new StorageClient(SMART_CARD_STORAGE_SCOPE);

function normalizeBaseUri(baseUriWithNoTrailingSlash = ''): string {
	return baseUriWithNoTrailingSlash.replace(/\/$/, '');
}

function cloudIdStorageItemKey(baseUriWithNoTrailingSlash = ''): string {
	return `${CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY_PREFIX}${encodeURIComponent(
		normalizeBaseUri(baseUriWithNoTrailingSlash),
	)}`;
}

/** Keys written by this service in localStorage when using {@link smartCardStorage}. */
export const getCurrentSiteCloudIdLocalStorageKey = (baseUriWithNoTrailingSlash = ''): string =>
	`${SMART_CARD_STORAGE_SCOPE}_${cloudIdStorageItemKey(baseUriWithNoTrailingSlash)}`;

/** Backwards-compatible default-scope key for existing tests and external assertions. */
export const CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY: string =
	getCurrentSiteCloudIdLocalStorageKey();

export class CurrentSiteCloudIdService {
	private tenantInfoInflightPromises = new Map<string, Promise<string | undefined>>();

	private readStoredCloudId(baseUriWithNoTrailingSlash = ''): string | undefined {
		try {
			const cloudId = smartCardStorage.getItem(cloudIdStorageItemKey(baseUriWithNoTrailingSlash));
			if (typeof cloudId !== 'string' || !cloudId || cloudId === 'undefined') {
				return undefined;
			}
			return cloudId;
		} catch {
			return undefined;
		}
	}

	private writeStoredCloudId(baseUriWithNoTrailingSlash: string, cloudId: string): void {
		if (!cloudId) {
			return;
		}
		try {
			smartCardStorage.setItemWithExpiry(
				cloudIdStorageItemKey(baseUriWithNoTrailingSlash),
				cloudId,
				CURRENT_SITE_CLOUD_ID_TTL_MS,
			);
		} catch {
			// Quota, private-mode, SSR, etc. — same intent as personalization-service.
		}
	}

	private ensureTenantInfoInflightStarted(
		baseUriWithNoTrailingSlash: string,
	): Promise<string | undefined> {
		const baseUri = normalizeBaseUri(baseUriWithNoTrailingSlash);
		const existing = this.tenantInfoInflightPromises.get(baseUri);
		if (existing) {
			return existing;
		}

		const promise = (async (): Promise<string | undefined> => {
			try {
				const response = await request<{ cloudId: string }>('get', `${baseUri}/_edge/tenant_info`);
				const cloudId = response?.cloudId;

				if (cloudId) {
					this.writeStoredCloudId(baseUri, cloudId);
				}

				return cloudId ? cloudId : this.readStoredCloudId(baseUri);
			} catch {
				return this.readStoredCloudId(baseUri);
			} finally {
				this.tenantInfoInflightPromises.delete(baseUri);
			}
		})();

		this.tenantInfoInflightPromises.set(baseUri, promise);
		return promise;
	}

	/** Pure synchronous read scoped to the given base URI. */
	getStoredCloudId(baseUriWithNoTrailingSlash = ''): string | undefined {
		return this.readStoredCloudId(baseUriWithNoTrailingSlash);
	}

	/** Writes tenant cloud id for tests or callers that intentionally warm storage before edge resolves. */
	persistStoredCloudId(cloudId: string, baseUriWithNoTrailingSlash = ''): void {
		this.writeStoredCloudId(baseUriWithNoTrailingSlash, cloudId);
	}

	async get(baseUriWithNoTrailingSlash = ''): Promise<string | undefined> {
		const fromStorage = this.readStoredCloudId(baseUriWithNoTrailingSlash);
		if (fromStorage) {
			return fromStorage;
		}

		return this.ensureTenantInfoInflightStarted(baseUriWithNoTrailingSlash);
	}
	/** Clears session pin and persisted storage so the next {@link get} is a fresh tenant_info fetch. */
	clearCache(): void {
		this.tenantInfoInflightPromises.clear();
	}
}

export const currentSiteCloudIdService: CurrentSiteCloudIdService = new CurrentSiteCloudIdService();

export function getCurrentSiteCloudIdSync(baseUriWithNoTrailingSlash = ''): string | undefined {
	return currentSiteCloudIdService.getStoredCloudId(baseUriWithNoTrailingSlash);
}

export const getCurrentSiteCloudId = (
	baseUriWithNoTrailingSlash = '',
): Promise<string | undefined> => currentSiteCloudIdService.get(baseUriWithNoTrailingSlash);
