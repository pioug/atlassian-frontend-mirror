import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import type { CardContext } from '@atlaskit/link-provider/types';
import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import type { ProductType } from '@atlaskit/linking-common/types';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { renderHook } from '@atlassian/testing-library';

import { getIsFirstPartyLink } from '../getIsFirstPartyLink';
import { useSmartLinkCrossProductUrlWrapper } from '../index';

type SmartLinkMetaWithFirstPartySignal = SmartLinkResponse['meta'] & {
	is1PLink?: boolean;
};

jest.mock('@atlaskit/analytics-cross-product/useCrossProductUrlWrapper', () => ({
	useCrossProductUrlWrapper: jest.fn(),
}));

jest.mock('@atlaskit/link-provider/use-smart-link-context', () => ({
	...jest.requireActual('@atlaskit/link-provider/use-smart-link-context'),
	useSmartLinkContext: jest.fn(),
}));

const mockUseCrossProductUrlWrapper = useCrossProductUrlWrapper as jest.MockedFunction<
	typeof useCrossProductUrlWrapper
>;
const mockUseSmartLinkContext = useSmartLinkContext as jest.MockedFunction<
	typeof useSmartLinkContext
>;

const makeDetails = (isFirstPartyLink?: boolean): SmartLinkResponse => ({
	meta: {
		access: 'granted',
		visibility: 'public',
		...(isFirstPartyLink === undefined ? {} : { is1PLink: isFirstPartyLink }),
	} as SmartLinkMetaWithFirstPartySignal,
	data: undefined,
});

const mockSmartLinkContext = (product?: ProductType) => {
	mockUseSmartLinkContext.mockReturnValue({
		product,
	} as CardContext);
};

const renderUrlWrapper = (details?: SmartLinkResponse) =>
	renderHook(() => useSmartLinkCrossProductUrlWrapper({ details })).current;

describe('getIsFirstPartyLink', () => {
	it('returns true only when meta.is1PLink is true', () => {
		expect(getIsFirstPartyLink(makeDetails(true))).toBe(true);
		expect(getIsFirstPartyLink(makeDetails(false))).toBe(false);
		expect(getIsFirstPartyLink(makeDetails())).toBe(false);
		expect(getIsFirstPartyLink(undefined)).toBe(false);
	});
});

describe('useSmartLinkCrossProductUrlWrapper', () => {
	let wrapUrl: jest.MockedFunction<(url: string) => string>;

	beforeEach(() => {
		wrapUrl = jest.fn((url: string) => `${url}${url.includes('?') ? '&' : '?'}xpis=wrapped`);
		mockUseCrossProductUrlWrapper.mockReturnValue(wrapUrl);
		mockSmartLinkContext('CONFLUENCE');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('wraps first-party links with the cross-product Smart Links bridge', () => {
		const urlWrapper = renderUrlWrapper(makeDetails(true));

		expect(mockUseCrossProductUrlWrapper).toHaveBeenCalledWith({
			bridge: 'smartLinks',
			product: 'confluence',
		});
		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page?xpis=wrapped');
		expect(wrapUrl).toHaveBeenCalledWith('https://example.com/page');
	});

	it('does not wrap third-party links', () => {
		const urlWrapper = renderUrlWrapper(makeDetails(false));

		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('does not wrap when the first-party signal is missing', () => {
		const urlWrapper = renderUrlWrapper(makeDetails());

		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('does not wrap when details are undefined', () => {
		const urlWrapper = renderUrlWrapper();

		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('does not wrap when the Smart Link context has no product', () => {
		mockSmartLinkContext(undefined);

		const urlWrapper = renderUrlWrapper(makeDetails(true));

		expect(mockUseCrossProductUrlWrapper).toHaveBeenCalledWith({
			bridge: 'smartLinks',
			product: 'unknown',
		});
		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('does not double-wrap URLs that already include the xpis query param', () => {
		const urlWrapper = renderUrlWrapper(makeDetails(true));

		expect(urlWrapper('https://example.com/page?xpis=existing')).toBe(
			'https://example.com/page?xpis=existing',
		);
		expect(urlWrapper('/wiki/spaces/ABC?xpis=existing')).toBe('/wiki/spaces/ABC?xpis=existing');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('returns malformed URLs unchanged without invoking the upstream wrapper', () => {
		const urlWrapper = renderUrlWrapper(makeDetails(true));
		const malformedUrl = 'http://[::1';

		expect(urlWrapper(malformedUrl)).toBe(malformedUrl);
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	describe('SSR (no window)', () => {
		let originalWindow: typeof global.window;

		afterEach(() => {
			(global as any).window = originalWindow;
		});

		it('returns the URL unchanged during server-side rendering', () => {
			// Render while window is still present, then simulate SSR by removing it
			const urlWrapper = renderUrlWrapper(makeDetails(true));
			originalWindow = global.window;
			delete (global as any).window;

			expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
			expect(wrapUrl).not.toHaveBeenCalled();
		});
	});
});
