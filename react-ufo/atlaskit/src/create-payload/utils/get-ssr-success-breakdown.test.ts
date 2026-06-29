// Mock the ssr module
jest.mock('../../ssr', () => ({
	getSSRSuccessBreakdown: jest.fn(),
}));

import * as ssr from '../../ssr';
import type { SsrSuccessBreakdown } from '../../ssr';

import getSSRSuccessBreakdown from './get-ssr-success-breakdown';

const SUCCESSFUL_BREAKDOWN: SsrSuccessBreakdown = {
	servedStaticFallback: false,
	notRendered: false,
	hadRuntimeError: false,
	circuitBreakerOpen: false,
	hadFailedResources: false,
	fetchAborted: false,
	emittedSuspenseFallback: false,
	hadEarlyFlushFailure: false,
	hadRouteResourceFailure: false,
	failedResources: [],
	failedResourceCount: 0,
	failedRouteResources: [],
	failedRouteResourceCount: 0,
};

describe('getSSRSuccessBreakdown', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return the breakdown object when getSsrSuccessBreakdown returns an object', () => {
		const breakdown = SUCCESSFUL_BREAKDOWN;
		(ssr.getSSRSuccessBreakdown as jest.Mock).mockReturnValue(breakdown);

		const result = getSSRSuccessBreakdown();

		expect(result).toEqual(breakdown);
		expect(ssr.getSSRSuccessBreakdown).toHaveBeenCalledTimes(1);
	});

	it('should return undefined when getSsrSuccessBreakdown returns undefined', () => {
		(ssr.getSSRSuccessBreakdown as jest.Mock).mockReturnValue(undefined);

		const result = getSSRSuccessBreakdown();

		expect(result).toBeUndefined();
		expect(ssr.getSSRSuccessBreakdown).toHaveBeenCalledTimes(1);
	});

	it('returns the breakdown verbatim (acts as a pure pass-through)', () => {
		// The "not configured" path lives in ssr/index.ts behind the
		// `!config?.getSsrSuccessBreakdown` guard and is covered by
		// `ssr/test.ts`. Here we pin that the wrapper is a no-op pass-through:
		// whatever the underlying ssr.getSSRSuccessBreakdown produces is
		// returned verbatim (same object reference, no transformation).
		const partial: SsrSuccessBreakdown = { ...SUCCESSFUL_BREAKDOWN, circuitBreakerOpen: true };
		(ssr.getSSRSuccessBreakdown as jest.Mock).mockReturnValue(partial);

		expect(getSSRSuccessBreakdown()).toBe(partial);
	});
});
