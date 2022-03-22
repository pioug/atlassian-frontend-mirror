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

  const setup = async () => {
    jest.useFakeTimers();

    mockFetch = jest.fn(() => Promise.resolve(mockResponse));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://some.url';

    const { getByTestId, queryByTestId } = render(
      <Provider client={mockClient}>
        <HoverCard url={mockUrl}>
          <span data-testid="element-to-hover" />
        </HoverCard>
      </Provider>,
    );

    const element = await waitForElement(() => getByTestId('element-to-hover'));
    fireEvent.mouseEnter(element);

    return { getByTestId, queryByTestId, element };
  };

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('renders hover card', async () => {
    const { getByTestId } = await setup();
    jest.runAllTimers();
    const hoverCard = await waitForElement(() => getByTestId('hover-card'));

    expect(hoverCard).toBeTruthy();
  });

  it('renders hover card blocks', async () => {
    const { getByTestId } = await setup();
    jest.runAllTimers();
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
    expect(footerBlock.textContent?.trim()).toBe('ConfluenceCommentPreview');
  });

  describe('when mouse moves over the child', () => {
    it('should wait a default delay before showing', async () => {
      const { queryByTestId } = await setup();

      // Delay not completed yet
      jest.advanceTimersByTime(299);

      expect(queryByTestId('hover-card')).toBeNull();

      // Delay completed
      jest.advanceTimersByTime(1);

      expect(queryByTestId('hover-card')).not.toBeNull();
    });

    it('should wait a default delay before hiding', async () => {
      const { queryByTestId, element } = await setup();
      jest.runAllTimers();
      fireEvent.mouseLeave(element);

      // Delay not completed yet
      jest.advanceTimersByTime(299);

      expect(queryByTestId('hover-card')).not.toBeNull();

      // Delay completed
      jest.advanceTimersByTime(1);

      expect(queryByTestId('hover-card')).toBeNull();
    });
  });

  it('should stay shown if theres a mouseEnter before the delay elapses', async () => {
    const { queryByTestId, element } = await setup();
    jest.runAllTimers();
    fireEvent.mouseLeave(element);

    // Delay not completed yet
    jest.advanceTimersByTime(299);
    expect(queryByTestId('hover-card')).not.toBeNull();

    fireEvent.mouseEnter(element);

    // Delay completed
    jest.advanceTimersByTime(1);

    expect(queryByTestId('hover-card')).not.toBeNull();
  });

  it('should stay hidden if theres a mouseLeave before the delay elapses', async () => {
    const { queryByTestId, element } = await setup();

    // Delay not completed yet
    jest.advanceTimersByTime(299);

    expect(queryByTestId('hover-card')).toBeNull();
    fireEvent.mouseLeave(element);

    // Delay completed
    jest.advanceTimersByTime(1);

    expect(queryByTestId('hover-card')).toBeNull();
  });

  it('should stay shown if mouse moves over the hover card', async () => {
    const { getByTestId, queryByTestId, element } = await setup();

    jest.runAllTimers();

    const hoverCard = await waitForElement(() =>
      getByTestId('smart-links-container'),
    );
    fireEvent.mouseLeave(element);
    fireEvent.mouseEnter(hoverCard);

    jest.runAllTimers();

    expect(queryByTestId('hover-card')).not.toBeNull();
  });

  it('should hide if mouse moves leaves the hover card', async () => {
    const { getByTestId, queryByTestId, element } = await setup();

    jest.runAllTimers();

    const hoverCard = await waitForElement(() =>
      getByTestId('smart-links-container'),
    );
    fireEvent.mouseLeave(element);
    fireEvent.mouseEnter(hoverCard);
    fireEvent.mouseLeave(hoverCard);

    jest.runAllTimers();

    expect(queryByTestId('hover-card')).toBeNull();
  });

  it('should hide after pressing escape', async () => {
    const { queryByTestId } = await setup();

    jest.runAllTimers();

    fireEvent.keyDown(document, { key: 'Escape', code: 27 });

    expect(queryByTestId('hover-card')).toBeNull();
  });

  it('should render actions', async () => {
    const { getByTestId } = await setup();
    jest.runAllTimers();
    const commentButton = await waitForElement(() => getByTestId('comment'));
    const previewButton = await waitForElement(() =>
      getByTestId('preview-content'),
    );

    expect(commentButton.textContent).toBe('Comment');
    expect(previewButton.textContent).toBe('Preview');
  });

  it('should open preview modal after clicking preview button', async () => {
    const { getByTestId } = await setup();
    jest.runAllTimers();
    const previewButton = await waitForElement(() =>
      getByTestId('preview-content'),
    );
    fireEvent.click(previewButton);
    const previewModal = await waitForElement(() =>
      getByTestId('preview-modal'),
    );
    expect(previewModal).toBeTruthy();
  });
});
