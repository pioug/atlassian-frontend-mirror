import React, { useCallback, useMemo } from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { type CardState, getUrl } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { type CardType, useSmartCardState as useSmartLinkState } from '../../state/store';

import { context } from './analytics';

type SmartLinkAnalyticsContextProps = {
	children?: React.ReactNode;
	display?: string;
	id?: string | undefined;
	source?: string;
	url: string;
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
	error?: CardState['error'];
	id?: string | undefined;
	response?: JsonLd.Response;
	source?: string;
	status?: CardType;
	url: string;
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
	const resolvedAttributes = getExtendedResolvedAttributes(
		{
			url,
			displayCategory: display === 'url' ? 'link' : 'smartLink',
		},
		response,
		status,
		error,
	);

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
	attributes?: typeof context &
		ReturnType<typeof getResolvedAttributes> & {
			display?: string;
			id?: string;
		};
	source?: string;
};

type GetByUrlFn = (
	url: string,
	props: Omit<SmartLinkAnalyticsContextProps, 'children' | 'url'>,
) => SmartLinkAnalyticsContextType;
type UseSmartLinkAnalyticsUtilsReturn = {
	getByUrl: GetByUrlFn;
};
/**
 * Provides an analytics context data to supply attributes to events based on a URL
 * and the link state in the store
 */
export const useSmartLinkAnalyticsUtils = (): UseSmartLinkAnalyticsUtilsReturn => {
	const { store } = useSmartLinkContext();

	const getByUrl: GetByUrlFn = useCallback(
		(url, props) => {
			const state = store ? getUrl(store, url) : undefined;
			return getSmartLinkAnalyticsContext({
				display: props?.display,
				id: props?.id,
				response: state?.details,
				source: props?.source,
				status: state?.status,
				url,
				error: state?.error,
			});
		},
		[store],
	);
	return useMemo(() => ({ getByUrl }), [getByUrl]);
};

/**
 * Provides an analytics context data to supply attributes to events based on a URL
 * and the link state in the store
 * @deprecated Use useSmartLinkAnalyticsUtils instead
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
