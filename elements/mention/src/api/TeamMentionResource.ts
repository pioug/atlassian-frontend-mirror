import { SLI_EVENT_TYPE, SliNames, Actions } from './../util/analytics';
import {
  KeyValues,
  utils as serviceUtils,
} from '@atlaskit/util-service-support';

import {
  MentionsResult,
  Team,
  UserType,
  UserAccessLevel,
  MentionDescription,
} from '../types';
import MentionResource, {
  MentionContextIdentifier,
  MentionResourceConfig,
  TeamMentionResourceConfig,
  TeamMentionProvider,
} from './MentionResource';
import debug from '../util/logger';

const MAX_QUERY_TEAMS = 20;

/**
 * Provides a Javascript API to fetch users and teams
 * In future we will have a new endpoint to return both users and teams, we can
 * remove this class at this point
 */
export default class TeamMentionResource
  extends MentionResource
  implements TeamMentionProvider {
  private readonly teamMentionConfig: TeamMentionResourceConfig;
  private lastSearchQuery?: string = '';
  private lastReturnedSearchTeam: number;

  constructor(
    userMentionConfig: MentionResourceConfig,
    teamMentionConfig: TeamMentionResourceConfig,
  ) {
    super(userMentionConfig);
    this.verifyMentionConfig(teamMentionConfig);
    this.teamMentionConfig = teamMentionConfig;
    this.lastReturnedSearchTeam = 0;
  }

  filter(
    query?: string,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<void> {
    this.lastSearchQuery = query;
    if (!query) {
      return this.remoteInitialStateTeamAndUsers(contextIdentifier);
    } else {
      this.updateActiveSearches(query);

      // both user and team requests start at the same time
      const getUserPromise = this.remoteUserSearch(query, contextIdentifier);
      const getTeamsPromise = this.remoteTeamSearch(query, contextIdentifier);
      return this.handleBothRequests(query, getUserPromise, getTeamsPromise);
    }
  }

  mentionTypeaheadHighlightEnabled = () =>
    this.teamMentionConfig.teamHighlightEnabled || false;

  mentionTypeaheadCreateTeamPath = () => this.teamMentionConfig.createTeamPath;

  /**
   * Returns the initial mention display list before a search is performed for the specified
   * container.
   */
  private async remoteInitialStateTeamAndUsers(
    contextIdentifier?: MentionContextIdentifier,
  ) {
    const emptyQuery = '';
    const getUserPromise = super.remoteInitialState(contextIdentifier);

    const queryParams: KeyValues = this.getQueryParamsOfTeamMentionConfig(
      contextIdentifier,
    );
    const options = {
      path: 'bootstrap',
      queryParams,
    };
    const getTeamsPromise = serviceUtils.requestService<Team[]>(
      this.teamMentionConfig,
      options,
    );

    this.handleBothRequests(emptyQuery, getUserPromise, getTeamsPromise);
  }

  /**
   * Both user and team requests are not blocked together
   * If users request arrives first, show users. Show teams when team request arrives.
   * If team request arrives first, block waiting for user request, then show both
   * If one errors, show the non-erroring one
   * If both error, show error
   */
  private async handleBothRequests(
    query: string,
    userRequest: Promise<MentionsResult>,
    teamRequest: Promise<Team[] | MentionsResult>,
  ): Promise<void> {
    const searchTime = Date.now();
    let accumulatedResults: MentionsResult = {
      mentions: [],
      query,
    };
    const notifyWhenOneRequestDone = (
      results: MentionsResult,
      hasTeamResults: boolean,
    ) => {
      // just update UI for the last query string
      if (query !== this.lastSearchQuery) {
        return;
      }
      accumulatedResults = {
        mentions: [...accumulatedResults.mentions, ...results.mentions],
        query,
      };

      // we need to calculate different `duration` for user and team request.
      if (hasTeamResults) {
        this.notify(searchTime, accumulatedResults, query);
      } else {
        super.notify(searchTime, accumulatedResults, query);
      }
    };

    let userResults;
    let userRequestError: Error | null = null;
    let teamRequestError: Error | null = null;
    try {
      // user requests finishes, update the UI, don't need to wait for team requests
      userResults = await userRequest;
      notifyWhenOneRequestDone(userResults, false);
    } catch (error) {
      userRequestError = error;
    }

    // team request will wait for user request done
    try {
      const teamsResult = await teamRequest;
      // update search time after team results returns
      notifyWhenOneRequestDone(
        Array.isArray(teamsResult)
          ? this.convertTeamResultToMentionResult(teamsResult, query)
          : teamsResult,
        true,
      );
    } catch (error) {
      teamRequestError = error;
    }

    // both requests fail, show one of errors in UI
    if (userRequestError && teamRequestError) {
      this.notifyError(userRequestError, query);
      debug('User mention request fails. ', userRequestError);
      debug('Team mention request fails. ', teamRequestError);
    }
  }

  notify(searchTime: number, mentionResult: MentionsResult, query?: string) {
    if (searchTime > this.lastReturnedSearchTeam) {
      this.lastReturnedSearchTeam = searchTime;
      this._notifyListeners(mentionResult, {
        teamMentionDuration: Date.now() - searchTime,
      });
    } else {
      const date = new Date(searchTime).toISOString().substr(17, 6);
      debug('Stale search result, skipping', date, query); // eslint-disable-line no-console, max-len
    }

    this._notifyAllResultsListeners(mentionResult);
  }

  private getQueryParamsOfTeamMentionConfig(
    contextIdentifier?: MentionContextIdentifier,
  ): KeyValues {
    const configParams: KeyValues = {};

    if (this.teamMentionConfig.containerId) {
      configParams['containerId'] = this.teamMentionConfig.containerId;
    }

    if (this.teamMentionConfig.productId) {
      configParams['productIdentifier'] = this.teamMentionConfig.productId;
    }

    // if contextParams exist then it will override configParams for containerId
    return { ...configParams, ...contextIdentifier };
  }

  private remoteUserSearch(
    query: string,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    return super.remoteSearch(query, contextIdentifier);
  }

  private async remoteTeamSearch(
    query: string,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    const options = {
      path: 'search',
      queryParams: {
        query,
        limit: MAX_QUERY_TEAMS,
        ...this.getQueryParamsOfTeamMentionConfig(contextIdentifier),
      },
    };
    try {
      const teamResult = await serviceUtils.requestService<Team[]>(
        this.teamMentionConfig,
        options,
      );
      this._notifyAnalyticsListeners(
        SLI_EVENT_TYPE,
        SliNames.SEARCH_TEAM,
        Actions.SUCCEEDED,
      );
      return this.convertTeamResultToMentionResult(teamResult, query);
    } catch (error) {
      this._notifyAnalyticsListeners(
        SLI_EVENT_TYPE,
        SliNames.SEARCH_TEAM,
        Actions.FAILED,
      );
      throw error;
    }
  }

  private convertTeamResultToMentionResult(
    result: Team[],
    query: string,
  ): MentionsResult {
    const { teamLinkResolver } = this.teamMentionConfig;
    const mentions: MentionDescription[] = result.map((team: Team) => {
      let teamLink: string = '';
      const defaultTeamLink = `${window.location.origin}/people/team/${team.id}`;
      if (typeof teamLinkResolver === 'function') {
        teamLink = teamLinkResolver(team.id);
      }

      return {
        id: this.trimTeamARI(team.id),
        avatarUrl: team.smallAvatarImageUrl,
        name: team.displayName,
        accessLevel: UserAccessLevel[UserAccessLevel.CONTAINER],
        userType: UserType[UserType.TEAM],
        highlight: team.highlight,
        context: {
          members: team.members,
          includesYou: team.includesYou,
          memberCount: team.memberCount,
          teamLink: teamLink || defaultTeamLink,
        },
      };
    });

    return { mentions, query };
  }

  private trimTeamARI(teamId: string = '') {
    const TEAM_ARI_PREFIX = 'ari:cloud:teams::team/';
    return teamId.replace(TEAM_ARI_PREFIX, '');
  }
}
