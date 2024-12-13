import React, { useMemo } from 'react';

import { type JsonLd } from 'json-ld-types';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { getUrl } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { type CardType, useSmartCardState as useSmartLinkState } from '../../state/store';

import { context } from './analytics';
import { LinkAnalyticsContext } from './LinkAnalyticsContext';

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
): ReturnType<typeof getResolvedAttributes> & {
	definitionId?: string | null;
	resourceType?: string | null;
} => ({
	definitionId: details?.meta?.definitionId ?? null,
	resourceType: details?.meta?.resourceType ?? null,
	...getResolvedAttributes(linkDetails, details, linkStatus),
});

type GetSmartLinkAnalyticsContextParam = {
	display?: string;
	id?: string | undefined;
	source?: string;
	response?: JsonLd.Response;
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
}: GetSmartLinkAnalyticsContextParam) => {
	const resolvedAttributes = getExtendedResolvedAttributes({ url }, response, status);
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
		return fg('platform-smart-card-migrate-embed-modal-analytics')
			? getSmartLinkAnalyticsContext({
					display,
					id,
					response: state?.details,
					source,
					status: state?.status,
					url,
				})
			: {};
	}, [display, id, source, state?.details, state?.status, url]);
};

/**
 * Provides an analytics context to supply attributes to events based on a URL
 * and the link state in the store
 */
const ExtendedSmartLinkAnalyticsContext = ({
	children,
	display,
	id,
	source,
	url,
}: SmartLinkAnalyticsContextProps) => {
	const { details, status } = useSmartLinkState(url);
	const data = getSmartLinkAnalyticsContext({
		display,
		id,
		response: details,
		source,
		status,
		url,
	});

	return <AnalyticsContext data={data}>{children}</AnalyticsContext>;
};

/**
 * Provides an analytics context to supply attributes to events based on a URL
 * and the link state in the store
 */
const LegacySmartLinkAnalyticsContext = (props: SmartLinkAnalyticsContextProps) => {
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

/**
 * Provides an analytics context to supply attributes to events based on a URL
 * and the link state in the store
 */
export const SmartLinkAnalyticsContext = (props: SmartLinkAnalyticsContextProps) => {
	return fg('platform-smart-card-migrate-embed-modal-analytics') ? (
		<ExtendedSmartLinkAnalyticsContext {...props} />
	) : (
		<LegacySmartLinkAnalyticsContext {...props} />
	);
};
