import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook } from '@atlassian/testing-library';

import { mocks } from '../../../../utils/mocks';
import { useSmartCardState } from '../../../store';
import { useSmartLinkCrossProductUrlWrapper } from '../../use-smart-link-cross-product-url-wrapper';
import { useDestinationUrl } from '../index';

jest.mock('../../../store', () => ({
	useSmartCardState: jest.fn(),
}));

jest.mock('../../use-smart-link-cross-product-url-wrapper', () => ({
	useSmartLinkCrossProductUrlWrapper: jest.fn(),
}));

const url = 'https://start.atlassian.com';
const xpcUrl = 'https://start.atlassian.com/resolved?xpis=abc123';

const mockResolved = () => {
	(useSmartCardState as jest.Mock).mockReturnValue({
		status: 'resolved',
		details: mocks.success,
	});
};

const mockPending = () => {
	(useSmartCardState as jest.Mock).mockReturnValue({
		status: 'pending',
		details: undefined,
	});
};

const mockErrored = () => {
	(useSmartCardState as jest.Mock).mockReturnValue({
		status: 'errored',
		details: undefined,
	});
};

const mockXpcWrapper = (wrappedUrl: string) => {
	(useSmartLinkCrossProductUrlWrapper as jest.Mock).mockReturnValue((_: string) => wrappedUrl);
};

const mockIdentityWrapper = () => {
	(useSmartLinkCrossProductUrlWrapper as jest.Mock).mockReturnValue((u: string) => u);
};

describe('useDestinationUrl', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('when link is resolved', () => {
		ffTest.on('platform_smartlink_xpc_url_wrapping', '', () => {
			it('returns XPC-wrapped URL when wrapper appends params', () => {
				mockResolved();
				mockXpcWrapper(xpcUrl);

				const { current } = renderHook(() => useDestinationUrl(url));

				expect(current).toBe(xpcUrl);
			});

			it('returns raw url when wrapper is identity (non-1P link)', () => {
				mockResolved();
				mockIdentityWrapper();

				const { current } = renderHook(() => useDestinationUrl(url));

				expect(current).toBe(url);
			});
		});

		ffTest.off('platform_smartlink_xpc_url_wrapping', '', () => {
			it('falls back to the raw url', () => {
				mockResolved();
				mockXpcWrapper(xpcUrl);

				const { current } = renderHook(() => useDestinationUrl(url));

				expect(current).toBe(url);
			});
		});
	});

	describe('when link is pending (not yet resolved)', () => {
		ffTest.both('platform_smartlink_xpc_url_wrapping', '', () => {
			it('falls back to the raw url', () => {
				mockPending();
				mockIdentityWrapper();

				const { current } = renderHook(() => useDestinationUrl(url));

				expect(current).toBe(url);
			});

			it('falls back to raw url when details is undefined (getClickUrl returns undefined)', () => {
				mockPending();
				mockIdentityWrapper();

				const { current } = renderHook(() => useDestinationUrl(url));

				// When details is undefined, getClickUrl returns undefined → fallback to raw url
				expect(current).toBe(url);
			});
		});
	});

	describe('when link has errored', () => {
		ffTest.both('platform_smartlink_xpc_url_wrapping', '', () => {
			it('falls back to the raw url', () => {
				mockErrored();
				mockIdentityWrapper();

				const { current } = renderHook(() => useDestinationUrl(url));

				expect(current).toBe(url);
			});
		});
	});
});
