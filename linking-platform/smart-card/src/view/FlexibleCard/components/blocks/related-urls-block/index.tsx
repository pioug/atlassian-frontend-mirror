import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { di } from 'react-magnetic-di';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { type CardProviderRenderers } from '@atlaskit/link-provider';

import useRelatedUrls, {
	type RelatedUrlsResponse,
} from '../../../../../state/hooks/use-related-urls';
import { type BlockProps } from '../types';

import { fireRelatedLinksLoadedEvent } from './analytics';
import { RelatedUrlsBlockErroredView } from './errored';
import { RelatedUrlsResolvedView } from './resolved';
import { RelatedUrlsBlockResolvingView } from './resolving';

export type RelatedUrlBlockProps = {
	url: string;
	renderers?: CardProviderRenderers;
	testId?: string;
} & BlockProps;

/**
 * Represents a block to display related resources of a url
 */
const RelatedUrlsBlock = ({
	testId = 'smart-block-related-urls',
	url,
	renderers,
	...blockProps
}: RelatedUrlBlockProps) => {
	di(useRelatedUrls);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const [loadingRelatedUrls, setLoadingRelatedUrls] = useState(true);
	const [err, setErr] = useState<Error>();
	const [relatedUrls, setRelatedUrls] = useState<RelatedUrlsResponse>();
	const getRelatedUrls = useRelatedUrls();

	useEffect(() => {
		const fetchRelatedUrls = async () => {
			try {
				const relUrls = await getRelatedUrls(url);
				setRelatedUrls(relUrls);

				/**
				 * Fire TrackRelatedLinksLoadedEvent
				 */
				fireRelatedLinksLoadedEvent(createAnalyticsEvent)({
					relatedLinksCount: relUrls.resolvedResults?.length ?? 0,
				});
			} catch (error) {
				setErr(error as Error);
			}
			setLoadingRelatedUrls(false);
		};
		fetchRelatedUrls();
	}, [createAnalyticsEvent, getRelatedUrls, url]);

	if (loadingRelatedUrls) {
		return <RelatedUrlsBlockResolvingView testId={`${testId}-resolving-view`} {...blockProps} />;
	}

	if (relatedUrls) {
		return (
			<RelatedUrlsResolvedView
				renderers={renderers}
				overrideCss={css({
					minHeight: '1.55rem',
				})}
				testId={`${testId}-resolved-view`}
				relatedUrlsResponse={relatedUrls}
				{...blockProps}
			/>
		);
	}

	return (
		<RelatedUrlsBlockErroredView err={err} testId={`${testId}-errored-view`} {...blockProps} />
	);
};

export default RelatedUrlsBlock;
