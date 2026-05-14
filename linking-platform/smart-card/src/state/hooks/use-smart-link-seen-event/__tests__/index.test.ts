import { act, renderHook } from '@atlassian/testing-library';

import { useAnalyticsEvents } from '../../../../common/analytics/generated/use-analytics-events';
import { useSmartLinkAnalyticsUtils } from '../../../../utils/analytics/SmartLinkAnalyticsContext';
import { useSmartLinkSeenEvent } from '../index';

jest.mock('../../../../common/analytics/generated/use-analytics-events');
jest.mock('../../../../utils/analytics/SmartLinkAnalyticsContext');

const mockFireEvent = jest.fn();
const mockGetByUrl = jest.fn();

const defaultProps = {
	appearance: 'inline' as const,
	url: 'https://example.com',
	id: 'test-id',
};

const defaultPayload = {
	attributes: { display: 'inline' as const },
};

describe('useSmartLinkSeenEvent', () => {
	beforeEach(() => {
		jest.mocked(useAnalyticsEvents).mockReturnValue({
			fireEvent: mockFireEvent,
		});
		jest.mocked(useSmartLinkAnalyticsUtils).mockReturnValue({
			getByUrl: mockGetByUrl.mockReturnValue(defaultPayload),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should not fire ui.smartLink.seen if only intersected but status not settled', () => {
		const result = renderHook(() => useSmartLinkSeenEvent(defaultProps));

		act(() => {
			result.current.onIntersecting();
		});

		expect(mockFireEvent).not.toHaveBeenCalled();
	});

	it('should not fire ui.smartLink.seen if status settled but not intersected', () => {
		const result = renderHook(() => useSmartLinkSeenEvent(defaultProps));

		act(() => {
			result.current.onStatusSettled('unauthorized');
		});

		expect(mockFireEvent).not.toHaveBeenCalled();
	});

	it('should fire ui.smartLink.seen when intersected then status settled as unauthorized', () => {
		const result = renderHook(() => useSmartLinkSeenEvent(defaultProps));

		act(() => {
			result.current.onIntersecting();
			result.current.onStatusSettled('unauthorized');
		});

		expect(mockFireEvent).toHaveBeenCalledTimes(1);
		expect(mockFireEvent).toHaveBeenCalledWith('ui.smartLink.seen', defaultPayload.attributes);
	});

	it('should fire ui.smartLink.seen when status settled as unauthorized then intersected', () => {
		const result = renderHook(() => useSmartLinkSeenEvent(defaultProps));

		act(() => {
			result.current.onStatusSettled('unauthorized');
			result.current.onIntersecting();
		});

		expect(mockFireEvent).toHaveBeenCalledTimes(1);
		expect(mockFireEvent).toHaveBeenCalledWith('ui.smartLink.seen', defaultPayload.attributes);
	});

	it.each(['resolved', 'forbidden', 'errored', 'not_found', 'pending'] as const)(
		'should not fire ui.smartLink.seen when status is %s',
		(status) => {
			const result = renderHook(() => useSmartLinkSeenEvent(defaultProps));

			act(() => {
				result.current.onIntersecting();
				result.current.onStatusSettled(status);
			});

			expect(mockFireEvent).not.toHaveBeenCalled();
		},
	);

	it('should fire ui.smartLink.seen only once even when callbacks are called multiple times', () => {
		const result = renderHook(() => useSmartLinkSeenEvent(defaultProps));

		act(() => {
			result.current.onIntersecting();
			result.current.onStatusSettled('unauthorized');
			// Repeat calls — should be no-ops
			result.current.onIntersecting();
			result.current.onStatusSettled('unauthorized');
		});

		expect(mockFireEvent).toHaveBeenCalledTimes(1);
	});

	it('should pass url to getByUrl', () => {
		const url = 'https://example.com/my-page';
		const result = renderHook(() => useSmartLinkSeenEvent({ ...defaultProps, url }));

		act(() => {
			result.current.onIntersecting();
			result.current.onStatusSettled('unauthorized');
		});

		expect(mockGetByUrl).toHaveBeenCalledWith(url, expect.anything());
	});
});
