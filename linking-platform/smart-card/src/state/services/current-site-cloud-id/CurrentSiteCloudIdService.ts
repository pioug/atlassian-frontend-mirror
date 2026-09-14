import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';
import { request } from '@atlaskit/linking-common';

import { cloudIdStorageItemKey } from './cloudIdStorageItemKey';
import { currentSiteCloudIdConstants } from './constants';
import { normalizeBaseUri } from './normalizeBaseUri';

const smartCardStorage = new StorageClient(currentSiteCloudIdConstants.SMART_CARD_STORAGE_SCOPE);

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
				currentSiteCloudIdConstants.CURRENT_SITE_CLOUD_ID_TTL_MS,
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
