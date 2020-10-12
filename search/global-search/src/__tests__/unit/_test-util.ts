import {
  AnalyticsType,
  ResultType,
  JiraResult,
  ConfluenceObjectResult,
  ContentType,
  ContainerResult,
  PersonResult,
} from '../../model/Result';

function buildMockSearchResultProperties() {
  return {
    resultId: 'resultId',
    name: 'name',
    avatarUrl: 'avatarUrl',
    href: 'href',
  };
}

export function makeJiraObjectResult(
  partial?: Partial<JiraResult>,
): JiraResult {
  return {
    analyticsType: AnalyticsType.ResultJira,
    resultType: ResultType.JiraObjectResult,
    objectKey: 'objectKey',
    containerName: 'containerName',
    contentType: ContentType.JiraIssue,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makeConfluenceObjectResult(
  partial?: Partial<ConfluenceObjectResult>,
): ConfluenceObjectResult {
  return {
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.ConfluenceObjectResult,
    containerName: 'containerName',
    contentType: ContentType.ConfluencePage,
    containerId: 'containerId',
    friendlyLastModified: 'friendly-last-modified',
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makeConfluenceContainerResult(
  partial?: Partial<ContainerResult>,
): ContainerResult {
  return {
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.GenericContainerResult,
    contentType: ContentType.ConfluenceSpace,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makePersonResult(
  partial?: Partial<PersonResult>,
): PersonResult {
  return {
    mentionName: 'mentionName',
    presenceMessage: 'presenceMessage',
    contentType: ContentType.Person,
    analyticsType: AnalyticsType.ResultPerson,
    resultType: ResultType.PersonResult,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}
