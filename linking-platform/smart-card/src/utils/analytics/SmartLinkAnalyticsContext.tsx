import React from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';
import { useSmartCardState as useSmartLinkState } from '../../state/store';
import { LinkAnalyticsContext } from './LinkAnalyticsContext';

type SmartLinkAnalyticsContextProps = {
	url: string;
	display?: string;
	id?: string | undefined;
	source?: string;
	children?: React.ReactNode;
};

/**
 * Provides an analytics context to supply attributes to events based on a URL
 * and the link state in the store
 */
export const SmartLinkAnalyticsContext = (props: SmartLinkAnalyticsContextProps) => {
	const { children, url, display } = props;
	const { details, status } = useSmartLinkState(url);
	const attributes = getResolvedAttributes({ url }, details, status);

	return (
		<LinkAnalyticsContext {...props} display={display}>
			<AnalyticsContext
				data={{
					attributes,
				}}
			>
				{children}
			</AnalyticsContext>
		</LinkAnalyticsContext>
	);
};
