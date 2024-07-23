/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { messages } from '../../../../messages';
import RelatedLinksList from '../../components/related-links-list';
import { type RelatedLinksProps } from './types';
import { Stack } from '@atlaskit/primitives';

const RelatedLinksResolvedView = ({
	incomingLinks = [],
	outgoingLinks = [],
}: RelatedLinksProps) => {
	return (
		<Stack space="space.150">
			<RelatedLinksList
				urls={incomingLinks}
				title={messages.related_links_found_in}
				testId="incoming-related-links-list"
			/>
			<RelatedLinksList
				urls={outgoingLinks}
				title={messages.related_links_includes_links_to}
				testId="outgoing-related-links-list"
			/>
		</Stack>
	);
};

export default RelatedLinksResolvedView;
