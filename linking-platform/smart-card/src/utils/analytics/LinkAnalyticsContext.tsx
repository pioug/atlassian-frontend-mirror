import React from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import { context } from './analytics';

type LinkAnalyticsContextProps = {
	url?: string;
	/**
	 * The display mode of the link
	 * @example 'url'
	 */
	display?: string | undefined;
	id?: string | undefined;
	source?: string;
	children?: React.ReactNode;
};

/**
 * Provides an analytics context to supply attributes to events based on a URL
 */
export const LinkAnalyticsContext = ({
	display,
	id,
	children,
	source,
}: LinkAnalyticsContextProps) => {
	const displayCategory = display === 'url' ? 'link' : undefined;

	return (
		<AnalyticsContext
			data={{
				source,
				attributes: {
					...(fg('platform-smart-card-migrate-embed-modal-analytics') ? context : {}),
					displayCategory,
					display,
					id,
				},
			}}
		>
			{children}
		</AnalyticsContext>
	);
};
