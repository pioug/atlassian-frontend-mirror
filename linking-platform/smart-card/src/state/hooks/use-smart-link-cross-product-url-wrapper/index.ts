import { useCallback } from 'react';

import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { XPC_CONSTANTS } from './constants';
import { getIsFirstPartyLink } from './getIsFirstPartyLink';

export type UseSmartLinkCrossProductUrlWrapperArgs = {
	details?: SmartLinkResponse;
};

export const useSmartLinkCrossProductUrlWrapper = ({
	details,
}: UseSmartLinkCrossProductUrlWrapperArgs): ((url: string) => string) => {
	const { product, bridgeProduct, xpcProduct, xpcSubProduct } = useSmartLinkContext();
	// xpcProduct takes precedence over product — it identifies the host product for XPC analytics
	// without affecting link resolution (which uses the `product` prop separately).
	const effectiveProduct = xpcProduct ?? product;
	const effectiveBridge = bridgeProduct ?? XPC_CONSTANTS.SMART_LINKS_XPC_BRIDGE;
	const effectiveProductForWrapper = effectiveProduct?.toLowerCase() ?? 'unknown';

	const wrapUrl = useCrossProductUrlWrapper({
		bridge: effectiveBridge,
		product: effectiveProductForWrapper,
		...(xpcSubProduct ? { subProduct: xpcSubProduct } : {}),
	});

	return useCallback(
		(url: string) => {
			if (typeof window === 'undefined' || !getIsFirstPartyLink(details) || !effectiveProduct) {
				return url;
			}

			let parsedUrl: URL | undefined;
			try {
				parsedUrl = new URL(url);
			} catch {
				return url;
			}
			if (parsedUrl.searchParams.has(XPC_CONSTANTS.QUERY_PARAM)) {
				return url;
			}

			return wrapUrl(url);
		},
		// Keep bridge/subproduct in the dependency array so consumers that memoize this callback
		// refresh when mini-modal context updates from smartLinks to rovo-chat.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[details, effectiveBridge, effectiveProduct, wrapUrl, xpcSubProduct],
	);
};
