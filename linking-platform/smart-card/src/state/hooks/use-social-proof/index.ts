import { useEffect, useMemo, useState } from 'react';

import { getProviderPctMap } from '../../services/personalization';
import type { ProviderPctMap } from '../../services/personalization/types';

export interface SocialProof {
	connectedPct: number | undefined;
	isEnabled: boolean;
	/** True while fetching personalization (only when `isEnabled`). */
	isLoading: boolean;
}

const NOT_ENABLED_RESULT: SocialProof = {
	connectedPct: undefined,
	isEnabled: false,
	isLoading: false,
};

/**
 * Fetches provider usage percentage from the TAP Delivery personalization service when the
 * killswitch allows it. Callers decide separately (e.g. via Statsig experiment) whether to
 * surface that data in the UI.
 */
const useSocialProof = (
	traitName: string,
	extensionKey?: string,
	isKillswitchOn = false,
): SocialProof => {
	const isEnabled = isKillswitchOn;
	const [providerPctMap, setProviderPctMap] = useState<ProviderPctMap | undefined>(undefined);
	const [isPersonalizationLoading, setIsPersonalizationLoading] = useState(false);

	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		let cancelled = false;
		setIsPersonalizationLoading(true);

		getProviderPctMap(traitName).then((pctMap) => {
			if (!cancelled) {
				setProviderPctMap(pctMap);
				setIsPersonalizationLoading(false);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [isEnabled, traitName]);

	return useMemo(() => {
		if (!isEnabled) {
			return NOT_ENABLED_RESULT;
		}

		return {
			connectedPct: extensionKey && providerPctMap ? providerPctMap[extensionKey] : undefined,
			isEnabled,
			isLoading: isPersonalizationLoading,
		};
	}, [extensionKey, isEnabled, isPersonalizationLoading, providerPctMap]);
};

export default useSocialProof;
