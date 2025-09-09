import React, { useContext } from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client';

import { SmartCardContext } from '../../../state';

import withErrorBoundary from './error-boundary';
import { ResolveHyperlink } from './resolve-hyperlink';
export interface HyperlinkResolverProps {
	href: string;
}

const isSharePointDomain = (href: string): boolean => {
	try {
		const hostname = new URL(href).hostname.toLowerCase();
		return hostname.includes('sharepoint.com') || hostname.includes('onedrive.live.com');
	} catch {
		return false;
	}
};

const isGoogleDomain = (href: string): boolean => {
	try {
		const hostname = new URL(href).hostname.toLowerCase();
		return hostname.includes('docs.google.com') || hostname.includes('drive.google.com');
	} catch {
		return false;
	}
};

const HyperlinkResolver = ({ href }: HyperlinkResolverProps) => {
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
	const shouldResolveHyperlink =
		hasSmartCardProvider && (shouldResolveSharePoint || shouldResolveGoogle);

	if (!shouldResolveHyperlink) {
		return null;
	}

	return <ResolveHyperlink href={href} />;
};

export default withErrorBoundary(HyperlinkResolver);
