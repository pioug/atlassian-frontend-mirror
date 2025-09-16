import { useContext } from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { SmartCardContext } from '@atlaskit/link-provider';

export const isSharePointDomain = (href: string): boolean => {
	try {
		const hostname = new URL(href).hostname.toLowerCase();
		return hostname.includes('sharepoint.com') || hostname.includes('onedrive.live.com');
	} catch {
		return false;
	}
};

export const isGoogleDomain = (href: string): boolean => {
	try {
		const hostname = new URL(href).hostname.toLowerCase();
		return hostname.includes('docs.google.com') || hostname.includes('drive.google.com');
	} catch {
		return false;
	}
};

const useResolveHyperlinkValidator = (href: string = ''): boolean => {
	const hasSmartCardProvider = !!useContext(SmartCardContext);

	const isSharePointResolveEnabled =
		FeatureGates.getExperimentValue(
			'platform_editor_resolve_hyperlinks_confluence',
			'isEnabled',
			false,
		) ||
		FeatureGates.getExperimentValue('platform_editor_resolve_hyperlinks_jira', 'isEnabled', false);

	const isGoogleResolveEnabled = FeatureGates.getExperimentValue(
		'platform_editor_resolve_google_hyperlinks',
		'isEnabled',
		false,
	);

	const shouldResolveSharePoint = isSharePointDomain(href) && isSharePointResolveEnabled;
	const shouldResolveGoogle = isGoogleDomain(href) && isGoogleResolveEnabled;

	return hasSmartCardProvider && (shouldResolveSharePoint || shouldResolveGoogle);
};

export default useResolveHyperlinkValidator;
