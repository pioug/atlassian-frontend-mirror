import { useEffect } from 'react';

import { getDocument } from '@atlaskit/browser-apis';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { installScrollbarHarmonisation } from './install-scrollbar-harmonisation';

/**
 * Activates the harmonised scrollbar appearance. An explicit value overrides the shared rollout
 * gate; when omitted, the shared gate controls the appearance.
 */
export function useScrollbarHarmonisation(isEnabled?: boolean): void {
	const isGateEnabled = fg('platform_dst_scrollbar_harmonisation');
	const shouldEnable = isEnabled ?? isGateEnabled;

	useEffect(() => {
		if (!shouldEnable) {
			return;
		}

		const targetDocument = getDocument();
		if (!targetDocument) {
			return;
		}

		return installScrollbarHarmonisation(targetDocument);
	}, [shouldEnable]);
}
