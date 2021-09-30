import {
  KeyValues,
  utils as serviceUtils,
} from '@atlaskit/util-service-support';

import {
  AnalyticsCallback,
  ErrorCallback,
  InfoCallback,
  InviteExperimentCohort,
  InviteFlow,
  isAppMention,
  isTeamMention,
  MentionContextIdentifier,
  MentionDescription,
  MentionNameDetails,
  MentionNameStatus,
  MentionProvider,
  MentionResourceConfig,
  MentionsResult,
  MentionStats,
  ResourceProvider,
  ResultCallback,
  UserRole,
} from '../types';
import debug from '../util/logger';

const MAX_QUERY_ITEMS = 100;
const MAX_NOTIFIED_ITEMS = 20;

export type {
  MentionStats,
  ResultCallback,
  ErrorCallback,
  InfoCallback,
  MentionResourceConfig,
  ResourceProvider,
  MentionContextIdentifier,
  MentionProvider,
} from '../types'; // Re-exporting types to prevent breaking change
// Re-exporting types to prevent breaking change

import { SLI_EVENT_TYPE, Actions, SliNames } from '../util/analytics';
import debounce from 'lodash/debounce';

export interface TeamMentionResourceConfig extends MentionResourceConfig {
  teamLinkResolver?: (teamId: string) => string;
  teamHighlightEnabled?: boolean;
  createTeamPath?: string;
}

export interface TeamMentionProvider extends MentionProvider {
  mentionTypeaheadHighlightEnabled: () => boolean;
  mentionTypeaheadCreateTeamPath: () => string | undefined;
}

/**
 * Support
 */
export interface ResolvingMentionProvider extends MentionProvider {
  resolveMentionName(
    id: string,
  ): Promise<MentionNameDetails> | MentionNameDetails;
  cacheMentionName(id: string, mentionName: string): void;
  supportsMentionNameResolving(): boolean;
}

const emptySecurityProvider = () => {
  return {
    params: {},
    headers: {},
  };
};

type SearchResponse = {
  mentions: Promise<MentionsResult>;
};

class AbstractResource<Result> implements ResourceProvider<Result> {
  protected changeListeners: Map<string, ResultCallback<Result>>;
  protected errListeners: Map<string, ErrorCallback>;
  protected infoListeners: Map<string, InfoCallback>;
  protected allResultsListeners: Map<string, ResultCallback<Result>>;
  protected analyticsListeners: Map<string, AnalyticsCallback>;

  constructor() {
    this.changeListeners = new Map<string, ResultCallback<Result>>();
    this.allResultsListeners = new Map<string, ResultCallback<Result>>();
    this.errListeners = new Map<string, ErrorCallback>();
    this.infoListeners = new Map<string, InfoCallback>();
    this.analyticsListeners = new Map<string, AnalyticsCallback>();
  }

  subscribe(
    key: string,
    callback?: ResultCallback<Result>,
    errCallback?: ErrorCallback,
    infoCallback?: InfoCallback,
    allResultsCallback?: ResultCallback<Result>,
    analyticsListeners?: AnalyticsCallback,
  ): void {
    if (callback) {
      this.changeListeners.set(key, callback);
    }
    if (errCallback) {
      this.errListeners.set(key, errCallback);
    }
    if (infoCallback) {
      this.infoListeners.set(key, infoCallback);
    }
    if (allResultsCallback) {
      this.allResultsListeners.set(key, allResultsCallback);
    }
    if (analyticsListeners) {
      this.analyticsListeners.set(key, analyticsListeners);
    }
  }

  unsubscribe(key: string): void {
    this.changeListeners.delete(key);
    this.errListeners.delete(key);
    this.infoListeners.delete(key);
    this.allResultsListeners.delete(key);
    this.analyticsListeners.delete(key);
  }
}

class AbstractMentionResource
  extends AbstractResource<MentionDescription[]>
  implements MentionProvider {
  shouldHighlightMention(_mention: MentionDescription): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  filter(query?: string): void {
    throw new Error(`not yet implemented.\nParams: query=${query}`);
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  recordMentionSelection(_mention: MentionDescription): void {
    // Do nothing
  }

  isFiltering(_query: string): boolean {
    return false;
  }

  protected _notifyListeners(
    mentionsResult: MentionsResult,
    stats?: MentionStats,
  ): void {
    debug(
      'ak-mention-resource._notifyListeners',
      mentionsResult &&
        mentionsResult.mentions &&
        mentionsResult.mentions.length,
      this.changeListeners,
    );

    this.changeListeners.forEach((listener, key) => {
      try {
        listener(
          mentionsResult.mentions.slice(0, MAX_NOTIFIED_ITEMS),
          mentionsResult.query,
          stats,
        );
      } catch (e) {
        // ignore error from listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }

  protected _notifyAllResultsListeners(mentionsResult: MentionsResult): void {
    debug(
      'ak-mention-resource._notifyAllResultsListeners',
      mentionsResult &&
        mentionsResult.mentions &&
        mentionsResult.mentions.length,
      this.changeListeners,
    );

    this.allResultsListeners.forEach((listener, key) => {
      try {
        listener(
          mentionsResult.mentions.slice(0, MAX_NOTIFIED_ITEMS),
          mentionsResult.query,
        );
      } catch (e) {
        // ignore error from listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }

  protected _notifyErrorListeners(error: Error, query?: string): void {
    this.errListeners.forEach((listener, key) => {
      try {
        listener(error, query);
      } catch (e) {
        // ignore error from listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }

  protected _notifyInfoListeners(info: string): void {
    this.infoListeners.forEach((listener, key) => {
      try {
        listener(info);
      } catch (e) {
        // ignore error fromr listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }

  protected _notifyAnalyticsListeners(
    event: string,
    actionSubject: string,
    action: string,
    attributes?: {
      [key: string]: any;
    },
  ): void {
    this.analyticsListeners.forEach((listener, key) => {
      try {
        listener(event, actionSubject, action, attributes);
      } catch (e) {
        // ignore error from listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }
}

/**
 * Provides a Javascript API
 */
export class MentionResource
  extends AbstractMentionResource
  implements ResolvingMentionProvider {
  private config: MentionResourceConfig;
  private lastReturnedSearch: number;
  private activeSearches: Set<string>;

  productName?: string;
  shouldEnableInvite: boolean;
  inviteExperimentCohort?: InviteExperimentCohort;
  userRole: UserRole;
  onInviteItemClick?: (flow: InviteFlow) => void;

  constructor(config: MentionResourceConfig) {
    super();

    this.verifyMentionConfig(config);

    this.config = config;
    this.lastReturnedSearch = 0;
    this.activeSearches = new Set();
    this.productName = config.productName;
    this.shouldEnableInvite = !!config.shouldEnableInvite;
    this.inviteExperimentCohort = config.inviteExperimentCohort;
    this.onInviteItemClick = config.onInviteItemClick;
    this.userRole = config.userRole || 'basic';
    if (this.config.debounceTime) {
      this.filter = debounce(this.filter, this.config.debounceTime);
    }
  }

  shouldHighlightMention(mention: MentionDescription) {
    if (this.config.shouldHighlightMention) {
      return this.config.shouldHighlightMention(mention);
    }

    return false;
  }

  notify(searchTime: number, mentionResult: MentionsResult, query?: string) {
    if (searchTime > this.lastReturnedSearch) {
      this.lastReturnedSearch = searchTime;
      this._notifyListeners(mentionResult, {
        duration: Date.now() - searchTime,
      });
    } else {
      const date = new Date(searchTime).toISOString().substr(17, 6);
      debug('Stale search result, skipping', date, query); // eslint-disable-line no-console, max-len
    }

    this._notifyAllResultsListeners(mentionResult);
  }

  notifyError(error: Error, query?: string) {
    this._notifyErrorListeners(error, query);
    if (query) {
      this.activeSearches.delete(query);
    }
  }

  async filter(
    query?: string,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<void> {
    try {
      const searchTime = Date.now();
      let results;
      if (!query) {
        results = await this.initialState(contextIdentifier);
      } else {
        this.activeSearches.add(query);
        const searchResponse = this.search(query, contextIdentifier);
        results = await searchResponse.mentions;
      }

      this.notify(searchTime, results, query);
    } catch (error) {
      this.notifyError(error, query);
    }
  }

  recordMentionSelection(
    mention: MentionDescription,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<void> {
    return this.recordSelection(mention, contextIdentifier).then(
      () => {},
      (error) => debug(`error recording mention selection: ${error}`, error),
    );
  }

  isFiltering(query: string): boolean {
    return this.activeSearches.has(query);
  }

  resolveMentionName(
    id: string,
  ): Promise<MentionNameDetails> | MentionNameDetails {
    if (!this.config.mentionNameResolver) {
      return {
        id,
        name: '',
        status: MentionNameStatus.UNKNOWN,
      };
    }
    return this.config.mentionNameResolver.lookupName(id);
  }

  cacheMentionName(id: string, mentionName: string): void {
    if (!this.config.mentionNameResolver) {
      return;
    }
    this.config.mentionNameResolver.cacheName(id, mentionName);
  }

  supportsMentionNameResolving(): boolean {
    return !!this.config.mentionNameResolver;
  }

  protected updateActiveSearches(query: string): void {
    this.activeSearches.add(query);
  }

  protected verifyMentionConfig(config: MentionResourceConfig) {
    if (!config.url) {
      throw new Error('config.url is a required parameter');
    }

    if (!config.securityProvider) {
      config.securityProvider = emptySecurityProvider;
    }
  }

  private initialState(
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    return this.remoteInitialState(contextIdentifier);
  }

  /**
   * Clear a context object to generate query params by removing empty
   * strings, `undefined` and empty values.
   *
   * @param contextIdentifier the current context identifier
   * @returns a safe context for query encoding
   */
  private clearContext(
    contextIdentifier: MentionContextIdentifier = {},
  ): MentionContextIdentifier {
    return (Object.keys(contextIdentifier) as Array<
      keyof MentionContextIdentifier
    >)
      .filter((key) => contextIdentifier[key])
      .reduce(
        (context, key) => ({
          [key]: contextIdentifier[key],
          ...context,
        }),
        {},
      );
  }

  private getQueryParams(
    contextIdentifier?: MentionContextIdentifier,
  ): KeyValues {
    const configParams: KeyValues = {};

    if (this.config.containerId) {
      configParams['containerId'] = this.config.containerId;
    }

    if (this.config.productId) {
      configParams['productIdentifier'] = this.config.productId;
    }

    // if contextParams exist then it will override configParams for containerId
    return { ...configParams, ...this.clearContext(contextIdentifier) };
  }

  /**
   * Returns the initial mention display list before a search is performed for the specified
   * container.
   *
   * @param contextIdentifier
   * @returns Promise
   */
  protected async remoteInitialState(
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    const queryParams: KeyValues = this.getQueryParams(contextIdentifier);
    const options = {
      path: 'bootstrap',
      queryParams,
    };
    try {
      const result = await serviceUtils.requestService<MentionsResult>(
        this.config,
        options,
      );
      this._notifyAnalyticsListeners(
        SLI_EVENT_TYPE,
        SliNames.INITIAL_STATE,
        Actions.SUCCEEDED,
      );
      return this.transformServiceResponse(result, '');
    } catch (error) {
      this._notifyAnalyticsListeners(
        SLI_EVENT_TYPE,
        SliNames.INITIAL_STATE,
        Actions.FAILED,
      );
      throw error;
    }
  }

  private search(
    query: string,
    contextIdentifier?: MentionContextIdentifier,
  ): SearchResponse {
    return {
      mentions: this.remoteSearch(query, contextIdentifier),
    };
  }

  protected async remoteSearch(
    query: string,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    const options = {
      path: 'search',
      queryParams: {
        query,
        limit: MAX_QUERY_ITEMS,
        ...this.getQueryParams(contextIdentifier),
      },
    };
    try {
      const result = await serviceUtils.requestService<MentionsResult>(
        this.config,
        options,
      );
      this._notifyAnalyticsListeners(
        SLI_EVENT_TYPE,
        SliNames.SEARCH,
        Actions.SUCCEEDED,
      );
      return this.transformServiceResponse(result, query);
    } catch (error) {
      this._notifyAnalyticsListeners(
        SLI_EVENT_TYPE,
        SliNames.SEARCH,
        Actions.FAILED,
      );
      throw error;
    }
  }

  private transformServiceResponse(
    result: MentionsResult,
    query: string,
  ): MentionsResult {
    const mentions = result.mentions.map((mention) => {
      let lozenge: string | undefined;
      if (isAppMention(mention)) {
        lozenge = mention.userType;
      } else if (isTeamMention(mention)) {
        lozenge = mention.userType;
      }

      return { ...mention, lozenge, query };
    });

    return { ...result, mentions, query: result.query || query };
  }

  async recordSelection(
    mention: MentionDescription,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<void> {
    const options = {
      path: 'record',
      queryParams: {
        selectedUserId: mention.id,
        ...this.getQueryParams(contextIdentifier),
      },
      requestInit: {
        method: 'POST',
      },
    };
    const sliName = isTeamMention(mention)
      ? SliNames.SELECT_TEAM
      : SliNames.SELECT;
    try {
      const result = await serviceUtils.requestService<void>(
        this.config,
        options,
      );
      this._notifyAnalyticsListeners(
        SLI_EVENT_TYPE,
        sliName,
        Actions.SUCCEEDED,
      );
      return result;
    } catch (error) {
      this._notifyAnalyticsListeners(SLI_EVENT_TYPE, sliName, Actions.FAILED);
      throw error;
    }
  }
}

export class HttpError implements Error {
  name: string;
  message: string;
  statusCode: number;
  stack?: string;

  constructor(statusCode: number, statusMessage: string) {
    this.statusCode = statusCode;
    this.message = statusMessage;
    this.name = 'HttpError';
    this.stack = new Error().stack;
  }
}

export const isResolvingMentionProvider = (
  p: any,
): p is ResolvingMentionProvider =>
  !!(
    p &&
    (<ResolvingMentionProvider>p).supportsMentionNameResolving &&
    p.supportsMentionNameResolving()
  );

export { AbstractResource, AbstractMentionResource };
export default MentionResource;
