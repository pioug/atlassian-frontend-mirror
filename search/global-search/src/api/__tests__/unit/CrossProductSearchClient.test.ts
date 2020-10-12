import { utils } from '@atlaskit/util-service-support';

import CrossProductSearchClient, {
  CrossProductSearchResponse,
  ScopeResult,
  ABTest,
  CrossProductExperimentResponse,
  DEFAULT_AB_TEST,
} from '../../CrossProductSearchClient';
import { Scope, ConfluenceItem, PersonItem, UrsPersonItem } from '../../types';

import fetchMock from 'fetch-mock/cjs/client';
import {
  AnalyticsType,
  ConfluenceObjectResult,
  ResultType,
  ContentType,
  ContainerResult,
  JiraResult,
  PersonResult,
  Result,
} from '../../../model/Result';
import {
  generateRandomJiraBoard,
  generateRandomJiraFilter,
  generateRandomJiraProject,
} from '../../../../example-helpers/mocks/mockJira';
import {
  buildJiraModelParams,
  buildConfluenceModelParams,
} from '../../../util/model-parameters';
import uuid from 'uuid/v4';

const DEFAULT_XPSEARCH_OPTS = {
  method: 'post',
  name: 'xpsearch',
  overwriteRoutes: false,
};

function apiWillReturn(state: CrossProductSearchResponse) {
  fetchMock.once('localhost/quicksearch/v1', state, DEFAULT_XPSEARCH_OPTS);
}

function experimentApiWillReturn(state: CrossProductExperimentResponse) {
  fetchMock.once('localhost/experiment/v1', state, DEFAULT_XPSEARCH_OPTS);
}

const abTest: ABTest = {
  abTestId: 'abTestId',
  controlId: 'controlId',
  experimentId: 'experimentId',
};

describe('CrossProductSearchClient', () => {
  let searchClient: CrossProductSearchClient;

  beforeEach(() => {
    searchClient = new CrossProductSearchClient(
      'localhost',
      '123',
      false,
      undefined,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fetchMock.restore();
  });

  describe('Confluence', () => {
    it('should return confluence pages', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'confluence.page,blogpost' as Scope,
            results: [
              {
                title: '@@@hl@@@page@@@endhl@@@ name',
                baseUrl: 'http://baseUrl/wiki',
                url: '/url',
                container: {
                  title: 'containerTitle',
                },
                content: {
                  id: '123',
                  type: 'page',
                  space: {
                    id: '123',
                  },
                },
              } as ConfluenceItem,
            ],
          },
        ],
      });

      const result = await searchClient.search({
        query: 'query',
        sessionId: 'test_uuid',
        referrerId: undefined,
        scopes: [Scope.ConfluencePageBlog],
        modelParams: [],
      });
      expect(result.results[Scope.ConfluencePageBlog]!.items).toHaveLength(1);

      const item = result.results[Scope.ConfluencePageBlog]!
        .items[0] as ConfluenceObjectResult;
      expect(item.resultId).toEqual('123');
      expect(item.name).toEqual('page name');
      expect(item.href).toEqual('http://baseUrl/wiki/url');
      expect(item.containerName).toEqual('containerTitle');
      expect(item.containerId).toEqual('123');
      expect(item.analyticsType).toEqual(AnalyticsType.ResultConfluence);
      expect(item.resultType).toEqual(ResultType.ConfluenceObjectResult);
      expect(item.contentType).toEqual(ContentType.ConfluencePage);
    });

    it('should return confluence spaces', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'confluence.space' as Scope,
            abTest,
            results: [
              {
                title: 'abc',
                url: 'url',
                baseUrl: 'https://baseUrl/wiki',
                container: {
                  title: 'containerTitle',
                  displayUrl: '/displayUrl',
                },
                space: {
                  key: 'key',
                  icon: {
                    path: '/spaceIconPath',
                  },
                },
                iconCssClass: 'aui-iconfont-space-default',
              } as ConfluenceItem,
            ],
          },
        ],
      });

      const result = await searchClient.search({
        query: 'query',
        sessionId: 'test_uuid',
        referrerId: undefined,
        scopes: [Scope.ConfluenceSpace],
        modelParams: [],
      });
      expect(result.results[Scope.ConfluenceSpace]!.items).toHaveLength(1);
      expect(result.abTest!.experimentId).toBe('experimentId');

      const item = result.results[Scope.ConfluenceSpace]!
        .items[0] as ContainerResult;
      expect(item.resultId).toEqual('space-key');
      expect(item.avatarUrl).toEqual('https://baseUrl/wiki/spaceIconPath');
      expect(item.name).toEqual('containerTitle');
      expect(item.href).toEqual('https://baseUrl/wiki/displayUrl');
      expect(item.analyticsType).toEqual(AnalyticsType.ResultConfluence);
      expect(item.resultType).toEqual(ResultType.GenericContainerResult);
    });
  });

  describe('Jira', () => {
    it('should return jira result items', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'jira.issue' as Scope,
            abTest,
            results: [
              {
                key: 'key-1',
                fields: {
                  summary: 'summary',
                  project: {
                    name: 'projectName',
                  },
                  issuetype: {
                    iconUrl: 'iconUrl',
                  },
                },
              },
            ],
          },
        ],
      });

      const result = await searchClient.search({
        query: 'query',
        sessionId: 'test_uuid',
        referrerId: undefined,
        scopes: [Scope.JiraIssue],
        modelParams: [],
      });
      expect(result.results[Scope.JiraIssue]!.items).toHaveLength(1);
      expect(result.abTest!.experimentId).toBe('experimentId');

      const item = result.results[Scope.JiraIssue]!.items[0] as JiraResult;
      expect(item.name).toEqual('summary');
      expect(item.avatarUrl).toEqual('iconUrl');
      expect(item.href).toEqual('/browse/key-1');
      expect(item.containerName).toEqual('projectName');
      expect(item.objectKey).toEqual('key-1');
      expect(item.analyticsType).toEqual(AnalyticsType.ResultJira);
      expect(item.resultType).toEqual(ResultType.JiraObjectResult);
    });

    it('should not break with error scopes', async () => {
      const jiraScopes = [Scope.JiraIssue, Scope.JiraBoardProjectFilter];

      const issueErrorScope: ScopeResult = {
        id: Scope.JiraIssue,
        error: 'something wrong',
        results: [],
      };

      const containerCorrectScope = {
        id: Scope.JiraBoardProjectFilter,
        results: [
          generateRandomJiraBoard(),
          generateRandomJiraFilter(),
          generateRandomJiraProject(),
        ],
      };

      apiWillReturn({
        scopes: [issueErrorScope, containerCorrectScope],
      });

      const result = await searchClient.search({
        query: 'query',
        sessionId: 'test_uuid',
        referrerId: undefined,
        scopes: jiraScopes,
        modelParams: [],
      });
      expect(result.results[Scope.JiraIssue]!.items).toHaveLength(0);
      expect(result.results[Scope.JiraBoardProjectFilter]!.items).toHaveLength(
        3,
      );
    });
  });

  describe('Recents', () => {
    let requestSpy: jest.SpyInstance;

    beforeEach(() => {
      requestSpy = jest.spyOn(utils, 'requestService');
      requestSpy.mockReturnValue(
        Promise.resolve({
          scopes: [],
        }),
      );
    });

    afterEach(() => {
      requestSpy.mockRestore();
    });

    it('should not make recents request when user is anonymous', async () => {
      searchClient = new CrossProductSearchClient(
        'localhost',
        '123',
        true,
        undefined,
      );
      await searchClient.getRecentItems({
        context: 'jira',
        modelParams: [],
        mapItemToResult: () => ({} as Result),
      });

      expect(requestSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('People', () => {
    it('should return people results', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'cpus.user' as Scope,
            results: [
              {
                account_id: 'account_id',
                name: 'name',
                nickname: 'nickname',
                job_title: 'job_title',
                picture: 'picture',
              } as PersonItem,
            ],
          },
        ],
      });

      const result = await searchClient.search({
        query: 'query',
        sessionId: 'test_uuid',
        referrerId: undefined,
        scopes: [Scope.People],
        modelParams: [],
      });
      expect(result.results[Scope.People]!.items).toHaveLength(1);

      const item = result.results[Scope.People]!.items[0] as PersonResult;
      expect(item.resultId).toEqual('people-account_id');
      expect(item.name).toEqual('name');
      expect(item.href).toEqual('/people/account_id');
      expect(item.analyticsType).toEqual(AnalyticsType.ResultPerson);
      expect(item.resultType).toEqual(ResultType.PersonResult);
      expect(item.avatarUrl).toEqual('picture');
      expect(item.mentionName).toEqual('nickname');
      expect(item.presenceMessage).toEqual('job_title');
    });

    it('should have fall back for optional properties like title and nickname', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'cpus.user' as Scope,
            results: [
              {
                account_id: 'account_id',
                name: 'name',
                picture: 'picture',
              } as PersonItem,
            ],
          },
        ],
      });

      const result = await searchClient.search({
        query: 'query',
        sessionId: 'test_uuid',
        referrerId: undefined,
        scopes: [Scope.People],
        modelParams: [],
      });

      const item = result.results[Scope.People]!.items[0] as PersonResult;
      expect(item.mentionName).toEqual('name');
      expect(item.presenceMessage).toEqual('');
    });

    it('should return people results from urs confluence', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'urs.user-confluence' as Scope,
            results: [
              {
                avatarUrl: 'picture',
                entityType: 'USER',
                id: 'account_id',
                name: 'name',
              } as UrsPersonItem,
            ],
          },
        ],
      });

      const result = await searchClient.getPeople({
        query: 'query',
        sessionId: 'sessionId',
        referrerId: undefined,
        currentQuickSearchContext: 'confluence',
        resultLimit: 3,
      });
      expect(result.results[Scope.UserConfluence]!.items).toHaveLength(1);

      const item = result.results[Scope.UserConfluence]!
        .items[0] as PersonResult;
      expect(item.resultId).toEqual('people-account_id');
      expect(item.name).toEqual('name');
      expect(item.href).toEqual('/people/account_id');
      expect(item.analyticsType).toEqual(AnalyticsType.ResultPerson);
      expect(item.resultType).toEqual(ResultType.PersonResult);
      expect(item.avatarUrl).toEqual('picture');
      expect(item.mentionName).toEqual('');
    });

    it('should return people results from urs jira with nickname', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'urs.user-confluence' as Scope,
            results: [
              {
                avatarUrl: 'picture',
                entityType: 'USER',
                id: 'account_id',
                name: 'name',
                nickname: 'nickname',
              } as UrsPersonItem,
            ],
          },
        ],
      });

      const result = await searchClient.getPeople({
        query: 'query',
        sessionId: 'sessionId',
        referrerId: undefined,
        currentQuickSearchContext: 'confluence',
        resultLimit: 3,
      });

      expect(result.results[Scope.UserConfluence]!.items).toHaveLength(1);

      const item = result.results[Scope.UserConfluence]!
        .items[0] as PersonResult;
      expect(item.mentionName).toEqual('nickname');
    });

    it('should return people results from urs jira', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'urs.user-jira' as Scope,
            results: [
              {
                avatarUrl: 'picture',
                entityType: 'USER',
                id: 'account_id',
                name: 'name',
              } as UrsPersonItem,
            ],
          },
        ],
      });

      const result = await searchClient.getPeople({
        query: 'query',
        sessionId: 'sessionId',
        referrerId: undefined,
        currentQuickSearchContext: 'jira',
        resultLimit: 3,
      });

      expect(result.results[Scope.UserJira]!.items).toHaveLength(1);

      const item = result.results[Scope.UserJira]!.items[0] as PersonResult;
      expect(item.resultId).toEqual('people-account_id');
      expect(item.name).toEqual('name');
      expect(item.href).toEqual('/people/account_id');
      expect(item.analyticsType).toEqual(AnalyticsType.ResultPerson);
      expect(item.resultType).toEqual(ResultType.PersonResult);
      expect(item.avatarUrl).toEqual('picture');
      expect(item.mentionName).toEqual('');
    });

    it('should return people results from urs jira with nickname', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'urs.user-jira' as Scope,
            results: [
              {
                avatarUrl: 'picture',
                entityType: 'USER',
                id: 'account_id',
                name: 'name',
                nickname: 'nickname',
              } as UrsPersonItem,
            ],
          },
        ],
      });

      const result = await searchClient.getPeople({
        query: 'query',
        sessionId: 'sessionId',
        referrerId: undefined,
        currentQuickSearchContext: 'jira',
        resultLimit: 3,
      });

      expect(result.results[Scope.UserJira]!.items).toHaveLength(1);

      const item = result.results[Scope.UserJira]!.items[0] as PersonResult;
      expect(item.mentionName).toEqual('nickname');
    });
  });

  it('should return partial results when one scope has an error', async () => {
    apiWillReturn({
      scopes: [
        {
          id: 'jira.issue' as Scope,
          results: [
            {
              key: 'key-1',
              fields: {
                summary: 'summary',
                project: {
                  name: 'name',
                },
                issuetype: {
                  iconUrl: 'iconUrl',
                },
              },
            },
          ],
        },
        {
          id: 'confluence.page,blogpost' as Scope,
          error: 'TIMEOUT',
          results: [],
        },
      ],
    });

    const result = await searchClient.search({
      query: 'query',
      sessionId: 'test_uuid',
      referrerId: undefined,
      scopes: [Scope.ConfluencePageBlog, Scope.ConfluenceSpace],
      modelParams: [],
    });

    expect(result.results[Scope.JiraIssue]!.items).toHaveLength(1);
    expect(result.results[Scope.ConfluencePageBlog]!.items).toHaveLength(0);
  });

  it('should send the right body with query version', async () => {
    apiWillReturn({
      scopes: [],
    });

    const params = {
      query: uuid(),
      sessionId: uuid(),
      referrerId: uuid(),
      scopes: [Scope.ConfluencePageBlog, Scope.JiraIssue],
      modelParams: [
        {
          '@type': 'queryParams',
          queryVersion: 0,
        },
      ],
    };

    await searchClient.search(params);

    const call = fetchMock.calls('xpsearch')[0];
    // @ts-ignore
    const body = JSON.parse(call[1].body);

    expect(body).toEqual({
      query: params.query,
      cloudId: '123',
      limit: 10,
      filters: [],
      searchSession: {
        sessionId: params.sessionId,
        referrerId: params.referrerId,
      },
      scopes: expect.arrayContaining([
        'jira.issue',
        'confluence.page,blogpost',
      ]),
      modelParams: params.modelParams,
    });
  });

  it('should send the right body with container id in jira', async () => {
    apiWillReturn({
      scopes: [],
    });

    const params = {
      query: uuid(),
      sessionId: uuid(),
      referrerId: uuid(),
      scopes: [Scope.ConfluencePageBlog, Scope.JiraIssue],
      modelParams: buildJiraModelParams(1, '123'),
    };

    await searchClient.search(params);

    const call = fetchMock.calls('xpsearch')[0];
    // @ts-ignore
    const body = JSON.parse(call[1].body);

    expect(body).toEqual({
      query: params.query,
      cloudId: '123',
      limit: 10,
      filters: [],
      searchSession: {
        sessionId: params.sessionId,
        referrerId: params.referrerId,
      },
      scopes: expect.arrayContaining([
        'jira.issue',
        'confluence.page,blogpost',
      ]),
      modelParams: params.modelParams,
    });
  });

  it('should send the right body with container id in confluence', async () => {
    apiWillReturn({
      scopes: [],
    });

    const params = {
      query: uuid(),
      sessionId: uuid(),
      referrerId: uuid(),
      scopes: [Scope.ConfluencePageBlog, Scope.JiraIssue],
      modelParams: buildConfluenceModelParams(1, {
        spaceKey: '123',
      }),
    };

    await searchClient.search(params);

    const call = fetchMock.calls('xpsearch')[0];
    // @ts-ignore
    const body = JSON.parse(call[1].body);

    expect(body).toEqual({
      query: params.query,
      cloudId: '123',
      limit: 10,
      filters: [],
      searchSession: {
        sessionId: params.sessionId,
        referrerId: params.referrerId,
      },
      scopes: expect.arrayContaining([
        'jira.issue',
        'confluence.page,blogpost',
      ]),
      modelParams: params.modelParams,
    });
  });

  it('should send the right body with project id and query version', async () => {
    apiWillReturn({
      scopes: [],
    });

    const params = {
      query: uuid(),
      sessionId: uuid(),
      referrerId: uuid(),
      scopes: [Scope.ConfluencePageBlog, Scope.JiraIssue],
      modelParams: buildJiraModelParams(1, '123'),
    };

    await searchClient.search(params);

    const call = fetchMock.calls('xpsearch')[0];
    // @ts-ignore
    const body = JSON.parse(call[1].body);

    expect(body).toEqual({
      query: params.query,
      cloudId: '123',
      limit: 10,
      filters: [],
      searchSession: {
        sessionId: params.sessionId,
        referrerId: params.referrerId,
      },
      scopes: expect.arrayContaining([
        'jira.issue',
        'confluence.page,blogpost',
      ]),
      modelParams: params.modelParams,
    });
  });

  describe('ABTest', () => {
    it('should get the ab test data', async () => {
      const abTest = {
        abTestId: 'abTestId',
        experimentId: 'experimentId',
        controlId: 'controlId',
      };

      experimentApiWillReturn({
        scopes: [
          {
            id: 'confluence.page,blogpost' as Scope,
            abTest,
          },
        ],
      });

      const result = await searchClient.getAbTestData(Scope.ConfluencePageBlog);

      expect(result).toEqual(abTest);
    });

    it('should not fail if getting experiments fails', async () => {
      experimentApiWillReturn({
        scopes: [
          {
            id: 'confluence.page,blogpost' as Scope,
            error: 'did not work',
            abTest: DEFAULT_AB_TEST,
          },
        ],
      });

      const result = await searchClient.getAbTestData(Scope.ConfluencePageBlog);

      expect(result).toEqual(DEFAULT_AB_TEST);
    });

    it('should not make REST request to retrieve ab test data if the scope has been requested before', async () => {
      experimentApiWillReturn({
        scopes: [
          {
            id: 'confluence.page,blogpost' as Scope,
            abTest: DEFAULT_AB_TEST,
          },
        ],
      });

      const result1 = await searchClient.getAbTestData(
        Scope.ConfluencePageBlog,
      );
      const result2 = await searchClient.getAbTestData(
        Scope.ConfluencePageBlog,
      );

      expect(result1).toEqual(result2);
    });

    it('should make REST request to retrieve ab test data if the scope has not been requested before', async () => {
      experimentApiWillReturn({
        scopes: [
          {
            id: Scope.ConfluencePageBlog,
            abTest: {
              abTestId: 'firstAbTest',
              experimentId: 'firstExperimentId',
              controlId: 'firstControlId',
            },
          },
        ],
      });

      experimentApiWillReturn({
        scopes: [
          {
            id: Scope.ConfluencePageBlogAttachment,
            abTest: {
              abTestId: 'secondAbTest',
              experimentId: 'secondExperimentId',
              controlId: 'secondControlId',
            },
          },
        ],
      });

      const result1 = await searchClient.getAbTestData(
        Scope.ConfluencePageBlog,
      );
      const result2 = await searchClient.getAbTestData(
        Scope.ConfluencePageBlogAttachment,
      );

      expect(result1).not.toEqual(result2);
    });
  });

  describe('NavCompletion', () => {
    let requestSpy: jest.SpyInstance;

    beforeEach(() => {
      requestSpy = jest.spyOn(utils, 'requestService');
      requestSpy.mockReturnValue(
        Promise.resolve({
          scopes: [],
        }),
      );
    });

    afterEach(() => {
      requestSpy.mockRestore();
    });

    it('requests are made with the correct request body for the query', () => {
      searchClient.getNavAutocompleteSuggestions('auto');

      expect(requestSpy).toHaveBeenCalledTimes(1);

      const serviceConfigParam = requestSpy.mock.calls[0][0];
      expect(serviceConfigParam).toHaveProperty('url', 'localhost');

      const serviceOptions = requestSpy.mock.calls[0][1];
      const expectedBody = {
        cloudId: '123',
        scopes: [Scope.NavSearchCompleteConfluence],
        query: 'auto',
      };
      expect(JSON.parse(serviceOptions.requestInit.body)).toEqual(expectedBody);
    });

    it('should correctly parse responses from the API and return the correct data', async () => {
      const mockResponse = {
        scopes: [
          {
            id: 'nav.completion-confluence',
            results: [
              {
                dateTime: '2019-07-09T23:55:48.785Z',
                product: 'confluence',
                query: 'confluence test',
                cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
                resources: 'query',
                principalId: '5ce5ec61c9167e0d6ea2a5ad',
                sessionId: 'f78da746-d495-4845-8620-6a32b8dc89df',
                es_metadata_id: 'f78da746-d495-4845-8620-6a32b8dc89df',
              },
              {
                dateTime: '2019-07-08T18:27:45.824Z',
                product: 'confluence',
                query: 'confluence',
                cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
                resources: 'query',
                principalId: '5ce5ec61c9167e0d6ea2a5ad',
                sessionId: '4a0dfeff-32fb-4a2f-8d17-a7eb2e0a0857',
                es_metadata_id: '4a0dfeff-32fb-4a2f-8d17-a7eb2e0a0857',
              },
              {
                dateTime: '2019-07-26T20:56:30.576Z',
                product: 'confluence',
                query: 'conf',
                cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
                resources: 'query',
                principalId: '5ce5ec61c9167e0d6ea2a5ad',
                sessionId: '4c2c80c8-5269-4e54-bb66-28f3a34093c4',
                es_metadata_id: '4c2c80c8-5269-4e54-bb66-28f3a34093c4',
              },
            ],
            size: 3,
          },
        ],
      };

      const expectedParsedResult = ['confluence test', 'confluence', 'conf'];

      requestSpy.mockReturnValue(Promise.resolve(mockResponse));

      const result = await searchClient.getNavAutocompleteSuggestions('auto');

      expect(result).toEqual(expectedParsedResult);
    });

    it('should correctly parse responses which are empty', async () => {
      const mockResponse = {
        scopes: [
          {
            id: 'nav.completion-confluence',
            results: [],
            size: 0,
          },
        ],
      };

      const expectedParsedResult: string[] = [];

      requestSpy.mockReturnValue(Promise.resolve(mockResponse));

      const result = await searchClient.getNavAutocompleteSuggestions('auto');

      expect(result).toEqual(expectedParsedResult);
    });
  });
});
