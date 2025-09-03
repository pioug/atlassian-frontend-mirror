import React, { useContext } from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client';

import { SmartCardContext } from '../../../state';

import withErrorBoundary from './error-boundary';
import { ResolveHyperlink } from './resolve-hyperlink';
export interface HyperlinkResolverProps {
	href: string;
}

export const isSharePointDomain = (href: string): boolean => {
	try {
		const hostname = new URL(href).hostname.toLowerCase();
		return (
			hostname.includes('sharepoint.com') ||
			hostname.includes('onedrive.com') ||
			hostname.includes('.live.com')
		);
	} catch {
		return false;
	}
};

const HyperlinkResolver = ({ href }: HyperlinkResolverProps) => {
	const hasSmartCardProvider = !!useContext(SmartCardContext);
	const isHyperlinkResolveExperimentEnabled =
		FeatureGates.getExperimentValue(
			'platform_editor_resolve_hyperlinks_confluence',
			'isEnabled',
			false,
		) ||
		FeatureGates.getExperimentValue('platform_editor_resolve_hyperlinks_jira', 'isEnabled', false);

	if (!isSharePointDomain(href) || !hasSmartCardProvider || !isHyperlinkResolveExperimentEnabled) {
		return null;
	}

	return <ResolveHyperlink href={href} />;
};

export default withErrorBoundary(HyperlinkResolver);
