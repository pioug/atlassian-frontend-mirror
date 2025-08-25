import React from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';

type LinkAnalyticsContextProps = {
	children?: React.ReactNode;
	/**
	 * The display mode of the link
	 * @example 'url'
	 */
	display?: string | undefined;
	id?: string | undefined;
	source?: string;
	url?: string;
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
