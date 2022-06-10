jest.mock('../../../utils/analytics/analytics');
jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.mock('uuid', () => {
  const actualUuid = jest.requireActual('uuid');
  return {
    ...actualUuid,
    __esModule: true,
    default: jest.fn(),
  };
});

import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import { CardClient } from '@atlaskit/link-provider';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import {
  MockIntersectionObserverFactory,
  MockIntersectionObserverOpts,
} from '../../__mocks__/intersection-observer';
import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import 'jest-extended';
import uuid from 'uuid';
import { JestFunction } from '@atlaskit/media-test-helpers';

describe('smart-card: prefetching of content', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockPrefetch: jest.Mock;
  let mockUrl: string;
  let mockGetEntries: jest.Mock;
  let mockIntersectionObserverOpts: MockIntersectionObserverOpts;

  const mockUuid = uuid as JestFunction<typeof uuid>;
  const mockStartUfoExperience = jest.spyOn(ufoWrapper, 'startUfoExperience');
  const mockSucceedUfoExperience = jest.spyOn(
    ufoWrapper,
    'succeedUfoExperience',
  );

  beforeEach(() => {
    mockFetch = jest.fn(() => Promise.resolve(mocks.success));
    mockPrefetch = jest.fn(() => Promise.resolve(mocks.success));
    mockClient = new (fakeFactory(mockFetch, undefined, mockPrefetch))();
    mockUrl = 'https://some.url';
    mockUuid.mockReturnValueOnce('some-uuid-1');
    mockGetEntries = jest
      .fn()
      .mockImplementation(() => [{ isIntersecting: true }]);
    mockIntersectionObserverOpts = {
      disconnect: jest.fn(),
      getMockEntries: mockGetEntries,
    };
    // Gives us access to a mock IntersectionObserver, which we can
    // use to spoof visibility of a Smart Link.
    window.IntersectionObserver = MockIntersectionObserverFactory(
      mockIntersectionObserverOpts,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockUuid.mockReset();
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('does not prefetch URLs if they are already visible, rendering as Smart Link', async () => {
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <Card appearance="inline" url={mockUrl} />
      </Provider>,
    );
    const resolvedView = await waitForElement(() =>
      getByTestId('inline-card-resolved-view'),
    );
    // In this test, only the fetch path should have been called
    // since prefetching is not meant to be triggered when a URL
    // is already in the viewport.
    // - Assertions that we rendered the correct Smart Link (and the store
    // has the correct data in it) ⬇️.
    expect(resolvedView).toBeTruthy();
    expect(resolvedView.textContent).toBe('I love cheese');
    // - Assertions that fetch was called ⬇️
    expect(mockFetch).toBeCalled();
    expect(mockFetch).toBeCalledTimes(1);
    // - Assertions that prefetch was not called ⬇️
    expect(mockPrefetch).not.toHaveBeenCalled();

    // - Assertions that we started and finished the UFO render experience in that order.
    expect(mockStartUfoExperience).toBeCalledWith(
      'smart-link-rendered',
      'some-uuid-1',
    );
    expect(mockSucceedUfoExperience).toBeCalledWith(
      'smart-link-rendered',
      'some-uuid-1',
      {
        display: 'inline',
        extensionKey: 'object-provider',
      },
    );
    expect(mockSucceedUfoExperience).toHaveBeenCalledAfter(
      mockStartUfoExperience as jest.Mock,
    );
  });

  it('does prefetch URLs if they are not visible, rendering as lazy rendering placeholder', async () => {
    mockGetEntries.mockImplementation(() => [{ isIntersecting: false }]);
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <Card appearance="inline" url={mockUrl} />
      </Provider>,
    );
    const lazyPlaceholderView = await waitForElement(() =>
      getByTestId('lazy-render-placeholder'),
    );
    // In this test, the prefetch path is privileged, since the URL is not
    // in the viewport. The result in the DOM should be a placeholder for the link.
    // - Assertions that we rendered the correct Smart Link ⬇️.
    expect(lazyPlaceholderView).toBeTruthy();
    // - Assertions that fetch was not called ⬇️
    expect(mockFetch).not.toBeCalled();
    // - Assertions that prefetch was called ⬇️
    expect(mockPrefetch).toBeCalled();
    expect(mockPrefetch).toBeCalledTimes(1);

    // - Assertions that UFO experience has not been started or succeeded since
    // it is not in the viewport
    expect(mockStartUfoExperience).not.toHaveBeenCalled();
    expect(mockSucceedUfoExperience).not.toHaveBeenCalled();
  });

  it('loads a lazy rendering placeholder with the title text override if it is provided', async () => {
    mockGetEntries.mockImplementation(() => [{ isIntersecting: false }]);
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <Card appearance="inline" url={mockUrl} placeholder="spaghetti" />
      </Provider>,
    );
    const lazyPlaceholderView = await waitForElement(() =>
      getByTestId('lazy-render-placeholder'),
    );
    // In this test, the prefetch path is privileged, since the URL is not
    // in the viewport. The result in the DOM should be a placeholder for the link.
    // - Assertions that we rendered the correct Smart Link ⬇️.
    expect(lazyPlaceholderView).toBeTruthy();
    expect(lazyPlaceholderView.textContent).toBe('spaghetti');
    // - Assertions that fetch was not called ⬇️
    expect(mockFetch).not.toBeCalled();
    // - Assertions that prefetch was called ⬇️
    expect(mockPrefetch).toBeCalled();
    expect(mockPrefetch).toBeCalledTimes(1);

    // - Assertions that UFO experience has not been started or succeeded since
    // it is not in the viewport
    expect(mockStartUfoExperience).not.toHaveBeenCalled();
    expect(mockSucceedUfoExperience).not.toHaveBeenCalled();
  });

  it('converts a lazy render placeholder into a Smart Link when it enters the viewPort', async () => {
    mockGetEntries.mockImplementation(() => [{ isIntersecting: false }]);
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <Card appearance="inline" url={mockUrl} />
      </Provider>,
    );
    const lazyPlaceholderView = await waitForElement(() =>
      getByTestId('lazy-render-placeholder'),
    );
    // In this test, the prefetch path is privileged, since the URL is not
    // in the viewport. The result in the DOM should be a placeholder for the link.
    // - Assertions that we rendered the correct Smart Link ⬇️.
    expect(lazyPlaceholderView).toBeTruthy();

    // - Assertions that UFO experience has not been started or succeeded since
    // it is not in the viewport
    expect(mockStartUfoExperience).not.toHaveBeenCalled();
    expect(mockSucceedUfoExperience).not.toHaveBeenCalled();

    mockGetEntries.mockImplementation(() => [
      { isIntersecting: false },
      { isIntersecting: true },
    ]);

    const resolvedView = await waitForElement(() =>
      getByTestId('inline-card-resolved-view'),
    );

    expect(resolvedView).toBeTruthy();
    expect(resolvedView.textContent).toBe('I love cheese');

    // - Assertions that we started and finished the UFO render experience in that order.
    expect(mockStartUfoExperience).toBeCalledWith(
      'smart-link-rendered',
      'some-uuid-1',
    );
    expect(mockSucceedUfoExperience).toBeCalledWith(
      'smart-link-rendered',
      'some-uuid-1',
      {
        display: 'inline',
        extensionKey: 'object-provider',
      },
    );
    expect(mockSucceedUfoExperience).toHaveBeenCalledAfter(
      mockStartUfoExperience as jest.Mock,
    );
  });
});
