import { renderHook } from '@testing-library/react';

import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import type { CardContext } from '@atlaskit/link-provider/types';
import { useSmartCardContext } from '@atlaskit/link-provider/use-smart-card-context';
import type { ProductType } from '@atlaskit/linking-common/types';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { useDatasourceCrossProductAttribution } from '../useDatasourceCrossProductAttribution';

const FEATURE_GATE = 'electric_issue_like_table_xpc_url_wrapping';

jest.mock('@atlaskit/analytics-cross-product/useCrossProductUrlWrapper', () => ({
	useCrossProductUrlWrapper: jest.fn(),
}));

jest.mock('@atlaskit/link-provider/use-smart-card-context', () => ({
	...jest.requireActual('@atlaskit/link-provider/use-smart-card-context'),
	useSmartCardContext: jest.fn(),
}));

const mockUseCrossProductUrlWrapper = useCrossProductUrlWrapper as jest.MockedFunction<
	typeof useCrossProductUrlWrapper
>;
const mockUseSmartCardContext = useSmartCardContext as jest.MockedFunction<
	typeof useSmartCardContext
>;

const mockSmartLinkContext = (context: Partial<CardContext> = {}) => {
	mockUseSmartCardContext.mockReturnValue({
		value: context as CardContext,
	} as ReturnType<typeof useSmartCardContext>);
};

const renderAttribution = () =>
	renderHook(() => useDatasourceCrossProductAttribution()).result.current;

describe('useDatasourceCrossProductAttribution', () => {
	let wrapUrl: jest.MockedFunction<(url: string) => string>;

	beforeEach(() => {
		wrapUrl = jest.fn((url: string) => `${url}${url.includes('?') ? '&' : '?'}xpis=wrapped`);
		mockUseCrossProductUrlWrapper.mockReturnValue(wrapUrl);
		mockSmartLinkContext({ product: 'CONFLUENCE' as ProductType });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('when the feature gate is off', () => {
		beforeEach(() => {
			failGate(FEATURE_GATE);
		});

		it('returns a no-op wrapper, mounting no underlying hooks', () => {
			const { wrapCrossProductUrl } = renderAttribution();

			// functionWithFG mounts the fallback, so the real hooks are never called.
			expect(mockUseSmartCardContext).not.toHaveBeenCalled();
			expect(mockUseCrossProductUrlWrapper).not.toHaveBeenCalled();

			expect(wrapCrossProductUrl('https://example.com/issues')).toBe('https://example.com/issues');
			expect(wrapUrl).not.toHaveBeenCalled();
		});
	});

	describe('when the feature gate is on', () => {
		beforeEach(() => {
			passGate(FEATURE_GATE);
		});

		it('wraps URLs using the host product', () => {
			const { wrapCrossProductUrl } = renderAttribution();

			expect(mockUseCrossProductUrlWrapper).toHaveBeenCalledWith({
				bridge: 'confluence-linkDatasource',
				product: 'confluence',
			});
			expect(wrapCrossProductUrl('https://example.com/issues')).toBe(
				'https://example.com/issues?xpis=wrapped',
			);
			expect(wrapUrl).toHaveBeenCalledWith('https://example.com/issues');
		});

		it('prefers xpcProduct over product for URL wrapping', () => {
			mockSmartLinkContext({
				product: 'CONFLUENCE' as ProductType,
				xpcProduct: 'atlassianStudio',
				xpcSubProduct: 'chat',
			});

			renderAttribution();

			expect(mockUseCrossProductUrlWrapper).toHaveBeenCalledWith({
				bridge: 'atlassianstudio-linkDatasource',
				product: 'atlassianstudio',
				subProduct: 'chat',
			});
		});

		it('uses the bridgeProduct from context when provided', () => {
			mockSmartLinkContext({
				product: 'JIRA' as ProductType,
				bridgeProduct: 'customBridge',
			});

			renderAttribution();

			expect(mockUseCrossProductUrlWrapper).toHaveBeenCalledWith({
				bridge: 'customBridge',
				product: 'jira',
			});
		});

		it('does not wrap URLs when no host product is known', () => {
			mockSmartLinkContext({});

			const { wrapCrossProductUrl } = renderAttribution();

			expect(mockUseCrossProductUrlWrapper).toHaveBeenCalledWith({
				bridge: 'unknown-linkDatasource',
				product: 'unknown',
			});
			expect(wrapCrossProductUrl('https://example.com/issues')).toBe('https://example.com/issues');
			expect(wrapUrl).not.toHaveBeenCalled();
		});

		it('does not double-wrap a URL that already carries the xpis param', () => {
			const { wrapCrossProductUrl } = renderAttribution();

			const alreadyWrapped = 'https://example.com/issues?xpis=existing';
			expect(wrapCrossProductUrl(alreadyWrapped)).toBe(alreadyWrapped);
			expect(wrapUrl).not.toHaveBeenCalled();
		});

		it('returns unparseable URLs unchanged', () => {
			const { wrapCrossProductUrl } = renderAttribution();

			expect(wrapCrossProductUrl('not a url')).toBe('not a url');
			expect(wrapUrl).not.toHaveBeenCalled();
		});
	});
});
