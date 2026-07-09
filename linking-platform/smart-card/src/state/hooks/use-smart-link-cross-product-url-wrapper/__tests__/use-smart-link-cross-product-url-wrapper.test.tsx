import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import { type CardContext, useSmartLinkContext } from '@atlaskit/link-provider';
import { type ProductType } from '@atlaskit/linking-common';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { renderHook } from '@atlassian/testing-library';

import { getIsFirstPartyLink, useSmartLinkCrossProductUrlWrapperGated } from '../index';

const FEATURE_GATE = 'platform_smartlink_xpc_url_wrapping';

type SmartLinkMetaWithFirstPartySignal = SmartLinkResponse['meta'] & {
	is1PLink?: boolean;
};

jest.mock('@atlaskit/analytics-cross-product/useCrossProductUrlWrapper', () => ({
	useCrossProductUrlWrapper: jest.fn(),
}));

jest.mock('@atlaskit/link-provider', () => ({
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
	renderHook(() => useSmartLinkCrossProductUrlWrapperGated({ details })).current;

describe('getIsFirstPartyLink', () => {
	it('returns true only when meta.is1PLink is true', () => {
		expect(getIsFirstPartyLink(makeDetails(true))).toBe(true);
		expect(getIsFirstPartyLink(makeDetails(false))).toBe(false);
		expect(getIsFirstPartyLink(makeDetails())).toBe(false);
		expect(getIsFirstPartyLink(undefined)).toBe(false);
	});
});

describe('useSmartLinkCrossProductUrlWrapperGated', () => {
	let wrapUrl: jest.MockedFunction<(url: string) => string>;

	beforeEach(() => {
		wrapUrl = jest.fn((url: string) => `${url}${url.includes('?') ? '&' : '?'}xpis=wrapped`);
		mockUseCrossProductUrlWrapper.mockReturnValue(wrapUrl);
		mockSmartLinkContext('CONFLUENCE');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns the URL unchanged when the feature gate is off', () => {
		failGate(FEATURE_GATE);

		const urlWrapper = renderUrlWrapper(makeDetails(true));

		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
		expect(mockUseSmartLinkContext).not.toHaveBeenCalled();
		expect(mockUseCrossProductUrlWrapper).not.toHaveBeenCalled();
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('wraps first-party links with the cross-product Smart Links bridge when the gate is on', () => {
		passGate(FEATURE_GATE);

		const urlWrapper = renderUrlWrapper(makeDetails(true));

		expect(mockUseCrossProductUrlWrapper).toHaveBeenCalledWith({
			bridge: 'smartLinks',
			product: 'confluence',
		});
		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page?xpis=wrapped');
		expect(wrapUrl).toHaveBeenCalledWith('https://example.com/page');
	});

	it('does not wrap third-party links', () => {
		passGate(FEATURE_GATE);

		const urlWrapper = renderUrlWrapper(makeDetails(false));

		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('does not wrap when the first-party signal is missing', () => {
		passGate(FEATURE_GATE);

		const urlWrapper = renderUrlWrapper(makeDetails());

		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('does not wrap when details are undefined', () => {
		passGate(FEATURE_GATE);

		const urlWrapper = renderUrlWrapper();

		expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('does not wrap when the Smart Link context has no product', () => {
		passGate(FEATURE_GATE);
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
		passGate(FEATURE_GATE);

		const urlWrapper = renderUrlWrapper(makeDetails(true));

		expect(urlWrapper('https://example.com/page?xpis=existing')).toBe(
			'https://example.com/page?xpis=existing',
		);
		expect(urlWrapper('/wiki/spaces/ABC?xpis=existing')).toBe('/wiki/spaces/ABC?xpis=existing');
		expect(wrapUrl).not.toHaveBeenCalled();
	});

	it('returns malformed URLs unchanged without invoking the upstream wrapper', () => {
		passGate(FEATURE_GATE);

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

		it('returns the URL unchanged when the SSR guard gate is on', () => {
			passGate(FEATURE_GATE);

			// Render while window is still present, then simulate SSR by removing it
			const urlWrapper = renderUrlWrapper(makeDetails(true));
			originalWindow = global.window;
			delete (global as any).window;

			expect(urlWrapper('https://example.com/page')).toBe('https://example.com/page');
			expect(wrapUrl).not.toHaveBeenCalled();
		});
	});
});
