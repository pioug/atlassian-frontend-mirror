/** @jsx jsx */
import { jsx } from '@emotion/core';

import { HoverCard } from '../src/view/HoverCard';
import { VRTestWrapper } from './utils/vr-test';
import { Provider, Client, ResolveResponse } from '../src';

const mockResponse = {
  meta: {
    visibility: 'public',
    access: 'granted',
    auth: [],
    definitionId: 'd1',
    key: 'object-provider',
  },
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': 'Object',
    name: 'I love cheese',
    summary: 'Here is your serving of cheese',
    'schema:potentialAction': {
      '@id': 'comment',
      '@type': 'CommentAction',
      identifier: 'object-provider',
      name: 'Comment',
    },
    preview: {
      href: 'https://www.ilovecheese.com',
    },
    url: 'https://some.url',
    generator: {
      '@type': 'Application',
      '@id': 'https://www.atlassian.com/#Confluence',
      name: 'Confluence',
    },
  },
};

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(mockResponse as ResolveResponse);
  }
}

export default () => (
  <VRTestWrapper title="Hover Card">
    <Provider client={new CustomClient('staging')}>
      <HoverCard url={'https://www.mockurl.com'}>
        <span data-testid="text-to-hover">test123</span>
      </HoverCard>
    </Provider>
  </VRTestWrapper>
);
