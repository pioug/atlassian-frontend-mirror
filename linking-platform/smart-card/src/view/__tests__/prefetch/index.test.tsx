jest.mock('../../../utils/analytics/analytics');
jest.mock('../../../utils/shouldSample');
jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
jest.mock('uuid', () => {
	const actualUuid = jest.requireActual('uuid');
	return {
		...actualUuid,
		__esModule: true,
		default: jest.fn(),
	};
});

import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import { type CardClient } from '@atlaskit/link-provider';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import {
	MockIntersectionObserverFactory,
	type MockIntersectionObserverOpts,
} from '@atlaskit/link-test-helpers';
import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import * as jestExtendedMatchers from 'jest-extended';
import uuid from 'uuid';
import { type JestFunction } from '@atlaskit/media-test-helpers';
// ShouldSample needs to be loaded for beforeEach inside to be picked up before test runs
import '../../../utils/shouldSample';

expect.extend(jestExtendedMatchers);

describe('smart-card: prefetching of content', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockPrefetch: jest.Mock;
	let mockUrl: string;
	let mockGetEntries: jest.Mock;
	let mockIntersectionObserverOpts: MockIntersectionObserverOpts;

	const mockUuid = uuid as JestFunction<typeof uuid>;
	const mockStartUfoExperience = jest.spyOn(ufoWrapper, 'startUfoExperience');
	const mockSucceedUfoExperience = jest.spyOn(ufoWrapper, 'succeedUfoExperience');

	beforeEach(() => {
		mockFetch = jest.fn(() => Promise.resolve(mocks.success));
		mockPrefetch = jest.fn(() => Promise.resolve(mocks.success));
		mockClient = new (fakeFactory(mockFetch, undefined, mockPrefetch))();
		mockUrl = 'https://some.url';
		mockUuid.mockReturnValueOnce('some-uuid-1');
		mockGetEntries = jest.fn().mockImplementation(() => [{ isIntersecting: true }]);
		mockIntersectionObserverOpts = {
			disconnect: jest.fn(),
			getMockEntries: mockGetEntries,
		};
		// Gives us access to a mock IntersectionObserver, which we can
		// use to spoof visibility of a Smart Link.
		window.IntersectionObserver = MockIntersectionObserverFactory(mockIntersectionObserverOpts);
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
		jest.useFakeTimers();
		mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
		const { findByTestId } = render(
			<Provider client={mockClient}>
				<Card appearance="inline" url={mockUrl} />
			</Provider>,
		);
		const resolvedView = await findByTestId('inline-card-resolved-view');
		// In this test, only the fetch path should have been called
		// since prefetching is not meant to be triggered when a URL
		// is already in the viewport.
		// - Assertions that we rendered the correct Smart Link (and the store
		// has the correct data in it) ⬇️.
		expect(resolvedView).toBeTruthy();
		expect(resolvedView.textContent).toBe('I love cheese');
		// - Assertions that fetch was called ⬇️
		expect(mockFetch).toHaveBeenCalledTimes(1);
		// - Assertions that prefetch was not called ⬇️
		expect(mockPrefetch).not.toHaveBeenCalled();

		// Since there is a setTimeout in the window.IntersectionObserver, this test affected the other tests below it.
		// So I skipped 100ms to run properly the tests.
		jest.advanceTimersByTime(100);
		// - Assertions that we started and finished the UFO render experience in that order.
		expect(mockStartUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
		expect(mockSucceedUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1', {
			display: 'inline',
			extensionKey: 'object-provider',
		});
		expect(mockSucceedUfoExperience).toHaveBeenCalledAfter(mockStartUfoExperience as jest.Mock);
		jest.useRealTimers();
	});

	it('does prefetch URLs if they are not visible, rendering as lazy rendering placeholder', async () => {
		mockGetEntries.mockImplementation(() => [{ isIntersecting: false }]);
		const { findByTestId } = render(
			<Provider client={mockClient}>
				<Card appearance="inline" url={mockUrl} />
			</Provider>,
		);
		const lazyPlaceholderView = await findByTestId('lazy-render-placeholder');
		// In this test, the prefetch path is privileged, since the URL is not
		// in the viewport. The result in the DOM should be a placeholder for the link.
		// - Assertions that we rendered the correct Smart Link ⬇️.
		expect(lazyPlaceholderView).toBeTruthy();
		// - Assertions that fetch was not called ⬇️
		expect(mockFetch).not.toHaveBeenCalled();
		// - Assertions that prefetch was called ⬇️
		await waitFor(() => {
			expect(mockPrefetch).toHaveBeenCalledTimes(1);
		});

		// - Assertions that UFO experience has not been started or succeeded since
		// it is not in the viewport
		expect(mockStartUfoExperience).not.toHaveBeenCalled();
		expect(mockSucceedUfoExperience).not.toHaveBeenCalled();
	});

	it('loads a lazy rendering placeholder with the title text override if it is provided', async () => {
		mockGetEntries.mockImplementation(() => [{ isIntersecting: false }]);
		const { findByTestId } = render(
			<Provider client={mockClient}>
				<Card appearance="inline" url={mockUrl} placeholder="spaghetti" />
			</Provider>,
		);
		const lazyPlaceholderView = await findByTestId('lazy-render-placeholder');
		// In this test, the prefetch path is privileged, since the URL is not
		// in the viewport. The result in the DOM should be a placeholder for the link.
		// - Assertions that we rendered the correct Smart Link ⬇️.
		expect(lazyPlaceholderView).toBeTruthy();
		expect(lazyPlaceholderView.textContent).toBe('spaghetti');
		// - Assertions that fetch was not called ⬇️
		expect(mockFetch).not.toHaveBeenCalled();
		// - Assertions that prefetch was called ⬇️
		expect(mockPrefetch).toHaveBeenCalledTimes(1);

		// - Assertions that UFO experience has not been started or succeeded since
		// it is not in the viewport
		expect(mockStartUfoExperience).not.toHaveBeenCalled();
		expect(mockSucceedUfoExperience).not.toHaveBeenCalled();
	});

	it('converts a lazy render placeholder into a Smart Link when it enters the viewPort', async () => {
		mockGetEntries.mockImplementation(() => [{ isIntersecting: false }]);
		const { findByTestId } = render(
			<Provider client={mockClient}>
				<Card appearance="inline" url={mockUrl} />
			</Provider>,
		);
		const lazyPlaceholderView = await findByTestId('lazy-render-placeholder');
		// In this test, the prefetch path is privileged, since the URL is not
		// in the viewport. The result in the DOM should be a placeholder for the link.
		// - Assertions that we rendered the correct Smart Link ⬇️.
		expect(lazyPlaceholderView).toBeTruthy();

		// - Assertions that UFO experience has not been started or succeeded since
		// it is not in the viewport
		expect(mockStartUfoExperience).not.toHaveBeenCalled();
		expect(mockSucceedUfoExperience).not.toHaveBeenCalled();

		mockGetEntries.mockImplementation(() => [{ isIntersecting: false }, { isIntersecting: true }]);

		const resolvedView = await findByTestId('inline-card-resolved-view');

		expect(resolvedView).toBeTruthy();
		expect(resolvedView.textContent).toBe('I love cheese');

		// - Assertions that we started and finished the UFO render experience in that order.
		await waitFor(() => {
			expect(mockStartUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
		});
		await waitFor(() => {
			expect(mockSucceedUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1', {
				display: 'inline',
				extensionKey: 'object-provider',
			});
		});
		expect(mockSucceedUfoExperience).toHaveBeenCalledAfter(jest.mocked(mockStartUfoExperience));
	});
});
