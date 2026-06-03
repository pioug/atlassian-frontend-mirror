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
	const { product, bridgeProduct } = useSmartLinkContext();
	const wrapUrl = useCrossProductUrlWrapper({
		bridge: bridgeProduct ?? SMART_LINKS_XPC_BRIDGE,
		product: product?.toLowerCase() ?? 'unknown',
	});

	return useCallback(
		(url: string) => {
			if (!getIsFirstPartyLink(details) || !product) {
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
		[details, product, wrapUrl],
	);
};

export const useSmartLinkCrossProductUrlWrapperGated: typeof useSmartLinkCrossProductUrlWrapper =
	functionWithFG(
		'platform_smartlink_xpc_url_wrapping',
		useSmartLinkCrossProductUrlWrapper,
		useSmartLinkCrossProductUrlWrapperFallback,
	);
