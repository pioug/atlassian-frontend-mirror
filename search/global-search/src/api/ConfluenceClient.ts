import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import {
  AnalyticsType,
  ConfluenceObjectResult,
  ContainerResult,
  ContentType,
  Result,
  ResultType,
} from '../model/Result';

const RECENT_PAGES_PATH: string = 'rest/recentlyviewed/1.0/recent';
const RECENT_SPACE_PATH: string = 'rest/recentlyviewed/1.0/recent/spaces';

export interface ConfluenceClient {
  getRecentItems(): Promise<ConfluenceObjectResult[]>;
  getRecentSpaces(): Promise<Result[]>;
}

export type ConfluenceContentType = 'blogpost' | 'page';

export interface RecentPage {
  available: boolean;
  contentType: ConfluenceContentType;
  id: number;
  lastSeen: number;
  space: string;
  spaceKey: string;
  title?: string; // Due to some Confluence bug there is a chance that recent pages come back with NO title
  type: string;
  url: string;
  iconClass: string;
}

export interface RecentSpace {
  id: string;
  key: string;
  icon: string;
  name: string;
}

export default class ConfluenceClientImpl implements ConfluenceClient {
  private serviceConfig: ServiceConfig;

  constructor(url: string) {
    this.serviceConfig = { url: url };
  }

  public async getRecentItems(): Promise<ConfluenceObjectResult[]> {
    const recentPages = await this.createRecentRequestPromise<RecentPage>(
      RECENT_PAGES_PATH,
    );
    const baseUrl = this.serviceConfig.url;

    return recentPages
      .filter(page => !!page.title)
      .map(recentPage => recentPageToResult(recentPage, baseUrl));
  }

  public async getRecentSpaces(): Promise<Result[]> {
    const recentSpaces = await this.createRecentRequestPromise<RecentSpace>(
      RECENT_SPACE_PATH,
    );
    const baseUrl = this.serviceConfig.url;

    return recentSpaces.map(recentSpace =>
      recentSpaceToResult(recentSpace, baseUrl),
    );
  }

  private createRecentRequestPromise<T>(path: string): Promise<Array<T>> {
    const options: RequestServiceOptions = {
      path: path,
    };

    return utils.requestService(this.serviceConfig, options);
  }
}

function recentPageToResult(
  recentPage: RecentPage,
  baseUrl: string,
): ConfluenceObjectResult {
  return {
    resultId: String(recentPage.id),
    name: recentPage.title || '', // This is a failsafe, there should be a filter to drop pages with no titles
    href: `${baseUrl}${recentPage.url}`,
    containerName: recentPage.space,
    analyticsType: AnalyticsType.RecentConfluence,
    resultType: ResultType.ConfluenceObjectResult,
    contentType: `confluence-${recentPage.contentType}` as ContentType,
    iconClass: recentPage.iconClass,
    containerId: recentPage.spaceKey,
    isRecentResult: true,
    friendlyLastModified: undefined, // not available for recent results
  };
}

function recentSpaceToResult(
  recentSpace: RecentSpace,
  baseUrl: string,
): Result {
  return {
    resultId: recentSpace.id,
    name: recentSpace.name,
    href: `${baseUrl}/spaces/${recentSpace.key}/overview`,
    avatarUrl: recentSpace.icon,
    analyticsType: AnalyticsType.RecentConfluence,
    resultType: ResultType.GenericContainerResult,
    contentType: ContentType.ConfluenceSpace,
  } as ContainerResult;
}
