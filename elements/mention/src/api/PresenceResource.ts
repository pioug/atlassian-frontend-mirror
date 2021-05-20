import { Presence } from '../types';
import debug from '../util/logger';
import { AbstractResource, ResourceProvider } from './MentionResource';

export interface PresenceMap {
  [userId: string]: Presence;
}

export interface PresenceResourceConfig {
  url: string;
  cloudId: string;
  productId?: string;
  cache?: PresenceCache;
  cacheExpiry?: number;
  parser?: PresenceParser;
}

export interface PresenceCache {
  contains(userId: string): boolean;
  get(userId: string): Presence;
  getBulk(userIds: string[]): PresenceMap;
  getMissingUserIds(userIds: string[]): string[];
  update(presUpdate: PresenceMap): void;
}

export interface PresenceResponse {
  data: Data;
}

export interface Data {
  PresenceBulk: PresenceBulk[];
}

export interface PresenceBulk {
  userId: string;
  state: null | string;
  type: null | string;
  date: null | string;
  message: null | string;
  stateMetadata?: string;
}

type Query = {
  query: string;
  variables: {
    [key: string]: any;
  };
};

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

export interface PresenceParser {
  mapState(state: string): string;
  parse(response: PresenceResponse): PresenceMap;
}

export interface PresenceProvider extends ResourceProvider<PresenceMap> {
  refreshPresence(userIds: string[]): void;
}

class AbstractPresenceResource
  extends AbstractResource<PresenceMap>
  implements PresenceProvider {
  refreshPresence(userIds: string[]): void {
    throw new Error(`not yet implemented.\nParams: userIds=${userIds}`);
  }

  protected notifyListeners(presences: PresenceMap): void {
    this.changeListeners.forEach((listener, key) => {
      try {
        listener(presences);
      } catch (e) {
        // ignore error from listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }
}

class PresenceResource extends AbstractPresenceResource {
  private config: PresenceResourceConfig;
  private presenceCache: PresenceCache;
  private presenceParser: PresenceParser;

  constructor(config: PresenceResourceConfig) {
    super();

    if (!config.url) {
      throw new Error('config.url is a required parameter');
    }

    if (!config.cloudId) {
      throw new Error('config.cloudId is a required parameter');
    }

    this.config = config;
    this.config.url = PresenceResource.cleanUrl(config.url);
    this.presenceCache =
      config.cache || new DefaultPresenceCache(config.cacheExpiry);
    this.presenceParser = config.parser || new DefaultPresenceParser();
  }

  refreshPresence(userIds: string[]): void {
    const cacheHits = this.presenceCache.getBulk(userIds);
    this.notifyListeners(cacheHits);
    const cacheMisses = this.presenceCache.getMissingUserIds(userIds);

    if (cacheMisses.length) {
      this.retrievePresence(cacheMisses);
    }
  }

  private retrievePresence(userIds: string[]) {
    this.queryDirectoryForPresences(userIds)
      .then((res) => this.presenceParser.parse(res))
      .then((presences) => {
        this.notifyListeners(presences);
        this.presenceCache.update(presences);
      });
  }

  private queryDirectoryForPresences(
    userIds: string[],
  ): Promise<PresenceResponse> {
    const query: Query = {
      query: `query getPresenceForMentions($organizationId: String!, $userIds: [String!], $productId: String) {
                PresenceBulk(organizationId: $organizationId, product: $productId, userIds: $userIds) {
                  userId
                  state
                  stateMetadata
                }
              }`,
      variables: {
        organizationId: this.config.cloudId,
        userIds: userIds,
      },
    };
    if (this.config.productId) {
      query.variables['productId'] = this.config.productId;
    }

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(query),
    };
    return fetch(this.config.url, options).then((response) => response.json());
  }

  private static cleanUrl(url: string): string {
    if (url.substr(-1) !== '/') {
      url += '/';
    }
    return url;
  }
}

export class DefaultPresenceCache implements PresenceCache {
  private static readonly defaultTimeout: number = 20000;
  private static readonly defaultFlushTrigger: number = 50;
  private cache: CacheEntries;
  private size: number;
  private expiryInMillis: number;
  private flushTrigger: number;

  constructor(cacheTimeout?: number, cacheTrigger?: number) {
    this.expiryInMillis = cacheTimeout
      ? cacheTimeout
      : DefaultPresenceCache.defaultTimeout;
    this.flushTrigger = cacheTrigger
      ? cacheTrigger
      : DefaultPresenceCache.defaultFlushTrigger;
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

export class DefaultPresenceParser implements PresenceParser {
  static FOCUS_STATE = 'focus';

  mapState(state: string): string {
    if (state === 'unavailable') {
      return 'offline';
    } else if (state === 'available') {
      return 'online';
    } else {
      return state;
    }
  }

  parse(response: PresenceResponse): PresenceMap {
    const presences: PresenceMap = {};
    if (
      response.hasOwnProperty('data') &&
      response['data'].hasOwnProperty('PresenceBulk')
    ) {
      const results = response['data'].PresenceBulk;
      // Store map of state and time indexed by userId.  Ignore null results.
      for (const user of results) {
        if (user.userId && user.state) {
          const state = DefaultPresenceParser.extractState(user) || user.state;
          presences[user.userId] = {
            status: this.mapState(state),
          };
        } else if (
          !user.hasOwnProperty('userId') ||
          !user.hasOwnProperty('state')
        ) {
          // eslint-disable-next-line no-console
          console.error(
            'Unexpected response from presence service contains keys: ' +
              Object.keys(user),
          );
        }
      }
    }
    return presences;
  }

  private static extractState(presence: PresenceBulk): string | null {
    if (DefaultPresenceParser.isFocusState(presence)) {
      return DefaultPresenceParser.FOCUS_STATE;
    }
    return presence.state;
  }

  /*
    This is a bit of an odd exception. In the case where a user is in "Focus Mode", their presence state
    is returned as 'busy' along with a `stateMetadata` object containing a `focus` field.
    In this case we ignore the value of the `state` field and treat the presence as a 'focus' state.
   */
  private static isFocusState(presence: PresenceBulk): boolean {
    if (presence.stateMetadata) {
      try {
        const metadata = JSON.parse(presence.stateMetadata);
        return metadata && !!metadata.focus;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(
          `Failed to parse presence's stateMetadata for user with id ${presence.userId}: ${presence.stateMetadata}`,
        );
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
    return false;
  }
}

export { AbstractPresenceResource };
export default PresenceResource;
