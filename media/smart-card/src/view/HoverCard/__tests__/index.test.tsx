jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../../utils/analytics/analytics');

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
import { fireEvent, render, cleanup } from '@testing-library/react';
import { fakeFactory } from '../../../utils/mocks';
import { CardClient } from '@atlaskit/link-provider';
import { Provider } from '../../..';
import * as analytics from '../../../utils/analytics/analytics';
import { Card } from '../../Card';
import { IntlProvider } from 'react-intl-next';
import {
  mockConfluenceResponse,
  mockJiraResponse,
  mockIframelyResponse,
} from './__mocks__/mocks';

describe('HoverCard', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;

  const setup = async (mock: any = mockConfluenceResponse) => {
    mockFetch = jest.fn(() => Promise.resolve(mock));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://some.url';

    const { queryByTestId, findByTestId } = render(
      <IntlProvider locale="en">
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} showHoverPreview={true} />
        </Provider>
      </IntlProvider>,
    );

    const element = await findByTestId('inline-card-resolved-view');
    jest.useFakeTimers();
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('April 1, 2022 00:00:00').getTime());

    fireEvent.mouseEnter(element);

    return { findByTestId, queryByTestId, element };
  };

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    cleanup();
  });

  it('renders hover card', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const hoverCard = await findByTestId('hover-card');

    expect(hoverCard).toBeTruthy();
  });

  it('renders hover card blocks', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const titleBlock = await findByTestId('smart-block-title-resolved-view');
    await findByTestId('smart-block-metadata-resolved-view');
    const snippetBlock = await findByTestId(
      'smart-block-snippet-resolved-view',
    );
    const footerBlock = await findByTestId('smart-footer-block-resolved-view');
    //trim because the icons are causing new lines in the textContent
    expect(titleBlock.textContent?.trim()).toBe('I love cheese');
    expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
    expect(footerBlock.textContent?.trim()).toBe('ConfluenceCommentPreview');
  });

  describe('metadata', () => {
    it('renders correctly for confluence links', async () => {
      const { findByTestId } = await setup();
      jest.runAllTimers();
      await findByTestId('authorgroup-metadata-element');
      const createdBy = await findByTestId('createdby-metadata-element');
      const commentCount = await findByTestId('commentcount-metadata-element');
      const reactCount = await findByTestId('reactcount-metadata-element');

      expect(createdBy.textContent).toBe('Created by Michael Schrute');
      expect(commentCount.textContent).toBe('4');
      expect(reactCount.textContent).toBe('8');
    });

    it('renders correctly for jira links', async () => {
      const { findByTestId } = await setup(mockJiraResponse);
      jest.runAllTimers();
      await findByTestId('authorgroup-metadata-element');
      const priority = await findByTestId('priority-metadata-element');
      const state = await findByTestId('state-metadata-element');

      expect(priority.textContent).toBe('Major');
      expect(state.textContent).toBe('Done');
    });

    it('renders correctly for other providers', async () => {
      const { findByTestId } = await setup(mockIframelyResponse);
      jest.runAllTimers();
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      const modifiedOn = await findByTestId('modifiedon-metadata-element');

      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(modifiedOn.textContent).toBe('Updated on January 1, 2022');
    });
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
    const { findByTestId, queryByTestId, element } = await setup();

    jest.runAllTimers();

    const hoverCard = await findByTestId('smart-links-container');
    fireEvent.mouseLeave(element);
    fireEvent.mouseEnter(hoverCard);

    jest.runAllTimers();

    expect(queryByTestId('hover-card')).not.toBeNull();
  });

  it('should hide if mouse moves leaves the hover card', async () => {
    const { findByTestId, queryByTestId, element } = await setup();

    jest.runAllTimers();

    const hoverCard = await findByTestId('smart-links-container');
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

  it('should render smartlink actions', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const commentButton = await findByTestId('comment');
    const previewButton = await findByTestId('preview-content');

    expect(commentButton.textContent).toBe('Comment');
    expect(previewButton.textContent).toBe('Preview');
  });

  it('should open preview modal after clicking preview button', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const previewButton = await findByTestId('preview-content');
    fireEvent.click(previewButton);
    const previewModal = await findByTestId('preview-modal');

    expect(previewModal).toBeTruthy();
  });

  it('should render open action', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const openButton = await findByTestId('hover-card-open-button');

    expect(openButton).toBeTruthy();
  });

  it('should open url in a new tab after clicking open button', async () => {
    const mockOpen = jest.fn();
    // @ts-ignore
    global.open = mockOpen;
    const { findByTestId } = await setup();
    jest.runAllTimers();

    await findByTestId('smart-block-title-resolved-view');
    const openButton = await findByTestId('hover-card-open-button');
    fireEvent.click(openButton);

    expect(open).toHaveBeenCalledWith('https://some.url', '_blank');
    mockOpen.mockRestore();
  });

  describe('analytics', () => {
    it('should fire viewed event when hover card is opened', async () => {
      const mock = jest.spyOn(analytics, 'uiHoverCardViewedEvent');

      const { findByTestId } = await setup();
      jest.runAllTimers();

      //wait for card to be resolved
      await findByTestId('smart-block-title-resolved-view');
      expect(analytics.uiHoverCardViewedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiHoverCardViewedEvent).toHaveBeenCalledWith(
        'card',
        'd1',
        'confluence-object-provider',
        undefined,
      );
      mock.mockRestore();
    });

    it('should fire closed event when hover card is opened then closed', async () => {
      const mock = jest.spyOn(analytics, 'uiHoverCardDismissedEvent');

      const { queryByTestId, findByTestId, element } = await setup();
      jest.runAllTimers();
      // wait for card to be resolved
      await findByTestId('smart-block-title-resolved-view');
      fireEvent.mouseLeave(element);
      jest.runAllTimers();
      expect(queryByTestId('hover-card')).toBeNull();

      expect(analytics.uiHoverCardDismissedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiHoverCardDismissedEvent).toHaveBeenCalledWith(
        'card',
        0,
        'd1',
        'confluence-object-provider',
        undefined,
      );
      mock.mockRestore();
    });

    it('should fire clicked event when open button is clicked', async () => {
      jest.spyOn(analytics, 'uiHoverCardOpenLinkClickedEvent');

      const { findByTestId } = await setup();
      jest.runAllTimers();
      // wait for card to be resolved
      await findByTestId('smart-block-title-resolved-view');
      const openButton = await findByTestId('hover-card-open-button');
      fireEvent.click(openButton);

      expect(analytics.uiHoverCardOpenLinkClickedEvent).toHaveBeenCalledTimes(
        1,
      );
      expect(analytics.uiHoverCardOpenLinkClickedEvent).toHaveBeenCalledWith(
        'card',
        'd1',
        'confluence-object-provider',
        undefined,
      );
    });
  });
});
