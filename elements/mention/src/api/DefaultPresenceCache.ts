import { type Presence } from '../types';
import type { PresenceCache, PresenceMap } from './PresenceResource';

class CacheEntry {
	presence: Presence;
	expiry: number;

	constructor(pres: Presence, timeout: number) {
		this.presence = pres;
		this.expiry = Date.now() + timeout;
	}

	expired(): boolean {
		return Date.now() > this.expiry;
	}
}

interface CacheEntries {
	[userId: string]: CacheEntry;
}

export class DefaultPresenceCache implements PresenceCache {
	private static readonly defaultTimeout: number = 20000;
	private static readonly defaultFlushTrigger: number = 50;
	private cache: CacheEntries;
	private size: number;
	private expiryInMillis: number;
	private flushTrigger: number;

	constructor(cacheTimeout?: number, cacheTrigger?: number) {
		this.expiryInMillis = cacheTimeout ? cacheTimeout : DefaultPresenceCache.defaultTimeout;
		this.flushTrigger = cacheTrigger ? cacheTrigger : DefaultPresenceCache.defaultFlushTrigger;
		this.cache = {};
		this.size = 0;
	}

	/**
	 * Precondition: _delete is only called internally if userId exists in cache
	 * Removes cache entry
	 * @param userId
	 */
	private _delete(userId: string): void {
		delete this.cache[userId];
		this.size--;
	}

	/**
	 * Checks a cache entry and calls delete if the info has expired
	 * @param userId
	 */
	private _deleteIfExpired(userId: string): void {
		if (this.contains(userId) && this.cache[userId].expired()) {
			this._delete(userId);
		}
	}

	/**
	 * Cleans expired entries from cache
	 */
	private _removeExpired(): void {
		Object.keys(this.cache).forEach((id) => {
			this._deleteIfExpired(id);
		});
	}

	/**
	 * Checks if a user exists in the cache
	 * @param userId
	 */
	contains(userId: string): boolean {
		return this.cache.hasOwnProperty(userId);
	}

	/**
	 * Retrieves a presence from the cache after checking for expired entries
	 * @param userId - to index the cache
	 * @returns Presence - the presence that matches the userId
	 */
	get(userId: string): Presence {
		this._deleteIfExpired(userId);
		if (!this.contains(userId)) {
			return {};
		}
		return this.cache[userId].presence;
	}

	/**
	 * Retrieve multiple presences at once from the cache
	 * @param userIds - to index the cache
	 * @returns PresenceMap - A map of userIds to cached Presences
	 */
	getBulk(userIds: string[]): PresenceMap {
		const presences: PresenceMap = {};
		for (const userId of userIds) {
			if (this.contains(userId)) {
				presences[userId] = this.get(userId);
			}
		}
		return presences;
	}

	/**
	 * For a given list of ids, returns a subset
	 * of all the ids with missing cache entries.
	 * @param userIds - to index the cache
	 * @returns string[] - ids missing from the cache
	 */
	getMissingUserIds(userIds: string[]): string[] {
		return userIds.filter((id) => !this.contains(id));
	}

	/**
	 * Precondition: presMap only contains ids of users not in cache
	 *               expired users must first be removed then reinserted with updated presence
	 * Updates the cache by adding the new Presence entries and setting the expiry time
	 * @param presMap
	 */
	update(presMap: PresenceMap): void {
		if (this.size >= this.flushTrigger) {
			this._removeExpired();
		}
		Object.keys(presMap).forEach((userId) => {
			this.cache[userId] = new CacheEntry(presMap[userId], this.expiryInMillis);
			this.size++;
		});
	}
}
