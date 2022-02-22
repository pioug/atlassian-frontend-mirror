jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../../utils/analytics/analytics');

const mockAPIError = jest.fn();
jest.doMock('../../../client/errors', () => ({
  APIError: mockAPIError,
}));

import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import CardClient from '../../../client';
import { Card, CardAppearance } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { TitleBlock } from '../../FlexibleCard/components/blocks';

describe('smart-card: card states, flexible', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;

  beforeEach(() => {
    mockFetch = jest.fn(() => Promise.resolve(mocks.success));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://some.url';
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('render method: withUrl', () => {
    describe('> state: resolved', () => {
      it('flexible: should render with metadata when resolved', async () => {
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedViewName = await waitForElement(() =>
          getByText('I love cheese'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should re-render when URL changes', async () => {
        const { getByText, rerender } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedView = await waitForElement(() =>
          getByText('I love cheese'),
        );
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <Provider client={mockClient}>
            <Card appearance="block" url="https://google.com">
              <TitleBlock />
            </Card>
          </Provider>,
        );
        await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should not re-render when appearance changes', async () => {
        const { getByText, rerender } = render(
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedView = await waitForElement(() =>
          getByText('I love cheese'),
        );
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });
  });

  describe('render method: withData', () => {
    describe('> state: resolved', () => {
      it('flexible: renders successfully with data', async () => {
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} data={mocks.success.data}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedViewName = await waitForElement(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitForElement(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
      });
    });
  });

  describe.each([
    'inline' as CardAppearance,
    'block' as CardAppearance,
    'embed' as CardAppearance,
  ])('with %s card appearance', (appearance: CardAppearance) => {
    const testId = 'smart-links-container'; // default Flexible UI container testId
    it('renders Flexible UI when card is %s', async () => {
      const { getByTestId } = render(
        <Provider client={mockClient}>
          <Card appearance={appearance} url={mockUrl}>
            <TitleBlock />
          </Card>
        </Provider>,
      );
      const block = await waitForElement(() => getByTestId(testId));
      expect(block).toBeTruthy();
    });

    it('does not render Flexible UI when card has no children', () => {
      const { queryByTestId } = render(
        <Provider client={mockClient}>
          <Card appearance={appearance} url={mockUrl} />
        </Provider>,
      );
      expect(queryByTestId(testId)).toBeNull();
    });

    it('does not render Flexible UI when card has no valid children', () => {
      const { queryByTestId } = render(
        <Provider client={mockClient}>
          <Card appearance={appearance} url={mockUrl}>
            <div>Test</div>
          </Card>
        </Provider>,
      );
      expect(queryByTestId(testId)).toBeNull();
    });
  });
});
