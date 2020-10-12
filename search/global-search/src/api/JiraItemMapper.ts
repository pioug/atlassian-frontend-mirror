import uuid from 'uuid';

import {
  ResultType,
  AnalyticsType,
  JiraResult,
  ContentType,
  JiraProjectType,
} from '../model/Result';

import { JiraItem, JiraItemV1, JiraItemV2, JiraItemAttributes } from './types';

export const mapJiraItemToResult = (analyticsType: AnalyticsType) => (
  item: JiraItem,
): JiraResult =>
  (<JiraItemV2>item).attributes && (<JiraItemV2>item).attributes['@type']
    ? mapJiraItemToResultV2(item as JiraItemV2, analyticsType)
    : mapJiraItemToResultV1(item as JiraItemV1, analyticsType);

const extractSpecificAttributes = (
  attributes: JiraItemAttributes,
): Partial<JiraResult> | null => {
  const type = attributes['@type'];
  switch (type) {
    case 'issue':
      return {
        objectKey: attributes.key,
        containerName: attributes.container && attributes.container.title,
      };
    case 'board':
      return {
        containerName: attributes.containerName,
        containerId: attributes.containerId,
      };
    case 'filter':
      return {
        containerName: attributes.ownerName,
      };
    case 'project':
      return {
        containerName: attributes.projectType,
        projectType: attributes.projectType as JiraProjectType, // projectType maps directly to JiraProjectType enum at the moment for convenience
      };
  }
  return null;
};

const extractAvatarUrl = ({
  url = '',
  urls = {},
}: { url?: string; urls?: Record<string, string> } = {}) => {
  if (url) {
    return url;
  }
  return urls['48x48'] || urls[Object.keys(urls)[0]];
};

const JIRA_TYPE_TO_CONTENT_TYPE = {
  issue: ContentType.JiraIssue,
  board: ContentType.JiraBoard,
  filter: ContentType.JiraFilter,
  project: ContentType.JiraProject,
};

const mapJiraItemToResultV2 = (
  item: JiraItemV2,
  analyticsType: AnalyticsType,
): JiraResult => {
  const { id, name, url, attributes } = item;
  const contentType = JIRA_TYPE_TO_CONTENT_TYPE[attributes['@type']];

  const resultType =
    contentType === ContentType.JiraProject
      ? ResultType.JiraProjectResult
      : ResultType.JiraObjectResult;

  return {
    resultId: id,
    key: uuid(),
    name: name,
    href: url,
    resultType: resultType,
    containerId: attributes.container && attributes.container.id,
    analyticsType,
    ...extractSpecificAttributes(attributes),
    avatarUrl: attributes.avatar && extractAvatarUrl(attributes.avatar),
    contentType,
    isRecentResult: mapAnalyticsTypeToRecentResult(analyticsType),
  };
};

const mapJiraItemToResultV1 = (
  item: JiraItemV1,
  analyticsType: AnalyticsType,
): JiraResult => {
  return {
    resultId: item.key,
    avatarUrl: item.fields.issuetype.iconUrl,
    name: item.fields.summary,
    href: `/browse/${item.key}`,
    containerName: item.fields.project.name,
    objectKey: item.key,
    analyticsType,
    resultType: ResultType.JiraObjectResult,
    contentType: ContentType.JiraIssue,
    isRecentResult: mapAnalyticsTypeToRecentResult(analyticsType),
  };
};

const mapAnalyticsTypeToRecentResult = (
  analyticsType: AnalyticsType,
): boolean => {
  return analyticsType.startsWith('recent');
};
