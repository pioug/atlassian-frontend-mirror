import fetchMock from 'fetch-mock/cjs/client';
import { GraphqlResponse, SearchResult } from '../../../api/PeopleSearchClient';

export function recentPeopleApiWillReturn(
  state: SearchResult[] | GraphqlResponse,
) {
  const response = Array.isArray(state)
    ? { data: { Collaborators: state } }
    : state;

  const opts = {
    name: 'people',
  };
  fetchMock.post('localhost/graphql', response, opts);
}
