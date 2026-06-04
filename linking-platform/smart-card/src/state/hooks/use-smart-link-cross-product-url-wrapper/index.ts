import { useCallback } from 'react';

import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { functionWithFG } from '@atlaskit/platform-feature-flags-react';

const SMART_LINKS_XPC_BRIDGE = 'smartLinks';
const XPC_QUERY_PARAM = 'xpis';

type SmartLinkMetaWithFirstPartySignal = {
	is1PLink?: boolean;
};

export const getIsFirstPartyLink = (details?: SmartLinkResponse): boolean =>
	((details?.meta as SmartLinkMetaWithFirstPartySignal | undefined)?.is1PLink ?? false) === true;

const identityUrlWrapper = (url: string) => url;

type UseSmartLinkCrossProductUrlWrapperArgs = {
	details?: SmartLinkResponse;
};

const useSmartLinkCrossProductUrlWrapperFallback = (
	_args: UseSmartLinkCrossProductUrlWrapperArgs,
): ((url: string) => string) => identityUrlWrapper;

const useSmartLinkCrossProductUrlWrapper = ({
	details,
}: UseSmartLinkCrossProductUrlWrapperArgs): ((url: string) => string) => {
	const { product, bridgeProduct, xpcProduct, xpcSubProduct } = useSmartLinkContext();
	// xpcProduct takes precedence over product — it identifies the host product for XPC analytics
	// without affecting link resolution (which uses the `product` prop separately).
	const effectiveProduct = xpcProduct ?? product;
	const wrapUrl = useCrossProductUrlWrapper({
		bridge: bridgeProduct ?? SMART_LINKS_XPC_BRIDGE,
		product: effectiveProduct?.toLowerCase() ?? 'unknown',
		...(xpcSubProduct ? { subProduct: xpcSubProduct } : {}),
	});
	
	return useCallback(
		(url: string) => {
			if (!getIsFirstPartyLink(details) || !effectiveProduct) {
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
		[details, effectiveProduct, wrapUrl],
	);
};

export const useSmartLinkCrossProductUrlWrapperGated: typeof useSmartLinkCrossProductUrlWrapper =
	functionWithFG(
		'platform_smartlink_xpc_url_wrapping',
		useSmartLinkCrossProductUrlWrapper,
		useSmartLinkCrossProductUrlWrapperFallback,
	);
