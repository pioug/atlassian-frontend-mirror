import { ResultType, AnalyticsType, ContentType } from '../../../model/Result';

import { mapJiraItemToResult } from '../../JiraItemMapper';
import {
  generateRandomIssueV1,
  generateRandomJiraIssue,
  generateRandomJiraBoard,
  generateRandomJiraFilter,
  generateRandomJiraProject,
} from '../../../../example-helpers/mocks/mockJira';
import { JiraItemV1, JiraItemV2 } from '../../../api/types';

describe('mapJiraItemToResult', () => {
  it('should be able to parse issue V1 response', () => {
    const issue = generateRandomIssueV1() as JiraItemV1;
    const result = mapJiraItemToResult(AnalyticsType.ResultJira)(issue);

    expect(result).toMatchObject({
      resultId: issue.key,
      avatarUrl: issue.fields.issuetype.iconUrl,
      name: issue.fields.summary,
      href: `/browse/${issue.key}`,
      containerName: issue.fields.project.name,
      objectKey: issue.key,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraIssue,
      isRecentResult: false,
    });
  });

  it('should be able to parse issue V2 respnse', () => {
    const issue = generateRandomJiraIssue() as JiraItemV2;
    const result = mapJiraItemToResult(AnalyticsType.ResultJira)(issue);

    const avatar = issue.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: issue.id,
      avatarUrl: avatar.url,
      name: issue.name,
      href: expect.stringMatching(issue.url),
      containerName:
        issue.attributes.container && issue.attributes.container.title,
      objectKey: issue.attributes.key,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraIssue,
      isRecentResult: false,
    });
  });

  it('should be able to parse jira filter', () => {
    const filter = generateRandomJiraFilter() as JiraItemV2;
    const result = mapJiraItemToResult(AnalyticsType.ResultJira)(filter);

    const avatar = filter.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: filter.id,
      avatarUrl: avatar.url,
      name: filter.name,
      href: expect.stringMatching(filter.url),
      containerName: filter.attributes.ownerName,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraFilter,
    });
  });

  it('should be able to parse jira board', () => {
    const board = generateRandomJiraBoard() as JiraItemV2;
    const result = mapJiraItemToResult(AnalyticsType.ResultJira)(board);

    const avatar = board.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: board.id,
      avatarUrl: avatar.url,
      name: board.name,
      href: expect.stringMatching(board.url),
      containerName: board.attributes.containerName,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraBoard,
      isRecentResult: false,
    });
  });

  it('should be able to parse jira project', () => {
    const project = generateRandomJiraProject() as JiraItemV2;
    const result = mapJiraItemToResult(AnalyticsType.ResultJira)(project);

    const avatar = project.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: project.id,
      avatarUrl: avatar.url,
      name: project.name,
      href: expect.stringMatching(project.url),
      containerName: project.attributes.projectType,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraProjectResult,
      contentType: ContentType.JiraProject,
      isRecentResult: false,
    });
  });

  it('should not affect existing query params', () => {
    const url =
      'https://product-fabric.atlassian.net/browse/ETH-671?q=existing';

    const board = {
      ...(generateRandomJiraBoard() as JiraItemV2),
      url,
    };
    const result = mapJiraItemToResult(AnalyticsType.ResultJira)(board);

    expect(result.href).toEqual(url);
  });

  [AnalyticsType.ResultJira, AnalyticsType.RecentJira].forEach(
    analyticsType => {
      it(`should take the ${analyticsType} analytics type`, () => {
        const board = generateRandomJiraBoard() as JiraItemV2;
        const result = mapJiraItemToResult(analyticsType)(board);

        expect(result.analyticsType).toEqual(analyticsType);
      });
    },
  );

  it('should set the isRecentResult attribute', () => {
    const project = generateRandomJiraProject() as JiraItemV2;
    const result = mapJiraItemToResult(AnalyticsType.RecentJira)(project);

    expect(result).toMatchObject({
      isRecentResult: true,
    });
  });

  describe('avatar url', () => {
    it('should be able to extract the 48x48 avatar url', () => {
      const issue = generateRandomJiraIssue() as JiraItemV2;
      const avatar = issue.attributes.avatar || {};
      avatar.url = undefined;
      avatar.urls = { ['32x32']: 'http://32url', ['48x48']: 'http://48url' };
      const result = mapJiraItemToResult(AnalyticsType.ResultJira)(issue);
      expect(result.avatarUrl).toBe('http://48url');
    });

    it('should select first url if 48x48 url does not exist', () => {
      const issue = generateRandomJiraIssue() as JiraItemV2;
      const avatar = issue.attributes.avatar || {};
      avatar.url = undefined;
      avatar.urls = { ['32x32']: 'http://32url', ['16x16']: 'http://16url' };
      const result = mapJiraItemToResult(AnalyticsType.ResultJira)(issue);
      expect(result.avatarUrl).toBe('http://32url');
    });
  });
});
