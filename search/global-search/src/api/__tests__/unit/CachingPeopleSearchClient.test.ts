import fetchMock from 'fetch-mock/cjs/client';
import { PeopleSearchClient } from '../../PeopleSearchClient';
import { CachingPeopleSearchClient } from '../../CachingPeopleSearchClient';
import {
  AnalyticsType,
  ContentType,
  Result,
  ResultType,
} from '../../../model/Result';
import { recentPeopleApiWillReturn } from '../../../__tests__/unit/helpers/_people-client-mocks';

describe('CachingPeopleSearchClient', () => {
  let searchClient: PeopleSearchClient;
  const mockUser = [
    {
      id: '123',
      fullName: 'fullName',
      avatarUrl: 'avatarUrl',
      department: 'department',
      title: 'abc',
      nickname: 'nickname',
    },
  ];

  const expectedResults: Result[] = mockUser.map(person => ({
    resultType: ResultType.PersonResult,
    resultId: 'people-' + person.id,
    name: person.fullName,
    href: '/people/' + person.id,
    avatarUrl: person.avatarUrl,
    contentType: ContentType.Person,
    analyticsType: AnalyticsType.RecentPerson,
    mentionName: person.nickname,
    presenceMessage: person.title,
  }));

  beforeEach(() => {
    searchClient = new CachingPeopleSearchClient('localhost', '123');
    recentPeopleApiWillReturn(mockUser);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('getRecentItems', () => {
    it('should do an actual search if the pre-fetching isnt available', async () => {
      const items = await searchClient.getRecentPeople();

      expect(fetchMock.called()).toBeTruthy();
      expect(items).toEqual(expectedResults);
    });
  });
});
