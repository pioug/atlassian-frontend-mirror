import {
  SMART_EVENT_TYPE,
  Actions,
  getUsersForAnalytics,
  defaultAttributes,
} from './analytics';
import getUserRecommendations from './recommendationClient';
import { setEnv } from '../config';

import {
  EntityType,
  RecommendationItem,
  UserRecommendation,
  MemberItem,
  TeamRecommendation,
  GroupRecommendation,
} from './SmartMentionTypes';
import {
  MentionContextIdentifier,
  MentionsResult,
  MentionDescription,
  TeamMember,
  UserAccessLevel,
  UserType as MentionUserType,
  MentionNameDetails,
  MentionNameResolver,
} from '../types';

import { AbstractMentionResource, ResolvingMentionProvider } from '../resource';
import { DefaultMentionNameResolver } from '../default-mention-name-resolver/default-mention-name-resolver';

const CONTEXT_TYPE = 'Mentions';

export interface SmartMentionConfig {
  baseUrl?: string;
  /**
   * Use 'prod' for setting the env to a Stargate-supported endpoint
   */
  env?: 'prod' | 'local';
  /**
   * Defaults to 'Context', which will extract the principalId from the
   * JWT header.
   */
  principalId?: string;
  /**
   * Platform search is only available for certain products. Please
   * reach out to #help-smart-experiences to check.
   * Use productKey='people' if you are waiting for a product scope.
   */
  productKey: string;
  /**
   * Lucene-type query to proxy onto the search service.
   */
  searchQueryFilter?: string;
  /**
   * AKA tenantId/cloudId.
   */
  siteId: string;
  /**
   * Resolves a team's ID to the team name.
   */
  teamLinkResolver?: (teamId: string) => string;
  includeUsers?: boolean;
  includeTeams?: boolean;
  includeGroups?: boolean;
  mentionNameResolver?: MentionNameResolver;
  /**
   * Function to determine whether to highlight the mention result.
   */
  shouldHighlightMention?: (mention: MentionDescription) => boolean;
  /**
   * Max number of results to show in the suggestions list.
   */
  maxNumberOfResults?: number;
}

interface SmartMentionConfigWithMentionNameResolver extends SmartMentionConfig {
  mentionNameResolver: MentionNameResolver;
}

const isSmartMentionConfigWithMentionNameResolver = (
  smartMentionConfig: SmartMentionConfig,
): smartMentionConfig is SmartMentionConfigWithMentionNameResolver =>
  !!smartMentionConfig.mentionNameResolver;
/*
 * This is a provider implementation which calls URS to provide a list of recommended users/teams to mention.
 * The entryPoint hierarchy is : Editor -> editor-core -> plugins -> mentions -> typeAhead -> getItems -> pluginState.pluginProvider.filter
 * The results are then mapped to mentionItems which have a render prop mentionToTypeaheadItem -> MentionItem
 * https://bitbucket.org/atlassian/atlassian-frontend/src/0884032d85f11f43c13532cd21f13f696b0d28a7/packages/editor/editor-core/src/plugins/mentions/index.tsx#lines-219
 *
 */
class SmartMentionResource
  extends AbstractMentionResource
  implements ResolvingMentionProvider {
  private smartMentionConfig: SmartMentionConfigWithMentionNameResolver;
  private lastReturnedSearch: number;
  private contextIdentifier?: MentionContextIdentifier;

  constructor(smartMentionConfig: SmartMentionConfig) {
    super();

    // If the product doesn't provide a mention name resolve, use the default resolver so that
    // mention names can be looked up from PRS without configuration.
    this.smartMentionConfig = isSmartMentionConfigWithMentionNameResolver(
      smartMentionConfig,
    )
      ? smartMentionConfig
      : {
          ...smartMentionConfig,
          mentionNameResolver: new DefaultMentionNameResolver(
            smartMentionConfig.baseUrl,
          ),
        };
    this.lastReturnedSearch = 0;

    // Set the environment used for mention lookup API calls (defaults to production)
    if (smartMentionConfig.env) {
      setEnv(smartMentionConfig.env);
    }
  }

  shouldHighlightMention(mention: MentionDescription) {
    if (this.smartMentionConfig.shouldHighlightMention) {
      return this.smartMentionConfig.shouldHighlightMention(mention);
    }
    return false;
  }

  notify(searchTime: number, mentionResult: MentionsResult, query?: string) {
    if (searchTime > this.lastReturnedSearch) {
      this.lastReturnedSearch = searchTime;
      this._notifyListeners(mentionResult, {
        duration: Date.now() - searchTime,
      });
    }

    this._notifyAllResultsListeners(mentionResult);
  }

  notifyError(error: Error, query?: string) {
    this._notifyErrorListeners(error, query);
  }

  async filter(
    query?: string,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<void> {
    this.contextIdentifier = contextIdentifier;
    const searchTime = Date.now();
    try {
      let results = await this.getRecommendedMentions(
        query ? query : '',
        contextIdentifier,
      );
      this.notify(searchTime, results, query);
    } catch (error) {
      this.notifyError(error, query);
    }
  }

  async getRecommendedMentions(
    query: string,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    const startTime = window.performance.now();
    const conf = this.smartMentionConfig;
    const maxNumberOfResults = conf.maxNumberOfResults || 100;

    const request = {
      baseUrl: conf.baseUrl,
      context: {
        ...conf,
        contextType: CONTEXT_TYPE,
        principalId: conf.principalId || 'context',
        containerId: contextIdentifier && contextIdentifier.containerId,
        objectId:
          (contextIdentifier && contextIdentifier.objectId) || 'undefined',
        childObjectId:
          (contextIdentifier && contextIdentifier.childObjectId) || 'undefined',
        mentionsSessionId:
          (contextIdentifier && contextIdentifier.sessionId) || 'undefined',
        sessionId:
          (contextIdentifier && contextIdentifier.sessionId) || 'undefined',
      },
      includeUsers:
        typeof conf.includeUsers === 'undefined' ? true : conf.includeUsers,
      maxNumberOfResults: maxNumberOfResults,
      query,
    };
    try {
      this._notifyAnalyticsListeners(
        SMART_EVENT_TYPE,
        'users',
        Actions.REQUESTED,
        defaultAttributes(contextIdentifier),
      );
      const users = await getUserRecommendations(request);
      const elapsedTimeMilli = window.performance.now() - startTime;
      const usersForAnalytics = getUsersForAnalytics(users);
      this._notifyAnalyticsListeners(
        SMART_EVENT_TYPE,
        'usersRequest',
        Actions.SUCCESSFUL,
        {
          elapsedTimeMilli: elapsedTimeMilli,
          users: usersForAnalytics,
          displayedUsers: usersForAnalytics,
          ...defaultAttributes(contextIdentifier),
        },
      );
      const mentions = this.transformUsersToMentions(users);
      return { mentions, query };
    } catch (e) {
      const elapsedTimeMilli = window.performance.now() - startTime;

      this._notifyAnalyticsListeners(
        SMART_EVENT_TYPE,
        'usersRequest',
        Actions.FAILED,
        {
          elapsedTimeMilli: elapsedTimeMilli,
          ...defaultAttributes(contextIdentifier),
        },
      );
      throw new Error(e);
    }
  }

  private transformTeamMember(member: MemberItem): TeamMember {
    return {
      id: member.id,
      name: member.name,
    };
  }

  private transformUserToMention(item: RecommendationItem): MentionDescription {
    const type = item.entityType;
    let defaultVals = {
      source: 'smarts',
    };
    if (type === EntityType.USER) {
      const user = item as UserRecommendation;
      return {
        ...defaultVals,
        id: user.id,
        accessLevel: user.accessLevel,
        avatarUrl: user.avatarUrl,
        mentionName: user.nickname || '',
        name: user.name,
        userType: user.userType,
      };
    }

    if (type === EntityType.TEAM) {
      const team = item as TeamRecommendation;
      let teamLink = '';
      const defaultTeamLink = `${window.location.origin}/people/team/${team.id}`;
      if (typeof this.smartMentionConfig.teamLinkResolver === 'function') {
        teamLink = this.smartMentionConfig.teamLinkResolver(item.id);
      }

      return {
        ...defaultVals,
        id: team.id,
        name: team.displayName || '',
        mentionName: team.displayName,
        avatarUrl: team.smallAvatarImageUrl,
        accessLevel: UserAccessLevel[UserAccessLevel.CONTAINER],
        userType: MentionUserType[MentionUserType.TEAM],
        lozenge: MentionUserType[MentionUserType.TEAM],
        context: {
          members: team.members
            ? team.members.map(this.transformTeamMember)
            : [],
          includesYou: team.includesYou || false,
          memberCount: team.memberCount || 0,
          teamLink: teamLink || defaultTeamLink, //OOH HERE Do we pass in resolver or add in provider?
        },
        source: 'smarts',
      };
    }

    if (type === EntityType.GROUP) {
      const group = item as GroupRecommendation;
      return {
        ...defaultVals,
        id: group.id,
        userType: type.toLowerCase(),
        name: group.name || '',
        lozenge: type.toLowerCase(),
      };
    }

    return {
      id: item.id,
      userType: EntityType.USER.toLowerCase(),
      avatarUrl: item.avatarUrl,
      name: item.name,
      lozenge: EntityType.USER.toLowerCase(),
    };
  }

  private transformUsersToMentions(
    recommendationItems: RecommendationItem[],
  ): MentionDescription[] {
    return (recommendationItems || [])
      .map(this.transformUserToMention, this)
      .filter((user) => !!user)
      .map((user) => user as MentionDescription);
  }

  cacheMentionName(id: string, mentionName: string): void {
    this.smartMentionConfig.mentionNameResolver.cacheName(id, mentionName);
  }

  resolveMentionName(
    id: string,
  ): Promise<MentionNameDetails> | MentionNameDetails {
    return this.smartMentionConfig.mentionNameResolver.lookupName(id);
  }

  supportsMentionNameResolving(): boolean {
    return true;
  }

  recordMentionSelection(_mention: MentionDescription): void {
    this._notifyAnalyticsListeners(
      SMART_EVENT_TYPE,
      'usersRequest',
      Actions.SELECTED,
      {
        selectedOption: _mention.id,
        ...defaultAttributes(this.contextIdentifier),
      },
    );
  }
}

export default SmartMentionResource;
