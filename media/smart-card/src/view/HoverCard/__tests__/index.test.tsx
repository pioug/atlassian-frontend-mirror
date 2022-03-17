jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../../utils/analytics/analytics');
const mockAPIError = jest.fn();
jest.doMock('../../../client/errors', () => ({
  APIError: mockAPIError,
}));

// force isIntersectionObserverSupported to be false until support for it is dropped.
jest.mock('@atlaskit/media-ui', () => {
  const actualModule = jest.requireActual('@atlaskit/media-ui');
  return {
    __esModule: true,
    ...actualModule,
    isIntersectionObserverSupported: () => false,
  };
});

import React from 'react';
import {
  fireEvent,
  render,
  waitForElement,
  cleanup,
} from '@testing-library/react';
import { HoverCard } from '..';
import { fakeFactory } from '../../../utils/mocks';
import CardClient from '../../../client';
import { Provider } from '../../..';
import { JsonLd } from 'json-ld-types';

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
    summary: 'Here is your serving of cheese: 🧀',
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
} as JsonLd.Response;

describe('HoverCard', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;

  beforeEach(() => {
    mockFetch = jest.fn(() => Promise.resolve(mockResponse));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://some.url';
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders hover card', async () => {
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <HoverCard url={mockUrl}>
          <span data-testid="element-to-hover" />
        </HoverCard>
      </Provider>,
    );

    const element = await waitForElement(() => getByTestId('element-to-hover'));
    fireEvent.mouseOver(element);
    const hoverCard = await waitForElement(() => getByTestId('hover-card'));

    expect(hoverCard).toBeTruthy();
  });

  it('renders hover card blocks', async () => {
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <HoverCard url={mockUrl}>
          <span data-testid="element-to-hover" />
        </HoverCard>
      </Provider>,
    );

    const element = await waitForElement(() => getByTestId('element-to-hover'));
    fireEvent.mouseOver(element);
    const titleBlock = await waitForElement(() =>
      getByTestId('smart-block-title-resolved-view'),
    );
    const snippetBlock = await waitForElement(() =>
      getByTestId('smart-block-snippet-resolved-view'),
    );
    const footerBlock = await waitForElement(() =>
      getByTestId('smart-footer-block-resolved-view'),
    );

    //trim because the icons are causing new lines in the textContent
    expect(titleBlock.textContent?.trim()).toBe('I love cheese');
    expect(snippetBlock.textContent).toBe('Here is your serving of cheese: 🧀');
    expect(footerBlock.textContent?.trim()).toBe('Confluence');
  });
});
