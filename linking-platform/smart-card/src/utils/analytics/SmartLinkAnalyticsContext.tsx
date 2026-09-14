import React from 'react';

import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';
import type { getResolvedAttributes } from '@atlaskit/link-analytics/get-resolved-attributes';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useSmartCardState as useSmartLinkState } from '../../state/store/index';
import { type context } from './analytics';
import { getSmartLinkAnalyticsContext } from './getSmartLinkAnalyticsContext';

export type SmartLinkAnalyticsContextProps = {
	children?: React.ReactNode;
	display?: string;
	id?: string | undefined;
	source?: string;
	url: string;
};

export type SmartLinkAnalyticsContextType = {
	attributes?: typeof context &
		ReturnType<typeof getResolvedAttributes> & {
			display?: string;
			id?: string;
		};
	source?: string;
};

/**
 * Provides an analytics context to supply attributes to events based on a URL
 * and the link state in the store
 */
export const SmartLinkAnalyticsContext = ({
	children,
	display,
	id,
	source,
	url,
}: SmartLinkAnalyticsContextProps): React.JSX.Element => {
	const { details, status, error } = useSmartLinkState(url);
	const data = getSmartLinkAnalyticsContext({
		display,
		id,
		response: details,
		source,
		status,
		url,
		error: fg('platform_bandicoots-smartlink-unresolved-error-key') ? error : undefined,
	});

	return <AnalyticsContext data={data}>{children}</AnalyticsContext>;
};
