import {
  SearchProvider,
  QuickSearchResult,
} from '@atlaskit/editor-common/provider-factory';

const mockedData: QuickSearchResult[] = [
  {
    container: 'Editor Media',
    contentType: 'confluence.page',
    objectId:
      'ari:cloud:confluence:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:content/1538426521',
    title: 'Editor Media Planning - 2020-07-07',
    updatedTimestamp: '2020-07-07T03:24:39+00:00',
    url:
      'https://product-fabric.atlassian.net/wiki/spaces/EM/pages/1538426521/Editor+Media+Planning+-+2020-07-07',
  },
  {
    container: 'Media Platform Team',
    contentType: 'confluence.page',
    objectId:
      'ari:cloud:confluence:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:content/873989347',
    title: 'Weekly Media Triad Meeting',
    updatedTimestamp: '2020-07-05T23:30:42+00:00',
    url:
      'https://product-fabric.atlassian.net/wiki/spaces/FIL/pages/873989347/Weekly+Media+Triad+Meeting',
  },
  {
    container: 'Editor Media',
    contentType: 'confluence.page',
    objectId:
      'ari:cloud:confluence:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:content/1356074858',
    title: 'Media test Media single',
    updatedTimestamp: '2020-05-05T06:06:28+00:00',
    url:
      'https://product-fabric.atlassian.net/wiki/spaces/EM/pages/1356074858/Media+test+Media+single',
  },
  {
    container: 'Editor Media',
    contentType: 'confluence.page',
    objectId:
      'ari:cloud:confluence:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:content/1385631549',
    title: 'Editor Media OKRs',
    updatedTimestamp: '2020-06-09T02:21:27+00:00',
    url:
      'https://product-fabric.atlassian.net/wiki/spaces/EM/pages/1385631549/Editor+Media+OKRs',
  },
  {
    container: 'Editor',
    contentType: 'default',
    objectId:
      'ari:cloud:confluence:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:content/998082697',
    title: 'Media linking',
    updatedTimestamp: '2020-04-15T03:00:05+00:00',
    url:
      'https://product-fabric.atlassian.net/wiki/spaces/E/pages/998082697/Media+linking',
  },
];

export default class MockSearchProvider implements SearchProvider {
  quickSearch(query: string, limit: number): Promise<QuickSearchResult[]> {
    return Promise.resolve(mockedData.slice(0, limit));
  }
}
