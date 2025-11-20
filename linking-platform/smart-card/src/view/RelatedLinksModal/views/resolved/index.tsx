import React from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { Stack } from '@atlaskit/primitives/compiled';

import { messages } from '../../../../messages';
import RelatedLinksList from '../../components/related-links-list';

import { type RelatedLinksProps } from './types';

const RelatedLinksResolvedView = ({
	incomingLinks = [],
	outgoingLinks = [],
}: RelatedLinksProps): React.JSX.Element => {
	const [selected, setSelected] = React.useState('');

	const handleSelectedUpdate = (selectedKey: string) => {
		setSelected(selectedKey);
	};

	return (
		<Stack space="space.150">
			<AnalyticsContext data={{ component: 'relatedLinksIncoming' }}>
				<RelatedLinksList
					urls={incomingLinks}
					title={messages.related_links_found_in}
					testId="incoming-related-links-list"
					selected={selected}
					handleSelectedUpdate={handleSelectedUpdate}
				/>
			</AnalyticsContext>
			<AnalyticsContext data={{ component: 'relatedLinksOutgoing' }}>
				<RelatedLinksList
					urls={outgoingLinks}
					title={messages.related_links_includes_links_to}
					testId="outgoing-related-links-list"
					selected={selected}
					handleSelectedUpdate={handleSelectedUpdate}
				/>
			</AnalyticsContext>
		</Stack>
	);
};

export default RelatedLinksResolvedView;
