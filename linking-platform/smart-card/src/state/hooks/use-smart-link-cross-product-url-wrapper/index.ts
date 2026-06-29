import { useCallback } from 'react';

import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
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

export const useSmartLinkCrossProductUrlWrapper = ({
	details,
}: UseSmartLinkCrossProductUrlWrapperArgs): ((url: string) => string) => {
	const { product, bridgeProduct, xpcProduct, xpcSubProduct } = useSmartLinkContext();
	// xpcProduct takes precedence over product — it identifies the host product for XPC analytics
	// without affecting link resolution (which uses the `product` prop separately).
	const effectiveProduct = xpcProduct ?? product;
	const effectiveBridge = bridgeProduct ?? SMART_LINKS_XPC_BRIDGE;
	const effectiveProductForWrapper = effectiveProduct?.toLowerCase() ?? 'unknown';

	const wrapUrl = useCrossProductUrlWrapper({
		bridge: effectiveBridge,
		product: effectiveProductForWrapper,
		...(xpcSubProduct ? { subProduct: xpcSubProduct } : {}),
	});

	return useCallback(
		(url: string) => {
			if (
				(typeof window === 'undefined' &&
					fg('platform_smartlink_xpc_url_wrapping_window_existed')) ||
				!getIsFirstPartyLink(details) ||
				!effectiveProduct
			) {
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
		// Keep bridge/subproduct in the dependency array so consumers that memoize this callback
		// refresh when mini-modal context updates from smartLinks to rovo-chat.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[details, effectiveBridge, effectiveProduct, wrapUrl, xpcSubProduct],
	);
};

export const useSmartLinkCrossProductUrlWrapperGated: typeof useSmartLinkCrossProductUrlWrapper =
	functionWithFG(
		'platform_smartlink_xpc_url_wrapping',
		useSmartLinkCrossProductUrlWrapper,
		useSmartLinkCrossProductUrlWrapperFallback,
	);
