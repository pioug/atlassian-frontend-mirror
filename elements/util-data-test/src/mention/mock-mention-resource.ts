import { Search } from 'js-search';

import {
  MentionDescription,
  MentionsResult,
  AbstractMentionResource,
  MentionNameResolver,
  ResolvingMentionProvider,
  MentionNameDetails,
  MentionNameStatus,
  TeamMentionProvider,
  SLI_EVENT_TYPE,
} from '@atlaskit/mention/resource';
import {
  InviteExperimentCohort,
  InviteFlow,
  UserRole,
} from '@atlaskit/mention';
import debug from '../logger';
import { mentionTestResult } from './mention-test-data';
import { HttpError } from './utils';

export interface MockMentionConfig {
  minWait?: number;
  maxWait?: number;
  mentionNameResolver?: MentionNameResolver;
  enableTeamMentionHighlight?: boolean;
  inviteExperimentCohort?: InviteExperimentCohort;
  productName?: string;
  shouldEnableInvite?: boolean;
  onInviteItemClick?: (flow: InviteFlow) => void;
  userRole?: UserRole;
}

export class MockMentionResource
  extends AbstractMentionResource
  implements ResolvingMentionProvider, TeamMentionProvider {
  private config: MockMentionConfig;
  private lastReturnedSearch: number;
  private search: Search = new Search('id');

  productName?: string;
  shouldEnableInvite: boolean;
  userRole: UserRole;
  inviteExperimentCohort?: InviteExperimentCohort;
  onInviteItemClick?: (flow: InviteFlow) => void;

  constructor(config: MockMentionConfig) {
    super();

    this.search.addIndex('name');
    this.search.addIndex('mentionName');
    this.search.addIndex('nickname');
    this.search.addDocuments(mentionTestResult);

    this.config = config;
    this.lastReturnedSearch = 0;
    this.productName = config.productName;
    this.shouldEnableInvite = !!config.shouldEnableInvite;
    this.inviteExperimentCohort = config.inviteExperimentCohort;
    this.onInviteItemClick = config.onInviteItemClick;
    this.userRole = config.userRole || 'basic';
  }

  filter(query: string): Promise<void> {
    const searchTime = Date.now();
    const notify = (mentions: MentionsResult) => {
      if (searchTime >= this.lastReturnedSearch) {
        this.lastReturnedSearch = searchTime;
        let stats: { teamMentionDuration?: number; duration?: number } = {};
        if (query === 'team') {
          stats.teamMentionDuration = 200;
        } else {
          stats.duration = 100;
        }
        this._notifyListeners(mentions, stats);
      } else {
        const date = new Date(searchTime).toISOString().substr(17, 6);
        debug('Stale search result, skipping', date, query); // eslint-disable-line no-console, max-len
      }
      this._notifyAllResultsListeners(mentions);
    };

    const notifyErrors = (error: Error) => {
      this._notifyErrorListeners(error);
    };

    const notifyAnalytics = (
      eventType: string,
      sliName: string,
      action: string,
    ) => {
      this._notifyAnalyticsListeners(eventType, sliName, action);
    };

    const minWait = this.config.minWait || 0;
    const randomTime = (this.config.maxWait || 0) - minWait;
    const waitTime = Math.random() * randomTime + minWait;
    setTimeout(() => {
      let mentions;
      if (query === 'error') {
        notifyErrors(new Error('mock-error'));
        notifyAnalytics(SLI_EVENT_TYPE, 'searchUser', 'failed');
        return;
      } else if (query === '401' || query === '403') {
        notifyErrors(new HttpError(parseInt(query, 10), 'get off my lawn'));
        notifyAnalytics(SLI_EVENT_TYPE, 'searchUser', 'failed');
        return;
      } else if (query) {
        mentions = this.search.search(query);
      } else {
        mentions = mentionTestResult;
      }
      notify({ mentions, query });
      notifyAnalytics(SLI_EVENT_TYPE, 'searchUser', 'succeeded');
    }, waitTime + 1);
    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  recordMentionSelection(mention: MentionDescription): void {
    debug(`Record mention selection ${mention.id}`);
  }

  resolveMentionName(
    id: string,
  ): Promise<MentionNameDetails> | MentionNameDetails {
    debug('(mock)resolveMentionName', id);
    if (!this.config.mentionNameResolver) {
      return {
        id,
        name: '',
        status: MentionNameStatus.UNKNOWN,
      };
    }
    return this.config.mentionNameResolver.lookupName(id);
  }

  cacheMentionName(id: string, name: string) {
    debug('(mock)cacheMentionName', id, name);
    if (this.config.mentionNameResolver) {
      this.config.mentionNameResolver.cacheName(id, name);
    }
  }

  supportsMentionNameResolving() {
    const supported = !!this.config.mentionNameResolver;
    debug('supportsMentionNameResolving', supported);
    return supported;
  }

  shouldHighlightMention(mention: MentionDescription): boolean {
    return mention.id === 'oscar';
  }

  mentionTypeaheadHighlightEnabled = () =>
    this.config.enableTeamMentionHighlight || false;

  mentionTypeaheadCreateTeamPath = () => '/people/search#createTeam';
}
