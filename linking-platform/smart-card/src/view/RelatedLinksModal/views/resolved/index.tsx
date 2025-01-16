import React from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { Stack } from '@atlaskit/primitives';

import { messages } from '../../../../messages';
import RelatedLinksList from '../../components/related-links-list';

import RelatedLinksResolvedViewOld from './ResolvedOld';
import { type RelatedLinksProps } from './types';

const RelatedLinksResolvedView = ({
	incomingLinks = [],
	outgoingLinks = [],
}: RelatedLinksProps) => {
	return (
		<Stack space="space.150">
			<AnalyticsContext data={{ component: 'relatedLinksIncoming' }}>
				<RelatedLinksList
					urls={incomingLinks}
					title={messages.related_links_found_in}
					testId="incoming-related-links-list"
				/>
			</AnalyticsContext>
			<AnalyticsContext data={{ component: 'relatedLinksOutgoing' }}>
				<RelatedLinksList
					urls={outgoingLinks}
					title={messages.related_links_includes_links_to}
					testId="outgoing-related-links-list"
				/>
			</AnalyticsContext>
		</Stack>
	);
};

const RelatedLinksResolvedExported = (props: RelatedLinksProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <RelatedLinksResolvedView {...props} />;
	} else {
		return <RelatedLinksResolvedViewOld {...props} />;
	}
};

export default RelatedLinksResolvedExported;
