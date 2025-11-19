import {
	_getFullUserHash,
	_getStorageKey,
	type DataAdapterAsyncOptions,
	DataAdapterCachePrefix,
	DataAdapterCore,
	type DataAdapterResult,
	type EvaluationsDataAdapter,
	StableID,
	type StatsigUser,
	type StatsigUserInternal,
} from '@statsig/js-client';

/**
 * Data adapter which only uses bootstrap data and will never fetch from network or cache.
 * We do this because we control the fetching of bootstrap data from FFS in Client.ts whereas the
 * default data adapter fetches from Statsig servers.
 */
export class NoFetchDataAdapter extends DataAdapterCore implements EvaluationsDataAdapter {
	bootstrapResult: DataAdapterResult | null = null;

	constructor() {
		super('NoFetchDataAdapter', 'nofetch');
	}

	/**
	 * Make sure to call this **before** calling `initializeAsync` or `updateUserAsync` but
	 * after the Statsig client has been created!
	 */
	setBootstrapData(data?: Record<string, unknown>): void {
		this.bootstrapResult = data
			? {
					source: 'Bootstrap',
					data: JSON.stringify(data),
					receivedAt: Date.now(),
					stableID: StableID.get(this._getSdkKey()),
					fullUserHash: null,
				}
			: null;
	}

	async prefetchData(
		_user: StatsigUser,
		_options?: DataAdapterAsyncOptions | undefined,
	): Promise<void> {}

	async getDataAsync(
		_current: DataAdapterResult | null,
		user: StatsigUser,
		_options?: DataAdapterAsyncOptions | undefined,
	): Promise<DataAdapterResult | null> {
		return (
			this.bootstrapResult && {
				...this.bootstrapResult,
				fullUserHash: _getFullUserHash(user),
			}
		);
	}

	getDataSync(user?: StatsigUser | undefined): DataAdapterResult | null {
		return (
			this.bootstrapResult && {
				...this.bootstrapResult,
				fullUserHash: _getFullUserHash(user),
			}
		);
	}

	protected async _fetchFromNetwork(
		_current: string | null,
		_user?: StatsigUser | undefined,
		_options?: DataAdapterAsyncOptions | undefined,
	): Promise<string | null> {
		return null;
	}

	protected _getCacheKey(user?: StatsigUserInternal | undefined): string {
		// Same logic as default data adapter
		// https://github.com/statsig-io/js-client-monorepo/blob/main/packages/js-client/src/StatsigEvaluationsDataAdapter.ts
		const key = _getStorageKey(this._getSdkKey(), user);
		return `${DataAdapterCachePrefix}.${this._cacheSuffix}.${key}`;
	}

	protected _isCachedResultValidFor204(
		_result: DataAdapterResult,
		_user: StatsigUser | undefined,
	): boolean {
		return false;
	}

	setDataLegacy(data: string, user: StatsigUser): void {
		super.setData(data, user);
	}

	// Do not stringify options property since that includes this adapter and will
	// cause a circular reference when Statsig sends diagnostic events and including
	// values is not necessary and makes the result huge
	toJSON(): Record<string, unknown> {
		const result = { ...this } as Record<string, unknown>;
		delete result._options;
		delete result._inMemoryCache;
		delete result.bootstrapResult;
		return result;
	}
}
