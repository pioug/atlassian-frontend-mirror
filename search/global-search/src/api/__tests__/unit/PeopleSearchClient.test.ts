import fetchMock from 'fetch-mock/cjs/client';
import PeopleSearchClient, { GraphqlResponse } from '../../PeopleSearchClient';
import { AnalyticsType, ResultType, PersonResult } from '../../../model/Result';
import { recentPeopleApiWillReturn } from '../../../__tests__/unit/helpers/_people-client-mocks';

describe('PeopleSearchClient', () => {
  let searchClient: PeopleSearchClient;

  beforeEach(() => {
    searchClient = new PeopleSearchClient('localhost', '123');
  });

  afterEach(fetchMock.restore);

  describe('getRecentPeople()', () => {
    it('should put cloudId into the graphql query', () => {
      recentPeopleApiWillReturn([]);
      searchClient.getRecentPeople();

      const call = fetchMock.calls('people')[0];
      // @ts-ignore
      const body = JSON.parse(call[1].body);

      expect(body.variables.cloudId).toEqual('123');
    });

    it('should return result items', async () => {
      recentPeopleApiWillReturn([
        {
          id: '123',
          fullName: 'fullName',
          avatarUrl: 'avatarUrl',
          department: 'department',
          title: 'abc',
          nickname: 'nickname',
        },
      ]);

      const items = await searchClient.getRecentPeople();
      expect(items).toHaveLength(1);

      const item = items[0] as PersonResult;

      expect(item.resultType).toEqual(ResultType.PersonResult);
      expect(item.mentionName).toEqual('nickname');
      expect(item.presenceMessage).toEqual('abc');
      expect(item.resultId).toEqual('people-123');
      expect(item.avatarUrl).toEqual('avatarUrl');
      expect(item.name).toEqual('fullName');
      expect(item.href).toEqual('/people/123');
      expect(item.analyticsType).toEqual(AnalyticsType.RecentPerson);
    });

    it('should return empty array when data.Collaborators is not defined', async () => {
      recentPeopleApiWillReturn({
        data: 'foo',
      } as GraphqlResponse);

      const items = await searchClient.getRecentPeople();
      expect(items).toEqual([]);
    });

    it('should return empty array when data.errors is defined', async () => {
      recentPeopleApiWillReturn({
        errors: [
          {
            message: 'error1',
            category: 'category',
          },
        ],
      });

      const items = await searchClient.getRecentPeople();
      expect(items).toEqual([]);
    });
  });
});
