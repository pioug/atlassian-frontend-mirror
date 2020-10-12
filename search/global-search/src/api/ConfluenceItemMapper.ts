import {
  ResultType,
  AnalyticsType,
  ContainerResult,
  ConfluenceObjectResult,
  ContentType,
  Result,
} from '../model/Result';
import { Scope, ConfluenceItem } from './types';

export function removeHighlightTags(text: string): string {
  return text.replace(/@@@hl@@@|@@@endhl@@@/g, '');
}

function mapConfluenceItemToResultObject(
  item: ConfluenceItem,
  experimentId?: string,
): ConfluenceObjectResult {
  return {
    resultId: item.content!.id, // content always available for pages/blogs/attachments
    name: removeHighlightTags(item.title),
    href: `${item.baseUrl}${item.url}`,
    containerName: item.container.title,
    analyticsType: AnalyticsType.ResultConfluence,
    contentType: `confluence-${item.content!.type}` as ContentType,
    resultType: ResultType.ConfluenceObjectResult,
    containerId:
      item.content!.space && item.content!.space!.id
        ? item.content!.space!.id
        : 'UNAVAILABLE',
    iconClass: item.iconCssClass,
    experimentId: experimentId,
    friendlyLastModified: item.friendlyLastModified,
  };
}

function mapConfluenceItemToResultSpace(
  spaceItem: ConfluenceItem,
  experimentId?: string,
): ContainerResult {
  return {
    resultId: `space-${spaceItem.space!.key}`, // space is always defined for space results
    avatarUrl: `${spaceItem.baseUrl}${spaceItem.space!.icon.path}`,
    name: spaceItem.container.title,
    href: `${spaceItem.baseUrl || ''}${spaceItem.container.displayUrl}`,
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.GenericContainerResult,
    contentType: ContentType.ConfluenceSpace,
    experimentId: experimentId,
    key: spaceItem.space!.key,
  };
}

export function mapConfluenceItemToResult(
  scope: Scope,
  item: ConfluenceItem,
): Result {
  const mapper =
    scope === Scope.ConfluenceSpace
      ? mapConfluenceItemToResultSpace
      : mapConfluenceItemToResultObject;
  return mapper(item);
}
