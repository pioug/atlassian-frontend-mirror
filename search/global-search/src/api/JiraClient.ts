import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import {
  AnalyticsType,
  ContentType,
  JiraResult,
  ResultType,
} from '../model/Result';

const RECENT_ITEMS_PATH: string = 'rest/internal/2/productsearch/recent';
const PERMISSIONS_PATH: string =
  'rest/api/2/mypermissions?permissions=USER_PICKER';

export type RecentItemsCounts = {
  issues?: number;
  boards?: number;
  filters?: number;
  projects?: number;
};

export const DEFAULT_RECENT_ITEMS_COUNT: RecentItemsCounts = {
  issues: 8,
  boards: 2,
  projects: 2,
  filters: 2,
};

/**
 * Jira client to reterive recent items from jira
 */
export interface JiraClient {
  /**
   * @param searchSessionId string unique for every session id
   * @param recentItemCounts optional number of items to return for every recent
   * @returns a promise which resolves to recent items throws
   */
  getRecentItems(
    searchSessionId: string,
    recentItemCounts?: RecentItemsCounts,
  ): Promise<JiraResult[]>;

  canSearchUsers(): Promise<boolean>;
}

enum JiraResponseGroup {
  Issues = 'quick-search-issues',
  Projects = 'quick-search-projects',
  Boards = 'quick-search-boards',
  Filters = 'quick-search-filters',
}

const JiraResponseGroupToContentType = {
  [JiraResponseGroup.Issues]: ContentType.JiraIssue,
  [JiraResponseGroup.Boards]: ContentType.JiraBoard,
  [JiraResponseGroup.Filters]: ContentType.JiraFilter,
  [JiraResponseGroup.Projects]: ContentType.JiraProject,
};

type JiraRecentItemGroup = {
  id: JiraResponseGroup;
  name: string;
  items: JiraRecentItem[];
};

type JiraRecentIssueAttributes = {
  containerId?: string;
  containerName?: string;
  issueTypeId?: string;
  issueTypeName?: string;
};

type JiraRecentBoardAttributes = {
  containerId?: string;
  containerName?: string;
  parentType?: 'user' | 'project';
};

type JiraRecentFilterAttributes = {
  ownerId?: string;
};

type JiraRecentItem = {
  id: string;
  title: string;
  subtitle: string;
  metadata: string;
  avatarUrl: string;
  url: string;
  attributes?:
    | JiraRecentBoardAttributes
    | JiraRecentIssueAttributes
    | JiraRecentFilterAttributes;
};

type JiraMyPermissionsResponse = {
  permissions: {
    USER_PICKER?: {
      havePermission: boolean;
    };
  };
};

export default class JiraClientImpl implements JiraClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;
  private isUserAnonymous: boolean;
  private canSearchUsersCache: boolean | undefined;

  constructor(url: string, cloudId: string, isUserAnonymous: boolean) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
    this.isUserAnonymous = isUserAnonymous;
  }

  // Unused, just to mute ts lint
  public getCloudId() {
    return this.cloudId;
  }

  /**
   *
   * @param searchSessionId unique id for each session
   * @param recentItemCounts number of items to return for every recent item type defaults to {@link #defaultRecentItemCounts}
   * @returns a promise resolved to recent items array throws if any error occurs in reqeust or if parsing or transforming response fails
   */
  public async getRecentItems(
    searchSessionId: string,
    recentItemCounts: RecentItemsCounts = DEFAULT_RECENT_ITEMS_COUNT,
  ): Promise<JiraResult[]> {
    if (this.isUserAnonymous) {
      return [];
    }
    const options: RequestServiceOptions = {
      path: RECENT_ITEMS_PATH,
      queryParams: {
        counts: this.getRecentCountQueryParam(recentItemCounts),
        search_id: searchSessionId,
      },
    };
    const recentItems =
      (await utils.requestService<JiraRecentItemGroup[]>(
        this.serviceConfig,
        options,
      )) || [];
    const reduced = recentItems
      .filter(group => JiraResponseGroupToContentType.hasOwnProperty(group.id))
      .map(group => this.recentItemGroupToItems(group))
      .reduce((acc, item) => [...acc, ...item], []);

    return reduced;
  }

  public async canSearchUsers(): Promise<boolean> {
    if (this.isUserAnonymous) {
      return false;
    }
    if (typeof this.canSearchUsersCache === 'boolean') {
      return Promise.resolve(this.canSearchUsersCache);
    }

    const options: RequestServiceOptions = {
      path: PERMISSIONS_PATH,
    };

    const permissionsResponse: JiraMyPermissionsResponse = await utils.requestService<
      JiraMyPermissionsResponse
    >(this.serviceConfig, options);

    this.canSearchUsersCache =
      permissionsResponse &&
      permissionsResponse.permissions &&
      permissionsResponse.permissions.USER_PICKER &&
      permissionsResponse.permissions.USER_PICKER.havePermission;
    return !!this.canSearchUsersCache;
  }

  private recentItemGroupToItems(group: JiraRecentItemGroup) {
    const { id, items } = group;
    return items.map(item => this.recentItemToResultItem(item, id));
  }
  private recentItemToResultItem(
    item: JiraRecentItem,
    jiraGroup: JiraResponseGroup,
  ): JiraResult {
    const containerId = this.getContainerId(item, jiraGroup);
    const contentType = JiraResponseGroupToContentType[jiraGroup];
    const resultId = '' + item.id;

    return {
      resultType: ResultType.JiraObjectResult,
      resultId,
      name: item.title,
      href: item.url,
      analyticsType: AnalyticsType.RecentJira,
      avatarUrl: item.avatarUrl,
      containerId: containerId,
      contentType,
      ...this.getTypeSpecificAttributes(item, jiraGroup),
    };
  }

  private getContainerId(item: JiraRecentItem, jiraGroup: JiraResponseGroup) {
    return jiraGroup === JiraResponseGroup.Filters
      ? item.attributes &&
          (item.attributes as JiraRecentFilterAttributes).ownerId
      : item.attributes &&
          (item.attributes as
            | JiraRecentBoardAttributes
            | JiraRecentIssueAttributes).containerId;
  }

  private getTypeSpecificAttributes(
    item: JiraRecentItem,
    jiraGroup: JiraResponseGroup,
  ): {
    objectKey?: string;
    containerName?: string;
  } {
    switch (jiraGroup) {
      case JiraResponseGroup.Filters:
        return {
          containerName: item.metadata,
          objectKey: 'Filters',
        };
      case JiraResponseGroup.Projects:
        return {
          containerName: item.metadata,
        };
      case JiraResponseGroup.Issues:
        const issueType =
          item.attributes &&
          (item.attributes as JiraRecentIssueAttributes).issueTypeName;
        return {
          containerName: issueType ? issueType : item.metadata,
          objectKey: issueType ? item.metadata : undefined,
        };
      case JiraResponseGroup.Boards:
        return {
          containerName: item.attributes
            ? (item.attributes as JiraRecentBoardAttributes).containerName
            : item.metadata,
        };
    }
  }

  /**
   * Private method to construct a valid value for the 'counts' query param
   * for the Jira recent API. The format is as follows:
   *
   * ?counts=issues=8,boards=2,projects=2,filters=2
   *
   * @param recentCounts
   */
  private getRecentCountQueryParam(recentCounts: RecentItemsCounts): string {
    const keys = Object.keys(recentCounts) as Array<keyof typeof recentCounts>;

    return keys.map(key => `${key}=${recentCounts[key]}`).join(',');
  }
}
