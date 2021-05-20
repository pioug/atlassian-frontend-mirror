import fetchMock from 'fetch-mock/cjs/client';
import seedrandom from 'seedrandom';

import {
  makePeopleSearchData,
  makeCrossProductSearchData,
  makeConfluenceRecentPagesData,
  makeConfluenceRecentSpacesData,
  makeCrossProductExperimentData,
  makeAutocompleteData,
} from './mockData';
import { jiraRecentResponseWithAttributes } from './jiraRecentResponseDataWithAttributes';
import {
  permissionResponseWithoutUserPickerPermission,
  permissionResponseWithUserPickerPermission,
} from './jiraPermissionResponse';
import { ScopeResult } from '../../src/api/CrossProductSearchClient';
import { Scope } from '../../src/api/types';

type Request = string;

type Options = {
  body: string;
};

export type MocksConfig = {
  crossProductSearchDelay: number;
  quickNavDelay: number;
  jiraRecentDelay: number;
  peopleSearchDelay: number;
  autocompleteDelay: number;
  canSearchUsers: boolean;
  abTestExperimentId: string;
};

export const ZERO_DELAY_CONFIG: MocksConfig = {
  crossProductSearchDelay: 0,
  quickNavDelay: 0,
  jiraRecentDelay: 0,
  peopleSearchDelay: 0,
  autocompleteDelay: 0,
  canSearchUsers: true,
  abTestExperimentId: 'default',
};

export const DEFAULT_MOCKS_CONFIG: MocksConfig = {
  crossProductSearchDelay: 650,
  quickNavDelay: 500,
  jiraRecentDelay: 500,
  peopleSearchDelay: 500,
  autocompleteDelay: 200,
  canSearchUsers: true,
  abTestExperimentId: 'default',
};

function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), millis),
  );
}

function mockConfluenceRecentApi({
  confluenceRecentPagesResponse,
  confluenceRecentSpacesResponse,
}: any) {
  fetchMock.get(
    new RegExp('/wiki/rest/recentlyviewed/1.0/recent/spaces'),
    confluenceRecentSpacesResponse,
  );
  fetchMock.get(
    new RegExp('/wiki/rest/recentlyviewed/1.0/recent'),
    confluenceRecentPagesResponse,
  );
}

function mockCrossProductSearchApi(delayMs: number, queryMockSearch: any) {
  fetchMock.post(
    new RegExp('/quicksearch/v1'),
    (request: Request, options: Options) => {
      const body = JSON.parse(options.body);
      const query = body.query;
      const filters = body.filters;
      const response = queryMockSearch(query, filters);
      const includesNavCompletionScope =
        body.scopes.indexOf(Scope.NavSearchCompleteConfluence) > -1;

      const scopeResponses = response.scopes
        .filter((scope: ScopeResult) => body.scopes.includes(scope.id))
        .map((scope: ScopeResult) => {
          const { results, ...rest } = scope;
          return {
            ...rest,
            results: results.slice(0, body.limit),
          };
        })
        .filter((scope: ScopeResult) => {
          if (!includesNavCompletionScope) {
            return scope.id === Scope.NavSearchCompleteConfluence
              ? false
              : true;
          } else {
            return true;
          }
        });

      return delay(delayMs, { ...response, scopes: scopeResponses });
    },
  );
}

function mockCrossProductExperimentApi(
  delayMs: number,
  queryMockExperiments: any,
) {
  fetchMock.post(
    new RegExp('/experiment/v1'),
    (request: Request, options: Options) => {
      const body = JSON.parse(options.body);
      const scopes = body.scopes;
      const results = queryMockExperiments(scopes);

      return delay(delayMs, results);
    },
  );
}

function mockPeopleApi(delayMs: number, queryPeopleSearch: any) {
  fetchMock.post(
    new RegExp('/graphql'),
    (request: Request, options: Options) => {
      const body = JSON.parse(options.body);
      const query = body.variables.displayName || '';
      const results = queryPeopleSearch(query);

      return delay(delayMs, results);
    },
  );
}

function mockJiraApi(delayMs: number, canSearchUsers: boolean) {
  fetchMock.get(new RegExp('rest/internal/2/productsearch/recent?'), async () =>
    delay(delayMs, jiraRecentResponseWithAttributes),
  );

  const permissionResponse = canSearchUsers
    ? permissionResponseWithUserPickerPermission
    : permissionResponseWithoutUserPickerPermission;
  fetchMock.get('/rest/api/2/mypermissions?permissions=USER_PICKER', async () =>
    delay(delayMs, permissionResponse),
  );
}

function mockAnalyticsApi() {
  fetchMock.mock('https://analytics.atlassian.com/analytics/events', 200);
}

function mockAutocompleteApi(delayMs: number, autocomplete: string[]) {
  fetchMock.get(
    new RegExp('gateway/api/ccsearch-autocomplete'),
    (request: Request) => {
      const query = request.split('query=')[1];
      const tokens = query.split('+');
      const lastToken = tokens.slice(-1)[0];
      if (lastToken.length === 0) {
        return delay(delayMs, []);
      }
      if (lastToken === 'error') {
        return Promise.reject({
          code: 500,
          reason: 'Sensitive Data',
        });
      }
      const restTokens = tokens.slice(0, -1);
      const autocompleteList = autocomplete
        .filter((token) =>
          token.toLowerCase().startsWith(lastToken.toLowerCase()),
        )
        .map((token) => restTokens.concat([token]).join(' '));
      return delay(delayMs, autocompleteList);
    },
  );
}

export function setupMocks(configOverrides: Partial<MocksConfig> = {}) {
  const config = { ...DEFAULT_MOCKS_CONFIG, ...configOverrides };

  seedrandom('random seed', { global: true });
  const confluenceRecentPagesResponse = makeConfluenceRecentPagesData();
  const confluenceRecentSpacesResponse = makeConfluenceRecentSpacesData();
  const queryMockSearch = makeCrossProductSearchData();
  const autocompleteMockData = makeAutocompleteData();
  const queryMockExperiments = makeCrossProductExperimentData(
    config.abTestExperimentId,
  );
  const queryPeopleSearch = makePeopleSearchData();

  mockAnalyticsApi();
  mockCrossProductSearchApi(config.crossProductSearchDelay, queryMockSearch);
  mockCrossProductExperimentApi(
    config.crossProductSearchDelay,
    queryMockExperiments,
  );
  mockPeopleApi(config.peopleSearchDelay, queryPeopleSearch);
  mockConfluenceRecentApi({
    confluenceRecentPagesResponse,
    confluenceRecentSpacesResponse,
  });
  mockJiraApi(config.jiraRecentDelay, config.canSearchUsers);
  mockAutocompleteApi(config.autocompleteDelay, autocompleteMockData);
}

export function setupAllRequestFailedMocks() {
  fetchMock.get('*', 400);
  fetchMock.post('*', 400);
}

export function teardownMocks() {
  fetchMock.restore();
}
