import { useEffect } from 'react';

import { getDocument } from '@atlaskit/browser-apis';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { installScrollbarHarmonisation } from './install-scrollbar-harmonisation';
import { installScrollbarHarmonisationTransparentTrack } from './install-scrollbar-harmonisation-transparent-track';

/**
 * Activates the harmonised scrollbar appearance. An explicit value overrides the shared rollout
 * gate; when omitted, the shared gate controls the appearance.
 */
export function useScrollbarHarmonisation(isEnabled?: boolean): void {
	const isGateEnabled = fg('platform_dst_scrollbar_harmonisation');
	const shouldEnable = isEnabled ?? isGateEnabled;
	const isTransparentTrackGateEnabled = fg('platform_dst_scrollbar_harmonisation_transparent');
	const shouldUseTransparentTrack = isGateEnabled && isTransparentTrackGateEnabled;

	useEffect(() => {
		if (!shouldEnable) {
			return;
		}

		const targetDocument = getDocument();
		if (!targetDocument) {
			return;
		}

		const cleanupHarmonisation = installScrollbarHarmonisation(targetDocument);
		const cleanupTransparentTrack = shouldUseTransparentTrack
			? installScrollbarHarmonisationTransparentTrack(targetDocument)
			: undefined;

		return () => {
			cleanupTransparentTrack?.();
			cleanupHarmonisation();
		};
	}, [shouldEnable, shouldUseTransparentTrack]);
}
