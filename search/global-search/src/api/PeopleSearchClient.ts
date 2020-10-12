import {
  PersonResult,
  ResultType,
  AnalyticsType,
  ContentType,
} from '../model/Result';
import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

export interface GraphqlResponse {
  errors?: GraphqlError[];
  data?: {
    AccountCentricUserSearch?: SearchResult[];
    Collaborators?: SearchResult[];
    UserSearch?: SearchResult[];
  };
}

export interface SearchResult {
  id: string;
  avatarUrl: string;
  fullName: string;
  department: string;
  title: string;
  nickname: string;
}

export interface GraphqlError {
  category: string;
  message: string;
}

export interface PeopleSearchClient {
  getRecentPeople(): Promise<PersonResult[]>;
}

export default class PeopleSearchClientImpl implements PeopleSearchClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  private buildRecentQuery() {
    return {
      query: `query Collaborators(
          $cloudId: String!,
          $limit: Int) {
          Collaborators(cloudId: $cloudId, limit: $limit) {
            id,
            fullName,
            avatarUrl,
            title,
            nickname,
            department
          }
        }`,
      variables: {
        cloudId: this.cloudId,
        limit: 3,
        excludeBots: true,
        excludeInactive: true,
      },
    };
  }

  private buildRequestOptions(body: object): RequestServiceOptions {
    return {
      path: 'graphql',
      requestInit: {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
      },
    };
  }

  public async getRecentPeople(): Promise<PersonResult[]> {
    const options = this.buildRequestOptions(this.buildRecentQuery());

    const response = await utils.requestService<GraphqlResponse>(
      this.serviceConfig,
      options,
    );

    if (response.errors) {
      // TODO should probably catch and log this
      return [];
    }

    if (!response.data || !response.data.Collaborators) {
      return [];
    }

    return response.data.Collaborators.map(record =>
      userSearchResultToResult(record, AnalyticsType.RecentPerson),
    );
  }
}

function userSearchResultToResult(
  searchResult: SearchResult,
  analyticsType: AnalyticsType,
): PersonResult {
  const mention = searchResult.nickname || searchResult.fullName;

  return {
    resultType: ResultType.PersonResult,
    resultId: 'people-' + searchResult.id,
    name: searchResult.fullName,
    href: '/people/' + searchResult.id,
    avatarUrl: searchResult.avatarUrl,
    contentType: ContentType.Person,
    analyticsType,
    mentionName: mention,
    presenceMessage: searchResult.title,
  };
}
