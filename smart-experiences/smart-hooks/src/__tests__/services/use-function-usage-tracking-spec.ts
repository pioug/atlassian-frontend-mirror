import { act, renderHook } from '@testing-library/react-hooks';

import useFunctionUsageTracking from '../../services/use-function-usage-tracking';

describe('useFunctionUsageTracking hook', () => {
	it('should return not isUsed unless provided function is used', () => {
		const { result } = renderHook(() => useFunctionUsageTracking(jest.fn()));

		expect(result.current.isUsed).toBe(false);

		act(() => {
			result.current.trackingFunction();
		});

		expect(result.current.isUsed).toBe(true);

		act(() => {
			result.current.trackingFunction();
		});

		// check still isUsed for good measure
		expect(result.current.isUsed).toBe(true);
	});
});
