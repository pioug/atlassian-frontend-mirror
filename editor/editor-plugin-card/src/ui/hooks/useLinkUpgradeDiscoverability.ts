import { useEffect, useMemo, useState } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { CardContext } from '@atlaskit/link-provider';

import type { cardPlugin } from '../../cardPlugin';
import { isLocalStorageKeyDiscovered, LOCAL_STORAGE_DISCOVERY_KEY_TOOLBAR } from '../local-storage';

export type LinkUpgradeDiscoverabilityProps = {
	url: string;
	linkPosition: number;
	cardContext?: CardContext;
	pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>;
	isPulseEnabled?: boolean;
	isOverlayEnabled?: boolean;
};

const useLinkUpgradeDiscoverability = ({
	url,
	linkPosition,
	cardContext,
	pluginInjectionApi,
	isPulseEnabled,
	isOverlayEnabled,
}: LinkUpgradeDiscoverabilityProps) => {
	const [urlState, setUrlState] = useState(cardContext?.store?.getState()[url]);
	const { overlayCandidatePosition, inlineCardAwarenessCandidatePosition } =
		pluginInjectionApi?.card?.sharedState?.currentState() || {};

	useEffect(() => {
		const unsubscribe = cardContext?.store?.subscribe(() => {
			setUrlState(cardContext?.store?.getState()[url]);
		});

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, [cardContext?.store, url]);

	const canBeUpgradedToEmbed = useMemo(() => {
		const isResolved = urlState?.status === 'resolved';
		return isResolved && !!cardContext?.extractors?.getPreview(url, 'web');
	}, [cardContext?.extractors, url, urlState?.status]);

	const shouldShowLinkPulse = useMemo(() => {
		return (
			isPulseEnabled &&
			linkPosition === inlineCardAwarenessCandidatePosition &&
			canBeUpgradedToEmbed
		);
	}, [canBeUpgradedToEmbed, isPulseEnabled, linkPosition, inlineCardAwarenessCandidatePosition]);

	const shouldShowLinkOverlay = urlState?.status === 'resolved' && isOverlayEnabled;

	const isLinkMostRecentlyInserted = overlayCandidatePosition === linkPosition;

	const shouldShowToolbarPulse = useMemo(
		() =>
			isPulseEnabled &&
			!isLocalStorageKeyDiscovered(LOCAL_STORAGE_DISCOVERY_KEY_TOOLBAR) &&
			canBeUpgradedToEmbed,
		[canBeUpgradedToEmbed, isPulseEnabled],
	);

	return {
		shouldShowToolbarPulse,
		shouldShowLinkPulse,
		shouldShowLinkOverlay,
		isLinkMostRecentlyInserted,
	};
};

export default useLinkUpgradeDiscoverability;
