import React, { useMemo } from 'react';

import { type JsonLd } from 'json-ld-types';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { type CardState, getUrl } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { type CardType, useSmartCardState as useSmartLinkState } from '../../state/store';

import { context } from './analytics';

type SmartLinkAnalyticsContextProps = {
	url: string;
	display?: string;
	id?: string | undefined;
	source?: string;
	children?: React.ReactNode;
};

const getExtendedResolvedAttributes = (
	linkDetails: Parameters<typeof getResolvedAttributes>[0],
	details?: JsonLd.Response,
	linkStatus?: CardType,
	error?: CardState['error'],
): ReturnType<typeof getResolvedAttributes> & {
	definitionId?: string | null;
	resourceType?: string | null;
} => ({
	definitionId: details?.meta?.definitionId ?? null,
	resourceType: details?.meta?.resourceType ?? null,
	...getResolvedAttributes(linkDetails, details, linkStatus, error),
});

type GetSmartLinkAnalyticsContextParam = {
	display?: string;
	id?: string | undefined;
	source?: string;
	response?: JsonLd.Response;
	status?: CardType;
	url: string;
	error?: CardState['error'];
};
const getSmartLinkAnalyticsContext = ({
	display,
	id,
	response,
	source,
	status,
	url,
	error,
}: GetSmartLinkAnalyticsContextParam) => {
	const resolvedAttributes = getExtendedResolvedAttributes({ url }, response, status, error);
	return {
		source,
		attributes: {
			...context,
			display,
			id,
			...resolvedAttributes,
		},
	};
};

type SmartLinkAnalyticsContextType = {
	source?: string;
	attributes?: typeof context &
		ReturnType<typeof getResolvedAttributes> & {
			display?: string;
			id?: string;
		};
};

/**
 * Provides an analytics context data to supply attributes to events based on a URL
 * and the link state in the store
 */
export const useSmartLinkAnalyticsContext = ({
	display,
	id,
	source,
	url,
}: Exclude<SmartLinkAnalyticsContextProps, 'children'>):
	| SmartLinkAnalyticsContextType
	| undefined => {
	const { store } = useSmartLinkContext();
	const state = store ? getUrl(store, url) : undefined;

	return useMemo(() => {
		return getSmartLinkAnalyticsContext({
			display,
			id,
			response: state?.details,
			source,
			status: state?.status,
			url,
			error: state?.error,
		});
	}, [display, id, source, state?.details, state?.status, url, state?.error]);
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
}: SmartLinkAnalyticsContextProps) => {
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
