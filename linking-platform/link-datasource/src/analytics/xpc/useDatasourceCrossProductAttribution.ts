import { useCallback } from 'react';

import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import { useSmartCardContext } from '@atlaskit/link-provider/use-smart-card-context';
import { functionWithFG } from '@atlaskit/platform-feature-flags-react/function-with-fg';

const DATASOURCE_XPC_BRIDGE = 'linkDatasource';
const XPC_QUERY_PARAM = 'xpis';

export interface DatasourceCrossProductAttribution {
	wrapCrossProductUrl: (url: string) => string;
}

const identityUrlWrapper = (url: string) => url;

const noopAttribution: DatasourceCrossProductAttribution = {
	wrapCrossProductUrl: identityUrlWrapper,
};

/**
 * No-op fallback used when the `electric_issue_like_table_xpc_url_wrapping` gate is off
 */
const useDatasourceCrossProductAttributionFallback = (): DatasourceCrossProductAttribution =>
	noopAttribution;

/**
 * Returns cross-product (XPC) MAU attribution helpers for the linking-platform datasource modals
 * and the shared issue-like table renderer.
 *
 * Prefer the gated export {@link useDatasourceCrossProductAttribution} which swaps in a no-op
 * fallback when the gate is off (matching smart-card's `functionWithFG` pattern).
 */
const useDatasourceCrossProductAttributionUngated = (): DatasourceCrossProductAttribution => {
	const { value: smartLinkContext } = useSmartCardContext();
	const { product, bridgeProduct, xpcProduct, xpcSubProduct } = smartLinkContext ?? {};

	const effectiveProduct = xpcProduct ?? product;
	const effectiveProductForWrapper = effectiveProduct?.toLowerCase() ?? 'unknown';
	const effectiveBridge = bridgeProduct ?? `${effectiveProductForWrapper}-${DATASOURCE_XPC_BRIDGE}`;

	const wrapUrl = useCrossProductUrlWrapper({
		bridge: effectiveBridge,
		product: effectiveProductForWrapper,
		...(xpcSubProduct ? { subProduct: xpcSubProduct } : {}),
	});

	const wrapCrossProductUrl = useCallback(
		(url: string): string => {
			if (typeof window === 'undefined' || !effectiveProduct) {
				return url;
			}

			let parsedUrl: URL | undefined;
			try {
				parsedUrl = new URL(url);
			} catch {
				return url;
			}
			if (parsedUrl.searchParams.has(XPC_QUERY_PARAM)) {
				return url;
			}

			return wrapUrl(url);
		},
		[effectiveProduct, wrapUrl],
	);

	return { wrapCrossProductUrl };
};

export const useDatasourceCrossProductAttribution: typeof useDatasourceCrossProductAttributionUngated =
	functionWithFG(
		'electric_issue_like_table_xpc_url_wrapping',
		useDatasourceCrossProductAttributionUngated,
		useDatasourceCrossProductAttributionFallback,
	);
